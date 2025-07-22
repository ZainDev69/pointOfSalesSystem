import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Download, Edit3, Trash, Eye, X } from "lucide-react";
import {
  fetchAllCarePlanDocumentsForClient,
  addCarePlanDocument,
  updateCarePlanDocument,
  deleteCarePlanDocument,
  uploadCarePlanAttachment,
} from "../../../components/redux/slice/carePlanDocuments";
import { CarePlanDocumentForm } from "./CarePlanDocumentForm";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function CarePlanDocumentManager({ carePlanId, clientId }) {
  const dispatch = useDispatch();
  const {
    items: documents,
    loading,
    error,
  } = useSelector((state) => state.carePlanDocuments);
  const [view, setView] = useState("list");
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [detailsDoc, setDetailsDoc] = useState(null);

  useEffect(() => {
    if (clientId) {
      dispatch(fetchAllCarePlanDocumentsForClient(clientId));
    }
  }, [clientId, dispatch]);

  const handleAdd = async (doc) => {
    await dispatch(addCarePlanDocument({ carePlanId, documentData: doc }))
      .unwrap()
      .then(() => toast.success("Document added successfully"))
      .catch(() => {});
    setView("list");
  };
  const handleEdit = async (doc) => {
    await dispatch(
      updateCarePlanDocument({
        carePlanId,
        docId: doc._id,
        documentData: doc,
      })
    )
      .unwrap()
      .then(() => toast.success("Document updated successfully"))
      .catch(() => {});
    setView("list");
    setSelectedDoc(null);
  };
  const handleDelete = async (docId) => {
    await dispatch(deleteCarePlanDocument({ carePlanId, docId }))
      .unwrap()
      .then(() => toast.success("Document deleted successfully"))
      .catch(() => {});
  };
  const handleUpload = async (file) => {
    const res = await dispatch(
      uploadCarePlanAttachment({ carePlanId, file })
    ).unwrap();
    return res;
  };
  const handleDownload = (att) => {
    let url = typeof att === "string" ? att : att?.url;
    const originalName = typeof att === "object" ? att.originalName : undefined;
    if (!url) return;
    if (url.startsWith("/")) url = BACKEND_URL + url;
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", originalName || "download");
    a.setAttribute("target", "_blank");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (view === "form") {
    return (
      <CarePlanDocumentForm
        document={selectedDoc}
        onBack={() => {
          setView("list");
          setSelectedDoc(null);
        }}
        onSave={selectedDoc ? handleEdit : handleAdd}
        onUpload={handleUpload}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Care Plan Documents</h2>
        <button
          onClick={() => {
            setSelectedDoc(null);
            setView("form");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Document</span>
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium text-gray-900">
                    {doc.title}
                  </h4>
                  {doc.attachments && doc.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {doc.attachments.map((att, idx) => (
                        <button
                          key={idx}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title={`Download ${
                            att.originalName || `Attachment ${idx + 1}`
                          }`}
                          onClick={() => handleDownload(att)}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setDetailsDoc(doc)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDoc(doc);
                      setView("form");
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Document"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Document"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No documents found.
            </div>
          )}
        </div>
      </div>
      {/* Document Details Modal */}
      {detailsDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6 relative">
            <button
              onClick={() => setDetailsDoc(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {detailsDoc.title}
            </h2>
            {detailsDoc.attachments && detailsDoc.attachments.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Attachments
                </h3>
                <ul className="space-y-2">
                  {detailsDoc.attachments.map((att, idx) => (
                    <li key={idx}>
                      <button
                        className="text-blue-600 underline"
                        onClick={() => handleDownload(att)}
                      >
                        {att.originalName || `Download Attachment ${idx + 1}`}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
