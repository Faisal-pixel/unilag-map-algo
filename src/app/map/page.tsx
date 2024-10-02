"use client";

import Map from "@/components/Map";
import { useCallback, useEffect, useState } from "react";
import locationCord from "@/data/locationCoord";
import location from "@/data/location";

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

  const [path, setPath] = useState<string[]>([]); // This path state holds the nodes in the shortest path.
  const [distance, setDistance] = useState<number | null>(null); // This distance state holds the total distance of the shortest path.

  const handleInput = (value: string, setType: "current" | "destination") => {
    const filteredSuggestions = location.filter((location) =>
      location.toLowerCase().includes(value.toLowerCase())
    );

    if (setType === "current") {
      setCurrentLocation({ name: value, coordinate: [0, 0] });
      setCurrentSuggestions(filteredSuggestions);
      setDestinationSuggestions([]);
    } else {
      setDestination({ name: value, coordinate: [0, 0] });
      setDestinationSuggestions(filteredSuggestions);
      setCurrentSuggestions([]);
    }
  };


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

  const reconstructPath = useCallback((prev: { [key: string]: string | null }, start: string, destination: string) => {
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

    const result = dijkstra(unilagGraph, currentLocation.name);
    const { distances, prev } = result;
    const constructedPath = reconstructPath(prev, currentLocation.name, destination.name);

    // Set the path and the total distance
    setPath(constructedPath);
  console.log("result form dijstra", result);
  console.log("current location", currentLocation);
    console.log(constructedPath);
    setDistance(distances[destination.name]);
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


  const unilagGraph: Graph = {
    "Unilag First gate": {
      "Faculty of Education": haversineDistance([6.518014936063271, 3.384798992138069], [6.51771772897192, 3.385542526211888]),
      "Gate Carpark": haversineDistance([6.518014936063271, 3.384798992138069], [6.518113403528685, 3.3865495321438734])
    },
    "Faculty of Education": {
      "Unilag First gate": haversineDistance([6.51771772897192, 3.385542526211888], [6.518014936063271, 3.384798992138069]),
      "Faculty of Environmental Science": haversineDistance([6.51771772897192, 3.385542526211888], [6.51771772897192, 3.385542526211888]),
      "El kanemi Hall": haversineDistance([6.51771772897192, 3.385542526211888], [6.516587189550492, 3.3843879197731037]),
    },
    "Faculty of Environmental Science": {
      "Unilag First gate": haversineDistance([6.51771772897192, 3.385542526211888], [6.518014936063271, 3.384798992138069]),
      "Sport Center": haversineDistance([6.51771772897192, 3.385542526211888], [6.517601770612466, 3.3866594628360507]),
      "Faculty of Engineering": haversineDistance([6.51771772897192, 3.385542526211888], [6.5192100558079025, 3.399575844402204]),
    },
    "Faculty of Engineering": {
      "Faculty of Science": haversineDistance([6.5192100558079025, 3.399575844402204], [6.5163106738877365, 3.3995329290560568]),
      "Main Auditorium": haversineDistance([6.5192100558079025, 3.399575844402204], [6.517, 3.387]),
      "Faculty of Environmental Science": haversineDistance([6.5192100558079025, 3.399575844402204], [6.51771772897192, 3.385542526211888]),
    },
    "Faculty of Science": {
      "Faculty of Engineering": haversineDistance(
        [6.5163106738877365, 3.3995329290560568],
        [6.5192100558079025, 3.399575844402204]
      ),
      "Senate Building": haversineDistance([6.5163106738877365, 3.3995329290560568], [6.520434202856529, 3.3989086167980047]),
    },
    // Continue defining other landmarks...
  };

  const result = dijkstra(unilagGraph, "Faculty of Engineering");
  console.log(result);

  useEffect(() => {
    console.log(currentLocation);
    console.log('destination', destination);
  }, [currentLocation, destination]);

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
            onChange={(e) => handleInput(e.target.value, "current")}
          />

          {currentLocation && currentSuggestions.length > 0 && (
            <ul className="absolute bg-white w-full text-gray-900 mt-1 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
              {locationCord.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setCurrentLocation({
                      name: suggestion.name,
                      coordinate: [...suggestion.coordinate],
                    });
                    setCurrentSuggestions([]);
                  }}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {suggestion.name}
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
            onChange={(e) => handleInput(e.target.value, "destination")}
          />

          {destination && destinationSuggestions.length > 0 && (
            <ul className="absolute bg-white text-gray-900 w-full mt-1 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
              {locationCord.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setDestination(
                      {
                        name: suggestion.name,
                      coordinate: [...suggestion.coordinate],
                      }
                    );
                    setDestinationSuggestions([]);
                  }}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {suggestion.name}
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
      <div className="w-[90%] max-w-xl h-96 bg-gray-300 rounded-lg">
        <p className="text-center text-gray-500 pt-10">
          Map will be displayed here
        </p>
        <Map startCoords={[currentLocation.coordinate[0], currentLocation.coordinate[1]]} endCoords={ [destination.coordinate[0], destination.coordinate[1]] } path={path} />
      </div>
    </div>
  );
}
