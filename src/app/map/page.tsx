export default function MapPage() {
    return (
      <div className="map-page flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-[130px] pb-8">
        
        <div className="bg-gray-800 bg-opacity-70 p-8 rounded-lg shadow-lg mb-6 w-[90%] max-w-xl">
          <h1 className="text-2xl text-white font-semibold mb-4">Find Your Route</h1>
          <div className="mb-4">
            <label className="block text-gray-300 mb-1">Current Location:</label>
            <input 
              type="text" 
              className="w-full p-2 rounded border border-gray-500" 
              placeholder="Enter your current location" 
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-1">Destination:</label>
            <input 
              type="text" 
              className="w-full p-2 rounded border border-gray-500" 
              placeholder="Enter your destination" 
            />
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
  