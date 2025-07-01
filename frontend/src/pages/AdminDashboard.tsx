import React, { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import {
  Eye,
  CheckCircle,
  XCircle,
  KeyRound,
  Search,
  Filter,
  FileText,
  Globe,
  Phone,
  Trash2, // آیکون سطل زباله برای حذف
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

interface PlatformUser {
  id: string;
  firstName?: string;
  lastName?: string;
  alias?: string;
  email: string;
  role: "doctor" | "patient" | "admin";
  status?: "pending" | "approved" | "rejected";
  specialties?: string;
  createdAt: string;
  phone?: string;
  nationality?: string;
  website?: string;
  documents?: string[];
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    const params = new URLSearchParams();
    params.append("tab", activeTab);
    if (activeTab === "all") {
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);
    }
    try {
      const response = await fetch(
        `${API_URL}/api/admin/users?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, activeTab, roleFilter, statusFilter, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    if (!user?.token) return;
    try {
      await fetch(`${API_URL}/api/admin/doctors/${userId}/${action}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error(`Failed to ${action} user`, err);
    }
  };

  const handlePasswordReset = async (userId: string) => {
    if (
      !user?.token ||
      !window.confirm(
        "Are you sure you want to send a password reset link to this user?"
      )
    )
      return;
    try {
      const res = await fetch(
        `${API_URL}/api/admin/users/${userId}/reset-password`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(data.message);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  // --- تابع جدید برای حذف کاربر ---
  const handleDelete = async (userId: string) => {
    if (
      !user?.token ||
      !window.confirm(
        "آیا از حذف این کاربر اطمینان دارید؟ این عمل قابل بازگشت نیست."
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "خطا در حذف کاربر.");
      }

      alert("کاربر با موفقیت حذف شد.");
      fetchUsers(); // Refresh the user list
    } catch (err: any) {
      alert(`خطا: ${err.message}`);
    }
  };

  const getStatusBadge = (status?: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            N/A
          </span>
        );
    }
  };

  return (
    <Layout title="User Management">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending Doctors (
              {
                users.filter(
                  (u) => u.role === "doctor" && u.status === "pending"
                ).length
              }
              )
            </button>
          </nav>
        </div>

        {activeTab === "all" && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center space-x-4">
            <select
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2 border rounded-md bg-white shadow-sm"
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctors</option>
              <option value="patient">Patients</option>
            </select>
            <select
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded-md bg-white shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-md flex-grow shadow-sm"
            />
          </div>
        )}

        <div className="mt-8 bg-white shadow-xl rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {u.firstName ? `${u.firstName} ${u.lastName}` : u.alias}
                      </div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          u.role === "doctor"
                            ? "bg-blue-100 text-blue-800"
                            : u.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(u.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {u.specialties || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-3">
                      <button
                        onClick={() => {
                          if (u.role === "doctor") {
                            setSelectedUser(u);
                            setShowModal(true);
                          }
                        }}
                        className="text-gray-400 hover:text-blue-600 disabled:opacity-50"
                        disabled={u.role !== "doctor"}
                      >
                        <Eye />
                      </button>
                      {u.role === "doctor" && u.status !== "approved" && (
                        <button
                          onClick={() => handleAction(u.id, "approve")}
                          className="text-gray-400 hover:text-green-600"
                        >
                          <CheckCircle />
                        </button>
                      )}
                      {u.role === "doctor" && u.status !== "rejected" && (
                        <button
                          onClick={() => handleAction(u.id, "reject")}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <XCircle />
                        </button>
                      )}
                      <button
                        onClick={() => handlePasswordReset(u.id)}
                        className="text-gray-400 hover:text-yellow-600"
                      >
                        <KeyRound />
                      </button>

                      {/* --- دکمه حذف کاربر --- */}
                      {u.role !== "admin" && (
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete User"
                        >
                          <Trash2 />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative p-8 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Doctor Details
                </h3>
                <button onClick={() => setShowModal(false)}>
                  <XCircle className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-semibold text-gray-500">Full Name</p>
                  <p className="text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Email</p>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Phone</p>
                  <p className="text-gray-900">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-500">Nationality</p>
                  <p className="text-gray-900">{selectedUser.nationality}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-semibold text-gray-500">Specialties</p>
                  <p className="text-gray-900">{selectedUser.specialties}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="font-semibold text-gray-500">Website</p>
                  <a
                    href={selectedUser.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    {selectedUser.website}
                  </a>
                </div>
                <div className="md:col-span-2">
                  <p className="font-semibold text-gray-500 mb-2">Documents</p>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedUser.documents?.map((doc, i) => (
                      <li key={i} className="text-gray-700">
                        {doc.split("-").slice(2).join("-")}
                      </li>
                    )) || <li>No documents uploaded.</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
