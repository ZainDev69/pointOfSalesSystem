import React from "react";

export function SmallStatsGrid() {
  const stats = [
    {
      name: "Today's Visits",
      value: 23,
    },
    {
      name: "Tasks",
      value: 35,
      description: "Pending for you",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      {stats.map((stat) => {
        return (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex gap-2 items-center">
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <p>{stat.description}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
