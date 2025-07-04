import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MapPin, Loader2 } from "lucide-react";

// رابط داده های دریافتی از OpenCage
interface OpenCageResult {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  };
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;
const OPENCAGE_API_URL = "https://api.opencagedata.com/geocode/v1/json";
console.log("My API Key Is:", API_KEY);

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Start typing a city...",
}) => {
  const [suggestions, setSuggestions] = useState<OpenCageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(OPENCAGE_API_URL, {
          params: {
            q: value,
            key: API_KEY,
            limit: 5,
            language: "en", // زبان نتایج انگلیسی خواهد بود
          },
        });
        setSuggestions(response.data.results);
        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500); // 500ms تاخیر برای جلوگیری از درخواست های مکرر

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  const handleSelect = (result: OpenCageResult) => {
    onChange(result.formatted);
    setIsOpen(false);
    setSuggestions([]);
  };

  // بستن دراپ دان هنگام کلیک بیرون از آن
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl">
          <ul className="py-1">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSelect(item)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center"
              >
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {item.formatted}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
