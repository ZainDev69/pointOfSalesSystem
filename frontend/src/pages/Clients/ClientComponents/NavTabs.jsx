import {
  User,
  FileText,
  Heart,
  Shield,
  Users,
  AlertTriangle,
  Calendar,
  History,
  MessageSquare,
} from "lucide-react";

export function NavTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "personal", label: "Personal Details", icon: User },
    { id: "medical", label: "Medical Information", icon: Heart },
    { id: "care-plan", label: "Care Plan", icon: Shield },
    { id: "contacts", label: "Family & Friends", icon: Users },
    { id: "risk-assessments", label: "Risk Assessments", icon: AlertTriangle },
    { id: "visits", label: "Visit Schedule", icon: Calendar },
    { id: "documents", label: "Documentation", icon: FileText },
    { id: "communications", label: "Communication", icon: MessageSquare },

    { id: "compliance", label: "Compliance", icon: Shield },
    { id: "activity-log", label: "Activity Log", icon: History },
  ];
  return (
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
  );
}
