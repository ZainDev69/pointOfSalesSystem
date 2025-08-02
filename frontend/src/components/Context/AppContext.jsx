import React, { createContext, useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Clock, Target, X, FileText } from "lucide-react";
import { formatOptionLabel } from "../../utils/formatOptionLabel";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clientOptions } = useSelector((state) => state.clients);
  const { visitScheduleOptions } = useSelector((state) => state.visitSchedules);
  const { options } = useSelector((state) => state.outcomes);

  // Outcome Options
  const OutcomestatusOptions =
    options.status?.map((status) => ({
      value: status,
      label: formatOptionLabel(status),
      icon:
        status === "in-progress"
          ? Clock
          : status === "achieved"
          ? Target
          : status === "unachieved"
          ? X
          : FileText,
    })) || [];

  const OutcomepriorityOptions =
    options.priority?.map((priority) => ({
      value: priority,
      label: formatOptionLabel(priority),
      color:
        priority === "low"
          ? "text-green-600"
          : priority === "medium"
          ? "text-yellow-600"
          : "text-red-600",
    })) || [];

  const OutcomecategoryOptions =
    options.category?.map((category) => ({
      value: category,
      label: formatOptionLabel(category),
    })) || [];

  // VisitSchedule Options
  const visitScheduleStatus =
    visitScheduleOptions.status?.map((status) => ({
      value: status,
      label: formatOptionLabel(status),
    })) || [];
  const visitSchedulePriority =
    visitScheduleOptions.priority?.map((priority) => ({
      value: priority,
      label: formatOptionLabel(priority),
    })) || [];
  const visitScheduleTaskCategory =
    visitScheduleOptions.taskCategory?.map((category) => ({
      value: category,
      label: formatOptionLabel(category),
    })) || [];
  const visitScheduleTaskPriority =
    visitScheduleOptions.taskPriority?.map((priority) => ({
      value: priority,
      label: formatOptionLabel(priority),
    })) || [];

  // Client Options
  const titleOptions =
    clientOptions.title?.map((title) => ({
      value: title,
      label: formatOptionLabel(title),
    })) || [];

  const genderOptions =
    clientOptions.gender?.map((gender) => ({
      value: gender,
      label: formatOptionLabel(gender),
    })) || [];
  const statusOptions =
    clientOptions.status?.map((status) => ({
      value: status,
      label: formatOptionLabel(status),
    })) || [];

  const relationshipStatusOptions =
    clientOptions.relationshipStatus?.map((relation) => ({
      value: relation,
      label: formatOptionLabel(relation),
    })) || [];

  const ethnicityOptions =
    clientOptions.relationshipStatus?.map((ethn) => ({
      value: ethn,
      label: formatOptionLabel(ethn),
    })) || [];

  const contactMethodOptions =
    clientOptions.preferredContactMethod?.map((method) => ({
      value: method,
      label: formatOptionLabel(method),
    })) || [];

  const practiceLevelOptions =
    clientOptions.religiousPracticeLevel?.map((level) => ({
      value: level,
      label: formatOptionLabel(level),
    })) || [];

  const assistanceLevelOptions =
    clientOptions.dietaryAssistanceLevel?.map((level) => ({
      value: level,
      label: formatOptionLabel(level),
    })) || [];

  const conditionSeverityOptions =
    clientOptions.allergySeverity?.map((severe) => ({
      value: severe,
      label: formatOptionLabel(severe),
    })) || [];
  const allergySeverityOptions =
    clientOptions.allergySeverity?.map((severe) => ({
      value: severe,
      label: formatOptionLabel(severe),
    })) || [];

  const conditionStatusOptions =
    clientOptions.conditionStatus?.map((status) => ({
      value: status,
      label: formatOptionLabel(status),
    })) || [];

  const medicationRouteOptions =
    clientOptions.medicationRoute?.map((route) => ({
      value: route,
      label: formatOptionLabel(route),
    })) || [];

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        //Client Options
        titleOptions,
        genderOptions,
        statusOptions,
        relationshipStatusOptions,
        ethnicityOptions,
        contactMethodOptions,
        practiceLevelOptions,
        assistanceLevelOptions,
        conditionSeverityOptions,
        allergySeverityOptions,
        conditionStatusOptions,
        medicationRouteOptions,
        //VisitSchedule Options
        visitScheduleStatus,
        visitSchedulePriority,
        visitScheduleTaskCategory,
        visitScheduleTaskPriority,
        // Outcome Options
        OutcomestatusOptions,
        OutcomecategoryOptions,
        OutcomepriorityOptions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);
