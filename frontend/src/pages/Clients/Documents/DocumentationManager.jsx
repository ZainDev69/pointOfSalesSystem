import React, { useState } from "react";
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
  X,
} from "lucide-react";
import { DocumentForm } from "./DocumentForm";
import { useDispatch, useSelector } from "react-redux";
import {
  addDocument,
  updateDocument,
  deleteDocument,
} from "../../../components/redux/slice/documents";
import toast from "react-hot-toast";

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
      await dispatch(
        updateDocument({ clientId: client._id, documentId, documentData })
      ).unwrap();
      toast.success("Document updated successfully");
    } catch {
      toast.error("Failed to update document");
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await dispatch(
        deleteDocument({ clientId: client._id, documentId })
      ).unwrap();
      toast.success("Document deleted successfully");
    } catch {
      toast.error("Failed to delete document");
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
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
            handleUpdateDocument(document.id, document);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Documentation</h2>
          <p className="text-gray-600 mt-1">
            Client records, reports, and care documentation
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedDocument(null);
            setView("form");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Document</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {documentStats.total}
              </p>
              <p className="text-sm text-gray-600">Total Documents</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Edit3 className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {documentStats.draft}
              </p>
              <p className="text-sm text-gray-600">Draft</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {documentStats.final}
              </p>
              <p className="text-sm text-gray-600">Final</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {documentStats.reviewRequired}
              </p>
              <p className="text-sm text-gray-600">Review Required</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {documentStats.thisWeek}
              </p>
              <p className="text-sm text-gray-600">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="final">Final</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>
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
                key={document.id}
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
                      onClick={() => handleDeleteDocument(document.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Document"
                    >
                      <X className="w-4 h-4" />
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
              className={`w-10 h-10 ${typeInfo.color} rounded-full flex items-center justify-center`}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {document.title}
              </h1>
              <p className="text-gray-600 mt-1">
                {typeInfo.label} • {document.category}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Document</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Created</p>
            <p className="text-gray-900">
              {new Date(document.createdDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">by {document.createdBy}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
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
            <p className="text-gray-900">v{document.version}</p>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Attachments
            </h3>
            <ul className="space-y-2">
              {document.attachments.map((att, idx) => (
                <li key={idx}>
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
