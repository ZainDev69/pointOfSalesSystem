import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommunicationTypes,
  fetchCommunicationCategories,
  fetchCommunications,
  fetchCommunicationStatuses,
  deleteCommunication,
} from "../../../components/redux/slice/communications";
import {
  Plus,
  Eye,
  Edit3,
  Trash,
  MessageSquare,
  Filter,
  Phone,
  Mail,
  Video,
  FileText,
  MessageCircle,
  Users,
  User,
  HelpCircle,
} from "lucide-react";
import { CommunicationForm } from "./CommunicationForm";
import { Button } from "../../../components/ui/Button";

// Icon and color mapping for communication types
const typeIconMap = {
  phone: { icon: Phone, color: "bg-blue-500" },
  email: { icon: Mail, color: "bg-green-500" },
  "video-call": { icon: Video, color: "bg-purple-500" },

  sms: { icon: MessageCircle, color: "bg-indigo-500" },
};

export function CommunicationTab({ clientId, client }) {
  const dispatch = useDispatch();
  const communicationType = useSelector(
    (state) => state.communications.communicationType
  );
  const category = useSelector((state) => state.communications.category);
  const items = useSelector((state) => state.communications.items);
  const loading = useSelector((state) => state.communications.loading);
  const total = useSelector((state) => state.communications.total);
  const pages = useSelector((state) => state.communications.pages);
  const statuses = useSelector((state) => state.communications.statuses);
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    if (!communicationType.length) {
      dispatch(fetchCommunicationTypes());
    }
    if (!category.length) {
      dispatch(fetchCommunicationCategories());
    }
    if (!statuses.length) {
      dispatch(fetchCommunicationStatuses());
    }
  }, [dispatch, communicationType.length, category.length, statuses.length]);

  useEffect(() => {
    if (clientId) {
      dispatch(
        fetchCommunications({
          clientId,
          type: filterType,
          category: filterCategory,
          page: currentPage,
          limit,
        })
      );
    }
  }, [dispatch, clientId, filterType, filterCategory, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterCategory, clientId]);

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };
  const handleEdit = (comm) => {
    setEditData(comm);
    setViewData(null);
    setShowForm(true);
  };

  const handleView = (comm) => {
    setViewData(comm);
    setEditData(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditData(null);
    setViewData(null);
    // Optionally refresh list
    dispatch(
      fetchCommunications({
        clientId,
        type: filterType,
        category: filterCategory,
        page: currentPage,
        limit,
      })
    );
  };

  const handleDelete = async (comm) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this communication? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await dispatch(deleteCommunication(comm._id)).unwrap();
      // Refresh the list after deletion
      dispatch(
        fetchCommunications({
          clientId,
          type: filterType,
          category: filterCategory,
          page: currentPage,
          limit,
        })
      );
    } catch (error) {
      console.error("Failed to delete communication:", error);
    }
  };

  // Card stats by type
  const typeCounts = communicationType.reduce((acc, type) => {
    acc[type] = items.filter((c) => c.communicationType === type).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {communicationType.map((type) => {
          const { icon: Icon, color } = typeIconMap[type] || {
            icon: MessageSquare,
            color: "bg-gray-300",
          };
          return (
            <div
              key={type}
              className="flex items-center gap-3 p-3 rounded-lg shadow border border-gray-200 bg-white hover:shadow-md transition-all min-w-0"
              style={{ minHeight: 60 }}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${color}`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-gray-900 leading-tight">
                  {typeCounts[type]}
                </p>
                <p className="text-xs text-gray-600 truncate">
                  {type
                    .replace(/-/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>
            </div>
          );
        })}
        {/* Total card at the end */}
        <div className="flex items-center gap-3 p-3 rounded-lg shadow border border-blue-200 bg-blue-50 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-500">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-blue-900 leading-tight">
              {total}
            </p>
            <p className="text-xs text-blue-700 truncate">Total</p>
          </div>
        </div>
      </div>
      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            {communicationType.map((type) => (
              <option key={type} value={type}>
                {type
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {category.map((cat) => (
              <option key={cat} value={cat}>
                {cat
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Inline CommunicationForm for add/edit/view */}
      {showForm && (
        <div className="mb-6">
          <CommunicationForm
            initialData={editData || viewData}
            onSave={handleFormClose}
            onCancel={handleFormClose}
            mode={viewData ? "view" : editData ? "edit" : "add"}
            clientId={clientId}
            client={client}
          />
        </div>
      )}
      {/* List/History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Communication History
          </h3>
          <Button onClick={handleAdd} icon={Plus} variant="default">
            New Communication
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Date & Time
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Type
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Category
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Subject
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Initiated By
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    Loading communications...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No communications found.
                  </td>
                </tr>
              ) : (
                items.map((comm) => {
                  const { icon: TypeIcon, color } = typeIconMap[
                    comm.communicationType
                  ] || { icon: MessageSquare, color: "bg-gray-300" };
                  return (
                    <tr key={comm._id} className="hover:bg-blue-50">
                      <td className="px-3 py-2 font-mono text-blue-700 whitespace-nowrap">
                        {comm.date ? (
                          <span>
                            {new Date(comm.date).toLocaleDateString()}
                            <br />
                            <span className="text-xs text-gray-500">
                              {comm.time}
                            </span>
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 py-2 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${color}`}
                        >
                          <TypeIcon className="w-4 h-4 text-white" />
                        </span>
                        <span>{comm.communicationType}</span>
                      </td>
                      <td className="px-3 py-2">{comm.category}</td>
                      <td className="px-3 py-2">{comm.subject}</td>
                      <td className="px-3 py-2">
                        {comm.initiatedBy} - {comm.initiatorName}
                      </td>
                      <td className="px-3 py-2">{comm.status}</td>
                      <td className="px-3 py-2 flex items-center gap-2">
                        <button
                          onClick={() => handleView(comm)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(comm)}
                          className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(comm)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="flex justify-center mt-4 space-x-2 px-6 pb-6">
            {Array.from({ length: pages }, (_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                variant={currentPage === i + 1 ? "default" : "secondary"}
                size="sm"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
