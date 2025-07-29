import Billing from "@/components/Billing";
import { AuthProvider } from "@/contexts/AuthContext";

const BillingPage = () => {
  return (
    <AuthProvider>
      <Billing />
    </AuthProvider>
  );
};

export default BillingPage;
