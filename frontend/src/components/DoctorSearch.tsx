// frontend/src/components/DoctorSearch.tsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DoctorCard from "./DoctorCard";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { Search, MapPin } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const languageOptions = [
  "English",
  "Persian",
  "Arabic",
  "Spanish",
  "German",
  "French",
  "Russian",
  "Portuguese",
  "Mandarin Chinese",
  "Hindi",
  "Bengali",
  "Urdu",
];

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  location?: string;
  specialties?: string;
  languages?: string[];
}

const DoctorSearch: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [languageFilters, setLanguageFilters] = useState<string[]>([]);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (locationFilter) params.append("location", locationFilter);
      if (languageFilters.length > 0)
        params.append("language", languageFilters.join(","));

      const response = await axios.get(`${API_URL}/api/doctors`, { params });
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, locationFilter, languageFilters]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDoctors();
    }, 500);
    return () => clearTimeout(handler);
  }, [fetchDoctors]);

  return (
    // بخش اصلی که حالا پس‌زمینه ندارد و در صفحه لندینگ حل می‌شود
    <div className="py-16 -mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* کارت فیلتر با ظاهر شیشه‌ای و مدرن */}
        <div className="bg-white/50 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name or Specialty
              </label>
              <Search className="absolute left-3 top-1/2 mt-2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                id="search"
                type="text"
                placeholder="Dr. Smith, Cardiology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Location Input */}
            <div className="relative md:col-span-1">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <MapPin className="absolute left-3 top-1/2 mt-2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input
                id="location"
                type="text"
                placeholder="e.g., Iran"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Language Dropdown */}
            <div className="md:col-span-1">
              <label
                htmlFor="languages"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Languages
              </label>
              <MultiSelectDropdown
                options={languageOptions}
                selectedOptions={languageFilters}
                onChange={setLanguageFilters}
                placeholder="Select languages..."
              />
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="text-center text-gray-500">Loading doctors...</div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-lg p-12 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">
              No Doctors Found
            </h3>
            <p className="mt-2 text-gray-500">
              Please try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSearch;
