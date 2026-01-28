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

export default function AppRouter() {
  const queryClient = new QueryClient()
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={
                <ProtectedRoute requireAuth={false} redirectTo="/clusters">
                  <LoginPage />
                </ProtectedRoute>} />
              <Route path="/register" element={
                <ProtectedRoute requireAuth={false} redirectTo="/clusters">
                  <RegisterPage />
                </ProtectedRoute>}
              />
            </Route>

            <Route element={<HomeLayout />}>
              <Route path="/clusters" element={
                <ProtectedRoute>
                  <ClustersPage />
                </ProtectedRoute>
              } />

              <Route
                path="/clusters/:clusterId"
                element={<TabLayout />}
              >
                <Route index element={<DashboardTab />} />
                {/* <Route path="scaling" element={<ClusterScalingTab />} /> */}
              </Route>
            </Route>
            <Route path="/" element={<Navigate to="/clusters" replace />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter >
  );
}