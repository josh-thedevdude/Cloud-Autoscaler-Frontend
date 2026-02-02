import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeLayout from "./layouts/HomeLayout";
import ClustersPage from "./pages/ClustersPage";
import TabLayout from "./layouts/TabLayout";
import DashboardTab from "./pages/DashboardTab";
import ScalingTab from "./pages/ScalingTab";
import NotFoundPage from "./pages/NotFoundPage";

export default function AppRouter() {
  const queryClient = new QueryClient()
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route element={
              <ProtectedRoute requireAuth={false} redirectTo="/clusters">
                <AuthLayout />
              </ProtectedRoute>}>
              <Route path="/login" element={
                <LoginPage />
              } />
              <Route path="/register" element={
                <RegisterPage />
              }
              />
            </Route>

            <Route element={
              <ProtectedRoute>
                <HomeLayout />
              </ProtectedRoute>}>
              <Route path="/clusters" element={
                <ClustersPage />
              } />

              <Route
                path="/clusters/:clusterId"
                element={<TabLayout />}
              >
                <Route index element={<DashboardTab />} />
                <Route path="scaling" element={<ScalingTab />} />
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/clusters" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter >
  );
}