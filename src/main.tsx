import ReactDOM from "react-dom/client";
import { ToastProvider } from "./components/ToastProvider";
import { HashRouter } from "react-router-dom";

import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HashRouter>
    <ToastProvider>
      <App />
    </ToastProvider>
  </HashRouter>
);
