import React, { useState } from "react";
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
} from "lucide-react";
import { RiskAssessmentManager } from "./RiskAssessmentManager";
import { CarePlanManager } from "./CarePlanManager";
import { ContactForm } from "./ContactForm";
import { VisitScheduleManager } from "./VisitScheduleManager";
import { DocumentationManager } from "./DocumentationManager";
import { ComplianceTracker } from "./ComplianceTracker";

export function ClientProfileDetails({ client, onBack }) {
  console.log("The Client Data is", client);
  const [activeTab, setActiveTab] = useState("overview");
  const [contactView, setContactView] = useState("list");
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactFilter, setContactFilter] = useState("all");

  const mockContacts = [
    {
      id: "1",
      name: "John Thompson",
      relationship: "Son",
      contactType: "family",
      phone: "+44 20 7123 4568",
      email: "john.thompson@email.com",
      isRegularVisitor: true,
      visitFrequency: "weekly",
      consentToContact: true,
      canReceiveUpdates: true,
      canMakeDecisions: true,
      hasKeyAccess: true,
      status: "active",
      addedDate: "2024-01-15",
      lastContactDate: "2024-01-10",
    },
    {
      id: "2",
      name: "Sarah Thompson",
      relationship: "Daughter",
      contactType: "family",
      phone: "+44 20 7123 4569",
      alternativePhone: "+44 7123 456789",
      email: "sarah.thompson@email.com",
      isRegularVisitor: true,
      visitFrequency: "fortnightly",
      consentToContact: true,
      canReceiveUpdates: true,
      canMakeDecisions: false,
      hasKeyAccess: false,
      status: "active",
      addedDate: "2024-01-15",
    },
    {
      id: "3",
      name: "Mary Johnson",
      relationship: "Best Friend",
      contactType: "friend",
      phone: "+44 20 7123 4570",
      email: "mary.johnson@email.com",
      isRegularVisitor: true,
      visitFrequency: "weekly",
      preferredContactTime: "Weekday afternoons",
      consentToContact: true,
      canReceiveUpdates: false,
      canMakeDecisions: false,
      hasKeyAccess: false,
      status: "active",
      addedDate: "2024-01-20",
    },
    {
      id: "4",
      name: "Robert Smith",
      relationship: "Next Door Neighbor",
      contactType: "neighbor",
      phone: "+44 20 7123 4571",
      isRegularVisitor: false,
      consentToContact: true,
      canReceiveUpdates: false,
      canMakeDecisions: false,
      hasKeyAccess: true,
      specialInstructions: "Emergency contact only - has spare key",
      status: "active",
      addedDate: "2024-01-25",
    },
  ];

  const [contacts, setContacts] = useState(mockContacts);

  const handleAddContact = () => {
    setSelectedContact(null);
    setContactView("form");
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setContactView("form");
  };

  const handleSaveContact = (contactData) => {
    if ("id" in contactData) {
      // Update existing contact
      setContacts((prev) =>
        prev.map((c) => (c.id === contactData.id ? contactData : c))
      );
    } else {
      // Add new contact
      const newContact = {
        ...contactData,
        id: Date.now().toString(),
      };
      setContacts((prev) => [...prev, newContact]);
    }
    setContactView("list");
    setSelectedContact(null);
  };

  const handleBackToContactList = () => {
    setContactView("list");
    setSelectedContact(null);
  };

  const getContactTypeIcon = (type) => {
    switch (type) {
      case "family":
        return Heart;
      case "friend":
        return Users;
      case "neighbor":
        return Home;
      default:
        return User;
    }
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
              {client.FullName}
            </h1>
            <p className="text-gray-600 mt-1">
              NHS: {client.NHSNumber} • Age:{" "}
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
                      <p className="text-gray-900">{client.FullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date of Birth
                      </p>
                      <p className="text-gray-900">
                        {client.DateOfBirth
                          ? new Date(client.DateOfBirth).toLocaleDateString()
                          : "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">
                        {client.PhoneNumber || "Not specified"}
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
                        {client.Address || "123 Oak Street"}
                        <br />
                        {client.City || "London"}{" "}
                        {client.PostCode || "SW1A 1AA"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">
                        {client.EmailAddress || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* This needs to be updated */}
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                    <p className="text-sm text-gray-600">Contacts</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">Visits This Month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-gray-600">Documents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* This needs to be updated */}
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
                    {client.personalDetails?.nextOfKin?.name || "John Thompson"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Relationship
                  </p>
                  <p className="text-gray-900">
                    {client.personalDetails?.nextOfKin?.relationship || "Son"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">
                    {client.personalDetails?.nextOfKin?.phone ||
                      "+44 20 7123 4568"}
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  {client.personalDetails?.nextOfKin?.hasLegalAuthority && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Legal Authority
                    </span>
                  )}
                  {client.personalDetails?.nextOfKin?.powerOfAttorney && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      Power of Attorney
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* This needs to be updated */}
            {/* GP Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                GP Information
              </h3>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">GP Name</p>
                  <p className="text-gray-900">
                    {client.healthcareContacts?.gp?.name || "Dr. Sarah Wilson"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Practice</p>
                  <p className="text-gray-900">
                    {client.healthcareContacts?.gp?.organization ||
                      "Oakwood Medical Centre"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">
                    {client.healthcareContacts?.gp?.phone || "+44 20 7123 9999"}
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

      {/* I have to set it again. */}
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
                        {client.personalDetails?.title}{" "}
                        {client.personalDetails?.firstName}{" "}
                        {client.personalDetails?.lastName}
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
                        {client.personalDetails?.dateOfBirth
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
                        {client.personalDetails?.contactInformation
                          ?.primaryPhone || "Not specified"}
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
                        {client.personalDetails?.address?.line1 ||
                          "123 Oak Street"}
                        <br />
                        {client.personalDetails?.address?.city || "London"}{" "}
                        {client.personalDetails?.address?.postcode ||
                          "SW1A 1AA"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">
                        {client.personalDetails?.contactInformation?.email ||
                          "Not specified"}
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
                      {contactStats.total}
                    </p>
                    <p className="text-sm text-gray-600">Contacts</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-sm text-gray-600">Visits This Month</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                    <p className="text-sm text-gray-600">Documents</p>
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
                    {client.personalDetails?.nextOfKin?.name || "John Thompson"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Relationship
                  </p>
                  <p className="text-gray-900">
                    {client.personalDetails?.nextOfKin?.relationship || "Son"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">
                    {client.personalDetails?.nextOfKin?.phone ||
                      "+44 20 7123 4568"}
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-2">
                  {client.personalDetails?.nextOfKin?.hasLegalAuthority && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Legal Authority
                    </span>
                  )}
                  {client.personalDetails?.nextOfKin?.powerOfAttorney && (
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
                    {client.healthcareContacts?.gp?.name || "Dr. Sarah Wilson"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Practice</p>
                  <p className="text-gray-900">
                    {client.healthcareContacts?.gp?.organization ||
                      "Oakwood Medical Centre"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">
                    {client.healthcareContacts?.gp?.phone || "+44 20 7123 9999"}
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

      {activeTab === "contacts" && (
        <div className="space-y-6">
          {/* Contact Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {contactStats.total}
                </p>
                <p className="text-sm text-gray-600">Total Contacts</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {contactStats.family}
                </p>
                <p className="text-sm text-gray-600">Family</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {contactStats.friends}
                </p>
                <p className="text-sm text-gray-600">Friends</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {contactStats.neighbors}
                </p>
                <p className="text-sm text-gray-600">Neighbors</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {contactStats.regularVisitors}
                </p>
                <p className="text-sm text-gray-600">Regular Visitors</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {contactStats.keyHolders}
                </p>
                <p className="text-sm text-gray-600">Key Holders</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-indigo-600">
                  {contactStats.decisionMakers}
                </p>
                <p className="text-sm text-gray-600">Decision Makers</p>
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
                const ContactTypeIcon = getContactTypeIcon(contact.contactType);
                return (
                  <div
                    key={contact.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            contact.contactType === "family"
                              ? "bg-red-100"
                              : contact.contactType === "friend"
                              ? "bg-blue-100"
                              : contact.contactType === "neighbor"
                              ? "bg-green-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <ContactTypeIcon
                            className={`w-6 h-6 ${
                              contact.contactType === "family"
                                ? "text-red-600"
                                : contact.contactType === "friend"
                                ? "text-blue-600"
                                : contact.contactType === "neighbor"
                                ? "text-green-600"
                                : "text-gray-600"
                            }`}
                          />
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
      )}

      {activeTab === "risk-assessments" && (
        <RiskAssessmentManager
          clientId={client.id}
          assessments={client.riskAssessments || []}
          onAddAssessment={(assessment) =>
            console.log("Add assessment:", assessment)
          }
          onUpdateAssessment={(id, assessment) =>
            console.log("Update assessment:", id, assessment)
          }
        />
      )}

      {activeTab === "care-plan" && (
        <CarePlanManager
          clientId={client.id}
          carePlan={client.carePlan}
          onUpdateCarePlan={(carePlan) =>
            console.log("Update care plan:", carePlan)
          }
        />
      )}

      {activeTab === "visits" && (
        <VisitScheduleManager
          clientId={client.id}
          schedule={client.visitSchedule}
          onUpdateSchedule={(schedule) =>
            console.log("Update schedule:", schedule)
          }
        />
      )}

      {activeTab === "documents" && (
        <DocumentationManager
          clientId={client.id}
          documents={client.documentation}
          onAddDocument={(document) => console.log("Add document:", document)}
          onUpdateDocument={(id, document) =>
            console.log("Update document:", id, document)
          }
        />
      )}

      {activeTab === "compliance" && (
        <ComplianceTracker
          clientId={client.id}
          compliance={client.compliance}
          onUpdateCompliance={(compliance) =>
            console.log("Update compliance:", compliance)
          }
        />
      )}

      {![
        "overview",
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
