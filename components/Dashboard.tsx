"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (user) {
      // @ts-ignore
      const userCredits = user.credits || 0;
      setCredits(userCredits);
      setProgress((userCredits / 14) * 100);
    }
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-gray-100 p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-600">
            {credits > 0
              ? `${credits} Free Trial Credits Remaining`
              : "End of Free Tier – Upgrade to Access Premium Features"}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
