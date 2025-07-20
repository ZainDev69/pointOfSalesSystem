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
  Mail,
  MapPin,
  Phone,
  Home,
  Plus,
  Clock,
  MessageSquare,
  Edit3,
  MoreVertical,
  Pill,
  Brain,
  ShieldCheck,
  FileQuestion,
  Trash,
  Bell,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { RiskAssessmentManager } from "./RiskAssessmentManager";
import { CarePlanManager } from "./CarePlanManager";
import { ContactForm } from "./ContactForm";
import { VisitScheduleManager } from "./VisitScheduleManager";
import { DocumentationManager } from "./DocumentationManager";
import { ComplianceTracker } from "./ComplianceTracker";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContacts,
  addContact,
  editContact,
  deleteContact,
} from "../../components/redux/slice/contacts";
import { clearCarePlans } from "../../components/redux/slice/carePlans";
import { clearOutcomes } from "../../components/redux/slice/outcomes";
import Spinner from "../../components/layout/Spinner";

export function ClientProfileDetails({ client, onBack }) {
  console.log("The Client Data is", client);
  const [activeTab, setActiveTab] = useState("overview");
  const [contactView, setContactView] = useState("list");
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactFilter, setContactFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const dispatch = useDispatch();

  const contacts = useSelector((state) => state.contacts.items) || [];
  const loadingContacts = useSelector((state) => state.contacts.loading);

  useEffect(() => {
    if (client && client._id) {
      dispatch(fetchContacts(client._id));
    }

    // Cleanup function to clear care plans and outcomes when component unmounts
    return () => {
      dispatch(clearCarePlans());
      dispatch(clearOutcomes());
    };
  }, [client._id, dispatch]);

  const handleAddContact = () => {
    setSelectedContact(null);
    setContactView("form");
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setContactView("form");
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (contactData._id) {
        await dispatch(
          editContact({
            clientId: client._id,
            contactId: contactData._id,
            contactData,
          })
        ).unwrap();
        toast.success("Contact updated successfully");
      } else {
        await dispatch(
          addContact({
            clientId: client._id,
            contactData,
          })
        ).unwrap();
        toast.success("Contact added successfully");
      }
      setContactView("list");
      setSelectedContact(null);
    } catch {
      toast.error("Something went wrong while saving the contact");
    }
  };

  const handleDeleteContact = (contactId) => {
    setContactToDelete(contactId);
    setShowDeleteModal(true);
  };

  const confirmDeleteContact = async () => {
    try {
      await dispatch(
        deleteContact({ clientId: client._id, contactId: contactToDelete })
      ).unwrap();
      toast.success("Contact deleted");
    } catch {
      toast.error("Failed to delete contact");
    } finally {
      setShowDeleteModal(false);
      setContactToDelete(null);
    }
  };

  const cancelDeleteContact = () => {
    setShowDeleteModal(false);
    setContactToDelete(null);
  };

  const handleBackToContactList = () => {
    setContactView("list");
    setSelectedContact(null);
  };

  const contactTypeIconMap = {
    family: { icon: Heart, bg: "bg-red-100", text: "text-red-600" },
    friend: { icon: Users, bg: "bg-blue-100", text: "text-blue-600" },
    neighbor: { icon: Home, bg: "bg-green-100", text: "text-green-600" },
    other: { icon: User, bg: "bg-gray-100", text: "text-gray-600" },
  };

  const getContactTypeIconStyles = (type) => {
    return contactTypeIconMap[type] || contactTypeIconMap["other"];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "no-contact":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contactFilter === "all" || contact.contactType === contactFilter
  );

  const contactStats = {
    total: contacts.length,
    family: contacts.filter((c) => c.contactType === "family").length,
    friends: contacts.filter((c) => c.contactType === "friend").length,
    neighbors: contacts.filter((c) => c.contactType === "neighbor").length,
    regularVisitors: contacts.filter((c) => c.isRegularVisitor).length,
    keyHolders: contacts.filter((c) => c.hasKeyAccess).length,
    decisionMakers: contacts.filter((c) => c.canMakeDecisions).length,
    canReceiveUpdates: contacts.filter((c) => c.canReceiveUpdates).length,
    hasConsent: contacts.filter((c) => c.consentToContact).length,
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "personal", label: "Personal Details", icon: User },
    { id: "medical", label: "Medical Information", icon: Heart },
    { id: "care-plan", label: "Care Plan", icon: Shield },
    { id: "contacts", label: "Family & Friends", icon: Users },
    { id: "risk-assessments", label: "Risk Assessments", icon: AlertTriangle },
    { id: "visits", label: "Visit Schedule", icon: Calendar },
    { id: "documents", label: "Documentation", icon: FileText },
    { id: "compliance", label: "Compliance", icon: Shield },
  ];

  if (contactView === "form") {
    return (
      <ContactForm
        contact={selectedContact}
        onBack={handleBackToContactList}
        onSave={handleSaveContact}
      />
    );
  }

  const InfoBlock = ({ label, children }) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-900">{children}</p>
    </div>
  );

  const DeleteContactModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Delete Contact?
        </h2>
        <p className="text-gray-700 mb-4">
          Are you sure you want to delete this contact? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={cancelDeleteContact}
            className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteContact}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
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
              {client.personalDetails.fullName}
            </h1>
            <p className="text-gray-600 mt-1">
              NHS: {client.personalDetails.nhsNumber} • Age:{" "}
              {client.personalDetails.dateOfBirth
                ? Math.floor(
                    (new Date().getTime() -
                      new Date(client.personalDetails.dateOfBirth).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  )
                : "-"}
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
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Full Name
                      </p>
                      <p className="text-gray-900">
                        {client.personalDetails.fullName || "Not Specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date of Birth
                      </p>
                      <p className="text-gray-900">
                        {client.personalDetails.dateOfBirth
                          ? new Date(
                              client.personalDetails.dateOfBirth
                            ).toLocaleDateString()
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">
                        {client.contactInformation.primaryPhone ||
                          "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-gray-900">
                        {client.addressInformation.address || "Not Specified"}
                        <br />
                        {client.addressInformation.city}{" "}
                        {client.addressInformation.postCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">
                        {client.contactInformation.email || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {contacts.length}
                    </p>
                    <p className="text-sm text-gray-600">Contacts</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {contacts.filter((c) => c.isRegularVisitor).length}
                    </p>
                    <p className="text-sm text-gray-600">Regular Visitors</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {contacts.filter((c) => c.canMakeDecisions).length}
                    </p>
                    <p className="text-sm text-gray-600">Decision Makers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Next of Kin */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Next of Kin
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">
                    {client.nextOfKin.name || "Not Specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Relationship
                  </p>
                  <p className="text-gray-900">
                    {client.nextOfKin.relationship || "Not Specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">
                    {client.nextOfKin.phone || "Not Specified"}
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  {client.nextOfKin.hasLegalAuthority && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Legal Authority
                    </span>
                  )}
                  {client.nextOfKin.powerOfAttorney && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      Power of Attorney
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* GP Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                GP Information
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">GP Name</p>
                  <p className="text-gray-900">
                    {client.healthcareContacts.gp.name || "Not Specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Practice</p>
                  <p className="text-gray-900">
                    {client.healthcareContacts?.gp?.organization ||
                      "Not Specified"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">
                    {client.healthcareContacts?.gp?.phone || "Not Specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-colors">
                  Schedule Visit
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors">
                  Update Care Plan
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg transition-colors">
                  Generate Report
                </button>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors">
                  Contact Family
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "personal" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-4">
                <InfoBlock label="Title">
                  {client.personalDetails?.title || "Not specified"}
                </InfoBlock>
                <InfoBlock label="Gender">
                  {client.personalDetails?.gender || "Not specified"}
                </InfoBlock>
                <InfoBlock label="Ethnicity">
                  {client.personalDetails?.ethnicity || "Not specified"}
                </InfoBlock>
                <InfoBlock label="Languages">
                  {Array.isArray(
                    client?.preferences?.cultural?.languagePreferences
                  ) ? (
                    client.preferences.cultural.languagePreferences.length >
                    0 ? (
                      <div className="flex flex-wrap gap-2">
                        {client.preferences.cultural.languagePreferences.map(
                          (lang, idx) => (
                            <span
                              key={idx}
                              className="mt-2 px-3 py-1 rounded-md border border-blue-500 bg-green-50 text-blue-500 text-sm font-medium"
                            >
                              {lang}
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      "Not specified"
                    )
                  ) : (
                    client?.preferences?.cultural?.languagePreferences ||
                    "Not specified"
                  )}
                </InfoBlock>
              </div>
              <div className="space-y-4">
                <InfoBlock label="Preferred Name">
                  {client.personalDetails?.preferredName || "Not specified"}
                </InfoBlock>
                <InfoBlock label="Marital Status">
                  {client.personalDetails?.relationshipStatus ||
                    "Not specified"}
                </InfoBlock>
                <InfoBlock label="Nationality">
                  {client.addressInformation?.country || "Not specified"}
                </InfoBlock>
              </div>
            </div>
          </div>

          {/* Address & Access */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Address & Access
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <InfoBlock label="Full Address">
                {client.addressInformation?.address || "Not specified"}
                <br />
                {client.addressInformation?.city && (
                  <>{client.addressInformation.city}, </>
                )}
                {client.addressInformation?.postCode && (
                  <>
                    {client.addressInformation.postCode}
                    <br />
                  </>
                )}
                {client.addressInformation?.country || ""}
              </InfoBlock>
              <InfoBlock label="Access Instructions">
                {client.addressInformation?.accessInstructions ||
                  "Not specified"}
              </InfoBlock>
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Preferences
            </h3>
            <div className="space-y-4">
              <InfoBlock label="Preferred Contact Method">
                {client.contactInformation?.preferredContactMethod ||
                  "Not specified"}
              </InfoBlock>
              <InfoBlock label="Best Time to Contact">
                {client.contactInformation?.bestTimeToContact ||
                  "Not specified"}
              </InfoBlock>
              <InfoBlock label="Secondary Phone">
                {client.contactInformation?.secondaryPhone || "Not specified"}
              </InfoBlock>
            </div>
          </div>

          {/* Consent & Permissions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Consent & Permissions
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Photo Consent
                </span>
                {client.consent?.photoConsent ? (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                    Granted
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
                    Not Granted
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Data Processing Consent
                </span>
                {client.consent?.dataProcessingConsent ? (
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                    Granted
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-semibold">
                    Not Granted
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "medical" && (
        <div>
          {/* Medical Conditions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4 space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Medical Conditions
              </h3>
            </div>
            <div>
              {client.medicalInformation?.conditions?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Condition
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Severity
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Status
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Diagnosed
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.medicalInformation.conditions.map((cond, idx) => (
                        <tr key={idx} className="border-b last:border-b-0">
                          <td className="px-3 py-2 font-semibold text-gray-900">
                            {cond.condition}
                          </td>
                          <td className="px-3 py-2">
                            {cond.severity && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  cond.severity === "severe"
                                    ? "bg-red-100 text-red-800"
                                    : cond.severity === "moderate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {cond.severity}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2">
                            {cond.status && (
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  cond.status === "active"
                                    ? "bg-blue-100 text-blue-800"
                                    : cond.status === "resolved"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-purple-100 text-purple-800"
                                }`}
                              >
                                {cond.status}
                              </span>
                            )}
                          </td>
                          <td className="px-2 py-2">
                            {cond.diagnosisDate || "-"}
                          </td>
                          <td className="px-3 py-2">{cond.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <Heart className="w-10 h-10 text-gray-200 mb-2" />
                  <p className="text-gray-500">
                    No medical conditions recorded.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Allergies Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4 space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold text-gray-900">Allergies</h3>
            </div>
            <div>
              {client.medicalInformation?.allergies?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Allergen
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Reaction
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Severity
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Treatment
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.medicalInformation.allergies.map(
                        (allergy, idx) => (
                          <tr key={idx} className="border-b last:border-b-0">
                            <td className="px-3 py-2 font-semibold text-gray-900">
                              {allergy.allergen}
                            </td>
                            <td className="px-3 py-2">
                              {allergy.reaction || "-"}
                            </td>
                            <td className="px-3 py-2">
                              {allergy.severity && (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    allergy.severity === "severe"
                                      ? "bg-red-100 text-red-800"
                                      : allergy.severity === "moderate"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {allergy.severity}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {allergy.treatment || "-"}
                            </td>
                            <td className="px-3 py-2">
                              {allergy.notes || "-"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <AlertTriangle className="w-10 h-10 text-gray-200 mb-2" />
                  <p className="text-gray-500">No allergies recorded.</p>
                </div>
              )}
            </div>
          </div>

          {/* Medications Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4 space-x-2">
              <Pill className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Medications
              </h3>
            </div>
            <div>
              {client.medicalInformation?.medications?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Dosage
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Frequency
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Route
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Prescribed By
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Start Date
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Indication
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {client.medicalInformation.medications.map((med, idx) => (
                        <tr key={idx} className="border-b last:border-b-0">
                          <td className="px-3 py-2 font-semibold text-gray-900">
                            {med.name}
                          </td>
                          <td className="px-3 py-2">{med.dosage || "-"}</td>
                          <td className="px-3 py-2">{med.frequency || "-"}</td>
                          <td className="px-3 py-2">{med.route || "-"}</td>
                          <td className="px-3 py-2">
                            {med.prescribedBy || "-"}
                          </td>
                          <td className="px-3 py-2">{med.startDate || "-"}</td>
                          <td className="px-3 py-2">{med.indication || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <Pill className="w-10 h-10 text-gray-200 mb-2" />
                  <p className="text-gray-500">No medications recorded.</p>
                </div>
              )}
            </div>
          </div>

          {/* Mental Capacity Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4 space-x-2">
              <Brain className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Mental Capacity
              </h3>
            </div>
            <div>
              {client.medicalInformation?.mentalCapacity ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm mb-4">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Has Capacity
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Assessment Date
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Assessed By
                          </th>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">
                            Review Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b last:border-b-0">
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                client.medicalInformation.mentalCapacity
                                  .hasCapacity
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {client.medicalInformation.mentalCapacity
                                .hasCapacity
                                ? "Yes"
                                : "No"}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            {client.medicalInformation.mentalCapacity
                              .assessmentDate || "-"}
                          </td>
                          <td className="px-3 py-2">
                            {client.medicalInformation.mentalCapacity
                              .assessedBy || "-"}
                          </td>
                          <td className="px-3 py-2">
                            {client.medicalInformation.mentalCapacity
                              .reviewDate || "-"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {client.medicalInformation.mentalCapacity.notes && (
                    <div className="mt-2">
                      <span className="font-medium">Notes:</span>{" "}
                      {client.medicalInformation.mentalCapacity.notes}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <Brain className="w-10 h-10 text-gray-200 mb-2" />
                  <p className="text-gray-500">
                    No mental capacity assessment recorded.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* DNR Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center mb-4 space-x-2">
              <ShieldCheck className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                DNR (Do Not Resuscitate)
              </h3>
            </div>
            <div>
              {client.medicalInformation?.dnr ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm mb-4">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Has DNR
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Date Issued
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Issued By
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Location
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-gray-700">
                          Family Aware
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b last:border-b-0">
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              client.medicalInformation.dnr.hasDNR
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {client.medicalInformation.dnr.hasDNR
                              ? "Yes"
                              : "No"}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          {client.medicalInformation.dnr.dateIssued || "-"}
                        </td>
                        <td className="px-3 py-2">
                          {client.medicalInformation.dnr.issuedBy || "-"}
                        </td>
                        <td className="px-3 py-2">
                          {client.medicalInformation.dnr.location || "-"}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              client.medicalInformation.dnr.familyAware
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {client.medicalInformation.dnr.familyAware
                              ? "Yes"
                              : "No"}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {client.medicalInformation.dnr.notes && (
                    <div className="mt-2">
                      <span className="font-medium">Notes:</span>{" "}
                      {client.medicalInformation.dnr.notes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center py-8">
                  <ShieldCheck className="w-10 h-10 text-gray-200 mb-2" />
                  <p className="text-gray-500">No DNR status recorded.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "contacts" && loadingContacts ? (
        <Spinner />
      ) : (
        activeTab === "contacts" && (
          <div className="space-y-6">
            {/* Contact Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {/* Total Contacts */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-blue-900">
                      {contactStats.total}
                    </p>
                    <p className="text-xs text-blue-700 font-medium">Total</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Family */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-red-900">
                      {contactStats.family}
                    </p>
                    <p className="text-xs text-red-700 font-medium">Family</p>
                  </div>
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Friends */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-green-900">
                      {contactStats.friends}
                    </p>
                    <p className="text-xs text-green-700 font-medium">
                      Friends
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Can Receive Updates */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-purple-900">
                      {contactStats.canReceiveUpdates}
                    </p>
                    <p className="text-xs text-purple-700 font-medium">
                      Updates
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Has Consent */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-3 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-amber-900">
                      {contactStats.hasConsent}
                    </p>
                    <p className="text-xs text-amber-700 font-medium">
                      Consent
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Management */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Family & Friends Contacts
                    </h3>
                    <div className="flex items-center space-x-2">
                      <select
                        value={contactFilter}
                        onChange={(e) => setContactFilter(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Contacts</option>
                        <option value="family">Family</option>
                        <option value="friend">Friends</option>
                        <option value="neighbor">Neighbors</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleAddContact}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Contact</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => {
                  const {
                    icon: ContactTypeIcon,
                    bg,
                    text,
                  } = getContactTypeIconStyles(contact.contactType);

                  return (
                    <div
                      key={contact._id}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${bg}`}
                          >
                            <ContactTypeIcon className={`w-6 h-6 ${text}`} />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 className="text-lg font-medium text-gray-900">
                                {contact.name}
                              </h4>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  contact.status
                                )}`}
                              >
                                {contact.status}
                              </span>
                              {contact.isRegularVisitor && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Regular Visitor
                                </span>
                              )}
                              {contact.hasKeyAccess && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  Key Holder
                                </span>
                              )}
                              {contact.canMakeDecisions && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  Decision Maker
                                </span>
                              )}
                              {contact.canReceiveUpdates && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 flex items-center">
                                  <Bell className="w-3 h-3 mr-1" />
                                  Updates
                                </span>
                              )}
                              {contact.consentToContact && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex items-center">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Consent
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                              {contact.relationship} •{" "}
                              {contact.contactType.charAt(0).toUpperCase() +
                                contact.contactType.slice(1)}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-600">
                              {contact.phone && (
                                <div className="flex items-center">
                                  <Phone className="w-4 h-4 mr-1" />
                                  <span>{contact.phone}</span>
                                </div>
                              )}

                              {contact.email && (
                                <div className="flex items-center">
                                  <Mail className="w-4 h-4 mr-1" />
                                  <span>{contact.email}</span>
                                </div>
                              )}

                              {contact.isRegularVisitor &&
                                contact.visitFrequency && (
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    <span>Visits {contact.visitFrequency}</span>
                                  </div>
                                )}

                              {contact.lastContactDate && (
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  <span>
                                    Last contact:{" "}
                                    {new Date(
                                      contact.lastContactDate
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {contact.specialInstructions && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-700 italic">
                                  "{contact.specialInstructions}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {contact.phone && (
                            <button
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Call"
                            >
                              <Phone className="w-4 h-4" />
                            </button>
                          )}

                          {contact.email && (
                            <button
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Email"
                            >
                              <Mail className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Log Contact"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleEditContact(contact)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Contact"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteContact(contact._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Contact"
                          >
                            <Trash className="w-4 h-4" />
                          </button>

                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredContacts.length === 0 && (
                  <div className="p-8 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No contacts found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {contactFilter === "all"
                        ? "No family or friends contacts have been added yet."
                        : `No ${contactFilter} contacts found.`}
                    </p>
                    <button
                      onClick={handleAddContact}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add First Contact</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}

      {activeTab === "risk-assessments" && (
        <RiskAssessmentManager
          clientId={client._id}
          assessments={client.riskAssessments || []}
          onAddAssessment={(assessment) =>
            console.log("Add assessment:", assessment)
          }
          onUpdateAssessment={(id, assessment) =>
            console.log("Update assessment:", id, assessment)
          }
        />
      )}

      {activeTab === "care-plan" && <CarePlanManager clientId={client._id} />}

      {activeTab === "visits" && (
        <VisitScheduleManager
          clientId={client._id}
          schedule={client.visitSchedule}
          onUpdateSchedule={(schedule) =>
            console.log("Update schedule:", schedule)
          }
        />
      )}

      {activeTab === "documents" && (
        <DocumentationManager
          clientId={client._id}
          documents={client.documentation}
          onAddDocument={(document) => console.log("Add document:", document)}
          onUpdateDocument={(id, document) =>
            console.log("Update document:", id, document)
          }
        />
      )}

      {activeTab === "compliance" && (
        <ComplianceTracker
          clientId={client._id}
          compliance={client.compliance}
          onUpdateCompliance={(compliance) =>
            console.log("Update compliance:", compliance)
          }
        />
      )}

      {showDeleteModal && <DeleteContactModal />}

      {![
        "overview",
        "personal",
        "medical",
        "contacts",
        "risk-assessments",
        "care-plan",
        "visits",
        "documents",
        "compliance",
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
