import React from "react";
import { Plus, Calendar, FileText, MessageSquare } from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      name: "Add New Client",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      description: "Register a new client",
    },
    {
      name: "Schedule Visit",
      icon: Calendar,
      color: "bg-emerald-500 hover:bg-emerald-600",
      description: "Book care appointment",
    },
    {
      name: "Generate Report",
      icon: FileText,
      color: "bg-purple-500 hover:bg-purple-600",
      description: "Create custom report",
    },
    {
      name: "Send Message",
      icon: MessageSquare,
      color: "bg-indigo-500 hover:bg-indigo-600",
      description: "Contact staff or family",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.name}
              className={`w-full ${action.color} text-white p-4 rounded-lg transition-colors flex items-center space-x-3`}
            >
              <Icon className="w-5 h-5" />
              <div className="text-left">
                <p className="font-medium">{action.name}</p>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
