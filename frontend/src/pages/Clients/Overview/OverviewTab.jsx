import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "../../../components/redux/slice/contacts";
import {Calendar,MapPin,Phone,Mail,Heart,User,Shield,Users} from "lucide-react";

export function OverviewTab({ client }) {
  const dispatch = useDispatch();
  const { items: contacts } = useSelector((state) => state.contacts);
  const [emergencyContact, setEmergencyContact] = useState(null);

  useEffect(() => {
    if (client?._id) {
      dispatch(fetchContacts(client._id));
    }
  }, [dispatch, client?._id]);

  // Find emergency contact from family contacts
  useEffect(() => {
    if (contacts && contacts.length > 0) {
      // First try to find a family contact with canMakeDecisions
      let contact = contacts.find(
        (c) => c.contactType === "family" && c.canMakeDecisions
      );

      // If not found, get the first family contact
      if (!contact) {
        contact = contacts.find((c) => c.contactType === "family");
      }

      // If still not found, get the first active contact
      if (!contact) {
        contact = contacts.find((c) => c.status === "active");
      }

      setEmergencyContact(contact);
    }
  }, [contacts]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p className="text-gray-900 font-medium">
                      {client.personalDetails.fullName || "Not Specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </p>
                    <p className="text-gray-900 font-medium">
                      {client.personalDetails.dateOfBirth
                        ? new Date(
                            client.personalDetails.dateOfBirth
                          ).toLocaleDateString()
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900 font-medium">
                      {client.contactInformation.primaryPhone ||
                        "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900 font-medium">
                      {client.addressInformation.address || "Not Specified"}
                      <br />
                      {client.addressInformation.city}{" "}
                      {client.addressInformation.postCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">
                      {client.contactInformation.email || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-900">
                    {contacts.length}
                  </p>
                  <p className="text-sm text-blue-700 font-medium">Contacts</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-900">
                    {contacts.filter((c) => c.isRegularVisitor).length}
                  </p>
                  <p className="text-sm text-green-700 font-medium">
                    Regular Visitors
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-purple-900">
                    {contacts.filter((c) => c.canMakeDecisions).length}
                  </p>
                  <p className="text-sm text-purple-700 font-medium">
                    Decision Makers
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Emergency Contact */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Emergency Contact
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-gray-900">
                  {emergencyContact?.name || "Not Specified"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Relationship
                </p>
                <p className="text-gray-900">
                  {emergencyContact?.relationship || "Not Specified"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900">
                  {emergencyContact?.phone || "Not Specified"}
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                {emergencyContact?.canMakeDecisions && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Can Make Decisions
                  </span>
                )}
                {emergencyContact?.consentToContact && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                    Consent to Contact
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* GP Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                GP Information
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">GP Name</p>
                <p className="text-gray-900">
                  {client.healthcareContacts.gp.name || "Not Specified"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Surgery</p>
                <p className="text-gray-900">
                  {client.healthcareContacts?.surgery?.name || "Not Specified"}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900">
                  {client.healthcareContacts?.surgery?.phone || "Not Specified"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
