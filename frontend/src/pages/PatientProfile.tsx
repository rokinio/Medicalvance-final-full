import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import { Edit, KeyRound, User, Search, Calendar } from "lucide-react";

const PatientProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/30">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user.alias}</h1>
                <p className="text-green-100 text-sm">Patient</p>
              </div>
            </div>
          </div>
          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Information
                </h2>
                <div className="flex space-x-3">
                  <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
                    <KeyRound className="w-4 h-4 mr-2" />
                    Change Password
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
              <form className="space-y-6 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium text-gray-700">
                      Alias / Display Name
                    </label>
                    <input
                      type="text"
                      value={user.alias}
                      disabled
                      className="w-full px-4 py-3 border-gray-200 rounded-lg bg-gray-50 mt-2"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 border-gray-200 rounded-lg bg-gray-50 mt-2"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center p-3 bg-white border rounded-lg text-sm font-medium">
                    <Search className="w-4 h-4 mr-2" />
                    Find Doctors
                  </button>
                  <button className="w-full flex items-center justify-center p-3 bg-white border rounded-lg text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PatientProfile;
