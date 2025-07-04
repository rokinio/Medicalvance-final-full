import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { ManageDocumentsModal } from "../components/ManageDocumentsModal";
import {
  Edit,
  KeyRound,
  Check,
  Clock,
  X,
  FileText,
  Calendar,
  Camera,
  Tag,
  BookOpen,
  Languages,
  MapPin,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_URL) {
  throw new Error(
    "Fatal Error: VITE_API_BASE_URL is not defined in the build configuration."
  );
}
// Updated and complete list of available languages
const availableLanguages = [
  "English",
  "Persian", // اضافه شد
  "Arabic", // Standard Arabic -> Arabic
  "Spanish",
  "German", // اضافه شد
  "French",
  "Russian",
  "Portuguese",
  "Mandarin Chinese",
  "Hindi",
  "Bengali",
  "Urdu",
];

// A sample list of countries for the location dropdown
const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Iran",
  "Turkey",
  "India",
  "China",
  "Russia",
];

const DoctorProfile: React.FC = () => {
  const { user, updateUserState } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isDocumentsModalOpen, setDocumentsModalOpen] = useState(false);

  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    specialties: "",
    bio: "",
    location: "",
    education: "",
    tags: [] as string[],
    languages: [] as string[],
  });

  // Reset editData to user's current data when editing starts or user data changes
  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        specialties: user.specialties || "",
        bio: user.bio || "",
        location: user.location || "",
        education: user.education || "",
        tags: user.tags || [],
        languages: user.languages || [],
      });
    }
  }, [user, isEditing]); // Rerun effect to reset form on cancel

  const handleSave = async () => {
    if (!user?.token) return;
    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editData),
      });
      const updatedUser = await response.json();
      if (!response.ok) throw new Error(updatedUser.message);
      updateUserState(updatedUser);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLanguageChange = (language: string) => {
    setEditData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((lang) => lang !== language)
        : [...prev.languages, language],
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(",").map((tag) => tag.trim());
    setEditData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!user)
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );

  const getStatusInfo = () => {
    switch (user.status) {
      case "approved":
        return {
          text: "Verified",
          icon: Check,
          color: "text-green-500",
          bgColor: "bg-green-100 border-green-200",
        };
      case "pending":
        return {
          text: "Pending Verification",
          icon: Clock,
          color: "text-amber-600",
          bgColor: "bg-amber-100 border-amber-200",
        };
      case "rejected":
        return {
          text: "Rejected",
          icon: X,
          color: "text-red-500",
          bgColor: "bg-red-100 border-red-200",
        };
      default:
        return {
          text: "Unknown Status",
          icon: X,
          color: "text-gray-500",
          bgColor: "bg-gray-100 border-gray-200",
        };
    }
  };
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white/50"
                    src={
                      user.profileImage
                        ? `${API_URL}/${user.profileImage}`
                        : "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                  />
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">
                    Dr. {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-blue-100 text-sm">Medical Professional</p>
                </div>
              </div>
              <span
                className={`mt-4 sm:mt-0 inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${statusInfo.bgColor} ${statusInfo.color}`}
              >
                <StatusIcon className="w-4 h-4 mr-2" />
                {statusInfo.text}
              </span>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Information
                </h2>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setPasswordModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-sm font-medium"
                  >
                    <KeyRound className="w-4 h-4 mr-2" /> Change Password
                  </button>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 mr-2" /> Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        <X className="w-4 h-4 mr-2" /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-2" /> Save Changes
                      </button>
                    </>
                  )}
                </div>
              </div>
              <form className="space-y-6 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={editData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border rounded-lg mt-2 disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={editData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border rounded-lg mt-2 disabled:bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-500 mt-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border rounded-lg mt-2 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    Location of Practice
                  </label>
                  {isEditing ? (
                    <select
                      name="location"
                      value={editData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border rounded-lg mt-2 appearance-none bg-white"
                    >
                      <option value="" disabled>
                        Select a country
                      </option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="mt-2 text-gray-900 text-base p-3 bg-gray-50 rounded-lg">
                      {editData.location || "Not specified"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-gray-700 flex items-center">
                    <Languages className="w-4 h-4 mr-2 text-gray-400" />
                    Languages
                  </label>
                  {isEditing ? (
                    <div className="p-4 border border-gray-300 rounded-lg mt-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableLanguages.map((lang) => (
                        <div key={lang} className="flex items-center">
                          <input
                            id={`edit-lang-${lang}`}
                            type="checkbox"
                            checked={editData.languages.includes(lang)}
                            onChange={() => handleLanguageChange(lang)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label
                            htmlFor={`edit-lang-${lang}`}
                            className="ml-2 block text-sm text-gray-900"
                          >
                            {lang}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editData.languages.length > 0 ? (
                        editData.languages.map((lang) => (
                          <span
                            key={lang}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                          >
                            {lang}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No languages listed.</p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Specialization
                  </label>
                  <input
                    type="text"
                    name="specialties"
                    value={editData.specialties}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border rounded-lg mt-2 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                    Education
                  </label>
                  <textarea
                    name="education"
                    value={editData.education}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg mt-2 disabled:bg-gray-50"
                    placeholder="List your degrees and qualifications..."
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Biography
                  </label>
                  <textarea
                    name="bio"
                    value={editData.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg mt-2 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-gray-400" />
                    Tags
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="tags"
                      value={editData.tags.join(", ")}
                      onChange={handleTagsChange}
                      className="w-full px-4 py-3 border rounded-lg mt-2"
                      placeholder="Enter tags, separated by commas"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editData.tags.length > 0 ? (
                        editData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No tags listed.</p>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Verification Status
                </h3>
                <p className="text-sm text-gray-600">
                  {user.status === "pending"
                    ? "Your documents are being reviewed by our team."
                    : "Your account is active and verified."}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setDocumentsModalOpen(true)}
                    className="w-full flex items-center justify-center p-3 bg-white border rounded-lg text-sm font-medium hover:bg-gray-100"
                  >
                    <FileText className="w-4 h-4 mr-2" /> Manage Documents
                  </button>
                  <button className="w-full flex items-center justify-center p-3 bg-white border rounded-lg text-sm font-medium hover:bg-gray-100">
                    <Calendar className="w-4 h-4 mr-2" /> Manage Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
      <ManageDocumentsModal
        isOpen={isDocumentsModalOpen}
        onClose={() => setDocumentsModalOpen(false)}
      />
    </Layout>
  );
};

export default DoctorProfile;
