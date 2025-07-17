import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import store from "./components/redux/store.js";
import { Provider } from "react-redux";
import { AuthProvider } from "./components/Context/AuthContext.jsx";
import { AppProvider } from "./components/Context/AppContext.jsx";
import "react-confirm-alert/src/react-confirm-alert.css";

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
