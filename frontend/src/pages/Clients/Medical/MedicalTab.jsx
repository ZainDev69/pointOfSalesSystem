import {
  Heart,
  AlertTriangle,
  Edit3,
  Pill,
  Brain,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateClient } from "../../../components/redux/slice/clients";
import toast from "react-hot-toast";
import { MedicalInfoEditModal } from "./MedicalInfoEditModal";
import { Button } from "../../../components/ui/Button";
import { Section } from "../../../components/ui/Section";

export function MedicalTab({ client, onClientUpdate }) {
  const [showMedicalEditModal, setShowMedicalEditModal] = useState(false);
  const [savingMedicalInfo, setSavingMedicalInfo] = useState(false);
  const dispatch = useDispatch();

  const handleEditMedicalInfo = () => setShowMedicalEditModal(true);

  const handleSaveMedicalInfo = async (medicalData) => {
    setSavingMedicalInfo(true);
    try {
      const updatedClient = { ...client, medicalInformation: medicalData };
      const result = await dispatch(
        updateClient({ clientId: client._id, clientData: updatedClient })
      ).unwrap();

      toast.success("Medical information updated successfully");
      setShowMedicalEditModal(false);
      if (onClientUpdate) onClientUpdate(result?.data?.client || result);
    } catch (error) {
      console.error("Error updating medical information:", error);
      toast.error("Failed to update medical information");
    } finally {
      setSavingMedicalInfo(false);
    }
  };

  return (
    <div>
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Medical Information
        </h2>
        <Button
          onClick={handleEditMedicalInfo}
          variant="default"
          icon={Edit3}
          style={{ minWidth: 180 }}
        >
          Edit Medical Info
        </Button>
      </div>

      <div className="flex flex-col space-y-6">
        {/* Medical Conditions */}
        <Section
          icon={<Heart className="w-6 h-6 text-red-500" />}
          title="Medical Conditions"
        >
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
                      <td className="px-2 py-2">{cond.diagnosisDate || "-"}</td>
                      <td className="px-3 py-2">{cond.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <Heart className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-gray-500">No medical conditions recorded.</p>
            </div>
          )}
        </Section>

        {/* Allergies */}
        <Section
          icon={<AlertTriangle className="w-5 h-5 text-yellow-500" />}
          title="Allergies"
        >
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
                  {client.medicalInformation.allergies.map((a, idx) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="px-3 py-2 font-semibold text-gray-900">
                        {a.allergen}
                      </td>
                      <td className="px-3 py-2">{a.reaction || "-"}</td>
                      <td className="px-3 py-2">
                        {a.severity && (
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              a.severity === "severe"
                                ? "bg-red-100 text-red-800"
                                : a.severity === "moderate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {a.severity}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">{a.treatment || "-"}</td>
                      <td className="px-3 py-2">{a.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center py-8">
              <AlertTriangle className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-gray-500">No allergies recorded.</p>
            </div>
          )}
        </Section>

        {/* Medications */}
        <Section
          icon={<Pill className="w-5 h-5 text-purple-500" />}
          title="Medications"
        >
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
                  {client.medicalInformation.medications.map((m, idx) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="px-3 py-2 font-semibold text-gray-900">
                        {m.name}
                      </td>
                      <td className="px-3 py-2">{m.dosage || "-"}</td>
                      <td className="px-3 py-2">{m.frequency || "-"}</td>
                      <td className="px-3 py-2">{m.route || "-"}</td>
                      <td className="px-3 py-2">{m.prescribedBy || "-"}</td>
                      <td className="px-3 py-2">{m.startDate || "-"}</td>
                      <td className="px-3 py-2">{m.indication || "-"}</td>
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
        </Section>

        {/* Mental Capacity */}
        <Section
          icon={<Brain className="w-5 h-5 text-blue-500" />}
          title="Mental Capacity"
        >
          {client.medicalInformation?.mentalCapacity ? (
            <>
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
                          client.medicalInformation.mentalCapacity.hasCapacity
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {client.medicalInformation.mentalCapacity.hasCapacity
                          ? "Yes"
                          : "No"}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {client.medicalInformation.mentalCapacity
                        .assessmentDate || "-"}
                    </td>
                    <td className="px-3 py-2">
                      {client.medicalInformation.mentalCapacity.assessedBy ||
                        "-"}
                    </td>
                    <td className="px-3 py-2">
                      {client.medicalInformation.mentalCapacity.reviewDate ||
                        "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {client.medicalInformation.mentalCapacity.notes && (
                <div>
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
        </Section>

        {/* DNR */}
        <Section
          icon={<ShieldCheck className="w-5 h-5 text-gray-700" />}
          title="DNR (Do Not Resuscitate)"
        >
          {client.medicalInformation?.dnr ? (
            <>
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
                          client.medicalInformation.dnr.hasDNR
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {client.medicalInformation.dnr.hasDNR ? "Yes" : "No"}
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
                    <td className="px-3 py-2">
                      {client.medicalInformation.dnr.reviewDate || "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
              {client.medicalInformation.dnr.notes && (
                <div>
                  <span className="font-medium">Notes:</span>{" "}
                  {client.medicalInformation.dnr.notes}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center py-8">
              <ShieldCheck className="w-10 h-10 text-gray-200 mb-2" />
              <p className="text-gray-500">No DNR status recorded.</p>
            </div>
          )}
        </Section>
      </div>

      {/* Edit Modal */}
      {showMedicalEditModal && (
        <MedicalInfoEditModal
          isOpen={showMedicalEditModal}
          onClose={() => setShowMedicalEditModal(false)}
          medicalInfo={client.medicalInformation}
          onSave={handleSaveMedicalInfo}
          isLoading={savingMedicalInfo}
        />
      )}
    </div>
  );
}
