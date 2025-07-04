import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  FileText,
  Upload,
  Eye,
  EyeOff,
  Globe,
  Languages,
} from "lucide-react";

// کامپوننت‌های سفارشی
import MultiSelectDropdown from "../components/MultiSelectDropdown";
import LocationAutocomplete from "../components/LocationAutocomplete";

// لیست زبان‌های مهم برای انتخاب
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

const RegisterDoctor: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    specialties: "", // تبدیل به ورودی متنی ساده
    languages: [] as string[], // فیلد جدید برای زبان‌ها
    website: "",
    socialMedia: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (documents.length === 0) {
      setError("Please upload at least one document");
      return;
    }
    if (!formData.specialties) {
      setError("Please list your medical specialties");
      return;
    }
    if (formData.languages.length === 0) {
      setError("Please select at least one language");
      return;
    }
    if (!formData.location) {
      setError("Please select your location");
      return;
    }

    setLoading(true);
    try {
      // آماده‌سازی داده‌ها برای ارسال
      const dataToSend = {
        ...formData,
        role: "doctor",
        documents,
        profileImage,
        // تبدیل آرایه زبان‌ها به رشته جیسون برای ارسال به بک‌اند
        languages: JSON.stringify(formData.languages),
      };

      // حذف فیلدهای اضافی که نباید به سرور ارسال شوند
      delete (dataToSend as any).confirmPassword;

      await register(dataToSend);
      navigate("/verify-email");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // کنترلر برای انتخاب زبان‌ها
  const handleLanguagesChange = (selected: string[]) => {
    setFormData((prev) => ({
      ...prev,
      languages: selected,
    }));
  };

  const handleLocationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: value,
    }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              Doctor Registration
            </h2>
            <p className="mt-2 text-gray-600">
              Join our verified network of healthcare professionals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute h-5 w-5 text-gray-400 left-3 top-3.5" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="First name"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute h-5 w-5 text-gray-400 left-3 top-3.5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute h-5 w-5 text-gray-400 left-3 top-3.5" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute h-5 w-5 text-gray-400 left-3 top-3.5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute h-5 w-5 text-gray-400 left-3 top-3.5" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  City & Country <span className="text-red-500">*</span>
                </label>
                <LocationAutocomplete
                  value={formData.location}
                  onChange={handleLocationChange}
                  placeholder="Search for a city..."
                />
              </div>
            </div>

            {/* --- بخش تخصص‌ها --- */}
            <div>
              <label
                htmlFor="specialties"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Medical Specialties <span className="text-red-500">*</span>
              </label>
              <textarea
                id="specialties"
                name="specialties"
                required
                value={formData.specialties}
                onChange={handleChange}
                rows={3}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="List your medical specialties (e.g., Cardiology, Dermatology...)"
              />
            </div>

            {/* --- بخش جدید زبان‌ها --- */}
            <div>
              <label
                htmlFor="languages"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center">
                  <Languages className="w-4 h-4 mr-2" />
                  Languages Spoken <span className="text-red-500 ml-1">*</span>
                </div>
              </label>
              <MultiSelectDropdown
                options={languageOptions}
                selectedOptions={formData.languages}
                onChange={handleLanguagesChange}
                placeholder="Select languages you speak"
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image{" "}
                  <span className="text-gray-400">(Optional)</span>
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        profile image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG or JPEG (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleProfileImageUpload}
                    />
                  </label>
                </div>
                {profileImage && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ {profileImage.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Documents <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-8 h-8 mb-4 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        documents
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX (MAX. 10MB each)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={handleDocumentUpload}
                    />
                  </label>
                </div>
                {documents.length > 0 && (
                  <div className="mt-2">
                    {documents.map((doc, index) => (
                      <p key={index} className="text-sm text-green-600">
                        ✓ {doc.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Creating Account..." : "Create Doctor Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterDoctor;
