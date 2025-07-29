import React, { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  Edit3,
  Trash,
  CheckCircle,
  History,
  Search,
  Filter,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityLogs } from "../../../components/redux/slice/activityLogs";

export function ActivityTab({ client }) {
  const dispatch = useDispatch();
  const logs = useSelector((state) => state.activityLogs.logs);
  const loading = useSelector((state) => state.activityLogs.loading);
  const pages = useSelector((state) => state.activityLogs.pages);

  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const logsPerPage = 10;

  // Apply client-side search filter
  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      log.action?.toLowerCase().includes(searchLower) ||
      log.user?.toLowerCase().includes(searchLower) ||
      log.date?.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    if (client?._id) {
      dispatch(
        fetchActivityLogs({
          clientId: client._id,
          page: currentPage,
          limit: logsPerPage,
          date: selectedDate || undefined,
          user: userFilter || undefined,
        })
      );
    }
  }, [client?._id, dispatch, currentPage, selectedDate, userFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [client?._id, selectedDate, userFilter]);

  const handleClearFilters = () => {
    setSelectedDate("");
    setUserFilter("");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedDate || userFilter || searchTerm;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <History className="w-5 h-5 text-black" />
          <span>Activity Log</span>
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${
              showFilters
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center space-x-1 px-3 py-1 rounded-md text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search activity logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User
              </label>
              <input
                type="text"
                placeholder="Filter by user..."
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left font-medium text-gray-700">
                Date/Time
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">
                Action
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">
                User
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  Loading activity log...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  {searchTerm
                    ? "No activity logs match your search."
                    : "No activity recorded yet."}
                </td>
              </tr>
            ) : (
              filteredLogs.map((log, idx) => {
                // Zebra striping
                const isEven = idx % 2 === 0;
                // Highlight most recent
                const isMostRecent = idx === 0;
                // User initials
                const getInitials = (name) => {
                  if (!name) return "?";
                  return name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();
                };
                // Action icon (simple mapping)
                const actionIconMap = {
                  Created: (
                    <Plus className="w-4 h-4 text-green-500 mr-1 inline" />
                  ),
                  Updated: (
                    <Edit3 className="w-4 h-4 text-blue-500 mr-1 inline" />
                  ),
                  Deleted: (
                    <Trash className="w-4 h-4 text-red-500 mr-1 inline" />
                  ),
                  Contacted: (
                    <MessageSquare className="w-4 h-4 text-purple-500 mr-1 inline" />
                  ),
                };
                // Try to pick an icon based on action text
                const actionKey = Object.keys(actionIconMap).find((key) =>
                  (log.action || "").toLowerCase().includes(key.toLowerCase())
                );
                const ActionIcon = actionKey ? (
                  actionIconMap[actionKey]
                ) : (
                  <CheckCircle className="w-4 h-4 text-gray-400 mr-1 inline" />
                );
                return (
                  <tr
                    key={log._id || idx}
                    className={`transition-colors ${
                      isEven ? "bg-gray-50" : "bg-white"
                    } ${
                      isMostRecent ? "ring-2 ring-blue-200" : ""
                    } hover:bg-blue-50`}
                  >
                    <td className="px-3 py-2 font-mono text-blue-700 whitespace-nowrap">
                      {log.date ? (
                        <span>
                          {new Date(log.date).toLocaleDateString()}
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(log.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-3 py-2 flex items-center">
                      {ActionIcon}
                      <span className="ml-1">{log.action}</span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center">
                        <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mr-2 border border-blue-200">
                          {getInitials(log.user)}
                        </span>
                        <span className="font-medium text-gray-800">
                          {log.user}
                        </span>
                      </span>
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
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
