"use client";

import { useEffect, useState } from "react";

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

const location = [
  "Unilag First gate",
  "Unilag Second Gate (Back Gate)",

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
  "Lagoon Front",
  "Unilag Health Center",
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
];

const locationCord = [
  {
    name: "Unilag First gate",
    coordinate: [6.518014936063271, 3.384798992138069],
  },
  {
    name: "Unilag Second Gate (Back Gate)",
    coordinate: [6.5111756001287535, 3.388336250569788],
  },
  {
    name: "First Bank",
    coordinate: [6.513378894856121, 3.3907097167971094],
  },
  {
    name: "Access Bank",
    coordinate: [6.5091148347763435, 3.384315326711466],
  },
  {
    name: "Wema Bank",
    coordinate: [6.518250983384383, 3.386958662836135],
  },
  {
    name: "Eco Bank",
    coordinate: [6.519993228036292, 3.397178893528671],
  },
  {
    name: "Gauranty Trust Bank, GTB",
    coordinate: [6.517468541725904, 3.397785272733442],
  },
  {
    name: "Zenith Bank",
    coordinate: [6.5183421780461135, 3.3976562702563546],
  },
  {
    name: "United Bank For Africa, UBA",
    coordinate: [6.521496542576091, 3.399802023525028],
  },
  {
    name: "Chapel of Christ Our Light, Unilag",
    coordinate: [6.51897056442575, 3.3895678167978587],
  },
  {
    name: "Unilag Central Mosque Complex",
    coordinate: [6.524902095308841, 3.390214551066213],
  },
  {
    name: "Campus Carpark",
    coordinate: [6.518182149201132, 3.3972892932547993],
  },
  {
    name: "Gate Carpark",
    coordinate: [6.518113403528685, 3.3865495321438734],
  },
  {
    name: "DLI Carpark",
    coordinate: [],
  },
  {
    name: "Education Carpark",
    coordinate: [],
  },
  {
    name: "International School, University of Lagos Secondary School(ISL)",
    coordinate: [6.511106852357738, 3.391585608600962],
  },
  {
    name: "University of Lagos Staff School",
    coordinate: [6.5161245633656515, 3.397233261825241],
  },
  {
    name: "University of Lagos Women Society (Creche, Nursery and Primary School) ULWS",
    coordinate: [6.520260281601794, 3.3923100053115336],
  },
  {
    name: "Unilag School Of Post Graduate Studies",
    coordinate: [6.51675785224758, 3.386608852783639],
  },
  {
    name: "King Jaja Hall",
    coordinate: [6.517056295468176, 3.3977774167975574],
  },
  {
    name: "Mariere Hall",
    coordinate: [6.5186987906732545, 3.3982279781823883],
  },
  {
    name: "Saburi Biobaku Hall",
    coordinate: [6.516163997074919, 3.386987155412851],
  },
  {
    name: "Eni Njoku Hall",
    coordinate: [6.519912947917018, 3.393700549887167],
  },
  {
    name: "Sodeinde Hall",
    coordinate: [6.520427581600921, 3.392480316210162],
  },
  {
    name: "Queen Moremi Hall",
    coordinate: [6.518847002124518, 3.3972625236174303],
  },
  {
    name: "Fagunwa Hall",
    coordinate: [6.532856716093919, 3.3930610090434294],
  },
  {
    name: "Madam Tinub Hall, MTH",
    coordinate: [6.521390938638696, 3.3914420554135223],
  },
  {
    name: "El kanemi Hall",
    coordinate: [6.516587189550492, 3.3843879197731037],
  },
  {
    name: "Kofo Ademola Hall",
    coordinate: [6.516416637244883, 3.3869628405419685],
  },
  {
    name: "Honours Hall",
    coordinate: [6.511692443730583, 3.3937027657497407],
  },
  {
    name: "Queen Amina Hall",
    coordinate: [6.515478598527451, 3.385503718772945],
  },
  {
    name: "Makama-Bida Hall",
    coordinate: [6.520433465030067, 3.392329478182589],
  },
  {
    name: "Unilag Women Society (ULWS) Female Hostel",
    coordinate: [6.512031127019273, 3.3933828889652276],
  },
  {
    name: "Senate Building",
    coordinate: [6.520434202856529, 3.3989086167980047],
  },
  {
    name: "New Hall",
    coordinate: [6.53348539932536, 3.392373464755907],
  },
  {
    name: "Distance Learning Institute, DLI",
    coordinate: [6.512800964662927, 3.391929170758521],
  },
  {
    name: "Amphi Theatre",
    coordinate: [6.519080119492374, 3.3899658167977784],
  },
  {
    name: "Bookshop",
    coordinate: [6.5197206043242195, 3.3976865935286504],
  },
  {
    name: "Guest House",
    coordinate: [6.5222618660818314, 3.3991951895280037],
  },
  {
    name: "Lagoon Front",
    coordinate: [6.52177306936262, 3.4001575491284495],
  },
  {
    name: "Unilag Health Center",
    coordinate: [6.514816107698542, 3.3968322686718424],
  },
  {
    name: "Sport Center",
    coordinate: [6.517601770612466, 3.3866594628360507],
  },
  {
    name: "Centre for Information and Technology System, (CITS)",
    coordinate: [6.519328205131226, 3.395825739567028],
  },
  {
    name: "NORD Unilag",
    coordinate: [6.51970605281653, 3.390365347490202],
  },
  {
    name: "NITHUB",
    coordinate: [6.517334194967716, 3.391550678182176],
  },
  {
    name: "Unilag Alumni Jubilee House Park",
    coordinate: [6.51820250744604, 3.3972731014515287],
  },
  {
    name: "Afe Babalola Hall",
    coordinate: [6.519377353380712, 3.396955362836319],
  },
  {
    name: "Jelili Adebisi Omotola Hall (UNILAG Multi-Purpose Hall)",
    coordinate: [6.517524432693201, 3.387233901451461],
  },
  {
    name: "Julius Berger Hall",
    coordinate: [6.518328231177173, 3.400392908874607],
  },
  {
    name: "Tolulope Odugbemi Hall (UNILAG Staff School Hall)",
    coordinate: [6.516215958805685, 3.39732210145129],
  },
  {
    name: "Unilag Main Auditorium",
    coordinate: [6.519663663530796, 3.398843916797945],
  },
  {
    name: "Unilag Engineering Lecture Theatre, ELT",
    coordinate: [6.518354789639715, 3.3997827913990544],
  },
  {
    name: "Faculty of Science",
    coordinate: [6.5163106738877365, 3.3995329290560568],
  },
  {
    name: "Faculty of Education",
    coordinate: [6.51771772897192, 3.385542526211888],
  },
  {
    name: "Faculty of Social Sciences",
    coordinate: [6.516353311978581, 3.3916365053648696],
  },
  {
    name: "Faculty of Management Science",
    coordinate: [6.522279971330859, 3.398588791440806],
  },
  {
    name: "Faculty of Law",
    coordinate: [6.521384581245532, 3.399103775594579],
  },
  {
    name: "Faculty of Environmental Science",
    coordinate: [6.518398679091021, 3.387119370759319],
  },
  {
    name: "Faculty of Engineering",
    coordinate: [6.5192100558079025, 3.399575844402204],
  },
  {
    name: "Faculty of Art",
    coordinate: [6.520446551821463, 3.3978592305562945],
  },
  {
    name: "Main Library",
    coordinate: [6.521119001447902, 3.399734055413511],
  },
  {
    name: "Education Library",
    coordinate: [6.5174558186117375, 3.3852276861053388],
  },
];

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

        <button className="mt-4 w-full bg-orange-500 text-white font-semibold rounded-lg p-2 hover:bg-orange-600 transition duration-300 ease-in-out">
          Find Route
        </button>
      </div>

      {/* Map Section */}
      <div className="w-[90%] max-w-xl h-96 bg-gray-300 rounded-lg">
        <p className="text-center text-gray-500 pt-10">
          Map will be displayed here
        </p>
      </div>
    </div>
  );
}
