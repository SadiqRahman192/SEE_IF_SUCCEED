
import { useState } from "react";
import Navigation from "@/components/layout/Navigation";
import { StatsOverview } from "@/components/sections/StatsOverview";
import { DashboardTabs } from "@/components/sections/DashboardTabs";

const Dashboard = () => {
  const [currentView, setCurrentView] = useState("dashboard"); // Assuming a default view

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your events and track your progress</p>
        </div>
        <StatsOverview />
        <DashboardTabs />
      </div>
    </div>
  );
};

export default Dashboard;
