import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "@/Context/AuthContext";
// import { UIProvider } from "@/Context/UIContext";
import RouteLoader from "@/components/ui/RouteLoader";

import "./styles/bootstrap.scss";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <UIProvider> */}
        <AuthProvider>
          <RouteLoader />
          <App />
        </AuthProvider>
      {/* </UIProvider> */}
    </BrowserRouter>
  </React.StrictMode>
);
