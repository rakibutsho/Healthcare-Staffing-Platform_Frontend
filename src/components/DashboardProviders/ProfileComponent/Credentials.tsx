"use client";

import { useState } from "react";

import { useGetProviderProfileQuery } from "@/redux/features/(Providers)/profileProvider/profileProviderApi";

import {
  useAddACLSCredentialMutation,
  useAddBLSCredentialMutation,
  useAddDIPLOMACredentialMutation,
  useAddLICENCECredentialMutation,
  useAddPALSCredentialMutation,
  useDeleteACLSDocumentMutation,
  useDeleteBLSDocumentMutation,
  useDeleteDIPLOMADocumentMutation,
  useDeleteLICENCEDocumentMutation,
  useDeletePALSDocumentMutation,
} from "@/redux/features/(Providers)/ProviderCredentials/ProviderCredentials";

import { FileText, Upload, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const documentTypes = ["BLS", "ACLS", "PALS", "DIPLOMA", "LICENCE"];

function CertificationDocuments() {
  const { data, refetch } = useGetProviderProfileQuery("");

  // Upload APIs
  const [addBLSCredential] = useAddBLSCredentialMutation();
  const [addACLSCredential] = useAddACLSCredentialMutation();
  const [addPALSCredential] = useAddPALSCredentialMutation();
  const [addDIPLOMACredential] = useAddDIPLOMACredentialMutation();
  const [addLICENCECredential] = useAddLICENCECredentialMutation();

  // Delete APIs
  const [deleteBLSDocument] = useDeleteBLSDocumentMutation();
  const [deleteACLSDocument] = useDeleteACLSDocumentMutation();
  const [deletePALSDocument] = useDeletePALSDocumentMutation();
  const [deleteDIPLOMADocument] = useDeleteDIPLOMADocumentMutation();
  const [deleteLICENCEDocument] = useDeleteLICENCEDocumentMutation();

  const [uploadingType, setUploadingType] = useState<string | null>(null);

  const profile = data?.result?.providerProfile;

  // Upload API map
  const uploadMap: any = {
    BLS: addBLSCredential,
    ACLS: addACLSCredential,
    PALS: addPALSCredential,
    DIPLOMA: addDIPLOMACredential,
    LICENCE: addLICENCECredential,
  };

  // Delete API map
  const deleteMap: any = {
    BLS: deleteBLSDocument,
    ACLS: deleteACLSDocument,
    PALS: deletePALSDocument,
    DIPLOMA: deleteDIPLOMADocument,
    LICENCE: deleteLICENCEDocument,
  };

  const handleUpload = async (e: any, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingType(type);

      const formData = new FormData();
      formData.append(type, file);

      const uploadFunction = uploadMap[type];
      if (!uploadFunction) return;

      await uploadFunction(formData).unwrap();

      toast.success(`${type} uploaded successfully`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Upload failed");
    } finally {
      setUploadingType(null);
    }
  };

  const handleDelete = async (type: string, url: string) => {
    try {
      const deleteFunction = deleteMap[type];
      if (!deleteFunction) return;
      await deleteFunction({ url }).unwrap();

      toast.success(`${type} document deleted`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6">
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {documentTypes.map((type) => {
          const doc = profile?.[type]?.[0];

          return (
            <div
              key={type}
              className="bg-white border rounded-xl shadow-sm p-4 flex flex-col justify-between h-48"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">{type}</span>

                {doc && uploadingType !== type && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        document.getElementById(`input-${type}`)?.click()
                      }
                      className="p-1 hover:bg-teal-50 rounded"
                    >
                      <Pencil className="w-4 h-4 text-teal-600" />
                    </button>

                    <button
                      onClick={() => handleDelete(type, doc?.url)}
                      className="p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-center">
                {uploadingType === type ? (
                  <div className="flex flex-col items-center text-teal-600">
                    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm mt-2">Uploading...</span>
                  </div>
                ) : doc ? (
                  <a
                    href={doc?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-teal-600 hover:underline"
                  >
                    <FileText className="w-10 h-10 mb-2" />
                    <span className="text-sm truncate w-32 text-center">
                      {doc?.fileName}
                    </span>
                  </a>
                ) : (
                  <button
                    onClick={() =>
                      document.getElementById(`input-${type}`)?.click()
                    }
                    className="flex flex-col items-center text-gray-400 hover:text-teal-600"
                  >
                    <Upload className="w-10 h-10 mb-2" />
                    <span className="text-sm">Upload</span>
                  </button>
                )}
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                id={`input-${type}`}
                className="hidden"
                onChange={(e) => handleUpload(e, type)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CertificationDocuments;
