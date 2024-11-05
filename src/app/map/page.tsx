"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import locationCord from "@/data/locationCoord";
import axios from "axios";
import dynamic from "next/dynamic";
// import location from "@/data/location";
import { handleKeyDown } from "@/utilities/handleKeyDown";

interface Graph {
  [key: string]: {
    [key: string]: number; // Adjacent node and distance
  };
}

class PriorityQueue {
  private elements: { node: string; priority: number }[] = [];

  enqueue(node: string, priority: number) {
    this.elements.push({ node, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift();
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}


const fetchRouteFromORS = async (coordinates: [number, number][]) => {
  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        coordinates,
        instructions: true,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ORS_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data.features[0].properties.segments[0]);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const MapComponent = dynamic(() => import("@/components/Map"), { ssr: false });


export default function MapPage() {
  const [currentLocation, setCurrentLocation] = useState<{
    name: string;
    coordinate: number[];
  }>({ name: "", coordinate: [0, 0] });
  const [destination, setDestination] = useState<{
    name: string;
    coordinate: number[];
  }>({ name: "", coordinate: [0, 0] });

  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<
    string[]
  >([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  const [path, setPath] = useState<string[]>([]); // This path state holds the nodes in the shortest path.
  // const [distance, setDistance] = useState<number | null>(null); // This distance state holds the total distance of the shortest path.
  const [route, setRoute] = useState<L.LatLng[]>([]);
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);


  const currentInputRef = useRef<HTMLInputElement | null>(null)
  const destinationInputRef = useRef<HTMLInputElement | null>(null)

  const handleInput = (value: string, setType: "current" | "destination") => {
    const filteredSuggestions = locationCord.filter((location) =>
      location.name.toLowerCase().includes(value.toLowerCase())
    );

    if (setType === "current") {
      setCurrentLocation({ name: value, coordinate: [0, 0] });
      setCurrentSuggestions(value ? filteredSuggestions.map((loc) => loc.name) : []);
      setDestinationSuggestions([]);
    } else {
      setDestination({ name: value, coordinate: [0, 0] });
      setDestinationSuggestions(value ? filteredSuggestions.map((loc) => loc.name) : []);
      setCurrentSuggestions([]);
    }
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      currentInputRef.current && !currentInputRef.current.contains(event.target as Node) &&
      destinationInputRef.current && !destinationInputRef.current.contains(event.target as Node)
    ) {
      setCurrentSuggestions([])
      setDestinationSuggestions([])
    }
  }, [])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [handleClickOutside])


  const toRadians = useCallback((degrees: number): number => degrees * (Math.PI / 180), []);

  const haversineDistance = useCallback((
    coord1: [number, number],
    coord2: [number, number]
  ): number => {
    const R = 6371e3; // Earth radius in meters
    const lat1 = toRadians(coord1[0]);
    const lat2 = toRadians(coord2[0]);
    const deltaLat = toRadians(coord2[0] - coord1[0]);
    const deltaLon = toRadians(coord2[1] - coord1[1]);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  },[toRadians]);


  const constructGraph = (locations: typeof locationCord) => {
    const graph: Graph = {};
  
    for (let i = 0; i < locations.length; i++) {
      const locA = locations[i];
      graph[locA.name] = {};
  
      for (let j = 0; j < locations.length; j++) {
        if (i !== j && locations[j].coordinate.length === 2 && locA.coordinate.length === 2) {
          const locB = locations[j];
          const distance = haversineDistance([locA.coordinate[0], locA.coordinate[1]], [locB.coordinate[0], locB.coordinate[1]]);
          graph[locA.name][locB.name] = distance;
        }
      }
    }
  
    return graph;
  };
  
  const graph = constructGraph(locationCord);
  

  const reconstructPath = useCallback((prev: { [key: string]: string | null }, destination: string) => {
    const path = [];
    let currentNode: string | null = destination;
  
    while (currentNode !== null) {
      path.push(currentNode);
      currentNode = prev[currentNode]; // Move to the previous node
    }
  
    // The path will be in reverse (from destination to start), so we need to reverse it
    return path.reverse();
  }, []);

  const findRoute = () => {
    if (!currentLocation.name || !destination.name) return;

    const result = dijkstra(graph, currentLocation.name);

    const { prev } = result;
    const constructedPath = reconstructPath(prev, destination.name);

    // Set the path and the total distance
    setPath(constructedPath);
  };

  const dijkstra = (graph: Graph, startNode: string) => {
    const distances: { [key: string]: number } = {};
    const prev: { [key: string]: string | null } = {};
    const queue = new PriorityQueue();

    // Initialize distances and previous nodes
    for (const node in graph) {
      distances[node] = node === startNode ? 0 : Infinity;
      prev[node] = null;
      queue.enqueue(node, distances[node]);
    }

    while (!queue.isEmpty()) {
      const currentNode = queue.dequeue()?.node;

      if (currentNode && distances[currentNode] !== Infinity) {
        for (const neighbor in graph[currentNode]) {
          const newDist = distances[currentNode] + graph[currentNode][neighbor];
          if (newDist < distances[neighbor]) {
            distances[neighbor] = newDist;
            prev[neighbor] = currentNode;
            queue.enqueue(neighbor, newDist);
          }
        }
      }
    }

    return { distances, prev };
  };


  useEffect(() => {
    if (
      currentLocation &&
      destination &&
      currentLocation.coordinate[0] !== 0 &&
      currentLocation.coordinate[1] !== 0 &&
      destination.coordinate[0] !== 0 &&
      destination.coordinate[1] !== 0 &&
      path.length > 0
    ) {
      // Fetch the route when startCoords and endCoords are available

      const fetchRoute = async () => {
        const coordinates = path
          .map((nodeName) => {
            const coord = locationCord.find(
              (location) => location.name === nodeName
            )?.coordinate;
            return coord ? [coord[1], coord[0]] : null; // Make sure to invert lat/lng
          })
          .filter((coord) => coord !== null) as [number, number][];
        try {
        
          const routeData = await fetchRouteFromORS(coordinates);
          if (routeData) {
            // Extract coordinates from the GeoJSON response
            const routeCoords = routeData.features[0].geometry.coordinates.map(
              (coord: [number, number]) => [coord[1], coord[0]]
            );
            setRoute(routeCoords);
            setRouteInstructions(routeData.features[0].properties.segments[0].steps);
            setDistance(routeData.features[0].properties.segments[0].distance);
            setDuration(routeData.features[0].properties.segments[0].duration);
          }
          
        } catch (error) {
          console.error(error);
        }
      };

      fetchRoute();
    }
  }, [currentLocation, destination, path]);



  return (
    <div className="map-page flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-[130px] pb-8">
      <div className="bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-lg mb-6 w-[90%] max-w-xl">
        <h1 className="text-2xl text-white font-semibold mb-4">
          Find Your Route
        </h1>
        <div className="mb-4 relative">
          <label className="block text-gray-300 mb-1">Current Location:</label>
          <input
            type="text"
            className="w-full p-2 text-orange-400 rounded border border-gray-500"
            placeholder="Enter your current location"
            value={currentLocation.name}
            ref = {currentInputRef}
            onChange={(e) => handleInput(e.target.value, "current")}
            onKeyDown={(e) =>
              handleKeyDown(
                e,
                "current",
                currentSuggestions,
                destinationSuggestions,
                highlightedIndex,
                setHighlightedIndex,
                setCurrentLocation,
                setDestination,
                setCurrentSuggestions,
                setDestinationSuggestions
              )
            }

          />

          {currentLocation && currentSuggestions.length > 0 && (
            <ul className="absolute bg-white w-full text-gray-900 mt-1 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
              {currentSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  ref={(el) => {
                    if (highlightedIndex === index && el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                      });
                    }
                  }}

                  onClick={() => {
                    const selectedLocation = locationCord.find(
                      (loc) => loc.name === suggestion
                    );
                    if (selectedLocation) {
                      setCurrentLocation({
                        name: selectedLocation.name,
                        coordinate: [...selectedLocation.coordinate],
                      });
                      setCurrentSuggestions([]);
                    }
                  }}
                  className={`p-2 hover:bg-gray-200 cursor-pointer ${highlightedIndex === index ? "bg-gray-300" : ""}`}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative">
          <label className="block text-gray-300 mb-1">Destination:</label>
          <input
            type="text"
            className="w-full p-2 rounded border text-orange-400 border-gray-500"
            placeholder="Enter your destination"
            value={destination.name}
            ref = {destinationInputRef}
            onChange={(e) => handleInput(e.target.value, "destination")}
            onKeyDown={(e) =>
              handleKeyDown(
                e,
                "destination",
                currentSuggestions,
                destinationSuggestions,
                highlightedIndex,
                setHighlightedIndex,
                setCurrentLocation,
                setDestination,
                setCurrentSuggestions,
                setDestinationSuggestions
              )
            }
          />

          {destination && destinationSuggestions.length > 0 && (
            <ul className="absolute bg-white text-gray-900 w-full mt-1 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
              {destinationSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  ref={(el) => {
                    if (highlightedIndex === index && el) {
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                      });
                    }
                  }}
                  onClick={() => {
                    const selectedLocation = locationCord.find(
                      (loc) => loc.name === suggestion
                    );
                    if (selectedLocation) {
                      setDestination({
                        name: selectedLocation.name,
                        coordinate: [...selectedLocation.coordinate],
                      })
                      setDestinationSuggestions([])
                    }
                  }}
                  className={`p-2 hover:bg-gray-200 cursor-pointer ${highlightedIndex === index ? "bg-gray-300" : ""}`}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={findRoute} className="mt-4 w-full bg-orange-500 text-white font-semibold rounded-lg p-2 hover:bg-orange-600 transition duration-300 ease-in-out">
          Find Route
        </button>
      </div>

      {/* Map Section */}
      <div className="w-[90%] max-w-xl h-96 rounded-lg mt-20">
        <MapComponent startCoords={[currentLocation.coordinate[0], currentLocation.coordinate[1]]} endCoords={ [destination.coordinate[0], destination.coordinate[1]] } route={route} />
      </div>

      {
        routeInstructions && routeInstructions.length > 0 && (
          <div className="h-96 w-[36rem] md:w-96 mt-4 bg-white py-3 px-5 overflow-y-scroll">
            <h2 className="text-xl font-semibold mb-2 text-black">Route Instructions</h2>
            <h4 className=" text-lg text-black ">Total distance: {distance}</h4>
            <h4 className=" text-lg text-black ">Total duration: {duration}</h4>
            <ul className="h-full">
              {routeInstructions.map((instruction: {distance: number, duration:number, type: number, instruction: string, name: string}, index: number) => (
                <li key={index} className="mb-2">
                  <p className="text-gray-800">{instruction.name.length !== 1 && (<span>At {instruction.name}</span>)} {instruction.instruction} - {instruction.distance}</p>
                </li>
              ))}
            </ul>
            </div>
        )
      }
    </div>
  );
}
