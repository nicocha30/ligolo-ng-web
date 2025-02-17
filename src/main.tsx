import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import AuthProvider from "@/authprovider.tsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
