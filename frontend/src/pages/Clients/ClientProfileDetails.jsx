import React, { useState } from "react";
import {
  ArrowLeft,
  Edit3,
  User,
  Phone,
  MessageSquare,
  FileText,
  Activity,
  Pill,
  ClipboardList,
  AlertCircle,
  CalendarDays,
  BriefcaseMedical,
  Info,
} from "lucide-react";

export function ClientProfileDetails({ client, onBack }) {
  console.log("The Client Data is", client);
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Information", icon: User },
    { id: "contacts", label: "Contact Information", icon: Phone },
    { id: "additional", label: "Additional Information", icon: Info },
    { id: "service", label: "Service Information", icon: BriefcaseMedical },
    { id: "logs", label: "Activity Logs", icon: Activity },
    { id: "care", label: "Care Planning", icon: CalendarDays },
    { id: "risk", label: "Risk Management", icon: AlertCircle },
    { id: "tasks", label: "Visit Tasks", icon: ClipboardList },
    { id: "medication", label: "Medication", icon: Pill },
    { id: "documentation", label: "Documentation", icon: FileText },
    { id: "communication", label: "Communications", icon: MessageSquare },
  ];

  const InfoBlock = ({ label, children }) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900">{children}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {client.FullName || "Maria"}
            </h1>
            <p className="text-gray-600 mt-1">
              NHS: {client.NHSNumber || "123 456 7890"} • Age:{" "}
              {client.DateOfBirth
                ? Math.floor(
                    (new Date().getTime() -
                      new Date(client.DateOfBirth).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  )
                : 78}
            </p>
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
      {activeTab === "personal" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-4">
              <InfoBlock label="Full Name">{client.FullName}</InfoBlock>
              <InfoBlock label="Preferred Name">
                {client.PreferredName}
              </InfoBlock>

              <InfoBlock label="Date of Birth">
                {client.DateOfBirth
                  ? new Date(client.DateOfBirth).toLocaleDateString()
                  : "Not specified"}
              </InfoBlock>
            </div>

            <div className="space-y-4">
              <InfoBlock label="Gender">{client.Gender}</InfoBlock>
              <InfoBlock label="Pronouns">{client.Pronouns}</InfoBlock>
              <InfoBlock label="Ethnicity">{client.Ethnicity}</InfoBlock>
            </div>
            <div className="space-y-4">
              <InfoBlock label="Religion">{client.Religion}</InfoBlock>
              <InfoBlock label="Relationship Status">
                {client.RelationshipStatus}
              </InfoBlock>
              <InfoBlock label="Sexual Orientation">
                {client.SexualOrientation}
              </InfoBlock>
            </div>
          </div>
        </div>
      )}

      {activeTab === "contacts" && <div className="space-y-6"></div>}
      {activeTab === "additional" && <div className="space-y-6"></div>}
      {activeTab === "service" && <div className="space-y-6"></div>}
      {activeTab === "logs" && <div className="space-y-6"></div>}
      {activeTab === "care" && <div className="space-y-6"></div>}
      {activeTab === "risk" && <div className="space-y-6"></div>}
      {activeTab === "tasks" && <div className="space-y-6"></div>}
      {activeTab === "medication" && <div className="space-y-6"></div>}
      {activeTab === "documentation" && <div className="space-y-6"></div>}
      {activeTab === "communication" && <div className="space-y-6"></div>}

      {[
        "contacts",
        "additional",
        "service",
        "logs",
        "care",
        "risk",
        "tasks",
        "medication",
        "documentation",
        "communication",
      ].includes(activeTab) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tabs.find((tab) => tab.id === activeTab)?.label} Section
            </h3>
            <p className="text-gray-600">
              This section is under development. The comprehensive client
              profile will include detailed information for each tab.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
