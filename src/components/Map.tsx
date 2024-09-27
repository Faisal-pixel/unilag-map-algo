"use client";
import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

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

type LocationMarkerProps = {
    startCoords: [number, number] | null
    endCoords: [number, number] | null
    path: string[]
}

const Map = ({startCoords, endCoords, path}: LocationMarkerProps) => {
//   const [startLocation, setStartLocation] = useState<[number, number] | null>(
//     null
//   );
//   const [endLocation, setEndLocation] = useState<[number, number] | null>(null);
//   const [selectionState, setSelectionState] = useState<"start" | "end">(
//     "start"
//   );

const markers = path.map((nodeName) => {
    const coord = locationCord.find(location => location.name === nodeName)?.coordinate;
    return coord ? L.latLng(coord[0], coord[1]) : null;
  }).filter((coord): coord is L.LatLng => coord !== null);
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
        {markers.length > 1 && <Polyline positions={markers} color="blue" />}
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
