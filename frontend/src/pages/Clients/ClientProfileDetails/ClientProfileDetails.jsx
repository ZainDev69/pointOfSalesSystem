import React, { useState, useEffect } from "react";

import { ContactTab } from "../Contacts/ContactTab";
import { ActivityTab } from "../ActivityLog/ActivityTab";
import { RiskAssessmentManager } from "../RiskAssessments/RiskAssessmentManager";
import { CarePlanManager } from "../CarePlan/CarePlanManager";
import { VisitScheduleManager } from "../Visits/VisitScheduleManager";
import { DocumentationManager } from "../Documents/DocumentationManager";
import { ComplianceTracker } from "../Compliance/ComplianceTracker";
import { useDispatch } from "react-redux";
import { clearCarePlans } from "../../../components/redux/slice/carePlans";
import { clearOutcomes } from "../../../components/redux/slice/outcomes";
import { OverviewTab } from "../Overview/OverviewTab";
import { PersonalTab } from "../Personal/PersonalTab";
import { MedicalTab } from "../Medical/MedicalTab";
import { NavTabs } from "../ClientComponent/NavTabs";
import {
  clearContacts,
  fetchContacts,
} from "../../../components/redux/slice/contacts";
import { clearDocuments } from "../../../components/redux/slice/documents";
import { clearRiskAssessments } from "../../../components/redux/slice/riskAssessments";
import { clearVisitSchedules } from "../../../components/redux/slice/visitSchedules";
import { clearCarePlanDocuments } from "../../../components/redux/slice/carePlanDocuments";
import { clearActivityLogs } from "../../../components/redux/slice/activityLogs";
import { HeaderTab } from "../ClientComponent/HeaderTab";
import { CommunicationTab } from "../Communication/CommunicationTab";
import { MessageSquare } from "lucide-react";

export function ClientProfileDetails({ client, onBack, onClientUpdate }) {
  const [activeTab, setActiveTab] = useState("overview");

  const dispatch = useDispatch();

  useEffect(() => {
    if (client?._id) {
      dispatch(fetchContacts(client._id));
    }

    return () => {
      dispatch(clearCarePlanDocuments());
      dispatch(clearCarePlans());
      dispatch(clearOutcomes());
      dispatch(clearContacts());
      dispatch(clearDocuments());
      dispatch(clearRiskAssessments());
      dispatch(clearVisitSchedules());
      dispatch(clearActivityLogs());
    };
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
        <CommunicationTab clientId={client._id} />
      )}

      {activeTab === "compliance" && (
        <ComplianceTracker client={client} compliance={client.compliance} />
      )}

      {activeTab === "activity-log" && <ActivityTab client={client} />}
    </div>
  );
}
