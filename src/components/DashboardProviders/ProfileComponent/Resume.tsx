"use client";

import {
  useGetProviderProfileQuery,
  useUpdateProviderDocumentMutation,
  useDeleteDocumentMutation,
} from "@/redux/features/(Providers)/profileProvider/profileProviderApi";
import { FileText, Plus, Trash2, AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function ResumePage() {
  const { data, refetch } = useGetProviderProfileQuery("");
  const [updateDocument, { isLoading }] = useUpdateProviderDocumentMutation();
  const [deleteDoc, { isLoading: isDeleting }] = useDeleteDocumentMutation();

  const rawDocs = data?.result?.providerProfile?.document || [];

  // Filter out invalid/empty documents
  const documents = rawDocs.filter(
    (doc: any) =>
      doc?.url &&
      doc?.url.trim() !== "" &&
      doc?.fileName &&
      doc?.fileName.trim() !== "",
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    fileName: string;
    url: string;
  } | null>(null);

  // Add Document
  const handleAddDocument = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("document", selectedFile);

      await updateDocument(formData).unwrap();

      toast.success("Document added successfully");
      setSelectedFile(null);
      setShowModal(false);
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to add document");
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (fileName: string, url: string) => {
    setDocumentToDelete({ fileName, url });
    setShowDeleteModal(true);
  };

  // Confirm delete document
  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      await deleteDoc({ url: documentToDelete.url }).unwrap();
      toast.success("Document deleted successfully");
      refetch();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete document");
    } finally {
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDocumentToDelete(null);
  };

  return (
    <div className="p-5">
      {/* Add Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setShowModal(true)}
          className="w-fit bg-teal-50 hover:bg-teal-500 border border-teal-500 text-teal-600 hover:text-white cursor-pointer py-3 px-4 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus /> Add Resume
        </button>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Upload Document
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div
                className="w-full h-48 p-3 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center items-center cursor-pointer hover:bg-teal-50 transition-colors"
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <FileText className="w-12 h-12 text-teal-500" />
                <span className="mt-2 text-sm text-gray-500 text-center">
                  {selectedFile ? selectedFile?.name : "Click to select file"}
                </span>
              </div>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={(e) => setSelectedFile(e?.target?.files?.[0] || null)}
              />
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDocument}
                disabled={!selectedFile || isLoading}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isLoading || !selectedFile
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-teal-500 text-white hover:bg-teal-600 cursor-pointer"
                }`}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Delete Document
                  </h3>
                  <p className="text-gray-600">
                    Are you sure you want to delete &quot;
                    {documentToDelete?.fileName}&quot;? This action cannot be
                    undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document List */}
      <div className="flex flex-wrap gap-5 mt-5">
        {documents?.length > 0 ? (
          documents.map((doc: any, index: number) => (
            <div
              key={index}
              className="w-60 h-48 p-3 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between p-2">
                <span
                  className="font-medium truncate w-40"
                  title={doc?.fileName}
                >
                  {doc?.fileName}
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={doc?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium hover:underline cursor-pointer"
                  >
                    View
                  </a>
                  <button
                    onClick={() =>
                      showDeleteConfirmation(doc?.fileName, doc?.url)
                    }
                    className="p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                  </button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <FileText className="w-12 h-12 text-teal-500" />
              </div>
            </div>
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No documents uploaded yet.</p>
            <p className="text-gray-400 text-sm">
              Click &quot;Add Resume&quot; to upload your first document.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumePage;
