import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();

  const renderNotificationBanner = () => {
    if (!user) return null;

    if (!user.isEmailVerified) {
      return (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p className="font-bold">Email Verification Required</p>
          <p>
            Please check your email and enter the verification code to access
            all features.{" "}
            <Link to="/verify-email" className="font-semibold underline">
              Go to verification page
            </Link>
            .
          </p>
        </div>
      );
    }

    if (user.role === "doctor" && !user.isAccountApproved) {
      return (
        <div
          className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4"
          role="alert"
        >
          <p className="font-bold">Account Pending Approval</p>
          <p>
            Your account is awaiting review by our team. You'll be notified once
            it's activated.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                Medicalvance Platform
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {user.email} (<span className="font-medium">{user.role}</span>
                  )
                </span>
                <button
                  onClick={logout}
                  className="flex items-center text-sm text-gray-500 hover:text-indigo-600"
                >
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main>
        {renderNotificationBanner() && (
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            {renderNotificationBanner()}
          </div>
        )}
        <div className={user ? "py-6" : ""}>{children}</div>
      </main>
    </div>
  );
};

export default Layout;
