import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
import AuthProvider from "@/authprovider.tsx";
import { ErrorWrapper } from "@/contexts/Error.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorWrapper>
        <Provider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </Provider>
      </ErrorWrapper>
    </BrowserRouter>
  </React.StrictMode>,
);
