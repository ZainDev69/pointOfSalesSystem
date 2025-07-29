import React, { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Eye,
  Edit3,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Trash,
} from "lucide-react";
import { DocumentForm } from "./DocumentForm";
import { useDispatch, useSelector } from "react-redux";
import {
  addDocument,
  updateDocument,
  deleteDocument,
  fetchDocuments,
} from "../../../components/redux/slice/documents";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/Button";

// Add your backend base URL here
const BACKEND_URL = "http://localhost:5500";

export function DocumentationManager({ client }) {
  const [view, setView] = useState("list");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showArchived, setShowArchived] = useState(false);

  const documents = useSelector((state) => state.documents.items) || [];
  const documentsLoading = useSelector((state) => state.documents.loading);
  const dispatch = useDispatch();

  const documentTypes = [
    {
      id: "visit-log",
      label: "Visit Log",
      icon: Calendar,
      color: "bg-blue-500",
    },
    {
      id: "incident-report",
      label: "Incident Report",
      icon: AlertTriangle,
      color: "bg-red-500",
    },
    {
      id: "health-monitoring",
      label: "Health Monitoring",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      id: "medication-record",
      label: "Medication Record",
      icon: FileText,
      color: "bg-purple-500",
    },
    {
      id: "care-review",
      label: "Care Review",
      icon: FileText,
      color: "bg-indigo-500",
    },
    {
      id: "risk-assessment-update",
      label: "Risk Assessment Update",
      icon: AlertTriangle,
      color: "bg-orange-500",
    },
    {
      id: "quality-check",
      label: "Quality Check",
      icon: CheckCircle,
      color: "bg-cyan-500",
    },
    {
      id: "safeguarding-concern",
      label: "Safeguarding Concern",
      icon: AlertTriangle,
      color: "bg-red-600",
    },
    {
      id: "communication-log",
      label: "Communication Log",
      icon: FileText,
      color: "bg-blue-600",
    },
    {
      id: "assessment",
      label: "Assessment",
      icon: FileText,
      color: "bg-gray-500",
    },
    {
      id: "consent-form",
      label: "Consent Form",
      icon: CheckCircle,
      color: "bg-green-600",
    },
    {
      id: "complaint",
      label: "Complaint",
      icon: AlertTriangle,
      color: "bg-red-400",
    },
    {
      id: "compliment",
      label: "Compliment",
      icon: CheckCircle,
      color: "bg-yellow-500",
    },
  ];

  useEffect(() => {
    if (client?._id) {
      dispatch(fetchDocuments(client._id));
    }
  }, [client?._id, dispatch]);

  const handleAddDocument = async (documentData) => {
    try {
      await dispatch(
        addDocument({ clientId: client._id, documentData })
      ).unwrap();
      toast.success("Document added successfully");
    } catch {
      toast.error("Failed to add document");
    }
  };

  const handleUpdateDocument = async (documentId, documentData) => {
    try {
      console.log("Document Data", documentId, documentData);
      await dispatch(updateDocument({ documentId, documentData })).unwrap();
      toast.success("Document updated successfully");
    } catch {
      toast.error("Failed to update document");
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await dispatch(deleteDocument(documentId)).unwrap();
      toast.success("Document deleted successfully");
    } catch {
      toast.error("Failed to delete document");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tags || []).some((tag) =>
        tag?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = filterType === "all" || doc.type === filterType;
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;
    const matchesArchive = showArchived
      ? doc.status === "archived"
      : doc.status !== "archived";

    return matchesSearch && matchesType && matchesStatus && matchesArchive;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "final":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeInfo = (type) => {
    return documentTypes.find((t) => t.id === type) || documentTypes[0];
  };

  // Calculate stats based on filtered (archived or unarchived) documents
  const statsSource = documents.filter((doc) =>
    showArchived ? doc.status === "archived" : doc.status !== "archived"
  );
  const documentStats = {
    total: statsSource.length,
    draft: statsSource.filter((d) => d.status === "draft").length,
    final: statsSource.filter((d) => d.status === "final").length,
    reviewRequired: statsSource.filter((d) => d.reviewRequired).length,
    thisWeek: statsSource.filter((d) => {
      const docDate = new Date(d.createdDate);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return docDate > weekAgo;
    }).length,
  };

  // Utility functions to handle both string and object attachment formats
  const getAttachmentUrl = (att) => (typeof att === "string" ? att : att?.url);
  const getAttachmentName = (att) =>
    typeof att === "object" ? att.originalName : undefined;

  const handleDownload = (att) => {
    let url = getAttachmentUrl(att);
    const originalName = getAttachmentName(att);
    if (!url) {
      alert("No file to download.");
      return;
    }
    // If url is relative, prepend backend URL
    if (url.startsWith("/")) {
      url = BACKEND_URL + url;
    }
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
      <DocumentForm
        document={selectedDocument}
        onBack={() => setView("list")}
        onSave={(document) => {
          if (selectedDocument) {
            handleUpdateDocument(document._id, document);
          } else {
            handleAddDocument(document);
          }
          setView("list");
        }}
        clientId={client._id}
      />
    );
  }

  if (view === "details" && selectedDocument) {
    return (
      <DocumentDetails
        document={selectedDocument}
        onBack={() => setView("list")}
        onEdit={() => setView("form")}
      />
    );
  }

  if (documentsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-blue-600 text-lg font-semibold">
          Loading documents...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Move the add button above the search/filters and add spacing between heading/subheading and controls */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documentation</h2>
          <p className="text-gray-600 mt-1">
            Client records, reports, and care documentation
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedDocument(null);
            setView("form");
          }}
          variant="default"
          icon={Plus}
          style={{ minWidth: 160 }}
        >
          New Document
        </Button>
      </div>
      <div className="mb-6" />
      {/* The search/filter controls remain below, with their own margin-top for separation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex-1 flex items-center bg-white rounded-full shadow-sm border border-gray-200 px-4 py-2">
          <Search className="w-5 h-5 text-blue-500 mr-2" />
          <input
            type="text"
            placeholder="Search documents by title, content, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="final">Final</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-blue-900">
                {documentStats.total}
              </p>
              <p className="text-xs text-blue-700 font-medium">Total</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-yellow-900">
                {documentStats.draft}
              </p>
              <p className="text-xs text-yellow-700 font-medium">Draft</p>
            </div>
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-900">
                {documentStats.final}
              </p>
              <p className="text-xs text-green-700 font-medium">Final</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-orange-900">
                {documentStats.reviewRequired}
              </p>
              <p className="text-xs text-orange-700 font-medium">
                Review Required
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-purple-900">
                {documentStats.thisWeek}
              </p>
              <p className="text-xs text-purple-700 font-medium">This Week</p>
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="show-archived"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="show-archived" className="text-sm text-gray-700">
            Show archived documents
          </label>
        </div>
      </div>

      {/* Document List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Documents ({filteredDocuments.length})
            </h3>
            <div className="flex items-center space-x-2">
              <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100">
                <Upload className="w-4 h-4" />
              </button>
              {document.attachments && document.attachments.length > 0 ? (
                document.attachments.map((att, idx) => (
                  <a
                    key={idx}
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title={`Download ${
                      att.originalName || `Attachment ${idx + 1}`
                    }`}
                    download={att.originalName}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                ))
              ) : (
                <button
                  className="p-2 text-gray-300 cursor-not-allowed rounded-lg"
                  title="No attachment to download"
                  disabled
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredDocuments.map((document) => {
            const typeInfo = getTypeInfo(document.type);
            const TypeIcon = typeInfo.icon;

            return (
              <div
                key={document._id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 ${typeInfo.color} rounded-full flex items-center justify-center`}
                    >
                      <TypeIcon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">
                          {document.title}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            document.status
                          )}`}
                        >
                          {document.status}
                        </span>
                        {document.reviewRequired && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Review Required
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {document.content.length > 150
                          ? document.content.substring(0, 150) + "..."
                          : document.content}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <span className="font-medium">Type:</span>
                          <span className="ml-1">{typeInfo.label}</span>
                        </div>

                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>
                            {new Date(
                              document.createdDate
                            ).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{document.createdBy}</span>
                        </div>

                        <div className="flex items-center">
                          <span className="font-medium">Category:</span>
                          <span className="ml-1">{document.category}</span>
                        </div>
                      </div>

                      {document.tags && document.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {document.tags.slice(0, 4).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                          {document.tags.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                              +{document.tags.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedDocument(document);
                        setView("details");
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDocument(document);
                        setView("form");
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit Document"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {document.attachments && document.attachments.length > 0 ? (
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title={`Download ${
                          getAttachmentName(document.attachments[0]) ||
                          "Attachment"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(document.attachments[0]);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        className="p-2 text-gray-300 cursor-not-allowed rounded-lg"
                        title="No attachment to download"
                        disabled
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteDocument(document._id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Document"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredDocuments.length === 0 && (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No documents found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "No documents have been created yet."}
              </p>
              <button
                onClick={() => {
                  setSelectedDocument(null);
                  setView("form");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Document</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Placeholder component for document details view
function DocumentDetails({ document, onBack, onEdit }) {
  const typeInfo = {
    "visit-log": { label: "Visit Log", color: "bg-blue-500" },
    "incident-report": { label: "Incident Report", color: "bg-red-500" },
    "health-monitoring": { label: "Health Monitoring", color: "bg-green-500" },
    "medication-record": { label: "Medication Record", color: "bg-purple-500" },
    "communication-log": { label: "Communication Log", color: "bg-blue-600" },
  }[document.type] || { label: "Document", color: "bg-gray-500" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 ${typeInfo.color} rounded-full flex items-center justify-center shadow-md`}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {document.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${typeInfo.color} text-white`}
                >
                  {typeInfo.label}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    document.status === "final"
                      ? "bg-green-100 text-green-800"
                      : document.status === "draft"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {document.status}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                  v{document.version}
                </span>
              </div>
              <p className="text-gray-500 mt-1 text-sm">{document.category}</p>
            </div>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-full shadow-lg flex items-center space-x-2 text-base font-semibold transition-all duration-200"
        >
          <Edit3 className="w-5 h-5" />
          <span>Edit Document</span>
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Created</p>
            <p className="text-gray-900 font-semibold">
              {new Date(document.createdDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">by {document.createdBy}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                document.status === "final"
                  ? "bg-green-100 text-green-800"
                  : document.status === "draft"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {document.status}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Version</p>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
              v{document.version}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {document.content}
            </p>
          </div>
        </div>
        {document.tags && document.tags.length > 0 && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
        {document.attachments && document.attachments.length > 0 && (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" /> Attachments
            </h3>
            <ul className="space-y-2">
              {document.attachments.map((att, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                    download={att.originalName}
                  >
                    {att.originalName || `Download Attachment ${idx + 1}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
