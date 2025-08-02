import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Clock,
  User,
  Edit3,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash,
} from "lucide-react";
import { VisitForm } from "./VisitForm";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVisitSchedule,
  addVisit,
  updateVisit,
  deleteVisit,
  fetchVisitOptions,
} from "../../../components/redux/slice/visitSchedules";
import { Button } from "../../../components/ui/Button";

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function VisitScheduleManager({ clientId }) {
  const [view, setView] = useState("list");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [detailModalVisit, setDetailModalVisit] = useState(null);

  const dispatch = useDispatch();
  const visits = useSelector((state) => state.visitSchedules.items) || [];
  const loading = useSelector((state) => state.visitSchedules.loading);

  useEffect(() => {
    if (clientId) {
      dispatch(fetchVisitOptions(clientId));
    }
  }, [clientId, dispatch]);

  useEffect(() => {
    if (clientId) {
      dispatch(fetchVisitSchedule(clientId));
    }
  }, [clientId, dispatch]);

  const handleSaveVisit = async (visitData) => {
    const visitId = visitData._id;
    if (visitId) {
      await dispatch(updateVisit({ clientId, visitId, visitData }));
    } else {
      await dispatch(addVisit({ clientId, visitData }));
    }
    setView("list");
    setSelectedVisit(null);
  };

  const handleEditVisit = (visit) => {
    setSelectedVisit(visit);
    setView("form");
  };

  const handleDeleteVisit = async (id) => {
    dispatch(deleteVisit({ clientId, visitId: id }));
  };

  const filteredVisits =
    filterStatus === "all"
      ? visits
      : visits.filter((visit) => visit.status === filterStatus);

  const visitStats = {
    total: visits.length,
    scheduled: visits.filter((v) => v.status === "scheduled").length,
    confirmed: visits.filter((v) => v.status === "confirmed").length,
    completed: visits.filter((v) => v.status === "completed").length,
    cancelled: visits.filter((v) => v.status === "cancelled").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "missed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "emergency":
        return "bg-red-100 text-red-800";
      case "urgent":
        return "bg-orange-100 text-orange-800";
      case "routine":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "cancelled":
      case "missed":
        return XCircle;
      case "in-progress":
        return Clock;
      default:
        return Calendar;
    }
  };

  // Calendar logic
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const today = new Date();

  // Map: day number -> visits
  const visitsByDay = {};
  visits.forEach((visit) => {
    const visitDate = new Date(visit.date);
    if (visitDate.getFullYear() === year && visitDate.getMonth() === month) {
      const day = visitDate.getDate();
      if (!visitsByDay[day]) visitsByDay[day] = [];
      visitsByDay[day].push(visit);
    }
  });

  const selectedDateVisits = visitsByDay[selectedDay] || [];

  // Visit Details Modal
  const VisitDetailModal = ({ visit, onClose }) => {
    if (!visit) return null;
    const StatusIcon = getStatusIcon(visit.status);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full relative animate-fade-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            aria-label="Close"
          >
            <XCircle className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
              <StatusIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {visit.startTime} - {visit.endTime}{" "}
                <span className="text-base font-normal text-gray-500">
                  ({visit.status})
                </span>
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(visit.date).toLocaleDateString()}</span>
                <span>•</span>
                <Clock className="w-4 h-4" />
                <span>{visit.duration} min</span>
                <span>•</span>
                <User className="w-4 h-4" />
                <span>{visit.assignedCarer || "Unassigned"}</span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                visit.priority
              )}`}
            >
              {visit.priority}
            </span>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {visit.notes || "No notes provided."}
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tasks</h3>
            {visit.tasks && visit.tasks.length > 0 ? (
              <ul className="space-y-2">
                {visit.tasks.map((task, idx) => (
                  <li
                    key={task._id || idx}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-700">
                        {task.category}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 ml-2">
                        {task.priority}
                      </span>
                    </div>
                    <div className="text-gray-900 font-semibold mt-1">
                      {task.task}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Skills: {task.skills?.join(", ") || "None"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Equipment: {task.equipment?.join(", ") || "None"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Documentation: {task.documentation?.join(", ") || "None"}
                    </div>
                    {task.instructions && task.instructions.length > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Instructions: {task.instructions.join("; ")}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No tasks for this visit.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (view === "form") {
    return (
      <VisitForm
        visit={selectedVisit}
        onBack={() => setView("list")}
        onSave={handleSaveVisit}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visit Schedule</h2>
          <p className="text-gray-600 mt-1">
            Manage client visits and care delivery
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedVisit(null);
            setView("form");
          }}
          variant="default"
          icon={Plus}
          style={{ minWidth: 180 }}
        >
          Schedule Visit
        </Button>
      </div>
      <div className="mb-6" />

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-blue-900">
                {visitStats.total}
              </p>
              <p className="text-xs text-blue-700 font-medium">Total</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-yellow-900">
                {visitStats.scheduled}
              </p>
              <p className="text-xs text-yellow-700 font-medium">Scheduled</p>
            </div>
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-900">
                {visitStats.confirmed}
              </p>
              <p className="text-xs text-green-700 font-medium">Confirmed</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">
                {visitStats.completed}
              </p>
              <p className="text-xs text-gray-700 font-medium">Completed</p>
            </div>
            <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-red-900">
                {visitStats.cancelled}
              </p>
              <p className="text-xs text-red-700 font-medium">Cancelled</p>
            </div>
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle and Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Visits</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="missed">Missed</option>
            </select>
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              view === "calendar"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {/* Visit List */}
      {view === "list" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Scheduled Visits ({filteredVisits.length})
            </h3>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading visits...
            </div>
          ) : filteredVisits.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Scheduled Visits
              </h3>
              <p className="text-gray-600 mb-4">
                {filterStatus === "all"
                  ? "No visits have been scheduled yet."
                  : `No ${filterStatus} visits found.`}
              </p>
              <button
                onClick={() => {
                  setSelectedVisit(null);
                  setView("form");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule First Visit</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredVisits.map((visit) => {
                const StatusIcon = getStatusIcon(visit.status);
                return (
                  <div
                    key={visit._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <StatusIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-medium text-gray-900">
                              {visit.startTime} - {visit.endTime}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                visit.status
                              )}`}
                            >
                              {visit.status}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                visit.priority
                              )}`}
                            >
                              {visit.priority}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>
                                {new Date(visit.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              <span>{visit.duration} minutes</span>
                            </div>
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              <span>{visit.assignedCarer}</span>
                            </div>
                            <div className="flex items-center">
                              <AlertTriangle className="w-4 h-4 mr-1" />
                              <span>{visit.tasks?.length || 0} tasks</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-2">
                              {visit.tasks?.slice(0, 3).map((task, idx) => (
                                <span
                                  key={task._id || idx}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                                >
                                  {task.category}:{" "}
                                  {task.task?.length > 30
                                    ? task.task.substring(0, 30) + "..."
                                    : task.task}
                                </span>
                              ))}
                              {visit.tasks?.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                                  +{visit.tasks.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          onClick={() => setDetailModalVisit(visit)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditVisit(visit)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVisit(visit._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Visit"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {view === "calendar" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h3 className="text-xl font-semibold text-gray-900">
                {calendarMonth.toLocaleString("default", { month: "long" })}{" "}
                {year}
              </h3>
              <button
                onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <button
              onClick={() => setCalendarMonth(new Date())}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Today
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="text-center font-semibold text-gray-500 py-2"
              >
                {d}
              </div>
            ))}
            {Array(firstDayOfWeek)
              .fill(null)
              .map((_, idx) => (
                <div key={"empty-" + idx} className="h-16"></div>
              ))}
            {Array(daysInMonth)
              .fill(null)
              .map((_, idx) => {
                const day = idx + 1;
                const isToday =
                  year === today.getFullYear() &&
                  month === today.getMonth() &&
                  day === today.getDate();
                const hasVisits = !!visitsByDay[day];
                const isSelected = selectedDay === day;

                return (
                  <button
                    key={day}
                    onClick={() => {
                      setSelectedDay(day);
                    }}
                    className={`h-16 w-full rounded-lg flex flex-col items-center justify-center border transition-all duration-200 hover:shadow-md
                      ${
                        isToday
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }
                      ${
                        isSelected
                          ? "bg-blue-100 border-blue-600 shadow-md"
                          : "bg-white hover:bg-gray-50"
                      }
                      ${hasVisits ? "ring-2 ring-green-300" : ""}
                    `}
                  >
                    <span
                      className={`font-bold ${isToday ? "text-blue-700" : ""}`}
                    >
                      {day}
                    </span>
                    {hasVisits && (
                      <div className="flex flex-col items-center mt-1">
                        <span className="text-xs text-green-600 font-semibold">
                          {visitsByDay[day].length} visit
                          {visitsByDay[day].length > 1 ? "s" : ""}
                        </span>
                        <div className="flex space-x-1 mt-1">
                          {visitsByDay[day]
                            .slice(0, 3)
                            .map((visit, visitIdx) => (
                              <div
                                key={visitIdx}
                                className={`w-1 h-1 rounded-full ${
                                  visit.status === "completed"
                                    ? "bg-green-500"
                                    : visit.status === "cancelled"
                                    ? "bg-red-500"
                                    : visit.status === "in-progress"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                }`}
                              />
                            ))}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
          </div>
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Visits on{" "}
                {calendarMonth.toLocaleString("default", { month: "long" })}{" "}
                {selectedDay}, {year}
              </h4>
            </div>

            {selectedDateVisits.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h5 className="text-lg font-medium text-gray-900 mb-2">
                  No visits scheduled
                </h5>
                <p className="text-gray-600 mb-4">
                  No visits are scheduled for this date.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateVisits.map((visit) => (
                  <div
                    key={visit._id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-semibold text-blue-700 text-lg">
                            {visit.startTime} - {visit.endTime}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              visit.status
                            )}`}
                          >
                            {visit.status}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              visit.priority
                            )}`}
                          >
                            {visit.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>{visit.assignedCarer || "Unassigned"}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{visit.duration} minutes</span>
                          </div>
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span>{visit.tasks?.length || 0} tasks</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setDetailModalVisit(visit)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditVisit(visit)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Visit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteVisit(visit._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Visit"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visit Details Modal */}
      {detailModalVisit && (
        <VisitDetailModal
          visit={detailModalVisit}
          onClose={() => setDetailModalVisit(null)}
        />
      )}
    </div>
  );
}
