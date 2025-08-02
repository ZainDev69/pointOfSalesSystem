import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import store from "./components/redux/store.js";
import { Provider } from "react-redux";
import { AuthProvider } from "./components/Context/AuthContext.jsx";
import { AppProvider } from "./components/Context/AppContext.jsx";
import "react-confirm-alert/src/react-confirm-alert.css";

const API_URL = import.meta.env.VITE_BACKEND_URL;
if (!import.meta.env.VITE_BACKEND_URL) {
  console.warn("VITE_BACKEND_URL is not set. Using default:", API_URL);
}
export { API_URL };

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppProvider>
      <AuthProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <App />
      </AuthProvider>
    </AppProvider>
  </Provider>
);
