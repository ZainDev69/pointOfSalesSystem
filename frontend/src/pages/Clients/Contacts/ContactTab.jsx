import {
  Heart,
  Shield,
  Users,
  Calendar,
  Mail,
  Phone,
  Plus,
  Clock,
  MessageSquare,
  Edit3,
  MoreVertical,
  Trash,
  Bell,
  Home,
  User,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ContactForm } from "./ContactForm";
import {
  addContact,
  editContact,
  deleteContact,
} from "../../../components/redux/slice/contacts";
import toast from "react-hot-toast";

export function ContactTab({ client }) {
  const [contactFilter, setContactFilter] = useState("all");
  const [contactView, setContactView] = useState("list");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts.items) || [];

  const contactTypeIconMap = {
    family: { icon: Heart, bg: "bg-red-100", text: "text-red-600" },
    friend: { icon: Users, bg: "bg-blue-100", text: "text-blue-600" },
    neighbor: { icon: Home, bg: "bg-green-100", text: "text-green-600" },
    other: { icon: User, bg: "bg-gray-100", text: "text-gray-600" },
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contactFilter === "all" || contact.contactType === contactFilter
  );

  const getContactTypeIconStyles = (type) => {
    return contactTypeIconMap[type] || contactTypeIconMap["other"];
  };

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

  if (contactView === "form") {
    return (
      <ContactForm
        contact={selectedContact}
        onBack={handleBackToContactList}
        onSave={handleSaveContact}
      />
    );
  }

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
      {/* Contact Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
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

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-green-900">
                {contactStats.friends}
              </p>
              <p className="text-xs text-green-700 font-medium">Friends</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-purple-900">
                {contactStats.canReceiveUpdates}
              </p>
              <p className="text-xs text-purple-700 font-medium">Updates</p>
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200 p-3 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-amber-900">
                {contactStats.hasConsent}
              </p>
              <p className="text-xs text-amber-700 font-medium">Consent</p>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Family & Friends Contacts
              </h2>
              <p className="text-gray-600 mt-1">
                Manage and connect with client contacts
              </p>
            </div>
            <button
              onClick={handleAddContact}
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-full shadow-lg flex items-center space-x-2 text-base font-semibold transition-all duration-200"
              style={{ minWidth: 180 }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Contact</span>
            </button>
          </div>
          <div className="mb-6" />
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Contacts</option>
                <option value="family">Family</option>
                <option value="friend">Friends</option>
                <option value="neighbor">Neighbors</option>
                <option value="other">Other</option>
              </select>
            </div>
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

                        {contact.isRegularVisitor && contact.visitFrequency && (
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
      {showDeleteModal && <DeleteContactModal />}
    </div>
  );
}
