// app/components/product/ProductHeader.tsx
import { Link } from "@remix-run/react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaExclamationTriangle,
  FaTrash,
} from "react-icons/fa";
import { useAuthGuard } from "~/hooks/useAuthGuard";
import { UserProps } from "~/types/auth";
import { Product, StockStatus, User } from "~/types/product";

interface ProductHeaderProps {
  product: Product;
  isEditing: boolean;
  onDeleteClick: () => void;
  user: UserProps | null;
}
const getStockStatus = (product: Product): StockStatus => {
  if (product.quantity === 0)
    return {
      status: "Out of Stock",
      color: "text-red-600",
      bgColor: "bg-red-100",
      icon: <FaExclamationTriangle />,
    };
  if (product.quantity <= product.minStock)
    return {
      status: "Low Stock",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      icon: <FaClock />,
    };
  return {
    status: "In Stock",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: <FaCheckCircle />,
  };
};

export default function ProductHeader({
  product,
  user,
  isEditing,
  onDeleteClick,
}: ProductHeaderProps) {
  const canEdit = user && user.role === "admin" ? true : false;
  const stockStatus = getStockStatus(product);
  useAuthGuard();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        {canEdit && !isEditing && (
          <div className="flex items-center space-x-3">
            <Link
              to={`/products/${product._id}?edit=true`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <FaEdit className="mr-2 h-4 w-4" />
              Edit Product
            </Link>
            <button
              onClick={onDeleteClick}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
            >
              <FaTrash className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.bgColor} ${stockStatus.color}`}
        >
          {stockStatus.icon}
          <span className="ml-1">{stockStatus.status}</span>
        </span>
      </div>
      <p className="mt-2 text-gray-600">SKU: {product.sku}</p>
    </div>
  );
}
