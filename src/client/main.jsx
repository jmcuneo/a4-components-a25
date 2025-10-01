import "./index.css";

import React, { useState } from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import DrawingApp from "./components/DrawingCanvas";
import PostBoard from "./Components/PostBoard";
import FormCard from "./Components/FormCard";
import TextForm from "./Components/TextForm";
import Login from "./components/Login";
import { AuthProvider } from "./contexts/AuthContext";

function MainApp() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubmitSuccess = () => {
    // Trigger a refresh of the posts
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <AuthProvider>
      <Login />
      <App>
        <FormCard>
          <TextForm onSubmitSuccess={handleSubmitSuccess}>
            <DrawingApp></DrawingApp>
          </TextForm>
        </FormCard> 
      </App>
      <PostBoard refreshTrigger={refreshTrigger}></PostBoard>
    </AuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
);
