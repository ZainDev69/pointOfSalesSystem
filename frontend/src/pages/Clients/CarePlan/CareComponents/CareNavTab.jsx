import { Shield, User, Target, FileText, Calendar } from "lucide-react";

export function CareNavTab({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "personal-care", label: "Personal Care", icon: User },
    { id: "daily-living", label: "Daily Living", icon: FileText },
    { id: "outcomes", label: "Outcomes", icon: Target },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "visit-types", label: "Visit Types", icon: Calendar },
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
