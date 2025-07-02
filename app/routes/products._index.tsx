import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState, useMemo } from "react";
import {
  FaPlus,
  FaEdit,
  FaEye,
  FaTrash,
  FaSearch,
  FaTimes,
  FaFilter,
} from "react-icons/fa";
import Header from "~/components/Header";
import DeleteConfirmModal from "~/components/product/DeleteConfirmModal";
import { useMainContext } from "~/context/MainContext";
import { useAuthGuard } from "~/hooks/useAuthGuard";
import { Product } from "~/types/product";
import { AxiosClient } from "~/utils/AxiosClient";

export default function ProductsIndex() {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // ✅ Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  // useAuthGuard();
  const navigate = useNavigate();

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";
      if (!token) {
        return;
      }
      const response = await AxiosClient.get("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (error) {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteConfirm(true);
  };

  const handleDeleteSuccess = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
    fetchAllProducts();
  };

  const getStockStatus = (product: Product) => {
    if (product.quantity === 0)
      return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
    if (product.quantity <= product.minStock)
      return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { status: "In Stock", color: "bg-green-100 text-green-800" };
  };

  // ✅ Get unique categories for filter dropdown
  const categories = useMemo(() => {
    if (!products) return [];
    return [...new Set(products.map((product) => product.category))].sort();
  }, [products]);

  // ✅ Filter and search logic
  const filteredProducts = useMemo(() => {
    if (!products) return [];

    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.supplier?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      // Category filter
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      // Price filter
      let matchesPrice = true;
      if (priceFilter !== "all") {
        switch (priceFilter) {
          case "under-10":
            matchesPrice = product.price < 10;
            break;
          case "10-50":
            matchesPrice = product.price >= 10 && product.price <= 50;
            break;
          case "50-100":
            matchesPrice = product.price >= 50 && product.price <= 100;
            break;
          case "100-500":
            matchesPrice = product.price >= 100 && product.price <= 500;
            break;
          case "over-500":
            matchesPrice = product.price > 500;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, statusFilter, categoryFilter, priceFilter]);

  // ✅ Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPriceFilter("all");
  };

  // ✅ Check if any filters are active
  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    priceFilter !== "all";

  const { user } = useMainContext();
  const canEdit = user && user.role === "admin" ? true : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="products" />
      {loading && <p>Loading</p>}

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="mt-2 text-gray-600">
              Manage your product catalog and inventory levels
            </p>
          </div>
          {canEdit && (
            <Link
              to="/products/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
            >
              <FaPlus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          )}
        </div>

        {/* ✅ Search and Filters Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products "
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center px-4 py-3 border rounded-lg font-medium transition-colors ${
                  hasActiveFilters
                    ? "border-primary-300 bg-primary-50 text-primary-700"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FaFilter className="mr-2 h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                    {
                      [
                        searchTerm !== "",
                        statusFilter !== "all",
                        categoryFilter !== "all",
                        priceFilter !== "all",
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label
                      htmlFor="status-filter"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Status
                    </label>
                    <select
                      id="status-filter"
                      value={statusFilter}
                      onChange={(e) =>
                        setStatusFilter(
                          e.target.value as "all" | "active" | "inactive"
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label
                      htmlFor="category-filter"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Category
                    </label>
                    <select
                      id="category-filter"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Filter */}
                  <div>
                    <label
                      htmlFor="price-filter"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Price Range
                    </label>
                    <select
                      id="price-filter"
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    >
                      <option value="all">All Prices</option>
                      <option value="under-10">Under $10</option>
                      <option value="10-50">$10 - $50</option>
                      <option value="50-100">$50 - $100</option>
                      <option value="100-500">$100 - $500</option>
                      <option value="over-500">Over $500</option>
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      disabled={!hasActiveFilters}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products?.length || 0}{" "}
            products
            {hasActiveFilters && (
              <span className="ml-2 text-primary-600 font-medium">
                (filtered)
              </span>
            )}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product?._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.quantity}
                        <div className="text-xs text-gray-500">
                          Min: {product.minStock}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}
                        >
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/products/${product._id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded"
                            title="View"
                          >
                            <FaEye />
                          </Link>
                          {canEdit && (
                            <>
                              <Link
                                to={`/products/${product._id}?edit=true`}
                                className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded"
                                title="Edit"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDeleteClick(product)}
                                className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ✅ Updated Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <FaSearch className="mx-auto h-12 w-12" />
              </div>
              {hasActiveFilters ? (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products match your filters
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search terms or filters to find what you
                    are looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Clear Filters
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adding a new product to get started.
                  </p>
                  {canEdit && (
                    <Link
                      to="/products/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
                    >
                      <FaPlus className="mr-2 h-4 w-4" />
                      Add Your First Product
                    </Link>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Delete Modal */}
        {productToDelete && (
          <DeleteConfirmModal
            product={productToDelete}
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setProductToDelete(null);
            }}
          />
        )}
      </main>
    </div>
  );
}
// import { Link, useNavigate } from "@remix-run/react";
// import { useEffect, useState } from "react";
// import { FaPlus, FaEdit, FaEye, FaTrash, FaSearch } from "react-icons/fa";
// import Header from "~/components/Header";
// import DeleteConfirmModal from "~/components/product/DeleteConfirmModal";
// import { useMainContext } from "~/context/MainContext";
// import { Product } from "~/types/product";
// import { AxiosClient } from "~/utils/AxiosClient";

// export default function ProductsIndex() {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [products, setProducts] = useState<Product[] | null>(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [productToDelete, setProductToDelete] = useState<Product | null>(null);

//   const navigate = useNavigate();
//   const fetchAllProducts = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token") || "";
//       if (!token) {
//         return;
//       }
//       const response = await AxiosClient.get("/api/products", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = response.data;
//       setProducts(Array.isArray(data.products) ? data.products : []);
//     } catch (error) {
//       navigate("/login");
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() => {
//     fetchAllProducts();
//   }, []);

//   const handleDeleteClick = (product: Product) => {
//     setProductToDelete(product);
//     setShowDeleteConfirm(true);
//   };

//   // ✅ Handle successful deletion
//   const handleDeleteSuccess = () => {
//     setShowDeleteConfirm(false);
//     setProductToDelete(null);
//     // Refresh the products list
//     fetchAllProducts();
//   };

//   const getStockStatus = (product: Product) => {
//     if (product.quantity === 0)
//       return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
//     if (product.quantity <= product.minStock)
//       return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
//     return { status: "In Stock", color: "bg-green-100 text-green-800" };
//   };

//   const { user } = useMainContext();
//   const canEdit = user && user.role === "admin" ? true : false;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header currentPage="products" />
//       {loading && <p>Loading</p>}

//       <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         {/* Page Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Products</h1>
//             <p className="mt-2 text-gray-600">
//               Manage your product catalog and inventory levels
//             </p>
//           </div>
//           {canEdit && (
//             <Link
//               to="/products/new"
//               className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
//             >
//               <FaPlus className="mr-2 h-4 w-4" />
//               Add Product
//             </Link>
//           )}
//         </div>

//         {/* Results Summary */}
//         <p className="text-sm text-gray-600 mb-2">
//           Showing {products?.length} products
//         </p>

//         {/* Products Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Product
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     SKU
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Category
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Price
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Stock
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {products?.map((product) => {
//                   const stockStatus = getStockStatus(product);
//                   return (
//                     <tr key={product?._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-sm font-medium text-gray-900">
//                           {product.name}
//                         </div>
//                         <div className="text-sm text-gray-500 truncate max-w-xs">
//                           {product.description}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900 font-mono">
//                         {product.sku}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {product.category}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
//                         ${product.price}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {product.quantity}
//                         <div className="text-xs text-gray-500">
//                           Min: {product.minStock}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <span
//                           className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}
//                         >
//                           {stockStatus.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm font-medium">
//                         <div className="flex space-x-2">
//                           <Link
//                             to={`/products/${product._id}`}
//                             className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 rounded"
//                             title="View"
//                           >
//                             <FaEye />
//                           </Link>
//                           {canEdit && (
//                             <>
//                               <Link
//                                 to={`/products/${product._id}?edit=true`}
//                                 className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded"
//                                 title="Edit"
//                               >
//                                 <FaEdit />
//                               </Link>
//                               <button
//                                 onClick={() => handleDeleteClick(product)}
//                                 className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded"
//                                 title="Delete"
//                               >
//                                 <FaTrash />
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {products?.length === 0 && (
//             <div className="text-center py-12">
//               <div className="text-gray-500 mb-4">
//                 <FaSearch className="mx-auto h-12 w-12" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No products found
//               </h3>
//               <p className="text-gray-500 mb-4">
//                 Try adding a new product to get started.
//               </p>
//               {canEdit && (
//                 <Link
//                   to="/products/new"
//                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700"
//                 >
//                   <FaPlus className="mr-2 h-4 w-4" />
//                   Add Your First Product
//                 </Link>
//               )}
//             </div>
//           )}
//         </div>
//         {productToDelete && (
//           <DeleteConfirmModal
//             product={productToDelete}
//             isOpen={showDeleteConfirm}
//             onClose={() => {
//               setShowDeleteConfirm(false);
//               setProductToDelete(null);
//             }}
//           />
//         )}
//       </main>
//     </div>
//   );
// }
