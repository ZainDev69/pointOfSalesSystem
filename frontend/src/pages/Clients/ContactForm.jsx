import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Heart,
  Users,
  Home,
} from "lucide-react";

export function ContactForm({ contact, onBack, onSave }) {
  const isEditing = !!contact;

  const [formData, setFormData] = useState({
    _id: contact?._id || undefined,
    name: contact?.name || "",
    relationship: contact?.relationship || "",
    contactType: contact?.contactType || "family",
    phone: contact?.phone || "",
    alternativePhone: contact?.alternativePhone || "",
    email: contact?.email || "",
    address: {
      line1: contact?.address?.line1 || "",
      line2: contact?.address?.line2 || "",
      city: contact?.address?.city || "",
      county: contact?.address?.county || "",
      postcode: contact?.address?.postcode || "",
      country: contact?.address?.country || "United Kingdom",
    },
    isRegularVisitor: contact?.isRegularVisitor || false,
    visitFrequency: contact?.visitFrequency || "",
    preferredContactTime: contact?.preferredContactTime || "",
    specialInstructions: contact?.specialInstructions || "",
    consentToContact: contact?.consentToContact || false,
    canReceiveUpdates: contact?.canReceiveUpdates || false,
    canMakeDecisions: contact?.canMakeDecisions || false,
    hasKeyAccess: contact?.hasKeyAccess || false,
    notes: contact?.notes || "",
    status: contact?.status || "active",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const contactData = {
      ...formData,
      addedDate: contact?.addedDate || new Date().toISOString(),
      lastContactDate: contact?.lastContactDate,
    };

    if (isEditing && contact) {
      onSave(formData);
    } else {
      onSave(contactData);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
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

  const ContactTypeIcon = getContactTypeIcon(formData.contactType);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <ContactTypeIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? "Edit Contact" : "Add New Contact"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditing
                ? "Update contact information and permissions"
                : "Add a family member, friend, or other important contact"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <User className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Relationship *
              </label>
              <input
                type="text"
                required
                value={formData.relationship}
                onChange={(e) => handleChange("relationship", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Son, Daughter, Best Friend, Neighbor"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Type *
              </label>
              <select
                required
                value={formData.contactType}
                onChange={(e) => handleChange("contactType", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="family">Family Member</option>
                <option value="friend">Friend</option>
                <option value="neighbor">Neighbor</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="no-contact">No Contact</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Phone className="w-5 h-5 text-gray-400" />
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
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+44 20 7123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alternative Phone
              </label>
              <input
                type="tel"
                value={formData.alternativePhone}
                onChange={(e) =>
                  handleChange("alternativePhone", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+44 7123 456789"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Contact Time
              </label>
              <input
                type="text"
                value={formData.preferredContactTime}
                onChange={(e) =>
                  handleChange("preferredContactTime", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Weekday evenings, Weekend mornings"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Address</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.address.line1}
                onChange={(e) => handleChange("address.line1", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Street address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.address.line2}
                onChange={(e) => handleChange("address.line2", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => handleChange("address.city", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                County
              </label>
              <input
                type="text"
                value={formData.address.county}
                onChange={(e) => handleChange("address.county", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="County"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode
              </label>
              <input
                type="text"
                value={formData.address.postcode}
                onChange={(e) =>
                  handleChange("address.postcode", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SW1A 1AA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) =>
                  handleChange("address.country", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="United Kingdom"
              />
            </div>
          </div>
        </div>

        {/* Visit Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              Visit Information
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isRegularVisitor"
                checked={formData.isRegularVisitor}
                onChange={(e) =>
                  handleChange("isRegularVisitor", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="isRegularVisitor"
                className="ml-2 block text-sm text-gray-900"
              >
                Regular visitor to the client
              </label>
            </div>

            {formData.isRegularVisitor && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visit Frequency
                </label>
                <select
                  value={formData.visitFrequency}
                  onChange={(e) =>
                    handleChange("visitFrequency", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                  <option value="occasionally">Occasionally</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions
              </label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) =>
                  handleChange("specialInstructions", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special instructions for contacting or visiting this person..."
              />
            </div>
          </div>
        </div>

        {/* Permissions & Access */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              Permissions & Access
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="consentToContact"
                  checked={formData.consentToContact}
                  onChange={(e) =>
                    handleChange("consentToContact", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="consentToContact"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Consent to contact about client
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canReceiveUpdates"
                  checked={formData.canReceiveUpdates}
                  onChange={(e) =>
                    handleChange("canReceiveUpdates", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="canReceiveUpdates"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Can receive care updates
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="canMakeDecisions"
                  checked={formData.canMakeDecisions}
                  onChange={(e) =>
                    handleChange("canMakeDecisions", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="canMakeDecisions"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Can make decisions for client
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasKeyAccess"
                  checked={formData.hasKeyAccess}
                  onChange={(e) =>
                    handleChange("hasKeyAccess", e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="hasKeyAccess"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Has key access to client's home
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Notes
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional notes about this contact..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? "Update Contact" : "Save Contact"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
