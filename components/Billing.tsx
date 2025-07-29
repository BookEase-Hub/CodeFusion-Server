"use client";

import { useAuth } from "@/contexts/AuthContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const Billing = () => {
  const { user } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Billing</h1>
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="mb-4">
          You are currently on the <strong>{user?.subscriptionPlan}</strong> plan.
        </p>
        {user?.subscriptionPlan === "free" && (
          <div>
            <p className="mb-4">
              Upgrade to the <strong>Premium</strong> plan for unlimited access.
            </p>
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
