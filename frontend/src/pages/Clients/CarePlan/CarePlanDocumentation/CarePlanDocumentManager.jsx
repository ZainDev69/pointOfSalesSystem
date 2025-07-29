import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Download, Edit3, Trash, Eye, X } from "lucide-react";
import {
  fetchAllClientDocuments,
  uploadCarePlanAttachment,
  addClientDocument,
  updateClientDocument,
  deleteClientDocument,
} from "../../../../components/redux/slice/carePlanDocuments";
import { CarePlanDocumentForm } from "./CarePlanDocumentForm";
import toast from "react-hot-toast";
import { Button } from "../../../../components/ui/Button";

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
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (clientId) {
      dispatch(fetchAllClientDocuments(clientId));
    }
  }, [clientId, dispatch]);

  const handleAdd = async (doc) => {
    await dispatch(addClientDocument({ clientId, documentData: doc }))
      .unwrap()
      .then(() => toast.success("Document added successfully"))
      .catch(() => {});

    setView("list");
  };
  const handleEdit = async (doc) => {
    setUpdating(true);
    try {
      await dispatch(
        updateClientDocument({
          clientId,
          docId: doc._id,
          documentData: doc,
        })
      ).unwrap();

      toast.success("Document updated successfully");
      setView("list");
      setSelectedDoc(null);
    } catch {
      toast.error("Failed to update document");
      setView("list");
      setSelectedDoc(null);
    } finally {
      setUpdating(false);
    }
  };
  const handleDelete = async (doc) => {
    await dispatch(deleteClientDocument({ clientId, docId: doc._id }))
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
  const handleOpenInNewTab = (att) => {
    let url = typeof att === "string" ? att : att?.url;
    console.log("Opening in new tab", att.url);
    const originalName = typeof att === "object" ? att.originalName : undefined;
    console.log(url);
    if (!url) return;
    if (url.startsWith("/")) url = BACKEND_URL + url;
    console.log(BACKEND_URL);
    const ext = (originalName || url).split(".").pop().toLowerCase();
    if (ext === "pdf") {
      // Use anchor navigation for PDFs to avoid popup blockers
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (["docx", "xlsx", "pptx", "doc", "xls", "ppt"].includes(ext)) {
      const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
        url
      )}&embedded=true`;
      window.open(viewerUrl, "_blank");
    } else {
      window.open(url, "_blank");
    }
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
        <Button
          onClick={() => {
            setSelectedDoc(null);
            setView("form");
          }}
          variant="default"
          icon={Plus}
          style={{ minWidth: 180 }}
        >
          Add Document
        </Button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {updating && (
        <div className="text-center text-blue-600 py-2">
          Updating document...
        </div>
      )}
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
                      {doc.attachments.map((att, idx) => {
                        const originalName = att.originalName || "";
                        const ext = originalName.split(".").pop().toLowerCase();
                        return (
                          <React.Fragment key={att._id || idx}>
                            {ext === "pdf" ? (
                              <button
                                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                title={`Open ${originalName}`}
                                onClick={() => handleOpenInNewTab(att)}
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            ) : null}
                            <button
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title={`Download ${originalName}`}
                              onClick={() => handleDownload(att)}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </React.Fragment>
                        );
                      })}
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
                    onClick={() => handleDelete(doc)}
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
                        onClick={() => handleOpenInNewTab(att)}
                      >
                        {att.originalName || `Open Attachment ${idx + 1}`}
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
