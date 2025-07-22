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
  Trash2,
} from "lucide-react";
import { VisitForm } from "./VisitForm";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVisitSchedule,
  addVisit,
  updateVisit,
  deleteVisit,
} from "../../components/redux/slice/visitSchedules";

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
    console.log("Deleting the visit in handleDeleteVisit", id);
    await dispatch(deleteVisit({ clientId, visitId: id }));
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Visit Schedule</h2>
          <p className="text-gray-600 mt-1">
            Manage client visits and care delivery
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView("calendar")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === "calendar"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                view === "list"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              List
            </button>
          </div>

          <button
            onClick={() => {
              setSelectedVisit(null);
              setView("form");
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Visit</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {visitStats.total}
              </p>
              <p className="text-sm text-gray-600">Total Visits</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {visitStats.scheduled}
              </p>
              <p className="text-sm text-gray-600">Scheduled</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {visitStats.confirmed}
              </p>
              <p className="text-sm text-gray-600">Confirmed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-gray-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {visitStats.completed}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {visitStats.cancelled}
              </p>
              <p className="text-sm text-gray-600">Cancelled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">
            Filter by status:
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                          <Trash2 className="w-4 h-4" />
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
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}
              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              &lt;
            </button>
            <h3 className="text-lg font-medium text-gray-900">
              {calendarMonth.toLocaleString("default", { month: "long" })}{" "}
              {year}
            </h3>
            <button
              onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}
              className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center font-semibold text-gray-500">
                {d}
              </div>
            ))}
            {Array(firstDayOfWeek)
              .fill(null)
              .map((_, idx) => (
                <div key={"empty-" + idx}></div>
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
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-12 w-full rounded-lg flex flex-col items-center justify-center border transition-colors
                      ${isToday ? "border-blue-500" : "border-gray-200"}
                      ${selectedDay === day ? "bg-blue-100" : "bg-white"}
                      ${hasVisits ? "ring-2 ring-green-300" : ""}
                    `}
                  >
                    <span className="font-bold">{day}</span>
                    {hasVisits && (
                      <span className="text-xs text-green-600 font-semibold">
                        {visitsByDay[day].length} visit
                        {visitsByDay[day].length > 1 ? "s" : ""}
                      </span>
                    )}
                  </button>
                );
              })}
          </div>
          <div>
            <h4 className="text-md font-semibold mb-2">
              Visits on{" "}
              {calendarMonth.toLocaleString("default", { month: "long" })}{" "}
              {selectedDay}, {year}
            </h4>
            {selectedDateVisits.length === 0 ? (
              <div className="text-gray-500">
                No visits scheduled for this day.
              </div>
            ) : (
              <div className="space-y-2">
                {selectedDateVisits.map((visit) => (
                  <div
                    key={visit._id}
                    className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-blue-700">
                        {visit.startTime} - {visit.endTime}
                      </span>{" "}
                      <span className="text-gray-700">
                        {visit.assignedCarer}
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          visit.status
                        )}`}
                      >
                        {visit.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditVisit(visit)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Visit"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVisit(visit._id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Visit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
