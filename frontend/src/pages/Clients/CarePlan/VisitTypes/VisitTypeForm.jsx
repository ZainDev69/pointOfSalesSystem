import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../../components/ui/Button";
import {
  createVisitType,
  updateVisitType,
  fetchRequiredTaskOptions,
} from "../../../../components/redux/slice/visitTypes";
import { X } from "lucide-react";

export function VisitTypeForm({
  visitType = null,
  onSave,
  onCancel,
  clientId,
}) {
  const dispatch = useDispatch();
  const { requiredTaskOptions = [], loading } = useSelector(
    (state) => state.visitTypes
  );

  // New form state: name, requiredTasks [{task, notes}]
  const [name, setName] = useState(visitType?.name || "");
  const [requiredTasks, setRequiredTasks] = useState(
    visitType?.requiredTasks?.length
      ? visitType.requiredTasks.map((row) => ({
          task: row.task || row, // support old data
          notes: row.notes || "",
        }))
      : [
          {
            task: "",
            notes: "",
          },
        ]
  );

  useEffect(() => {
    dispatch(fetchRequiredTaskOptions());
  }, [dispatch]);

  // Add a new required task row
  const addTaskRow = () => {
    setRequiredTasks((prev) => [...prev, { task: "", notes: "" }]);
  };

  // Remove a required task row
  const removeTaskRow = (idx) => {
    setRequiredTasks((prev) => prev.filter((_, i) => i !== idx));
  };

  // Update a task or notes in a row
  const updateTaskRow = (idx, field, value) => {
    setRequiredTasks((prev) =>
      prev.map((row, i) =>
        i === idx
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  // Get available options for a select (exclude already selected except current row)
  const getAvailableOptions = (idx) => {
    const selected = requiredTasks.map((row) => row.task).filter(Boolean);
    return requiredTaskOptions.filter(
      (opt) => !selected.includes(opt) || requiredTasks[idx].task === opt
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a visit type name");
      return;
    }
    // Validate at least one required task
    const validTasks = requiredTasks.filter((row) => row.task);
    if (validTasks.length === 0) {
      alert("Please select at least one required task");
      return;
    }
    // Prepare data for backend
    const visitTypeData = {
      name: name.trim(),
      requiredTasks: validTasks,
    };
    console.log("Submitting visit type data:", visitTypeData);
    try {
      if (visitType) {
        await dispatch(
          updateVisitType({ id: visitType._id, visitTypeData })
        ).unwrap();
      } else {
        await dispatch(createVisitType({ clientId, visitTypeData })).unwrap();
      }
      onSave();
    } catch (error) {
      console.error("Error saving visit type:", error);
      const errorMessage =
        error.message || "Error saving visit type. Please try again.";
      alert(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">
        {visitType ? "Edit Visit Type" : "Add New Visit Type"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Visit Type Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Visit Type Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter visit type name"
            required
          />
        </div>
        {/* Dynamic Required Tasks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Required task*
          </label>
          {requiredTasks.map((row, idx) => (
            <div key={idx} className="flex items-start gap-2 mb-3">
              <button
                type="button"
                onClick={() => removeTaskRow(idx)}
                className="mt-2 text-gray-400 hover:text-red-600"
                aria-label="Remove required task"
              >
                <X className="w-5 h-5" />
              </button>
              <select
                className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={row.task}
                onChange={(e) => updateTaskRow(idx, "task", e.target.value)}
                required
              >
                <option value="">Select task</option>
                {getAvailableOptions(idx).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notes for care worker"
                value={row.notes}
                onChange={(e) => updateTaskRow(idx, "notes", e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm mt-2"
            onClick={addTaskRow}
          >
            + Add required task
          </button>
        </div>
        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="sky" disabled={loading}>
            {loading
              ? "Saving..."
              : visitType
              ? "Update Visit Type"
              : "Create Visit Type"}
          </Button>
        </div>
      </form>
    </div>
  );
}
