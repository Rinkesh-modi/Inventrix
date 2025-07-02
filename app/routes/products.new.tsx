import { Link, useNavigate } from "@remix-run/react";
import {
  ErrorMessage,
  Field,
  Form as FormikForm,
  Formik,
  FormikHelpers,
} from "formik";
import * as yup from "yup";
import {
  FaArrowLeft,
  FaSave,
  FaBox,
  FaTag,
  FaDollarSign,
  FaCube,
  FaWarehouse,
  FaTruck,
  FaFileAlt,
} from "react-icons/fa";
import { AxiosClient } from "~/utils/AxiosClient";
import toast from "react-hot-toast";
import { useState } from "react";

interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  minStock: number;
  category: string;
  supplier: string;
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

export default function ProductsNew() {
  const initialValues: ProductFormData = {
    name: "",
    description: "",
    sku: "",
    price: 0,
    quantity: 0,
    minStock: 0,
    category: "",
    supplier: "",
  };
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Product name is required").min(2),
    description: yup.string().max(500),
    sku: yup.string().required("SKU is required").min(3),
    price: yup.number().required().min(0),
    quantity: yup.number().required().min(0),
    minStock: yup.number().required().min(0),
    category: yup.string().required("Category is required"),
    supplier: yup.string().max(100),
  });

  const generateSKU = (name: string, category: string) => {
    const namePrefix = name.slice(0, 2).toUpperCase();
    const categoryPrefix = category.slice(0, 2).toUpperCase();
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${namePrefix}${categoryPrefix}-${randomNum}`;
  };

  const handleSubmit = async (
    values: ProductFormData,
    helpers: FormikHelpers<ProductFormData>
  ) => {
    try {
      setLoading(true);
      console.log("Form values:", values);
      const response = await AxiosClient.post("/api/products", values);
      const data = response.data;
      if (response.status === 201) {
        console.log("Product created Successfully", data);
        toast.success("Product created successfully");
        helpers.resetForm();
        navigate("/products");
      }
    } catch (error: any) {
      toast.error(
        error.response.data.error ||
          "An error occurred while submitting the form."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/products"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
              >
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
              <div className="h-6 w-px bg-slate-300"></div>
              <div className="flex items-center space-x-2">
                <FaBox className="h-5 w-5 text-indigo-600" />
                <h1 className="text-xl font-bold text-slate-900">
                  Add New Product
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <FaBox className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Create New Product
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Add a new product to your inventory with detailed information and
            specifications
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <FormikForm className="space-y-8">
              {/* Basic Information Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <FaFileAlt className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">
                      Basic Information
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="flex items-center space-x-2 text-sm font-semibold text-slate-700"
                      >
                        <FaTag className="h-4 w-4 text-indigo-500" />
                        <span>Product Name *</span>
                      </label>
                      <Field
                        id="name"
                        name="name"
                        type="text"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-slate-900"
                        placeholder="Enter product name"
                      />
                      <ErrorMessage
                        name="name"
                        component="p"
                        className="text-xs text-red-500 font-medium mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="category"
                        className="flex items-center space-x-2 text-sm font-semibold text-slate-700"
                      >
                        <FaCube className="h-4 w-4 text-indigo-500" />
                        <span>Category *</span>
                      </label>
                      <Field
                        as="select"
                        id="category"
                        name="category"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-slate-900"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          setFieldValue("category", e.target.value);
                          if (values.name && e.target.value) {
                            setFieldValue(
                              "sku",
                              generateSKU(values.name, e.target.value)
                            );
                          }
                        }}
                      >
                        <option value="">Select a category</option>
                        {productCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="category"
                        component="p"
                        className="text-xs text-red-500 font-medium mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="description"
                      className="flex items-center space-x-2 text-sm font-semibold text-slate-700"
                    >
                      <FaFileAlt className="h-4 w-4 text-indigo-500" />
                      <span>Description</span>
                    </label>
                    <Field
                      id="description"
                      as="textarea"
                      name="description"
                      rows={4}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md resize-none text-slate-900"
                      placeholder="Enter a detailed product description..."
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="text-xs text-red-500 font-medium mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <FaDollarSign className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">
                      Pricing & Inventory
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="sku"
                        className="flex items-center space-x-2 text-sm font-semibold text-slate-700"
                      >
                        <FaTag className="h-4 w-4 text-emerald-500" />
                        <span>SKU *</span>
                      </label>
                      <Field
                        id="sku"
                        name="sku"
                        type="text"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md font-mono text-sm text-slate-900"
                        placeholder="e.g., WH-001"
                      />
                      <ErrorMessage
                        name="sku"
                        component="p"
                        className="text-xs text-red-500 font-medium mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="price"
                        className="flex items-center space-x-2 text-sm font-semibold text-slate-700"
                      >
                        <FaDollarSign className="h-4 w-4 text-emerald-500" />
                        <span>Price ($) *</span>
                      </label>
                      <Field
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-slate-900"
                        placeholder="0.00"
                      />
                      <ErrorMessage
                        name="price"
                        component="p"
                        className="text-xs text-red-500 font-medium mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="quantity"
                        className="flex items-center space-x-2 text-sm font-semibold text-slate-700"
                      >
                        <FaWarehouse className="h-4 w-4 text-emerald-500" />
                        <span>Initial Quantity *</span>
                      </label>
                      <Field
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="0"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-slate-900"
                        placeholder="0"
                      />
                      <ErrorMessage
                        name="quantity"
                        component="p"
                        className="text-xs text-red-500 font-medium mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="minStock"
                        className="flex items-center space-x-2 text-sm font-semibold text-slate-700"
                      >
                        <FaWarehouse className="h-4 w-4 text-emerald-500" />
                        <span>Minimum Stock Level *</span>
                      </label>
                      <Field
                        id="minStock"
                        name="minStock"
                        type="number"
                        min="0"
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-slate-900"
                        placeholder="0"
                      />
                      <ErrorMessage
                        name="minStock"
                        component="p"
                        className="text-xs text-red-500 font-medium mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Supplier Information Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <FaTruck className="h-5 w-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">
                      Supplier Information
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="supplier"
                      className="flex items-center space-x-2 text-sm font-semibold text-slate-700"
                    >
                      <FaTruck className="h-4 w-4 text-orange-500" />
                      <span>Supplier Name</span>
                    </label>
                    <Field
                      id="supplier"
                      name="supplier"
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md text-slate-900"
                      placeholder="Enter supplier name (optional)"
                    />
                    <ErrorMessage
                      name="supplier"
                      component="p"
                      className="text-xs text-red-500 font-medium mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6">
                <Link
                  to="/products"
                  className="px-8 py-3 border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-400 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-8 py-3 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2 h-4 w-4" />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </main>
    </div>
  );
}
