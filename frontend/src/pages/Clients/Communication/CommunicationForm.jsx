import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommunicationTypes,
  fetchCommunicationCategories,
  createCommunication,
  updateCommunication,
  fetchInitiatedByOptions,
} from "../../../components/redux/slice/communications";
import toast from "react-hot-toast";

export function CommunicationForm({
  initialData,
  onSave,
  onCancel,
  mode = "add",
  clientId,
}) {
  // Ensure initialData is always an object
  const safeInitialData = initialData || {};
  const dispatch = useDispatch();
  const communicationType = useSelector(
    (state) => state.communications.communicationType
  );
  const category = useSelector((state) => state.communications.category);
  const initiatedByOptions = useSelector(
    (state) => state.communications.initiatedByOptions
  );
  const [form, setForm] = useState({
    date: safeInitialData.date ? safeInitialData.date.slice(0, 10) : "",
    time: safeInitialData.time || "",
    communicationType: safeInitialData.communicationType || "",
    category: safeInitialData.category || "",
    subject: safeInitialData.subject || "",
    initiatedBy: safeInitialData.initiatedBy || "",
    initiatorName: safeInitialData.initiatorName || "",
    recipient: safeInitialData.recipient || "",
    message: safeInitialData.message || "",
    response: safeInitialData.response || "",
    outcome: safeInitialData.outcome || "",
    status: safeInitialData.status || "",
    followUpDate: safeInitialData.followUpDate
      ? safeInitialData.followUpDate.slice(0, 10)
      : "",
    urgent: safeInitialData.urgent || false,
    confidential: safeInitialData.confidential || false,
    attachments: safeInitialData.attachments || [],
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!communicationType.length) dispatch(fetchCommunicationTypes());
    if (!category.length) dispatch(fetchCommunicationCategories());
    if (!initiatedByOptions.length) dispatch(fetchInitiatedByOptions());
  }, [
    dispatch,
    communicationType.length,
    category.length,
    initiatedByOptions.length,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let payload = { ...form, client: clientId };
      // Handle file upload if needed (stub, implement as needed)
      if (file) {
        // TODO: implement file upload and set payload.attachments
        // For now, just simulate
        payload.attachments = [file.name];
      }
      if (mode === "add") {
        await dispatch(createCommunication(payload)).unwrap();
        toast.success("Communication added successfully");
      } else {
        await dispatch(
          updateCommunication({ id: initialData._id, data: payload })
        ).unwrap();
        toast.success("Communication updated successfully");
      }
      onSave && onSave();
    } catch (err) {
      toast.error(err?.message || "Failed to save communication");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time *
            </label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Communication Type *
            </label>
            <select
              name="communicationType"
              value={form.communicationType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Type</option>
              {communicationType.map((type) => (
                <option key={type} value={type}>
                  {type
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Category</option>
              {category.map((cat) => (
                <option key={cat} value={cat}>
                  {cat
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initiated By *
            </label>
            <select
              name="initiatedBy"
              value={form.initiatedBy}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Initiator</option>
              {initiatedByOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Initiator Name *
            </label>
            <input
              type="text"
              name="initiatorName"
              value={form.initiatorName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient *
            </label>
            <input
              type="text"
              name="recipient"
              value={form.recipient}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Content & Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Response
            </label>
            <textarea
              name="response"
              value={form.response}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Outcome
            </label>
            <input
              type="text"
              name="outcome"
              value={form.outcome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <input
              type="text"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Follow Up Date
            </label>
            <input
              type="date"
              name="followUpDate"
              value={form.followUpDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attach Document
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="urgent"
                checked={form.urgent}
                onChange={handleChange}
              />
              Mark as Urgent
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="confidential"
                checked={form.confidential}
                onChange={handleChange}
              />
              Mark as Confidential
            </label>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {mode === "add" ? "Add Communication" : "Update Communication"}
        </button>
      </div>
    </form>
  );
}
