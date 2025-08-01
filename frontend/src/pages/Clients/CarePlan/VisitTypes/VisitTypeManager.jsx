import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../../components/ui/Button";
import { VisitTypeForm } from "./VisitTypeForm";
import {
  fetchClientVisitTypes,
  deleteVisitType,
  addNewTaskOption,
  deleteTaskOption,
  fetchRequiredTaskOptions,
} from "../../../../components/redux/slice/visitTypes";
import {
  Edit,
  Trash2,
  Plus,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
} from "lucide-react";

export function VisitTypeManager({ clientId }) {
  const dispatch = useDispatch();
  const { visitTypes, loading, requiredTaskOptions } = useSelector(
    (state) => state.visitTypes
  );

  const [activeForms, setActiveForms] = useState([]);
  const [showTaskOptionsModal, setShowTaskOptionsModal] = useState(false);
  const [newTaskOption, setNewTaskOption] = useState("");

  useEffect(() => {
    dispatch(fetchClientVisitTypes(clientId));
  }, [dispatch, clientId]);

  const handleAddNew = () => {
    const newFormId = Date.now();
    setActiveForms((prev) => [...prev, { id: newFormId, isNew: true }]);
  };

  const handleEdit = (visitType) => {
    const newFormId = Date.now();
    setActiveForms((prev) => [
      ...prev,
      { id: newFormId, isNew: false, visitType },
    ]);
  };

  const handleDelete = async (visitTypeId) => {
    if (window.confirm("Are you sure you want to delete this visit type?")) {
      try {
        await dispatch(deleteVisitType(visitTypeId)).unwrap();
      } catch (error) {
        console.error("Error deleting visit type:", error);
        alert("Error deleting visit type. Please try again.");
      }
    }
  };

  const handleSave = (formId) => {
    setActiveForms((prev) => prev.filter((form) => form.id !== formId));
    dispatch(fetchClientVisitTypes(clientId));
  };

  const handleCancel = (formId) => {
    setActiveForms((prev) => prev.filter((form) => form.id !== formId));
  };

  const handleAddTaskOption = async () => {
    if (!newTaskOption.trim()) {
      alert("Please enter a task option name");
      return;
    }

    try {
      await dispatch(addNewTaskOption(newTaskOption)).unwrap();
      setNewTaskOption("");
      setShowTaskOptionsModal(false);
      // Refresh task options to get the updated list
      dispatch(fetchRequiredTaskOptions());
    } catch (error) {
      console.error("Error adding task option:", error);
      alert("Error adding task option. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Visit Types</h2>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => setShowTaskOptionsModal(true)}
            icon={Settings}
          >
            Manage Task Options
          </Button>
          <Button variant="default" onClick={handleAddNew} icon={Plus}>
            Add New Visit Type
          </Button>
        </div>
      </div>

      {/* Task Options Modal */}
      {showTaskOptionsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Manage Task Options</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Task Option
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTaskOption}
                  onChange={(e) => setNewTaskOption(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new task option"
                />
                <Button onClick={handleAddTaskOption} variant="sky">
                  Add
                </Button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Task Options
              </label>
              <div className="min-h-[120px] min-w-[220px] max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 flex flex-col justify-center items-center">
                {loading ? (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
                    <span className="text-sm text-gray-600">
                      Loading options...
                    </span>
                  </div>
                ) : requiredTaskOptions.length === 0 ? (
                  <span className="text-gray-400 text-sm">
                    No task options found.
                  </span>
                ) : (
                  requiredTaskOptions.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm py-1 px-2 hover:bg-gray-50 rounded w-full"
                    >
                      <span>{task}</span>
                      <button
                        type="button"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Are you sure you want to remove "${task}"? This action cannot be undone.`
                            )
                          ) {
                            try {
                              await dispatch(deleteTaskOption(task)).unwrap();
                              // Refresh task options to get the updated list
                              dispatch(fetchRequiredTaskOptions());
                            } catch (error) {
                              console.error(
                                "Error deleting task option:",
                                error
                              );
                              if (
                                error.message &&
                                error.message.includes("being used")
                              ) {
                                alert(error.message);
                              } else {
                                alert(
                                  "Error deleting task option. Please try again."
                                );
                              }
                            }
                          }
                        }}
                        className="text-red-500 hover:text-red-700 text-xs"
                        title="Remove task option"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Note: Task options that are currently used by visit types cannot
                be deleted.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setShowTaskOptionsModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Forms */}
      {activeForms.map((form) => (
        <div
          key={form.id}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
        >
          <VisitTypeForm
            visitType={form.visitType}
            onSave={() => handleSave(form.id)}
            onCancel={() => handleCancel(form.id)}
            clientId={clientId}
          />
        </div>
      ))}

      {/* Existing Visit Types */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading visit types...</p>
        </div>
      ) : visitTypes.length === 0 && activeForms.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Visit Types
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by creating your first visit type.
          </p>
          <Button variant="default" onClick={handleAddNew} icon={Plus}>
            Add New Visit Type
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {visitTypes.map((visitType) => (
            <div
              key={visitType._id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {visitType.name}
                    </h3>
                  </div>

                  {/* Required Tasks */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        Required Tasks:
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {Array.isArray(visitType.requiredTasks) &&
                      visitType.requiredTasks.length > 0 ? (
                        visitType.requiredTasks.map((row, index) => {
                          const task = typeof row === "string" ? row : row.task;
                          const notes =
                            typeof row === "string" ? "" : row.notes;
                          return (
                            <div
                              key={index}
                              className="bg-blue-50 border border-blue-100 rounded px-3 py-2"
                            >
                              <span className="font-semibold text-blue-800">
                                {task}
                              </span>
                              {notes && (
                                <span className="block text-xs text-gray-600 mt-1">
                                  {notes}
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No required tasks.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Created Date */}
                  <div className="text-xs text-gray-500">
                    Created:{" "}
                    {new Date(visitType.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(visitType)}
                    icon={Edit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(visitType._id)}
                    icon={Trash2}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
