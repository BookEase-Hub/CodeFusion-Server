import Dashboard from "@/components/Dashboard";
import { AuthProvider } from "@/contexts/AuthContext";

const DashboardPage = () => {
  return (
    <AuthProvider>
      <Dashboard />
    </AuthProvider>
  );
};

export default DashboardPage;
