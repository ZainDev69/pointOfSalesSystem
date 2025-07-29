import React, { useState } from "react";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { Button } from "../../../../components/ui/Button";

export function CarePlanDocumentForm({ document, onBack, onSave, onUpload }) {
  const isEditing = !!document;
  const [formData, setFormData] = useState({
    title: document?.title || "",
    attachments: document?.attachments || [],
  });
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await onUpload(file);
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

  const handleRemoveAttachment = (idxToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, idx) => idx !== idxToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert("Title is required");
      return;
    }
    onSave({
      ...formData,
      attachments: (formData.attachments || []).map((att) => ({
        url: att.url,
        originalName: att.originalName,
      })),
      _id: document?._id,
    });
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
            {isEditing ? "Edit Document" : "Add Document"}
          </h1>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <Button type="submit" variant="default" style={{ minWidth: 180 }}>
            {isEditing ? "Update Document" : "Save Document"}
          </Button>
        </div>
      </form>
    </div>
  );
}
