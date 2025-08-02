import React, { useState, useEffect } from "react";
import { ContactTab } from "../Contacts/ContactTab";
import { ActivityTab } from "../ActivityLog/ActivityTab";
import { RiskAssessmentManager } from "../RiskAssessments/RiskAssessmentManager";
import { CarePlanManager } from "../CarePlan/CarePlanManager";
import { VisitScheduleManager } from "../Visits/VisitScheduleManager";
import { DocumentationManager } from "../Documents/DocumentationManager";
import { ComplianceTracker } from "../Compliance/ComplianceTracker";
import { useDispatch } from "react-redux";
import { OverviewTab } from "../Overview/OverviewTab";
import { PersonalTab } from "../Personal/PersonalTab";
import { MedicalTab } from "../Medical/MedicalTab";
import { NavTabs } from "../ClientComponents/NavTabs";
import { fetchContacts } from "../../../components/redux/slice/contacts";

import { HeaderTab } from "../ClientComponents/HeaderTab";
import { CommunicationTab } from "../Communication/CommunicationTab";

export function ClientProfileDetails({ client, onBack, onClientUpdate }) {
  const [activeTab, setActiveTab] = useState("overview");

  const dispatch = useDispatch();

  useEffect(() => {
    if (client?._id) {
      dispatch(fetchContacts(client._id));
    }
  }, [dispatch, client?._id]);

  return (
    <div className="space-y-6">
      {/* Client header Tab */}
      <HeaderTab client={client} onBack={onBack} setActiveTab={setActiveTab} />

      {/* Navigation Tabs */}
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Tab Content */}
      {activeTab === "overview" && <OverviewTab client={client} />}

      {activeTab === "personal" && (
        <PersonalTab client={client} onClientUpdate={onClientUpdate} />
      )}

      {activeTab === "medical" && (
        <MedicalTab client={client} onClientUpdate={onClientUpdate} />
      )}

      {/* Show Spinner for contacts tab if loading */}
      {activeTab === "contacts" && <ContactTab client={client} />}

      {activeTab === "risk-assessments" && (
        <RiskAssessmentManager
          clientId={client._id}
          clientName={
            client?.personalDetails.fullName
              ? `${client.personalDetails.fullName}`
              : "Unknown Client"
          }
        />
      )}

      {activeTab === "care-plan" && <CarePlanManager client={client} />}
      {activeTab === "visits" && <VisitScheduleManager clientId={client._id} />}

      {activeTab === "documents" && <DocumentationManager client={client} />}

      {activeTab === "communications" && (
        <CommunicationTab clientId={client._id} client={client} />
      )}

      {activeTab === "compliance" && (
        <ComplianceTracker client={client} compliance={client.compliance} />
      )}

      {activeTab === "activity-log" && <ActivityTab client={client} />}
    </div>
  );
}
