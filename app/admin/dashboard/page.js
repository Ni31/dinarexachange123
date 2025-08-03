"use client";

import { useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("30");

  // Mock data for demonstration
  const stats = [
    {
      name: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      changeType: "positive",
      icon: CurrencyDollarIcon,
    },
    {
      name: "Total Orders",
      value: "2,350",
      change: "+180.1%",
      changeType: "positive",
      icon: ShoppingBagIcon,
    },
    {
      name: "Active Customers",
      value: "1,234",
      change: "+19%",
      changeType: "positive",
      icon: UsersIcon,
    },
    {
      name: "Conversion Rate",
      value: "3.2%",
      change: "+2.5%",
      changeType: "positive",
      icon: ChartBarIcon,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Welcome to the DinarExchange Admin Dashboard
            </p>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.change}
                </p>
              </dd>
            </div>
          ))}
        </div>

        {/* Placeholder for charts and additional content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart placeholder - Revenue data will be displayed here</p>
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart placeholder - Order status data will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                <p className="text-sm text-gray-600">New order #12345 received</p>
                <span className="text-xs text-gray-400">2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                <p className="text-sm text-gray-600">Customer verification completed</p>
                <span className="text-xs text-gray-400">5 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                <p className="text-sm text-gray-600">Payment pending for order #12344</p>
                <span className="text-xs text-gray-400">10 minutes ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}