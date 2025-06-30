import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FileText, XCircle, UploadCloud, ExternalLink } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

interface ManageDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageDocumentsModal: React.FC<ManageDocumentsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateUserState } = useAuth();
  const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!filesToUpload || filesToUpload.length === 0) {
      alert("Please select files to upload.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < filesToUpload.length; i++) {
        formData.append("documents", filesToUpload[i]);
      }

      const response = await fetch(`${API_URL}/api/profile/documents`, {
        method: "POST",
        headers: { Authorization: `Bearer ${user?.token}` },
        body: formData,
      });

      const updatedUser = await response.json();
      if (!response.ok) throw new Error(updatedUser.message);

      updateUserState(updatedUser); // Update context with new documents
      alert("Documents uploaded successfully!");
      onClose();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Manage Documents</h3>
          <button onClick={onClose}>
            <XCircle />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Uploaded Documents</h4>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {user?.documents?.map((doc, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>{doc.split("-").slice(2).join("-")}</span>
                </div>
                <a
                  href={`${API_URL}/${doc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 text-blue-600" />
                </a>
              </li>
            )) || <li className="text-sm text-gray-500">No documents.</li>}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Upload New Documents</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
            <UploadCloud className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              multiple
              onChange={(e) => setFilesToUpload(e.target.files)}
              className="text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};
