import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  Clock,
  User,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Eye,
} from "lucide-react";
import {
  fetchCommunicationTypes,
  fetchCommunicationCategories,
  createCommunication,
  updateCommunication,
  deleteCommunication,
  fetchInitiatedByOptions,
  fetchCommunicationStatuses,
} from "../../../components/redux/slice/communications";
import toast from "react-hot-toast";

export function CommunicationForm({
  initialData,
  onSave,
  onCancel,
  onDelete,
  mode = "add",
  clientId,
  client,
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
  const statuses = useSelector((state) => state.communications.statuses);
  // Get current date and time for auto-fill
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);
    return { date, time };
  };

  const { date: currentDate, time: currentTime } = getCurrentDateTime();

  const [form, setForm] = useState({
    date: safeInitialData.date
      ? safeInitialData.date.slice(0, 10)
      : currentDate,
    time: safeInitialData.time || currentTime,
    communicationType: safeInitialData.communicationType || "",
    category: safeInitialData.category || "",
    subject: safeInitialData.subject || "",
    initiatedBy: safeInitialData.initiatedBy || "",
    initiatorName: safeInitialData.initiatorName || "",
    recipient:
      safeInitialData.recipient ||
      (client?.personalDetails?.fullName
        ? client?.personalDetails?.fullName
        : client?.personalDetails?.firstName || ""),
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
  const [deleting, setDeleting] = useState(false);
  const [viewMode, setViewMode] = useState(mode === "view");

  useEffect(() => {
    if (!communicationType.length) dispatch(fetchCommunicationTypes());
    if (!category.length) dispatch(fetchCommunicationCategories());
    if (!initiatedByOptions.length) dispatch(fetchInitiatedByOptions());
    if (!statuses.length) dispatch(fetchCommunicationStatuses());
  }, [
    dispatch,
    communicationType.length,
    category.length,
    initiatedByOptions.length,
    statuses.length,
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

  const handleDelete = async () => {
    if (!initialData?._id) {
      toast.error("No communication to delete");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this communication? This action cannot be undone."
      )
    ) {
      return;
    }

    setDeleting(true);
    try {
      await dispatch(deleteCommunication(initialData._id)).unwrap();
      toast.success("Communication deleted successfully");
      onDelete && onDelete();
    } catch (err) {
      toast.error(err?.message || "Failed to delete communication");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
      case "in-progress":
        return <ClockIcon className="w-5 h-5 text-yellow-600" />;
      case "cancelled":
      case "failed":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const getCommunicationTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "phone":
      case "phone-call":
        return <Phone className="w-5 h-5 text-blue-600" />;
      case "email":
        return <Mail className="w-5 h-5 text-green-600" />;
      case "message":
      case "text":
        return <MessageSquare className="w-5 h-5 text-purple-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // If in view mode, render the impressive view UI
  if (viewMode) {
    return (
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Communication Details
                </h2>
                <p className="text-gray-600">
                  View communication information and history
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>{deleting ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </div>

          {/* Status and Type Badge */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {getStatusIcon(form.status)}
                <span className="text-lg font-semibold text-gray-900">
                  {form.status
                    ?.replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {getCommunicationTypeIcon(form.communicationType)}
                <span className="text-lg font-semibold text-gray-700">
                  {form.communicationType
                    ?.replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {form.urgent && (
                <span className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Urgent</span>
                </span>
              )}
              {form.confidential && (
                <span className="flex items-center space-x-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  <span>Confidential</span>
                </span>
              )}
            </div>
          </div>

          {/* Subject */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {form.subject}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(form.date)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(form.time)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Participants</span>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Initiator
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {form.initiatorName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {form.initiatedBy
                        ?.replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">
                      Category
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {form.category
                        ?.replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Recipient
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {form.recipient}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow-up Information */}
            {form.followUpDate && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-orange-600" />
                  <span>Follow-up</span>
                </h3>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">
                    Follow-up Date
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(form.followUpDate)}
                  </p>
                </div>
              </div>
            )}

            {/* Attachments */}
            {form.attachments && form.attachments.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Download className="w-5 h-5 text-purple-600" />
                  <span>Attachments</span>
                </h3>
                <div className="space-y-2">
                  {form.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {attachment}
                        </span>
                      </div>
                      <button className="text-purple-600 hover:text-purple-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6">
            {/* Message */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span>Message</span>
              </h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {form.message}
                </p>
              </div>
            </div>

            {/* Response */}
            {form.response && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Response</span>
                </h3>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {form.response}
                  </p>
                </div>
              </div>
            )}

            {/* Outcome */}
            {form.outcome && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Outcome</span>
                </h3>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-gray-900">{form.outcome}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
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
      <div className="flex justify-between items-center">
        <div>
          {mode === "edit" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete Communication"}
            </button>
          )}
        </div>
        <div className="flex gap-2">
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
      </div>
    </form>
  );
}
