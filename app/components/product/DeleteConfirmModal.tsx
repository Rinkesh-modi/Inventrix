// app/components/product/DeleteConfirmModal.tsx
import { Form, useNavigate } from "@remix-run/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Product } from "~/types/product";
import { AxiosClient } from "~/utils/AxiosClient";

interface DeleteConfirmModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onDeleteSuccess?: () => void;
}

export default function DeleteConfirmModal({
  product,
  isOpen,
  onClose,
  onDeleteSuccess,
}: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await AxiosClient.delete(
        `/api/products?id=${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Product deleted successfully");
        if (onDeleteSuccess) {
          onDeleteSuccess();
          navigate("/products");
        } else {
          navigate("/products");
        }
      } else {
        console.error("Error deleting product:", error);
      }
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Confirm Delete
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete {product.name}? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <Form method="post">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete Product"}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
