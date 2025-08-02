import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  Calendar,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { TextArea } from "../../../components/ui/TextArea";
import { Section } from "../../../components/ui/Section";
import { useSelector } from "react-redux";
import { useApp } from "../../../components/Context/AppContext";
// import { fetchVisitOptions } from "../../../components/redux/slice/visitSchedules";

export function VisitForm({ visit, onBack, onSave }) {
  const isEditing = !!visit;
  // const { selectedClientId } = useApp();

  const { visitScheduleOptionsLoading } = useSelector(
    (state) => state.visitSchedules
  );

  // const dispatch = useDispatch();

  const {
    visitScheduleStatus,
    visitSchedulePriority,
    visitScheduleTaskCategory,
    visitScheduleTaskPriority,
  } = useApp();

  // useEffect(() => {
  //   dispatch(fetchVisitOptions(selectedClientId));
  // }, [dispatch, selectedClientId]);

  const [formData, setFormData] = useState({
    date: visit?.date || new Date().toISOString().split("T")[0],
    startTime: visit?.startTime || "",
    endTime: visit?.endTime || "",
    duration: visit?.duration || 60,
    assignedCarer: visit?.assignedCarer || "",
    status: visit?.status || "scheduled",
    priority: visit?.priority || "routine",
    notes: visit?.notes || "",
    tasks: visit?.tasks || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDate = new Date(formData.date);
    if (selectedDate.getDay() === 0) {
      toast.error("Visits can only be scheduled from Monday to Saturday.");
      return;
    }

    let duration = formData.duration;
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      const calculated = (end - start) / 60000;
      if (!isNaN(calculated) && calculated > 0) duration = calculated;
    }

    const visitData = {
      ...formData,
      duration,
      ...(visit && visit._id ? { _id: visit._id } : {}),
    };

    onSave(visitData);
  };

  const addTask = () => {
    const newTask = {
      category: "",
      task: "",
      priority: "routine",
      skills: [],
      equipment: [],
      instructions: [],
      documentation: [],
    };
    setFormData((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const updateTask = (i, field, value) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task, idx) =>
        idx === i ? { ...task, [field]: value } : task
      ),
    }));
  };

  const removeTask = (i) => {
    setFormData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((_, idx) => idx !== i),
    }));
  };

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Edit Visit" : "Schedule New Visit"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? "Update visit details and tasks"
              : "Schedule a new care visit with specific tasks"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section: Visit Details */}
        <Section
          icon={<Calendar className="w-5 h-5 text-gray-400" />}
          title="Visit Details"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Date *"
              type="date"
              value={formData.date}
              required
              onChange={(val) => {
                const day = new Date(val).getDay();
                if (day === 0)
                  return toast.error("Visits cannot be scheduled on Sundays.");
                setFormData((prev) => ({ ...prev, date: val }));
              }}
            />
            <Input
              label="Start Time *"
              type="time"
              value={formData.startTime}
              required
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, startTime: val }))
              }
            />
            <Input
              label="End Time *"
              type="time"
              value={formData.endTime}
              required
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, endTime: val }))
              }
            />
            <Input
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, duration: Number(val) }))
              }
            />
            <Input
              label="Assigned Carer"
              value={formData.assignedCarer}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, assignedCarer: val }))
              }
              placeholder="Enter or select carer"
            />
            <Select
              label="Priority"
              value={formData.priority}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, priority: val }))
              }
              options={
                visitScheduleOptionsLoading
                  ? ["Loading options..."]
                  : visitSchedulePriority
              }
              disabled={visitScheduleOptionsLoading}
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, status: val }))
              }
              options={
                visitScheduleOptionsLoading
                  ? ["Loading options..."]
                  : visitScheduleStatus
              }
              disabled={visitScheduleOptionsLoading}
            />
            <TextArea
              label="Visit Notes"
              value={formData.notes}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, notes: val }))
              }
              placeholder="Special instructions or notes"
              full
            />
          </div>
        </Section>

        {/* Section: Visit Tasks */}
        <Section
          icon={<Clock className="w-5 h-5 text-gray-400" />}
          title="Visit Tasks"
        >
          <div className="flex justify-between items-center mb-4">
            <div />
            <Button
              type="button"
              onClick={addTask}
              icon={Plus}
              style={{ minWidth: 180 }}
            >
              Add Task
            </Button>
          </div>

          <div className="space-y-4">
            {formData.tasks.map((task, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Category"
                    value={task.category}
                    onChange={(val) => updateTask(i, "category", val)}
                    options={
                      visitScheduleOptionsLoading
                        ? ["Loading options..."]
                        : visitScheduleTaskCategory
                    }
                    disabled={visitScheduleOptionsLoading}
                  />
                  <Input
                    label="Task Description"
                    value={task.task}
                    onChange={(val) => updateTask(i, "task", val)}
                    placeholder="Describe task"
                    full
                  />
                  <Select
                    label="Priority"
                    value={task.priority}
                    onChange={(val) => updateTask(i, "priority", val)}
                    options={
                      visitScheduleOptionsLoading
                        ? ["Loading options..."]
                        : visitScheduleTaskPriority
                    }
                    disabled={visitScheduleOptionsLoading}
                  />
                  <Input
                    label="Required Skills"
                    value={task.skills.join(", ")}
                    onChange={(val) =>
                      updateTask(
                        i,
                        "skills",
                        val.split(", ").filter((s) => s.trim())
                      )
                    }
                    placeholder="Comma separated"
                  />
                  <Input
                    label="Equipment Needed"
                    value={task.equipment.join(", ")}
                    onChange={(val) =>
                      updateTask(
                        i,
                        "equipment",
                        val.split(", ").filter((e) => e.trim())
                      )
                    }
                    placeholder="Comma separated"
                  />
                  <Input
                    label="Documentation Required"
                    value={task.documentation.join(", ")}
                    onChange={(val) =>
                      updateTask(
                        i,
                        "documentation",
                        val.split(", ").filter((d) => d.trim())
                      )
                    }
                    placeholder="Comma separated"
                  />
                  <TextArea
                    label="Special Instructions"
                    value={task.instructions.join("\n")}
                    onChange={(val) =>
                      updateTask(
                        i,
                        "instructions",
                        val.split("\n").filter((s) => s.trim())
                      )
                    }
                    rows={2}
                    full
                  />
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={() => removeTask(i)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Task</span>
                  </button>
                </div>
              </div>
            ))}
            {formData.tasks.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No tasks added yet. Click "Add Task" to define visit activities.
              </p>
            )}
          </div>
        </Section>

        {/* Form Footer Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          <Button type="submit" icon={Save} style={{ minWidth: 180 }}>
            {isEditing ? "Update Visit" : "Schedule Visit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
