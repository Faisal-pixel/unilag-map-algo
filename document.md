### Explaining map page
1. We create a Graph interface. It will have keys that are of the string type and values that are object that stores keys that are of the string typ and a number value.
2. We create a PriorityQueue class. A priority queue is quite different froma  queue. here a member of the queue who has a higher priority is served before a member who has a lower priority. Not necessarily the one who comes first. We have an elements which is an empy list of objects.
Each object has a node property and a priority property. The priority property tells use how important this node is. Lower number means its more important (closer).
The essence of the priority queue is to keep track of the next node to visit. We will always visit the node with the lowest priority first..
The enqueue method adds a node to the queue and sorts it based on the priority. The dequeue method removes a node from the queue and return the node with the highest priority (the smallest distance)
The isEmpty method checks if the queue is empty. It checks if the length of the list is 0. If it is, it returns true.
3. Then we create our MapPage component.
    1. The currentLocation state is created. Its an object with a name property:string and a coordinate property which is an array of numbers. Same is done with the destinations tte.
    2. We then create the currentSuggestions state which is an array of string.
    3. We then create the destinationSuggestions also which is an array of strings.
    4. We create the path state. *** I will get back to this. ***
    5. We created the handleInput function which receives the value of the input boxes and also the type which runs a condition based on which input boxes is being typed in. Either current or destination.
    6. We have a filteredSuggestions variable that stores the array returned if any of the locations from the locationCOrd array includes the value of the input text. This way we can render them as the suggestions.
    7. If the type is current, set the current location to the value of the input text, set the suggestions to the array of loc.name strings, and the destination suggestions to an empty array. We are doing vice versa for the destination type.

    8. Now in other to calculate the distance between two nodes using the coordinates, we use the haversine formula. To use this, we need to convert the coordinates from degrees to radians.
    9. We created a variable, toRadians which is a function that recieves a number in degrees and converts it to radians.
    10. Then we created a harversineDistance function that recieves first coordinates, and second coordinates and returns the distance between them.
    11. Remember the graph type, it basically stores object of nodes and their neighbours.
    12. We created a constructGraph functions that helps construct the graph of unilag. I did not want to do this manually. Its way too tasking. So I created a function that takes in locations (type of locationCord - an array of of all places in unilag with their name and coordinate.)
        1. We loop through the locations and for each location:
            - We create a locA varable which is equal to the location[i] - the current value of i in the loop location, i.e for the first loop, locA is equal to location[0]. Which is the first location of the locationCoord array.
            - then we are setting it as a property in the graph object and set it to an empty object. Remember I said the graph picks a location and then stores all its neighbours in an object.
            - Now we need to compare the current location with all other locations to see if they are neighbours. We do this by looping through the locations again and for each location:
                - We create a locB variable which is equal to the location[j] - the current value of j in the loop location, i.e for the first loop, locB is equal to location[0]. Which is the first location of the locationCoord array.
                - We then check if the locA is not equal to locB (by ensuring i is not equal to j). If it is not, we calculate the distance between locA and locB using the haversineDistance function we created earlier.
        2. So our graph isnt perfect because it takes a node and stores all other nodes's distances.
        3. Then we return the graph.
    13. Then we create our graph.
    14. We created the reconstructPath function *** Will get back to this ***
    15. We created the findRoute function.
        1. We check if there is no currentLocation.name or destination.name. If there is none, we return.
        2. We create a variable result that stores dijkstra's algorithm. *** We will get back to this. ***
    
    16. We created the dijkstra algorithm which is a function that recieves two args, graph and startNode.
        1. We create a distances obkect which is of type object (key: string, value: number) and set it to an empty object.
        2. We create a prev object which is of type object (key: string, value: string | null) and set it to an empty object.
