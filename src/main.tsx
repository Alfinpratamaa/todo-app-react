import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SWRConfig } from "swr";
import { Toaster } from "./components/ui/sonner.tsx";

const fetcher = (url: string) =>
  fetch(`http://94.74.86.174:8080/api${url}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SWRConfig value={{ fetcher }}>
      <App />
      <Toaster />
    </SWRConfig>
  </StrictMode>
);
