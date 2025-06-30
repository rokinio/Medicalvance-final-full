import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Stethoscope, Heart, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="py-6">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-blue-600">MedPlatform</div>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">MedPlatform</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A comprehensive medical platform connecting patients with verified healthcare professionals. 
            Join our community for secure, professional medical consultations and care.
          </p>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Patient Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-200">
              <div className="text-blue-600 mb-6">
                <Heart className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">I'm a Patient</h2>
              <p className="text-gray-600 mb-8">
                Find qualified doctors, book consultations, and manage your healthcare journey securely.
              </p>
              <Link
                to="/register/patient"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Register as Patient
              </Link>
            </div>

            {/* Doctor Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border-2 border-transparent hover:border-green-200">
              <div className="text-green-600 mb-6">
                <Stethoscope className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">I'm a Doctor</h2>
              <p className="text-gray-600 mb-8">
                Join our verified network of healthcare professionals and connect with patients worldwide.
              </p>
              <Link
                to="/register/doctor"
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center"
              >
                <Shield className="w-5 h-5 mr-2" />
                Register as Doctor
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-20 bg-white rounded-2xl shadow-lg mt-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose MedPlatform?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a secure, professional environment for medical consultations with verified healthcare providers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Doctors</h3>
              <p className="text-gray-600">All doctors are thoroughly verified and approved by our medical board.</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Patient Care</h3>
              <p className="text-gray-600">Comprehensive care management with secure patient-doctor communication.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Network</h3>
              <p className="text-gray-600">Connect with a global network of healthcare professionals and specialists.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;