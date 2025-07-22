import React, { useState } from "react";
import {
  Shield,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  FileText,
  User,
  Award,
} from "lucide-react";

export function ComplianceTracker({ client, compliance }) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "care-plan", label: "Care Plan Reviews", icon: FileText },
    { id: "risk-assessments", label: "Risk Assessments", icon: AlertTriangle },
    { id: "staff-training", label: "Staff Training", icon: Award },
    { id: "cqc", label: "CQC Readiness", icon: CheckCircle },
    { id: "audit-trail", label: "Audit Trail", icon: Clock },
  ];

  const getComplianceStatusColor = (status) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800";
      case "due":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "not-applicable":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getComplianceIcon = (status) => {
    switch (status) {
      case "compliant":
        return CheckCircle;
      case "due":
        return Clock;
      case "overdue":
        return XCircle;
      case "not-applicable":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  // Mock compliance data
  const mockComplianceItems = [
    {
      item: "Care Plan Review",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "due",
      responsibility: "Care Manager",
      evidence: ["care-plan-v2.pdf"],
      notes: "Annual review due next month",
    },
    {
      item: "Environmental Risk Assessment",
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "overdue",
      responsibility: "Health & Safety Officer",
      evidence: [],
      notes: "Assessment overdue by 5 days",
    },
    {
      item: "Medication Review",
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      completedDate: new Date().toISOString(),
      status: "compliant",
      responsibility: "Clinical Lead",
      evidence: ["medication-review-2024.pdf", "gp-consultation-notes.pdf"],
      notes: "Completed ahead of schedule",
    },
  ];

  const complianceStats = {
    total: mockComplianceItems.length,
    compliant: mockComplianceItems.filter((item) => item.status === "compliant")
      .length,
    due: mockComplianceItems.filter((item) => item.status === "due").length,
    overdue: mockComplianceItems.filter((item) => item.status === "overdue")
      .length,
    complianceRate: Math.round(
      (mockComplianceItems.filter((item) => item.status === "compliant")
        .length /
        mockComplianceItems.length) *
        100
    ),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Compliance Tracking
          </h2>
          <p className="text-gray-600 mt-1">
            Monitor regulatory compliance and quality standards
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-600">Compliance Rate</p>
            <p
              className={`text-2xl font-bold ${
                complianceStats.complianceRate >= 80
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {complianceStats.complianceRate}%
            </p>
          </div>
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              complianceStats.complianceRate >= 80
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            <Shield
              className={`w-8 h-8 ${
                complianceStats.complianceRate >= 80
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {complianceStats.total}
              </p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {complianceStats.compliant}
              </p>
              <p className="text-sm text-gray-600">Compliant</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {complianceStats.due}
              </p>
              <p className="text-sm text-gray-600">Due Soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {complianceStats.overdue}
              </p>
              <p className="text-sm text-gray-600">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Compliance Alert */}
          {complianceStats.overdue > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Compliance Issues Detected
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      {complianceStats.overdue} compliance items are overdue and
                      require immediate attention.
                    </p>
                  </div>
                  <div className="mt-3">
                    <button className="text-red-800 hover:text-red-900 text-sm font-medium underline">
                      View overdue items →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Compliance Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Compliance Items
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {mockComplianceItems.map((item, index) => {
                const StatusIcon = getComplianceIcon(item.status);

                return (
                  <div key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.status === "compliant"
                              ? "bg-green-100"
                              : item.status === "due"
                              ? "bg-yellow-100"
                              : item.status === "overdue"
                              ? "bg-red-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <StatusIcon
                            className={`w-5 h-5 ${
                              item.status === "compliant"
                                ? "text-green-600"
                                : item.status === "due"
                                ? "text-yellow-600"
                                : item.status === "overdue"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900">
                              {item.item}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              <span>
                                Due:{" "}
                                {new Date(item.dueDate).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              <span>{item.responsibility}</span>
                            </div>

                            {item.evidence && item.evidence.length > 0 && (
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                <span>
                                  {item.evidence.length} evidence file(s)
                                </span>
                              </div>
                            )}
                          </div>

                          {item.notes && (
                            <p className="text-sm text-gray-600 mt-2">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Other tab content placeholders */}
      {activeTab !== "overview" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tabs.find((tab) => tab.id === activeTab)?.label} Section
            </h3>
            <p className="text-gray-600">
              This compliance tracking section is under development.
              Comprehensive compliance management features coming soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
