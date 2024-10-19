"use client";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";

// Importing leaflet CSS in the component to ensure it's applied
import "leaflet/dist/leaflet.css";
import "tailwindcss/tailwind.css";
import locationCord from "@/data/locationCoord";

// Fix for default marker icon issue in Leaflet + React
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// const LocationMarker: React.FC<{
//   setStartLocation: (pos: [number, number]) => void;
//   setEndLocation: (pos: [number, number]) => void;
//   selectionState: "start" | "end";
//   setSelectionState: React.Dispatch<React.SetStateAction<"start" | "end">>;
// }> = ({
//   setStartLocation,
//   setEndLocation,
//   selectionState,
//   setSelectionState,
// }) => {
//   useMapEvents({
//     click(e) {
//       const { lat, lng } = e.latlng;
//       if (selectionState === "start") {
//         setStartLocation([lat, lng]);
//         setSelectionState("end"); // Switch to selecting end location after start is set
//       } else if (selectionState === "end") {
//         setEndLocation([lat, lng]);
//         setSelectionState("start"); // Switch back to selecting start location after end is set
//       }
//     },
//   });
//   return null;
// };

const fetchRouteFromORS = async (coordinates: [number, number][]) => {
  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        coordinates,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ORS_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

type LocationMarkerProps = {
  startCoords: [number, number] | null;
  endCoords: [number, number] | null;
  path: string[];
};

const Map = ({ startCoords, endCoords, path }: LocationMarkerProps) => {
  //   const [startLocation, setStartLocation] = useState<[number, number] | null>(
  //     null
  //   );
  //   const [endLocation, setEndLocation] = useState<[number, number] | null>(null);
  //   const [selectionState, setSelectionState] = useState<"start" | "end">(
  //     "start"
  //   );

  const [route, setRoute] = useState<L.LatLng[]>([]);

  // const markers = path.map((nodeName) => {
  //   // find in the locationCord array for every location if the location name is equal to the nodeName. Remember we are mapping through. This runs for every nodeName in the path array.
  //     const coord = locationCord.find(location => location.name === nodeName)?.coordinate;
  //     // if the coordinate is found, return the lat and long, else return null
  //     return coord ? L.latLng(coord[0], coord[1]) : null;

  //     // filter out the nodes that are null
  //   }).filter((coord): coord is L.LatLng => coord !== null);

  useEffect(() => {
    if (
      startCoords &&
      endCoords &&
      startCoords[0] !== 0 &&
      startCoords[1] !== 0 &&
      endCoords[0] !== 0 &&
      endCoords[1] !== 0 &&
      path.length > 0
    ) {
      // Fetch the route when startCoords and endCoords are available

      const fetchRoute = async () => {
        const coordinates = path.map(nodeName => {
          const coord = locationCord.find(location => location.name === nodeName)?.coordinate;
          return coord ? [coord[1], coord[0]] : null; // Make sure to invert lat/lng
        }).filter(coord => coord !== null) as [number, number][];
        try {
          
          // const response = await axios.get(
          //   `https://api.openrouteservice.org/v2/directions/foot-walking?api_key=${apiKey}&start=${startCoords[1]},${startCoords[0]}&end=${endCoords[1]},${endCoords[0]}`
          // );
          // Fetching coordinates from locationCord based on path names
      

      // Call the OpenRouteService API with your coordinates
      const routeData = await fetchRouteFromORS(coordinates);
      if (routeData) {
        // Extract coordinates from the GeoJSON response
        const routeCoords = routeData.features[0].geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        setRoute(routeCoords);
      }
          // const coordinates = await response.data.features[0].geometry
          //   .coordinates;
          // console.log("coordinates", coordinates);
          // console.log(response);

          // // Convert coordinates from [lng, lat] to [lat, lng] and store them as L.LatLng
          // const routeCoords = coordinates.map((coord: [number, number]) =>
          //   L.latLng(coord[1], coord[0])
          // );
          // setRoute(routeCoords);
        } catch (error) {
          console.error(error);
        }
      };

      fetchRoute();
    }
  }, [startCoords, endCoords, path]);

  return (
    <div className="h-full">
      <MapContainer
        center={[6.515, 3.386]} // Coordinates for Unilag or your desired location
        zoom={16}
        className="h-full w-full" // Tailwind classes to make the map fill the div
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* <LocationMarker
          setStartLocation={setStartLocation}
          setEndLocation={setEndLocation}
          selectionState={selectionState}
          setSelectionState={setSelectionState}
        /> */}

        {/* Marker for start location */}
        {startCoords && (
          <Marker position={startCoords}>
            <Popup>Start Location</Popup>
          </Marker>
        )}

        {/* Marker for end location */}
        {endCoords && (
          <Marker position={endCoords}>
            <Popup>End Location</Popup>
          </Marker>
        )}
        {route.length > 1 && <Polyline positions={route} color="blue" />}
        {/* <Marker position={[6.515, 3.386]}>
          <Popup>
            University of Lagos <br /> Main Campus.
          </Popup>
        </Marker> */}
      </MapContainer>

      {/* Information and instructions for the user */}
      {/* <div className="absolute top-5 left-5 bg-white p-4 shadow-md rounded-lg z-10">
        <p>
          {selectionState === 'start'
            ? 'Click on the map to select the start location.'
            : 'Click on the map to select the end location.'}
        </p>
        {startLocation && endLocation && (
          <p>
            Start: {startLocation.join(', ')} <br />
            End: {endLocation.join(', ')}
          </p>
        )}
      </div> */}
    </div>
  );
};

export default Map;
