// app/routes/products.$id.tsx
import {
  useLoaderData,
  useNavigation,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import Header from "~/components/Header";
import DeleteConfirmModal from "~/components/product/DeleteConfirmModal";
import ProductHeader from "~/components/product/ProductHeader";
import ProductInformation from "~/components/product/ProductInformation";
import ProductMeta from "~/components/product/ProductMeta";
import StockOverview from "~/components/product/StockOverview";
import { useMainContext } from "~/context/MainContext";
import { Product } from "~/types/product";
import { AxiosClient } from "~/utils/AxiosClient";
export default function ProductDetails() {
  const navigation = useNavigation();
  const { user } = useMainContext();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await AxiosClient.get(`/api/products?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProduct(response.data.product); // ✅ Set actual product
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const isEditing = searchParams.get("edit") === "true";

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="p-6 text-center text-red-600">Product not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="products" />
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ProductHeader
          product={product}
          user={user}
          isEditing={isEditing}
          onDeleteClick={() => setShowDeleteConfirm(true)}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <ProductInformation product={product} isEditing={isEditing} />
          </div>

          <div className="space-y-6">
            <StockOverview product={product} />
            <ProductMeta product={product} />
          </div>
        </div>

        <DeleteConfirmModal
          product={product}
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
        />
      </main>
    </div>
  );
}
