import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  FileText,
  Heart,
  Shield,
  Users,
  AlertTriangle,
  Calendar,
  Home,
  History,
} from "lucide-react";

import { ContactTab } from "../Contacts/ContactTab";
import { ActivityTab } from "../ActivityLog/ActivityTab";
import { RiskAssessmentManager } from "../RiskAssessments/RiskAssessmentManager";
import { CarePlanManager } from "../CarePlan/CarePlanManager";
import { VisitScheduleManager } from "../Visits/VisitScheduleManager";
import { DocumentationManager } from "../Documents/DocumentationManager";
import { ComplianceTracker } from "../Compliance/ComplianceTracker";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../../components/redux/slice/contacts";
import { getClient } from "../../../components/redux/slice/clients";
import { clearCarePlans } from "../../../components/redux/slice/carePlans";
import { clearOutcomes } from "../../../components/redux/slice/outcomes";
import Spinner from "../../../components/layout/Spinner";
import { fetchDocuments } from "../../../components/redux/slice/documents";
import { OverviewTab } from "../Overview/OverviewTab";
import { PersonalTab } from "../Personal/PersonalTab";
import { MedicalTab } from "../Medical/MedicalTab";
import { NavTabs } from "../ClientComponent/NavTabs";
import { clearContacts } from "../../../components/redux/slice/contacts";
import { clearDocuments } from "../../../components/redux/slice/documents";
import { clearRiskAssessments } from "../../../components/redux/slice/riskAssessments";
import { clearVisitSchedules } from "../../../components/redux/slice/visitSchedules";
import { clearCarePlanDocuments } from "../../../components/redux/slice/carePlanDocuments";

export function ClientProfileDetails({ client, onBack, onClientUpdate }) {
  const [activeTab, setActiveTab] = useState("overview");

  const loadingContacts = useSelector((state) => state.contacts.loading);
  const loadingDocuments = useSelector((state) => state.documents.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    if (client && client._id) {
      dispatch(fetchContacts(client._id));
    }

    // Cleanup function to clear care plans, outcomes, contacts, documents, risk assessments, and visit schedules when component unmounts
    return () => {
      dispatch(clearCarePlanDocuments());
      dispatch(clearCarePlans());
      dispatch(clearOutcomes());
      dispatch(clearContacts());
      dispatch(clearDocuments());
      dispatch(clearRiskAssessments());
      dispatch(clearVisitSchedules());
    };
  }, [client._id, dispatch]);

  useEffect(() => {
    if (activeTab === "activity-log" && client && client._id) {
      dispatch(getClient(client._id));
    }
  }, [activeTab, client?._id, dispatch]);

  useEffect(() => {
    if (client && client._id && activeTab === "documents") {
      dispatch(fetchDocuments(client._id));
    }
  }, [client._id, activeTab, dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {client.personalDetails.fullName || "Client Name"}
                </h2>
                <p className="text-blue-100">
                  NHS: {client.personalDetails.nhsNumber} • Age:{" "}
                  {client.personalDetails.dateOfBirth
                    ? Math.floor(
                        (new Date().getTime() -
                          new Date(
                            client.personalDetails.dateOfBirth
                          ).getTime()) /
                          (365.25 * 24 * 60 * 60 * 1000)
                      )
                    : "-"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg border border-green-300 border-opacity-50 backdrop-blur-sm transform hover:scale-105 transition-all duration-200">
                <div className="w-2.5 h-2.5 bg-white rounded-full mr-2 animate-pulse shadow-sm"></div>
                <span className="text-white drop-shadow-sm">
                  {client.personalDetails?.status || "No Status"}
                </span>
                <div className="ml-2 w-1 h-1 bg-white rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
      {activeTab === "contacts" &&
        (loadingContacts ? <Spinner /> : <ContactTab client={client} />)}

      {activeTab === "risk-assessments" && (
        <RiskAssessmentManager clientId={client._id} />
      )}

      {activeTab === "care-plan" && <CarePlanManager client={client} />}
      {activeTab === "visits" && <VisitScheduleManager clientId={client._id} />}

      {/* Show Spinner for documents tab if loading */}
      {activeTab === "documents" &&
        (loadingDocuments ? (
          <Spinner />
        ) : (
          <DocumentationManager client={client} />
        ))}

      {activeTab === "compliance" && (
        <ComplianceTracker client={client} compliance={client.compliance} />
      )}

      {activeTab === "activity-log" && <ActivityTab client={client} />}
    </div>
  );
}
