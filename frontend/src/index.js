import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

// Check if the application is running in production mode and disable React DevTools if so
if (process.env.NODE_ENV === "production") disableReactDevTools();

// Create a root element for rendering the React app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the React app within a StrictMode component for enhanced development checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
