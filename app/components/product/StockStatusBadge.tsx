// app/components/product/StockStatusBadge.tsx

import { Product } from "~/types/product";

interface StockStatusBadgeProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function StockStatusBadge({
  product,
  size = "md",
  showIcon = true,
}: StockStatusBadgeProps) {
  const getStockStatus = (product: Product) => {
    if (product.quantity === 0)
      return {
        status: "Out of Stock",
        bgColor: "bg-red-100",
        color: "text-red-800",
        icon: (
          <svg
            className="w-4 h-4 text-red-800"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <line
              x1="8"
              y1="8"
              x2="16"
              y2="16"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16"
              y1="8"
              x2="8"
              y2="16"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        ),
      };
    if (product.quantity <= product.minStock)
      return {
        status: "Low Stock",
        bgColor: "bg-yellow-100",
        color: "text-yellow-800",
        icon: (
          <svg
            className="w-4 h-4 text-yellow-800"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M12 8v4l2 2"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        ),
      };
    return {
      status: "In Stock",
      bgColor: "bg-green-100",
      color: "text-green-800",
      icon: (
        <svg
          className="w-4 h-4 text-green-800"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
    };
  };
  const stockStatus = getStockStatus(product);

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${stockStatus.bgColor} ${stockStatus.color} ${sizeClasses[size]}`}
    >
      {showIcon && stockStatus.icon}
      {showIcon && <span className="ml-1">{stockStatus.status}</span>}
      {!showIcon && stockStatus.status}
    </span>
  );
}
