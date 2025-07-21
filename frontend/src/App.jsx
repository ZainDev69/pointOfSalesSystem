import React, { useState } from "react";
import Dashboard from "./pages/Dashboard/dashboard";
import Clients from "./pages/Clients/ClientPage";
import Documents from "./pages/Documents/document";
import RiskManagement from "./pages/Risk/riskmanagement";
import Staff from "./pages/Staff/staff";
import Tasks from "./pages/Tasks/tasks";
import Reports from "./pages/Reports/report";
import ClientPortal from "./pages/ClientPortal/clientPortal";
import Schedule from "./pages/Schedule/schedule";
import Accounting from "./pages/Accounting/accounting";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";

function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "clients":
        return <Clients />;
      case "documents":
        return <Documents />;
      case "risk":
        return <RiskManagement />;
      case "staff":
        return <Staff />;
      case "tasks":
        return <Tasks />;
      case "schedule":
        return <Schedule />;
      case "accounting":
        return <Accounting />;
      case "reports":
        return <Reports />;
      case "clientportal":
        return <ClientPortal />;
      default:
        return <Dashboard />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="lg:ml-72">
        <Header />
        <main className="p-4 lg:p-6">{renderSection()}</main>
      </div>
    </div>
  );
}

export default App;
