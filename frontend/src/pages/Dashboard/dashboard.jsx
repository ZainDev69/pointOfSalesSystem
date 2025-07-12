import React from "react";
import { StatsGrid } from "./StatsGrid";
import { SmallStatsGrid } from "./smallStatsGrid";
import { RevenueChart } from "./RevenueChart";
import { QuickActions } from "./QuickActions";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

          <SmallStatsGrid />
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <RevenueChart />
      </div>
      <div>
        <RevenueChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <RevenueChart />
      </div>
    </div>
  );
}
