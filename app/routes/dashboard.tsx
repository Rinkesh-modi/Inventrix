import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  FaBox,
  FaChartLine,
  FaExclamationTriangle,
  FaPlus,
  FaDollarSign,
  FaEye,
} from "react-icons/fa";
import Header from "~/components/Header";
import { useMainContext } from "~/context/MainContext";
import { useAuthGuard } from "~/hooks/useAuthGuard";
import { Product } from "~/types/product";
import { AxiosClient } from "~/utils/AxiosClient";

const Dashboard = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useMainContext();

    useAuthGuard();

  // Fetch products data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      if (!token) return;

      const response = await AxiosClient.get("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(
        Array.isArray(response.data.products) ? response.data.products : []
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Calculate stats from products API data
  const stats = {
    totalProducts: products.length,
    lowStockItems: products.filter((p) => p.quantity <= p.minStock).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    activeProducts: products.filter((p) => p.status === "active").length,
  };

  // ✅ Get low stock products (quantity <= minStock)
  const lowStockProducts = products
    .filter((p) => p.quantity <= p.minStock)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 6);

  // ✅ Get recently added products (using createdAt)
  const recentProducts = products
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // ✅ Get category distribution (using category field)
  const categoryStats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // ✅ Stock status distribution (using quantity and minStock)
  const stockStatusDistribution = {
    inStock: products.filter((p) => p.quantity > p.minStock).length,
    lowStock: products.filter((p) => p.quantity <= p.minStock && p.quantity > 0)
      .length,
    outOfStock: products.filter((p) => p.quantity === 0).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header currentPage="dashboard" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="dashboard" />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back{user?.name ? `, ${user.name}` : ""}! Here's your
            inventory overview.
          </p>
        </div>

        {/* ✅ Stats Cards - All calculated from products API */}
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
                <FaDollarSign className="h-6 w-6 text-green-600" />
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
                <FaChartLine className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Products
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeProducts}
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
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <FaBox className="mr-2 h-4 w-4" />
              View All Products
            </Link>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ✅ Recently Added Products (using createdAt) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recently Added Products
                </h3>
              </div>
              <div className="p-6">
                {recentProducts.length > 0 ? (
                  <div className="space-y-4">
                    {recentProducts.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            SKU: {product.sku} • {product.category}
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-sm font-bold text-gray-900">
                            ${product.price}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(product.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Link
                          to={`/products/${product._id}`}
                          className="ml-3 text-blue-600 hover:text-blue-800"
                          title="View Product"
                        >
                          <FaEye className="h-4 w-4" />
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No products found
                  </p>
                )}
              </div>
            </div>

            {/* ✅ Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* ✅ Stock Status Distribution */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Stock Status
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      In Stock
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {stockStatusDistribution.inStock}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Low Stock
                    </span>
                    <span className="text-sm font-bold text-yellow-600">
                      {stockStatusDistribution.lowStock}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Out of Stock
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {stockStatusDistribution.outOfStock}
                    </span>
                  </div>
                </div>
              </div>

              {/* ✅ Top Categories */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Top Categories
                </h3>
                <div className="space-y-3">
                  {topCategories.slice(0, 4).map(([category, count]) => (
                    <div
                      key={category}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm font-medium text-gray-600 truncate">
                        {category}
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {count}
                      </span>
                    </div>
                  ))}
                  {topCategories.length === 0 && (
                    <p className="text-sm text-gray-500">No categories found</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Low Stock Alert (using quantity and minStock) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FaExclamationTriangle className="mr-2 h-5 w-5 text-red-500" />
                  Low Stock Alert
                </h3>
              </div>
              <div className="p-6">
                {lowStockProducts.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {lowStockProducts.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              SKU: {product.sku}
                            </p>
                          </div>
                          <div className="text-right ml-3">
                            <p className="text-sm font-bold text-red-600">
                              {product.quantity}
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
                        to="/products"
                        className="block w-full text-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 transition-colors duration-200"
                      >
                        View All Products
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <FaChartLine className="mx-auto h-12 w-12 text-green-400 mb-4" />
                    <p className="text-sm font-medium text-gray-900">
                      All Good!
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      No low stock items found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
