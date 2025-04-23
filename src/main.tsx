import "@/assets/styles/globals.css";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import AuthProvider from "@/contexts/Auth.tsx";
import { ErrorWrapper } from "@/contexts/Error.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <ErrorWrapper>
        <Provider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Provider>
      </ErrorWrapper>
    </HashRouter>
  </React.StrictMode>
);
