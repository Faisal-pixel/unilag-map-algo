import locationCord from "@/data/locationCoord";

export const handleKey = (
    e: React.KeyboardEvent<HTMLInputElement>,
    setType: "current" | "destination",
    currentSuggestions: string[],
    destinationSuggestions: string[],
    highlightedIndex: number | null,

    setHighlightedIndex: React.Dispatch<React.SetStateAction<number | null>>,
    setCurrentLocation: (location: { name: string; coordinate: number[] }) => void,
    setDestination: (location: { name: string; coordinate: number[] }) => void,
    setCurrentSuggestions: React.Dispatch<React.SetStateAction<string[]>>,
    setDestinationSuggestions: React.Dispatch<React.SetStateAction<string[]>>
) => {
    if (setType === "current" && currentSuggestions.length > 0) {
        if (e.key === "ArrowDown") {
            setHighlightedIndex((prev) =>
                prev === null || prev === currentSuggestions.length - 1? 0: prev + 1
            );
        }
        else if (e.key === "ArrowUp") {
            setHighlightedIndex((prev) =>
                prev === null || prev === 0 ? currentSuggestions.length - 1 : prev - 1
            );
        }
        else if (e.key === "Enter" && highlightedIndex !== null) {
            const selectedLocation = locationCord.find(
                (loc) => loc.name === currentSuggestions[highlightedIndex]
            );
            if (selectedLocation) {
                setCurrentLocation({
                name: selectedLocation.name,
                coordinate: [...selectedLocation.coordinate],
                });
                setCurrentSuggestions([]);
                setHighlightedIndex(null);
            }
        }
    }
    else if (setType === "destination" && destinationSuggestions.length > 0) {
        if (e.key === "ArrowDown") {
            setHighlightedIndex((prev) =>
                prev === null || prev === destinationSuggestions.length - 1
                ? 0
                : prev + 1
            );
        }
        else if (e.key === "ArrowUp") {
            setHighlightedIndex((prev) =>
                prev === null || prev === 0 ? destinationSuggestions.length - 1 : prev - 1
            );
        }
        else if (e.key === "Enter" && highlightedIndex !== null) {
            const selectedLocation = locationCord.find(
                (loc) => loc.name === destinationSuggestions[highlightedIndex]
            );
            if (selectedLocation) {
                setDestination({
                name: selectedLocation.name,
                coordinate: [...selectedLocation.coordinate],
                });
                setDestinationSuggestions([]);
                setHighlightedIndex(null);
            }
        }
    }
};
