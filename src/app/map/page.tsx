"use client";
import Map from "@/components/Map";
import axios from "axios";
import { useState } from "react";

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
  // States for user inputs
  const [startLocation, setStartLocation] = useState<string>("");
  const [endLocation, setEndLocation] = useState<string>("");

  // States for coordinates
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [endCoords, setEndCoords] = useState<[number, number] | null>(null);

  // Function to get coordinates using Google Maps Geocoding API
  const getCoordinates = async (address: string) => {
    const API_KEY = "AIzaSyAKk3hlTbzWVJfDM8xOlHd-OreQgA_fwNk"; // Replace with your Google Maps API key
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${API_KEY}`
      );
      const { lat, lng } = response.data.results[0].geometry.location;
      return [lat, lng];
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Handle form submission to set markers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (startLocation) {
      const startCoords = await getCoordinates(startLocation);
      setStartCoords(startCoords as [number, number]);
    }
    if (endLocation) {
      const endCoords = await getCoordinates(endLocation);
      setEndCoords(endCoords as [number, number]);
    }
  };

  //------------------------------------------------------- LAST CODE UP THERE---------------------------------------------//

  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

  const haversineDistance = (
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
  };

  // Example usage:
  // const distance = haversineDistance([6.515, 3.386], [6.516, 3.387]);
  // console.log(`Distance: ${distance} meters`);

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
    "Faculty of Engineering": {
      "Faculty of Science": haversineDistance([6.516, 3.387], [6.52, 3.391]),
      "Main Auditorium": haversineDistance([6.516, 3.387], [6.517, 3.387]),
    },
    "Faculty of Science": {
      "Faculty of Engineering": haversineDistance(
        [6.52, 3.391],
        [6.516, 3.387]
      ),
      "Senate Building": haversineDistance([6.52, 3.391], [6.515, 3.386]),
    },
    // Continue defining other landmarks...
  };

  const result = dijkstra(unilagGraph, "Faculty of Engineering");
  console.log(result);

  return (
    <div className="map-page flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-[130px] pb-8">
      <div className="bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-lg mb-6 w-[90%] max-w-xl">
        <h1 className="text-2xl text-white font-semibold mb-4">
          Find Your Route
        </h1>
        <div className="mb-4">
          <label className="block text-gray-300 mb-1">Current Location:</label>
          <input
            type="text"
            className="w-full p-2 rounded border border-gray-500"
            placeholder="Enter your current location"
            onChange={(e) => setStartLocation(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1">Destination:</label>
          <input
            type="text"
            className="w-full p-2 rounded border border-gray-500"
            placeholder="Enter your destination"
            onChange={(e) => setEndLocation(e.target.value)}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-orange-500 text-white font-semibold rounded-lg p-2 hover:bg-orange-600 transition duration-300 ease-in-out"
        >
          Find Route
        </button>
      </div>

      {/* Map Section */}
      <div className="w-[90%] max-w-xl h-96 bg-gray-300 rounded-lg">
        <p className="text-center text-gray-500 pt-10">
          Map will be displayed here
        </p>
        <Map startCoords={startCoords} endCoords={endCoords} />
      </div>
    </div>
  );
}
