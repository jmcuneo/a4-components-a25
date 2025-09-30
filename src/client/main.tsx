import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Auth0Provider
            domain={"https://dev-28jpicfxa7oh6z7f.us.auth0.com"}
            clientId={"iKs9HQaUb9z3Oldam0xBvoSvko7ao4WM"}
            authorizationParams={{
                redirect_uri: window.location.origin,
            }}
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>,
);
