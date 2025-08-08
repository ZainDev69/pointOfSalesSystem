import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./components/redux/store.js";
import { Provider } from "react-redux";
import { SearchProvider } from "./components/context/SearchContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <SearchProvider>
      <App />
    </SearchProvider>
  </Provider>
);
