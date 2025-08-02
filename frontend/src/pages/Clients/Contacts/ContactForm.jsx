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
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { TextArea } from "../../../components/ui/TextArea";
import { Checkbox } from "../../../components/ui/Checkbox";
import { Section } from "../../../components/ui/Section";
import { useSelector } from "react-redux";
import { formatOptionLabel } from "../../../utils/formatOptionLabel";

export function ContactForm({ contact, onBack, onSave }) {
  const isEditing = !!contact;

  const { contactOptions, contactOptionsLoading } = useSelector(
    (state) => state.contacts
  );

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const contactData = {
      ...formData,
      addedDate: contact?.addedDate || new Date().toISOString(),
      lastContactDate: contact?.lastContactDate,
    };
    isEditing ? onSave(formData) : onSave(contactData);
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
      {/* Header */}
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
        <Section
          icon={<User className="w-5 h-5 text-gray-400" />}
          title="Basic Information"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              value={formData.name}
              onChange={(val) => handleChange("name", val)}
              placeholder="Enter full name"
              required
            />
            <Input
              label="Relationship *"
              value={formData.relationship}
              onChange={(val) => handleChange("relationship", val)}
              placeholder="e.g., Son, Daughter, Best Friend, Neighbor"
              required
            />
            <select
              disabled={contactOptionsLoading}
              value={formData.contactType}
              onChange={(val) => handleChange("contactType", val)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Contact Type</option>
              {contactOptions.types?.map((t) => (
                <option key={t} value={t}>
                  {formatOptionLabel(t)}
                </option>
              ))}
            </select>

            <select
              disabled={contactOptionsLoading}
              value={formData.status}
              onChange={(val) => handleChange("status", val)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Contact Status</option>
              {contactOptions.status?.map((t) => (
                <option key={t} value={t}>
                  {formatOptionLabel(t)}
                </option>
              ))}
            </select>
          </div>
        </Section>

        {/* Contact Info */}
        <Section
          icon={<Phone className="w-5 h-5 text-gray-400" />}
          title="Contact Information"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Primary Phone"
              value={formData.phone}
              onChange={(val) => handleChange("phone", val)}
              placeholder="+44 20 7123 4567"
              type="tel"
            />
            <Input
              label="Alternative Phone"
              value={formData.alternativePhone}
              onChange={(val) => handleChange("alternativePhone", val)}
              placeholder="+44 7123 456789"
              type="tel"
            />
            <Input
              full
              label="Email Address"
              value={formData.email}
              onChange={(val) => handleChange("email", val)}
              placeholder="contact@example.com"
              type="email"
            />
            <Input
              label="Preferred Contact Time"
              value={formData.preferredContactTime}
              onChange={(val) => handleChange("preferredContactTime", val)}
              placeholder="e.g., Weekday evenings, Weekend mornings"
            />
          </div>
        </Section>

        {/* Address */}
        <Section
          icon={<MapPin className="w-5 h-5 text-gray-400" />}
          title="Address"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              full
              label="Address Line 1"
              value={formData.address.line1}
              onChange={(val) => handleChange("address.line1", val)}
              placeholder="Street address"
            />
            <Input
              full
              label="Address Line 2"
              value={formData.address.line2}
              onChange={(val) => handleChange("address.line2", val)}
              placeholder="Apartment, suite, etc. (optional)"
            />
            <Input
              label="City"
              value={formData.address.city}
              onChange={(val) => handleChange("address.city", val)}
              placeholder="City"
            />
            <Input
              label="County"
              value={formData.address.county}
              onChange={(val) => handleChange("address.county", val)}
              placeholder="County"
            />
            <Input
              label="Postcode"
              value={formData.address.postcode}
              onChange={(val) => handleChange("address.postcode", val)}
              placeholder="SW1A 1AA"
            />
            <Input
              label="Country"
              value={formData.address.country}
              onChange={(val) => handleChange("address.country", val)}
              placeholder="United Kingdom"
            />
          </div>
        </Section>

        {/* Visit Info */}
        <Section
          icon={<Calendar className="w-5 h-5 text-gray-400" />}
          title="Visit Information"
        >
          <Checkbox
            id="isRegularVisitor"
            label="Regular visitor to the client"
            checked={formData.isRegularVisitor}
            onChange={(val) => handleChange("isRegularVisitor", val)}
          />
          {formData.isRegularVisitor && (
            <Select
              label="Visit Frequency"
              value={formData.visitFrequency}
              onChange={(val) => handleChange("visitFrequency", val)}
              options={[
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
                { label: "Fortnightly", value: "fortnightly" },
                { label: "Monthly", value: "monthly" },
                { label: "Occasionally", value: "occasionally" },
              ]}
            />
          )}
          <TextArea
            label="Special Instructions"
            value={formData.specialInstructions}
            onChange={(val) => handleChange("specialInstructions", val)}
            placeholder="Any special instructions for contacting or visiting this person..."
          />
        </Section>

        {/* Permissions */}
        <Section
          icon={<Shield className="w-5 h-5 text-gray-400" />}
          title="Permissions & Access"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              id="consentToContact"
              label="Consent to contact about client"
              checked={formData.consentToContact}
              onChange={(val) => handleChange("consentToContact", val)}
            />
            <Checkbox
              id="canReceiveUpdates"
              label="Can receive care updates"
              checked={formData.canReceiveUpdates}
              onChange={(val) => handleChange("canReceiveUpdates", val)}
            />
            <Checkbox
              id="canMakeDecisions"
              label="Can make decisions for client"
              checked={formData.canMakeDecisions}
              onChange={(val) => handleChange("canMakeDecisions", val)}
            />
            <Checkbox
              id="hasKeyAccess"
              label="Has key access to client's home"
              checked={formData.hasKeyAccess}
              onChange={(val) => handleChange("hasKeyAccess", val)}
            />
          </div>
        </Section>

        {/* Notes */}
        <Section title="Additional Notes">
          <TextArea
            label="Notes"
            value={formData.notes}
            onChange={(val) => handleChange("notes", val)}
            placeholder="Any additional notes about this contact..."
            rows={4}
          />
        </Section>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <Button
            type="submit"
            variant="default"
            style={{ minWidth: 180 }}
            icon={Save}
          >
            {isEditing ? "Update Contact" : "Save Contact"}
          </Button>
        </div>
      </form>
    </div>
  );
}
