import React, { useState } from "react";
import { ArrowLeft, Save, X, FileText, Upload, Tag, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { uploadAttachment } from "../../../components/redux/slice/documents";
import { Button } from "../../../components/ui/Button";

export function DocumentForm({ document, onBack, onSave, clientId }) {
  const isEditing = !!document;

  const [formData, setFormData] = useState({
    type: document?.type || "visit-log",
    title: document?.title || "",
    content: document?.content || "",
    category: document?.category || "",
    tags: document?.tags || [],
    status: document?.status || "draft",
    reviewRequired: document?.reviewRequired || false,
    reviewDate: document?.reviewDate || "",
    version: document?.version || 1,
    attachments: document?.attachments || [],
  });

  const [newTag, setNewTag] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  const documentTypes = [
    { id: "visit-log", label: "Visit Log" },
    { id: "incident-report", label: "Incident Report" },
    { id: "health-monitoring", label: "Health Monitoring" },
    { id: "medication-record", label: "Medication Record" },
    { id: "care-review", label: "Care Review" },
    { id: "risk-assessment-update", label: "Risk Assessment Update" },
    { id: "quality-check", label: "Quality Check" },
    { id: "safeguarding-concern", label: "Safeguarding Concern" },
    { id: "communication-log", label: "Communication Log" },
    { id: "assessment", label: "Assessment" },
    { id: "consent-form", label: "Consent Form" },
    { id: "complaint", label: "Complaint" },
    { id: "compliment", label: "Compliment" },
  ];

  const categories = [
    "Daily Care",
    "Medical",
    "Safety",
    "Quality",
    "Communication",
    "Legal",
    "Training",
    "Compliance",
    "Emergency",
    "General",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category) {
      alert("Category is required");
      return;
    }
    const documentData = {
      ...formData,
      _id: document?._id, // Ensure ObjectId is preserved for editing
      createdDate: document?.createdDate || new Date().toISOString(),
      createdBy: document?.createdBy || "Current User",
      lastModified: new Date().toISOString(),
      modifiedBy: "Current User",
      attachments: (formData.attachments || []).map((att) => att.url),
    };
    onSave(documentData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await dispatch(uploadAttachment({ clientId, file })).unwrap();
      // res may be a URL or an object with url and originalName
      let url, originalName;
      if (typeof res === "string") {
        url = res;
        originalName = file.name;
      } else {
        url = res.url;
        originalName = res.originalName || file.name;
      }
      setFormData((prev) => ({
        ...prev,
        attachments: [...(prev.attachments || []), { url, originalName }],
      }));
    } catch {
      alert("File upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Add a function to remove an attachment
  const handleRemoveAttachment = (idxToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, idx) => idx !== idxToRemove),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Document" : "Create New Document"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update document content and details"
              : "Create a new care documentation record"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              Document Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {documentTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter document title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="final">Final</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Version
              </label>
              <input
                type="number"
                min="1"
                value={formData.version}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    version: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Content *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter the document content here..."
            />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag..."
              />
              <Button
                type="button"
                onClick={addTag}
                variant="default"
                icon={Plus}
              >
                Add
              </Button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Review Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="reviewRequired"
                checked={formData.reviewRequired}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reviewRequired: e.target.checked,
                  }))
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="reviewRequired"
                className="ml-2 block text-sm text-gray-900"
              >
                This document requires review
              </label>
            </div>

            {formData.reviewRequired && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Date
                </label>
                <input
                  type="date"
                  value={formData.reviewDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reviewDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Attachments</h3>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop files here, or click to select files
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
              id="file-upload-input"
            />
            <label
              htmlFor="file-upload-input"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer"
            >
              {uploading ? "Uploading..." : "Choose Files"}
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
            </p>
            {formData.attachments && formData.attachments.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Uploaded Files:</h4>
                <ul className="space-y-1">
                  {formData.attachments.map((att, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                        download={att.originalName}
                      >
                        {att.originalName || `Download Attachment ${idx + 1}`}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(idx)}
                        className="ml-2 text-red-600 hover:text-red-800 px-2 py-1 rounded"
                        title="Remove attachment"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>

          <Button
            type="submit"
            variant="default"
            icon={Save}
            style={{ minWidth: 180 }}
          >
            {isEditing ? "Update Document" : "Save Document"}
          </Button>
        </div>
      </form>
    </div>
  );
}
