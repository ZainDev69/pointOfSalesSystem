import React, { useState } from "react";
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
} from "lucide-react";
import { VisitForm } from "./VisitForm";

export function VisitScheduleManager({ clientId, schedule, onUpdateSchedule }) {
  const [view, setView] = useState("list");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedVisit, setSelectedVisit] = useState(null);

  // Mock visits data
  const mockVisits = [
    {
      id: "1",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "11:00",
      duration: 120,
      tasks: [
        {
          id: "1",
          category: "Personal Care",
          task: "Assistance with washing and dressing",
          duration: 45,
          priority: "essential",
          skills: ["Personal Care"],
          equipment: ["Hoist", "Shower chair"],
          instructions: ["Use gentle soap", "Check skin integrity"],
          documentation: ["Care log", "Skin assessment"],
        },
        {
          id: "2",
          category: "Medication",
          task: "Administer morning medications",
          duration: 15,
          priority: "essential",
          skills: ["Medication Administration"],
          equipment: ["MAR chart"],
          instructions: ["Check allergies", "Record administration"],
          documentation: ["MAR chart", "Medication log"],
        },
        {
          id: "3",
          category: "Daily Living",
          task: "Prepare breakfast",
          duration: 30,
          priority: "important",
          skills: ["Food Preparation"],
          equipment: ["Kitchen utensils"],
          instructions: [
            "Check dietary requirements",
            "Ensure hot food is served hot",
          ],
          documentation: ["Food diary"],
        },
      ],
      assignedCarer: "Emma Wilson",
      status: "scheduled",
      priority: "routine",
    },
    {
      id: "2",
      date: new Date().toISOString().split("T")[0],
      startTime: "14:00",
      endTime: "15:30",
      duration: 90,
      tasks: [
        {
          id: "4",
          category: "Daily Living",
          task: "Meal preparation and assistance",
          duration: 60,
          priority: "important",
          skills: ["Nutrition Support"],
          equipment: ["Adaptive cutlery"],
          instructions: ["Check dietary requirements", "Monitor intake"],
          documentation: ["Food diary", "Nutrition log"],
        },
        {
          id: "5",
          category: "Social",
          task: "Social interaction and activities",
          duration: 30,
          priority: "routine",
          skills: ["Social Care"],
          equipment: ["Activity materials"],
          instructions: ["Engage in conversation", "Encourage participation"],
          documentation: ["Activity log"],
        },
      ],
      assignedCarer: "James Mitchell",
      status: "confirmed",
      priority: "routine",
    },
    {
      id: "3",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      startTime: "10:00",
      endTime: "12:00",
      duration: 120,
      tasks: [
        {
          id: "6",
          category: "Health Monitoring",
          task: "Blood pressure and weight check",
          duration: 20,
          priority: "important",
          skills: ["Health Monitoring"],
          equipment: ["Blood pressure monitor", "Scales"],
          instructions: ["Record readings", "Report any concerns"],
          documentation: ["Health monitoring chart"],
        },
        {
          id: "7",
          category: "Personal Care",
          task: "Bathing assistance",
          duration: 60,
          priority: "essential",
          skills: ["Personal Care", "Moving and Handling"],
          equipment: ["Hoist", "Bath board", "Non-slip mat"],
          instructions: ["Check water temperature", "Two-person lift required"],
          documentation: ["Care log", "Skin assessment"],
        },
      ],
      assignedCarer: "Sarah Thompson",
      status: "scheduled",
      priority: "routine",
    },
  ];

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

  const filteredVisits = mockVisits.filter(
    (visit) => filterStatus === "all" || visit.status === filterStatus
  );

  const visitStats = {
    total: mockVisits.length,
    scheduled: mockVisits.filter((v) => v.status === "scheduled").length,
    confirmed: mockVisits.filter((v) => v.status === "confirmed").length,
    completed: mockVisits.filter((v) => v.status === "completed").length,
    cancelled: mockVisits.filter((v) => v.status === "cancelled").length,
  };

  if (view === "form") {
    return (
      <VisitForm
        visit={selectedVisit}
        onBack={() => setView("list")}
        onSave={(visit) => {
          console.log("Save visit:", visit);
          setView("list");
        }}
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

          <div className="divide-y divide-gray-200">
            {filteredVisits.map((visit) => {
              const StatusIcon = getStatusIcon(visit.status);

              return (
                <div
                  key={visit.id}
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
                            <span>{visit.tasks.length} tasks</span>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="flex flex-wrap gap-2">
                            {visit.tasks.slice(0, 3).map((task) => (
                              <span
                                key={task.id}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                              >
                                {task.category}:{" "}
                                {task.task.length > 30
                                  ? task.task.substring(0, 30) + "..."
                                  : task.task}
                              </span>
                            ))}
                            {visit.tasks.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                                +{visit.tasks.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedVisit(visit);
                          setView("form");
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredVisits.length === 0 && (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No visits found
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
            )}
          </div>
        </div>
      )}

      {/* Calendar View */}
      {view === "calendar" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Calendar View
            </h3>
            <p className="text-gray-600">
              Interactive calendar view coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
