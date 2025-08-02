import React, { useEffect } from "react";
import {
  Users,
  UserCheck,
  DollarSign,
  ClipboardList,
  Star,
  TrendingUp,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clientList } from "../../components/redux/slice/clients";

export function StatsGrid() {
  const dispatch = useDispatch();
  const clientData = useSelector((state) => state.clients.clients);

  useEffect(() => {
    dispatch(clientList());
  }, [dispatch]);

  const stats = [
    {
      name: "Clients",
      value: clientData.length,
      icon: Users,
      color: "bg-blue-500",
      changeType: "positive",
    },
    {
      name: "Staff",
      value: 45,
      icon: UserCheck,
      color: "bg-emerald-500",
      changeType: "positive",
    },
    {
      name: "Care Plane Compliance",
      value: 34,
      icon: DollarSign,
      color: "bg-yellow-500",
      changeType: "positive",
    },
    {
      name: "Client Satisfaction",
      value: 56,
      icon: ClipboardList,
      color: "bg-red-500",
      changeType: "negative",
    },
    {
      name: "Today's Visits",
      value: 4566,
      icon: Star,
      color: "bg-purple-500",
      changeType: "positive",
    },
    {
      name: "Medication Compliance",
      value: 353,
      icon: TrendingUp,
      color: "bg-indigo-500",
      changeType: "positive",
    },
    {
      name: "Staff Training",
      value: 453453,
      icon: TrendingUp,
      color: "bg-indigo-500",
      changeType: "positive",
    },
    {
      name: "Risk Management",
      value: 443,
      icon: TrendingUp,
      color: "bg-indigo-500",
      changeType: "positive",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === "positive"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs last month
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
