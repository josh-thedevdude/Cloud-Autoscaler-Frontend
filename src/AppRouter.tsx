import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./contexts/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import HomeLayout from "./layouts/HomeLayout";
import ClustersPage from "./pages/ClustersPage";

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
              <Route path="/clusters" element={<ClustersPage />} />

              {/* <Route
                path="/clusters/:clusterId"
                element={<ClusterDashboardLayout />}
              >
                <Route index element={<ClusterDashboardTab />} />
                <Route path="scaling" element={<ClusterScalingTab />} />
              </Route> */}
            </Route>
            <Route path="/" element={<Navigate to="/clusters" replace />} />
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter >
  );
}