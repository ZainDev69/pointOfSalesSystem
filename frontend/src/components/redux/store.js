import { configureStore } from "@reduxjs/toolkit";
import clientReducer from "./slice/clients";
import contactReducer from "./slice/contacts";
import carePlansReducer from "./slice/carePlans";
import outcomesReducer from "./slice/outcomes";
import riskAssessmentsReducer from "./slice/riskAssessments";
import visitSchedulesReducer from './slice/visitSchedules';
import documentsReducer from "./slice/documents";
import carePlanDocumentsReducer from "./slice/carePlanDocuments";

const store = configureStore({
    reducer: {
        client: clientReducer,
        contacts: contactReducer,
        carePlans: carePlansReducer,
        outcomes: outcomesReducer,
        riskAssessments: riskAssessmentsReducer,
        visitSchedules: visitSchedulesReducer,
        documents: documentsReducer,
        carePlanDocuments: carePlanDocumentsReducer,
    }
});

export default store;