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
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

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
  });

  useEffect(() => {
    if (user) {
      setEditData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        specialties: user.specialties || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
                    <KeyRound className="w-4 h-4 mr-2" />
                    Change Password
                  </button>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
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
                    <FileText className="w-4 h-4 mr-2" />
                    Manage Documents
                  </button>
                  <button className="w-full flex items-center justify-center p-3 bg-white border rounded-lg text-sm font-medium hover:bg-gray-100">
                    <Calendar className="w-4 h-4 mr-2" />
                    Manage Schedule
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
