import React from "react";
import {
  Home,
  Users,
  UserPlus,
  Calendar,
  FileText,
  MessageSquare,
  BarChart3,
  X,
  ChevronRight,
  AlertTriangle,
  ListTodo,
  DoorOpen,
  CreditCard,
} from "lucide-react";
import { useApp } from "../Context/AppContext";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "clients", label: "Clients", icon: Users },
  { id: "documents", label: "Docuements", icon: FileText },
  { id: "risk", label: "Risk Management", icon: AlertTriangle },
  { id: "staff", label: "Staff", icon: UserPlus },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "accounting", label: "Accounting", icon: CreditCard },
];

const adminItems = [
  { id: "reports", label: "Reports ", icon: BarChart3 },
  { id: "clientportal", label: "Client Portal Access", icon: DoorOpen },
];

export function Sidebar({ activeSection, onSectionChange }) {
  const { sidebarOpen, setSidebarOpen } = useApp();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out lg:translate-x-0 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-900">TopLine</h1>
              <p className="text-sm text-gray-500">Care Solutions</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 ${
                      isActive ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 ml-auto text-blue-600" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <p className="text-xl font-bold text-gray-900 ml-3 mb-3">
              Administration
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-2">
              <div className="flex items-center space-x-3">
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSectionChange(item.id);
                          setSidebarOpen(false);
                        }}
                        className={`
                    w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                      >
                        <Icon
                          className={`w-5 h-5 mr-3 ${
                            isActive ? "text-blue-600" : "text-gray-400"
                          }`}
                        />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 ml-auto text-blue-600" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
