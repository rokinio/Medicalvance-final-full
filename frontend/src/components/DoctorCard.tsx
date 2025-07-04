// frontend/src/components/DoctorCard.tsx
import React from "react";
import { MapPin, Languages, Stethoscope } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  location?: string;
  specialties?: string;
  languages?: string[];
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  const profileImageUrl = doctor.profileImage
    ? `${API_URL}/${doctor.profileImage}`
    : `https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=random`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img
            className="h-48 w-full object-cover md:w-48"
            src={profileImageUrl}
            alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
          />
        </div>
        <div className="p-6">
          <div className="uppercase tracking-wide text-sm text-indigo-600 font-semibold">
            {doctor.specialties || "General Practitioner"}
          </div>
          <h2 className="block mt-1 text-lg leading-tight font-bold text-black">
            Dr. {doctor.firstName} {doctor.lastName}
          </h2>
          <div className="mt-4 space-y-3 text-gray-600">
            {doctor.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.location}</span>
              </div>
            )}
            {doctor.languages && doctor.languages.length > 0 && (
              <div className="flex items-center">
                <Languages className="h-4 w-4 mr-2 text-gray-400" />
                <span>{doctor.languages.join(", ")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
