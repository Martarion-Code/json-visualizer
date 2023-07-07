
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ReactFlowProvider } from "reactflow";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  // {/* </React.StrictMode> */}
);
