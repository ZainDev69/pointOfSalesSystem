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
} from "lucide-react";
import { DocumentForm } from "./DocumentForm";

export function DocumentationManager({
  clientId,
  documents,
  onAddDocument,
  onUpdateDocument,
}) {
  const [view, setView] = useState("list");
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

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

  // Mock documents data
  const mockDocuments = [
    {
      id: "1",
      type: "visit-log",
      title: "Morning Visit - Personal Care",
      content:
        "Client assisted with washing and dressing. Medication administered as prescribed. Client in good spirits and engaged in conversation about family visit planned for weekend. No concerns noted. Skin integrity checked - no issues observed. Client expressed satisfaction with care provided.",
      createdDate: new Date().toISOString(),
      createdBy: "Emma Wilson",
      lastModified: new Date().toISOString(),
      modifiedBy: "Emma Wilson",
      status: "final",
      category: "Daily Care",
      tags: ["personal-care", "medication", "routine", "skin-check"],
      attachments: [],
      reviewRequired: false,
      version: 1,
    },
    {
      id: "2",
      type: "incident-report",
      title: "Minor Fall in Bathroom",
      content:
        "At approximately 14:30, client experienced a minor slip in the bathroom while attempting to reach for towel. Client was assisted immediately and no injuries were sustained. Incident was caused by wet floor from earlier shower. Client was checked thoroughly and reported no pain or discomfort. Family contacted and informed. GP consultation not required as no injuries sustained. Additional non-slip mats have been placed in bathroom as preventive measure.",
      createdDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "James Mitchell",
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      modifiedBy: "James Mitchell",
      status: "final",
      category: "Safety",
      tags: ["incident", "fall", "bathroom", "safety", "prevention"],
      attachments: [],
      reviewRequired: true,
      reviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      version: 1,
    },
    {
      id: "3",
      type: "health-monitoring",
      title: "Weekly Health Check",
      content:
        "Weekly health monitoring completed. Blood pressure: 135/80 mmHg (within acceptable range for client). Weight: 65.2kg (stable from last week). Temperature: 36.8°C (normal). Client reports feeling well with no new symptoms. Appetite good, sleeping well. Medication compliance excellent. Next health check scheduled for next week.",
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "Sarah Thompson",
      lastModified: new Date(
        Date.now() - 2 * 24 * 60 * 60 * 1000
      ).toISOString(),
      modifiedBy: "Sarah Thompson",
      status: "final",
      category: "Health",
      tags: ["health-check", "blood-pressure", "weight", "monitoring"],
      attachments: [],
      reviewRequired: false,
      version: 1,
    },
    {
      id: "4",
      type: "medication-record",
      title: "Medication Administration Record - Week 1",
      content:
        "Weekly medication administration record. All medications administered as prescribed with no missed doses. Client tolerated all medications well with no adverse reactions reported. Metformin 500mg twice daily - administered at 08:00 and 18:00. Ramipril 5mg once daily - administered at 08:00. Blood pressure monitoring shows good control. Next medication review due in 4 weeks.",
      createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "Emma Wilson",
      lastModified: new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000
      ).toISOString(),
      modifiedBy: "Emma Wilson",
      status: "final",
      category: "Medical",
      tags: ["medication", "MAR", "compliance", "diabetes"],
      attachments: [],
      reviewRequired: false,
      version: 1,
    },
    {
      id: "5",
      type: "communication-log",
      title: "Family Communication - Son Visit",
      content:
        "Spoke with client's son John regarding upcoming visit this weekend. Discussed client's recent progress and general wellbeing. Son expressed satisfaction with care provided and noted improvement in client's mood since care started. Arranged for extended visit on Saturday afternoon. Client very excited about family visit. No concerns raised by family member.",
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: "James Mitchell",
      lastModified: new Date(
        Date.now() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      modifiedBy: "James Mitchell",
      status: "final",
      category: "Communication",
      tags: ["family", "communication", "visit", "wellbeing"],
      attachments: [],
      reviewRequired: false,
      version: 1,
    },
  ];

  const allDocuments = [...documents, ...mockDocuments];

  const filteredDocuments = allDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = filterType === "all" || doc.type === filterType;
    const matchesStatus = filterStatus === "all" || doc.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
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

  const documentStats = {
    total: allDocuments.length,
    draft: allDocuments.filter((d) => d.status === "draft").length,
    final: allDocuments.filter((d) => d.status === "final").length,
    reviewRequired: allDocuments.filter((d) => d.reviewRequired).length,
    thisWeek: allDocuments.filter((d) => {
      const docDate = new Date(d.createdDate);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return docDate > weekAgo;
    }).length,
  };

  if (view === "form") {
    return (
      <DocumentForm
        document={selectedDocument}
        onBack={() => setView("list")}
        onSave={(document) => {
          if ("id" in document) {
            onUpdateDocument(document.id, document);
          } else {
            onAddDocument(document);
          }
          setView("list");
        }}
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
              <button className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100">
                <Download className="w-4 h-4" />
              </button>
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

                      {document.tags.length > 0 && (
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

                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
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

        {document.tags.length > 0 && (
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
      </div>
    </div>
  );
}
