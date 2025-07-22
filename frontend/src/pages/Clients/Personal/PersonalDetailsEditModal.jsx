import React, { useState, useEffect } from "react";
import {
  X,
  Save,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
} from "lucide-react";

export function PersonalDetailsEditModal({
  isOpen,
  onClose,
  personalDetails,
  addressInformation,
  contactInformation,
  consent,
  onSave,
  isLoading = false,
}) {
  const [formData, setFormData] = useState({
    personalDetails: {
      title: "",
      fullName: "",
      preferredName: "",
      dateOfBirth: "",
      gender: "",
      nhsNumber: "",
      relationshipStatus: "",
      ethnicity: "",
    },
    addressInformation: {
      address: "",
      city: "",
      county: "",
      postCode: "",
      country: "United Kingdom",
      accessInstructions: "",
    },
    contactInformation: {
      primaryPhone: "",
      secondaryPhone: "",
      email: "",
      preferredContactMethod: "",
      bestTimeToContact: "",
    },
    consent: {
      photoConsent: false,
      dataProcessingConsent: false,
    },
  });

  useEffect(() => {
    if (
      personalDetails &&
      addressInformation &&
      contactInformation &&
      consent
    ) {
      setFormData({
        personalDetails: {
          title: personalDetails.title || "",
          fullName: personalDetails.fullName || "",
          preferredName: personalDetails.preferredName || "",
          dateOfBirth: personalDetails.dateOfBirth
            ? new Date(personalDetails.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: personalDetails.gender || "",
          nhsNumber: personalDetails.nhsNumber || "",
          relationshipStatus: personalDetails.relationshipStatus || "",
          ethnicity: personalDetails.ethnicity || "",
        },
        addressInformation: {
          address: addressInformation.address || "",
          city: addressInformation.city || "",
          county: addressInformation.county || "",
          postCode: addressInformation.postCode || "",
          country: addressInformation.country || "United Kingdom",
          accessInstructions: addressInformation.accessInstructions || "",
        },
        contactInformation: {
          primaryPhone: contactInformation.primaryPhone || "",
          secondaryPhone: contactInformation.secondaryPhone || "",
          email: contactInformation.email || "",
          preferredContactMethod:
            contactInformation.preferredContactMethod || "",
          bestTimeToContact: contactInformation.bestTimeToContact || "",
        },
        consent: {
          photoConsent: consent.photoConsent || false,
          dataProcessingConsent: consent.dataProcessingConsent || false,
        },
      });
    }
  }, [personalDetails, addressInformation, contactInformation, consent]);

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Personal Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Personal Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <User className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <select
                  value={formData.personalDetails.title}
                  onChange={(e) =>
                    handleChange("personalDetails", "title", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Title</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Miss">Miss</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                  <option value="Prof">Prof</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.personalDetails.fullName}
                  onChange={(e) =>
                    handleChange("personalDetails", "fullName", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Name
                </label>
                <input
                  type="text"
                  value={formData.personalDetails.preferredName}
                  onChange={(e) =>
                    handleChange(
                      "personalDetails",
                      "preferredName",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.personalDetails.dateOfBirth}
                  onChange={(e) =>
                    handleChange(
                      "personalDetails",
                      "dateOfBirth",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={formData.personalDetails.gender}
                  onChange={(e) =>
                    handleChange("personalDetails", "gender", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Other">Other</option>
                  <option value="Prefer Not to Say">Prefer Not to Say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NHS Number
                </label>
                <input
                  type="text"
                  value={formData.personalDetails.nhsNumber}
                  onChange={(e) =>
                    handleChange("personalDetails", "nhsNumber", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status
                </label>
                <select
                  value={formData.personalDetails.relationshipStatus}
                  onChange={(e) =>
                    handleChange(
                      "personalDetails",
                      "relationshipStatus",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Civil Partnership">Civil Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ethnicity
                </label>
                <input
                  type="text"
                  value={formData.personalDetails.ethnicity}
                  onChange={(e) =>
                    handleChange("personalDetails", "ethnicity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Address Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.addressInformation.address}
                  onChange={(e) =>
                    handleChange(
                      "addressInformation",
                      "address",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.addressInformation.city}
                  onChange={(e) =>
                    handleChange("addressInformation", "city", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  County
                </label>
                <input
                  type="text"
                  value={formData.addressInformation.county}
                  onChange={(e) =>
                    handleChange("addressInformation", "county", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Post Code
                </label>
                <input
                  type="text"
                  value={formData.addressInformation.postCode}
                  onChange={(e) =>
                    handleChange(
                      "addressInformation",
                      "postCode",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.addressInformation.country}
                  onChange={(e) =>
                    handleChange(
                      "addressInformation",
                      "country",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Instructions
                </label>
                <textarea
                  value={formData.addressInformation.accessInstructions}
                  onChange={(e) =>
                    handleChange(
                      "addressInformation",
                      "accessInstructions",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any special instructions for accessing the property..."
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactInformation.primaryPhone}
                  onChange={(e) =>
                    handleChange(
                      "contactInformation",
                      "primaryPhone",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactInformation.secondaryPhone}
                  onChange={(e) =>
                    handleChange(
                      "contactInformation",
                      "secondaryPhone",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.contactInformation.email}
                  onChange={(e) =>
                    handleChange("contactInformation", "email", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Contact Method
                </label>
                <select
                  value={formData.contactInformation.preferredContactMethod}
                  onChange={(e) =>
                    handleChange(
                      "contactInformation",
                      "preferredContactMethod",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Method</option>
                  <option value="Phone">Phone</option>
                  <option value="Email">Email</option>
                  <option value="Text">Text</option>
                  <option value="Post">Post</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Best Time to Contact
                </label>
                <select
                  value={formData.contactInformation.bestTimeToContact}
                  onChange={(e) =>
                    handleChange(
                      "contactInformation",
                      "bestTimeToContact",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Time</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                  <option value="Any Time">Any Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Consent & Permissions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Consent & Permissions
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="photoConsent"
                  checked={formData.consent.photoConsent}
                  onChange={(e) =>
                    handleChange("consent", "photoConsent", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="photoConsent"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Photo Consent - Client consents to having their photo taken
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="dataProcessingConsent"
                  checked={formData.consent.dataProcessingConsent}
                  onChange={(e) =>
                    handleChange(
                      "consent",
                      "dataProcessingConsent",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="dataProcessingConsent"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Data Processing Consent - Client consents to data processing
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{isLoading ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
