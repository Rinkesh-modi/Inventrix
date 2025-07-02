import { Link } from "@remix-run/react";
import {
  FaBox,
  FaChartLine,
  FaCog,
  FaExclamationTriangle,
  FaPlus,
  FaUsers,
} from "react-icons/fa";
import Header from "~/components/Header";

const Dashboard = () => {
  // Mock data - replace with real data from your loader
  const stats = {
    totalProducts: 1247,
    lowStockItems: 23,
    totalValue: 125800,
    todayTransactions: 45,
  };

  const recentTransactions = [
    {
      id: 1,
      product: "Wireless Headphones",
      type: "OUT",
      quantity: 5,
      user: "John Doe",
      date: "2025-01-02",
      time: "10:30 AM",
    },
    {
      id: 2,
      product: "Gaming Mouse",
      type: "IN",
      quantity: 25,
      user: "Jane Smith",
      date: "2025-01-02",
      time: "09:15 AM",
    },
    {
      id: 3,
      product: "USB Cable",
      type: "OUT",
      quantity: 12,
      user: "Mike Johnson",
      date: "2025-01-02",
      time: "08:45 AM",
    },
    {
      id: 4,
      product: "Bluetooth Speaker",
      type: "IN",
      quantity: 8,
      user: "Sarah Wilson",
      date: "2025-01-01",
      time: "04:20 PM",
    },
    {
      id: 5,
      product: "Phone Case",
      type: "OUT",
      quantity: 3,
      user: "Tom Brown",
      date: "2025-01-01",
      time: "02:10 PM",
    },
  ];

  const lowStockProducts = [
    {
      id: 1,
      name: "Wireless Earbuds",
      currentStock: 5,
      minStock: 20,
      sku: "WE-001",
    },
    {
      id: 2,
      name: "Screen Protector",
      currentStock: 2,
      minStock: 15,
      sku: "SP-002",
    },
    { id: 3, name: "Power Bank", currentStock: 8, minStock: 25, sku: "PB-003" },
  ];

  const handleLogout = () => {
    // Implement your logout logic here
    console.log("Logging out from dashboard...");
    // For example: redirect to login page, clear tokens, etc.
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        currentPage="dashboard"
        userName="John Doe"
        userRole="staff"
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Heres whats happening with your inventory today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <FaBox className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalProducts.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <FaExclamationTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Low Stock Items
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.lowStockItems}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <FaChartLine className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <FaUsers className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Todays Transactions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.todayTransactions}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
            <Link
              to="/inventory/adjust"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <FaCog className="mr-2 h-4 w-4" />
              Stock Adjustment
            </Link>
            <Link
              to="/reports"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <FaChartLine className="mr-2 h-4 w-4" />
              View Reports
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Transactions
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.product}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.type === "IN"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type === "IN"
                              ? "Stock In"
                              : "Stock Out"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div>{transaction.date}</div>
                            <div className="text-xs text-gray-400">
                              {transaction.time}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                <Link
                  to="/transactions"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-200"
                >
                  View all transactions →
                </Link>
              </div>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaExclamationTriangle className="mr-2 h-5 w-5 text-red-500" />
                  Low Stock Alert
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          SKU: {product.sku}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-red-600">
                          {product.currentStock}
                        </p>
                        <p className="text-xs text-gray-500">
                          Min: {product.minStock}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link
                    to="/products?filter=low-stock"
                    className="block w-full text-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                  >
                    View All Low Stock Items
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
