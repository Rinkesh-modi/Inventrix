// app/components/product/ProductInformation.tsx
import { Link, useNavigate } from "@remix-run/react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as yup from "yup";
import { FaSave } from "react-icons/fa";
import { Product } from "~/types/product";
import { AxiosClient } from "~/utils/AxiosClient";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProductInformationProps {
  product: Product;
  isEditing: boolean;
}
const productCategories = [
  "Electronics",
  "Accessories",
  "Clothing",
  "Home & Garden",
  "Sports & Outdoors",
  "Books & Media",
  "Health & Beauty",
  "Automotive",
  "Office Supplies",
  "Other",
];

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Product name is required")
    .min(2, "Name must be at least 2 characters"),
  description: yup
    .string()
    .max(500, "Description must be less than 500 characters"),
  sku: yup
    .string()
    .required("SKU is required")
    .min(3, "SKU must be at least 3 characters"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be positive"),
  quantity: yup
    .number()
    .required("Quantity is required")
    .min(0, "Quantity must be positive or zero"),
  minStock: yup
    .number()
    .required("Minimum stock is required")
    .min(0, "Minimum stock must be positive or zero"),
  category: yup.string().required("Category is required"),
  supplier: yup
    .string()
    .max(100, "Supplier name must be less than 100 characters"),
  status: yup
    .string()
    .oneOf(["active", "inactive"])
    .required("Status is required"),
});

export default function ProductInformation({
  product,
  isEditing,
}: ProductInformationProps) {
  // ✅ ADDED: Submit handler for updating product

  const intialValue = {
    _id: product._id,
    name: product.name,
    description: product.description,
    sku: product.sku,
    price: product.price,
    quantity: product.quantity,
    minStock: product.minStock,
    category: product.category,
    supplier: product.supplier,
    status: product.status,
  };

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Update product via API
      const response = await AxiosClient.put(
        `/api/products?id=${product._id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Product updated successfully");
        navigate(`/products/${product._id}`);
      } else {
        console.error("Error updating product:", error);
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Product Information
          </h2>
        </div>

        <Formik
          initialValues={intialValue}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <Form className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="product-name"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Product Name *
                </label>
                <Field
                  id="product-name"
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <ErrorMessage
                  name="name"
                  className="text-xs text-red-600"
                  component="p"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="product-category"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Category *
                </label>
                <Field
                  as="select"
                  id="product-category"
                  name="category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  {productCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="category"
                  className="text-xs text-red-600"
                  component="p"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700"
              >
                Description
              </label>
              <Field
                id="description"
                as="textarea"
                name="description"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
              />
              <ErrorMessage
                name="description"
                className="text-xs text-red-600"
                component="p"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="product-sku"
                  className="block text-sm font-semibold text-gray-700"
                >
                  SKU *
                </label>
                <Field
                  id="product-sku"
                  name="sku"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none font-mono"
                />
                <ErrorMessage
                  name="sku"
                  className="text-xs text-red-600"
                  component="p"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="product-price"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Price ($) *
                </label>
                <Field
                  id="product-price"
                  name="price"
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <ErrorMessage
                  name="price"
                  className="text-xs text-red-600"
                  component="p"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="product-quantity"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Quantity *
                </label>
                <Field
                  id="product-quantity"
                  name="quantity"
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <ErrorMessage
                  name="quantity"
                  className="text-xs text-red-600"
                  component="p"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="product-minStock"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Min Stock *
                </label>
                <Field
                  id="product-minStock"
                  name="minStock"
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
                <ErrorMessage
                  name="minStock"
                  className="text-xs text-red-600"
                  component="p"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="product-status"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Status *
                </label>
                <Field
                  as="select"
                  id="product-status"
                  name="status"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Field>
                <ErrorMessage
                  name="status"
                  className="text-xs text-red-600"
                  component="p"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="product-supplier"
                className="block text-sm font-semibold text-gray-700"
              >
                Supplier
              </label>
              <Field
                id="product-supplier"
                name="supplier"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <ErrorMessage
                name="supplier"
                className="text-xs text-red-600"
                component="p"
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <Link
                to={`/products/${product._id}`}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                name="intent"
                value="update"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 disabled:opacity-50"
              >
                <FaSave className="mr-2 h-4 w-4" />
                Save Changes
              </button>
            </div>
          </Form>
        </Formik>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Product Information
        </h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Product Name
            </span>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {product.name}
            </p>
          </div>

          <div>
            <span className="block text-sm font-medium text-gray-500">
              Category
            </span>
            <p className="mt-1 text-lg text-gray-900">{product.category}</p>
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-gray-500">
            Description
          </span>
          <p className="mt-1 text-gray-900">
            {product.description || "No description provided"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-500">SKU</span>
            <p className="mt-1 text-lg font-mono text-gray-900">
              {product.sku}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Price
            </span>
            <p className="mt-1 text-lg font-bold text-gray-900">
              ${product.price}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Current Stock
            </span>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {product.quantity}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Minimum Stock
            </span>
            <p className="mt-1 text-lg text-gray-900">{product.minStock}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Status
            </span>
            <p className="mt-1">
              <span
                className={`inline-flex px-2 py-1 text-sm font-medium rounded-full ${
                  product.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {product.status === "active" ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>

        {product.supplier && (
          <div>
            <span className="block text-sm font-medium text-gray-500">
              Supplier
            </span>
            <p className="mt-1 text-lg text-gray-900">{product.supplier}</p>
          </div>
        )}
      </div>
    </div>
  );
}
