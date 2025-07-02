// app/components/product/ProductMeta.tsx

import { Product } from "~/types/product";

interface ProductMetaProps {
  product: Product;
}

export default function ProductMeta({ product }: ProductMetaProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Product Details
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Created</span>
          <span className="text-gray-900">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Last Updated</span>
          <span className="text-gray-900">
            {new Date(product.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Total Value</span>
          <span className="text-gray-900 font-semibold">
            ${(product.price * product.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
