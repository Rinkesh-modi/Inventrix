// app/components/product/StockOverview.tsx
import { FaBox, FaExclamationTriangle } from "react-icons/fa";
import { Product } from "~/types/product";

interface StockOverviewProps {
  product: Product;
}
const getStockStatus = (product: Product) => {
  if (product.quantity === 0)
    return { status: "Out of Stock", color: "bg-red-100 text-red-800" };
  if (product.quantity <= product.minStock)
    return { status: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
  return { status: "In Stock", color: "bg-green-100 text-green-800" };
};

export default function StockOverview({ product }: StockOverviewProps) {
  const stockStatus = getStockStatus(product);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <FaBox className="mr-2 h-5 w-5" />
        Stock Overview
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Current Stock</span>
          <span className="text-2xl font-bold text-gray-900">
            {product.quantity}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Minimum Stock</span>
          <span className="text-lg text-gray-900">{product.minStock}</span>
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
            <span
              className={`inline-flex items-center text-sm font-medium ${stockStatus.color}`}
            >
              {/* {stockStatus.icon} */}
              <span className="ml-1">{stockStatus.status}</span>
            </span>
          </div>
        </div>

        {product.quantity <= product.minStock && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex">
              <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">
                  Low Stock Alert
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Consider restocking this item soon.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
