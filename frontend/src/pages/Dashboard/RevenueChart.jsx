import React from "react";
import { TrendingUp } from "lucide-react";

export function RevenueChart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const revenue = [95000, 110000, 105000, 125000, 130000, 125800];
  const maxRevenue = Math.max(...revenue);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Revenue Overview
          </h3>
          <p className="text-sm text-gray-600">Monthly revenue for 2024</p>
        </div>
        <div className="flex items-center space-x-2 text-emerald-600">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">+8.5% vs last year</span>
        </div>
      </div>

      <div className="h-64 flex items-end space-x-2">
        {months.map((month, index) => {
          const height = (revenue[index] / maxRevenue) * 100;
          return (
            <div key={month} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t-md relative group cursor-pointer">
                <div
                  className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    £{revenue[index].toLocaleString()}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
