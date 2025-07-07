import React, { useState } from "react";
import axios from 'axios'

function LocationAutoComplete({ onSelect }) {
    const [query, setQuery] = useState()
    const [suggestions, setSuggestions] = useState([])

    const handleChange = async (e) => {
        const value = e.target.value
        setQuery(value)

        if (!value.trim()) return setSuggestions([]);

        try {
            const res = await axios.get(
                `https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=5`
            );
            setSuggestions(res.data.features || []);
        } catch (err) {
            console.error("Error fetching suggestions:", err.message);
        }
    }

    const handleSelect = (place) => {
        const location = `${place.properties.name}, ${place.properties.city || ""}, ${place.properties.country || ""}`.trim()
        const coordinates = {
            lat: place.geometry.coordinates[1],
            lng: place.geometry.coordinates[0]
        }

        setQuery(location)
        setSuggestions([])
        onSelect({ location, coordinates })
    }

    return (<div className="relative w-full">
        <input type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search locations..."
            className="overflow-hidden w-full bg-transparent border-none outline-none px-3 py-2 text-white/50"
        />

        {
            suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border mt-1 rounded shadow-md text-black">
                    {
                        suggestions.map((place, index) => (
                            <li
                                key={index}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(place)}
                            >{place.properties.name}, {place.properties.city}, {place.properties.country}</li>
                        ))
                    }
                </ul>
            )
        }
    </div>)
}

export default LocationAutoComplete