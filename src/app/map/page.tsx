"use client"

import { useState } from "react";

export default function MapPage() {

    const [currentLocation, setCurrentLocation] = useState<string>('')
    const [destination, setDestination] = useState<string>('')

    const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);


    const location = [
        "Unilag First gate",
        "Unilag Back Gate",

        "First Bank",
        "Access Bank",
        "Wema Bank",
        "Eco Bank",
        "Gauranty Trust Bank, GTB",
        "Zenith Bank",
        "United Bank For Africa, UBA",

        "Chapel of Christ Our Light, Unilag",
        "Unilag Central Mosque Complex",

        "Campus Carpark",
        "Gate Carpark",
        "DLI Carpark",
        "Education Carpark",

        "International School, University of Lagos Secondary School(ISL)",
        "University of Lagos Staff School",
        "University of Lagos Women Society (Creche, Nursery and Primary School) ULWS",
        "Unilag School Of Post Graduate Studies",
        
        "King Jaja Hall",
        "Mariere Hall",
        "Saburi Biobaku Hall",
        "Eni Njoku Hall",
        "Sodeinde Hall",

        "Queen Moremi Hall",
        "Fagunwa Hall",
        "Madam Tinub Hall, MTH",
        "El kanemi Hall",
        "Kofo Ademola Hall",
        "Honours Hall",
        "Queen Amina Hall",
        "Makama-Bida Hall",
        "Unilag Women Society (ULWS) Female Hostel",

        "Senate Building",
        "New Hall",
        "Distance Learning Institute, DLI",
        "Amphi Theatre",
        "Bookshop",
        "Guest House",
        "Logoon Front",
        "Unilag Health/Medical Center",
        "Sport Center",
        "CITS",
        "NORD Unilag",
        "NITHUB",
        "Unilag Alumni Jubilee House Park",

        "Afe Babalola Hall",
        "Jelili Adebisi Omotola Hall (UNILAG Multi-Purpose Hall)",
        "Julius Berger Hall",
        "Tolulope Odugbemi Hall (UNILAG Staff School Hall)",
        "Unilag Main Auditorium",
        "New Engineering Building NEB",
        "Unilag Engineering Lecture Theatre, ELT",

        "Faculty of Science",
        "Faculty of Education",
        "Faculty of Social Sciences",
        "Faculty of Management Science",
        "Faculty of Law",
        "Faculty of Environmental Science",
        "Faculty of Engineering",
        "Faculty of Art",

        "Main Library",
        "Education Library",
    ]

    const handleInput = (value: string, setType: 'current' | 'destination') => {
        const filteredSuggestions = location.filter(location =>
            location.toLowerCase().includes(value.toLowerCase())
        );

        if (setType === 'current') {
            setCurrentLocation(value);
            setCurrentSuggestions(filteredSuggestions); 
            setDestinationSuggestions([]);
          }
        else {
            setDestination(value);
            setDestinationSuggestions(filteredSuggestions);
            setCurrentSuggestions([]);
        }
          
    }

    return (
      <div className="map-page flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-[130px] pb-8">
        
        <div className="bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-lg mb-6 w-[90%] max-w-xl">
            <h1 className="text-2xl text-white font-semibold mb-4">Find Your Route</h1>
            <div className="mb-4 relative">
                <label className="block text-gray-300 mb-1">Current Location:</label>
                <input 
                type="text" 
                className="w-full p-2 rounded border border-gray-500" 
                placeholder="Enter your current location" 
                value={currentLocation}
                onChange={(e) => handleInput(e.target.value, 'current')}
                />
                
                {currentLocation && currentSuggestions.length > 0 && (
                    <ul className="absolute bg-white w-full text-gray-900 mt-1 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
                        {currentSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => {
                                    setCurrentLocation(suggestion);
                                    setCurrentSuggestions([]); 
                                }}
                                className="p-2 hover:bg-gray-200 cursor-pointer">
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
                    className="w-full p-2 rounded border border-gray-500" 
                    placeholder="Enter your destination" 
                    value={destination}
                    onChange={(e) => handleInput(e.target.value, 'destination')}
                />

                {destination && destinationSuggestions.length > 0 && (
                    <ul className="absolute bg-white text-gray-900 w-full mt-1 rounded shadow-lg z-10 max-h-40 overflow-y-auto">
                    {destinationSuggestions.map((suggestion, index) => (
                        <li
                        key={index}
                        onClick={() => {
                            setDestination(suggestion);
                            setDestinationSuggestions([]);
                        }}
                        className="p-2 hover:bg-gray-200 cursor-pointer">
                        {suggestion}
                        </li>
                    ))}
                    </ul>
                )}
            </div>


            <button className="mt-4 w-full bg-orange-500 text-white font-semibold rounded-lg p-2 hover:bg-orange-600 transition duration-300 ease-in-out">
                Find Route
            </button>
        </div>
  
        {/* Map Section */}
        <div className="w-[90%] max-w-xl h-96 bg-gray-300 rounded-lg">
          <p className="text-center text-gray-500 pt-10">Map will be displayed here</p>
        </div>
      </div>
    );
  }
  