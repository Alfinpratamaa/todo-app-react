import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/checklist/DashboardPage";
import ChecklistDetailPage from "./pages/checklist/ChecklistDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/shared/ProtectedRoute.tsx";
import CreateChecklistPage from "./pages/checklist/CreateChecklistPage.tsx";
import ItemCreatePage from "./pages/checklist/ItemCreatePage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/checklist/create" element={<CreateChecklistPage />} />
          <Route
            path="/checklist/:checklistId"
            element={<ChecklistDetailPage />}
          />
          <Route
            path="/checklist/:checklistId/item/new"
            element={<ItemCreatePage />}
          />
          <Route
            path="/checklist/:checklistId/item/:itemId/edit"
            element={<ItemCreatePage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
