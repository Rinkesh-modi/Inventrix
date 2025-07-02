import { ActionFunctionArgs } from "@remix-run/node";
import { Product } from "~/models/Product";
import { ConnectDB } from "~/utils/database";

const validateProduct = (data: any) => {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Product name must be at least 2 characters");
  }
  if (!data.sku || data.sku.trim().length < 3) {
    errors.push("SKU must be at least 3 characters");
  }
  if (!data.category || data.category.trim().length === 0) {
    errors.push("Category is required");
  }
  if (data.price === undefined || data.price < 0) {
    errors.push("Price must be 0 or greater");
  }
  if (data.quantity === undefined || data.quantity < 0) {
    errors.push("Quantity must be 0 or greater");
  }
  if (data.minStock === undefined || data.minStock < 0) {
    errors.push("Minimum stock must be 0 or greater");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(", "));
  }

  return {
    name: data.name.trim(),
    description: data.description?.trim() || "",
    sku: data.sku.trim(),
    price: parseFloat(data.price),
    quantity: parseInt(data.quantity),
    minStock: parseInt(data.minStock),
    category: data.category.trim(),
    supplier: data.supplier?.trim() || "",
  };
};

export const loader = async ({ request }: ActionFunctionArgs) => {
  await ConnectDB();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  try {
    if (id) {
      const product = await Product.findById(id);
      if (!product) {
        return new Response(
          JSON.stringify({
            error: "Product not found",
          }),
          {
            status: 404,
          }
        );
      }
      return new Response(
        JSON.stringify({
          message: "Product fetched successfully",
          product: product,
        }),
        {
          status: 200,
        }
      );
    } else {
      const products = await Product.find().sort({ createdAt: -1 });
      return new Response(
        JSON.stringify({
          message: "Products fetched successfully",
          products: products,
        }),
        {
          status: 200,
        }
      );
    }
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch products" }),
      { status: 500 }
    );
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const method = request.method;
  await ConnectDB();
  try {
    switch (method) {
      case "POST": {
        const data = await request.json();
        const existingProduct = await Product.findOne({ sku: data.sku });
        if (existingProduct) {
          return new Response(
            JSON.stringify({
              message: "Product already exists",
              existingProduct,
            }),
            {
              status: 400,
            }
          );
        }
        const validatedData = validateProduct(data);

        const newProduct = await Product.create(validatedData);
        return new Response(
          JSON.stringify({
            message: "Product created successfully",
            product: newProduct,
          }),
          {
            status: 201,
          }
        );
      }
      case "PUT": {
        const data = await request.json();
        if (!data._id) {
          return new Response(
            JSON.stringify({ error: "Product ID is required" }),
            {
              status: 400,
            }
          );
        }

        const validatedData = validateProduct(data);
        const updatedProduct = await Product.findByIdAndUpdate(
          data._id,
          validatedData,
          {
            new: true,
          }
        );

        if (!updatedProduct) {
          return new Response(JSON.stringify({ error: "Product not found" }), {
            status: 404,
          });
        }

        return new Response(
          JSON.stringify({
            message: "Product updated successfully",
            product: updatedProduct,
          }),
          { status: 200 }
        );
      }

      case "DELETE": {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        if (!id) {
          return new Response(
            JSON.stringify({ error: "Product ID is required" }),
            { status: 400 }
          );
        }

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
          return new Response(JSON.stringify({ error: "Product not found" }), {
            status: 404,
          });
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "Product deleted successfully",
            product: deletedProduct,
          }),
          { status: 200 }
        );
      }
      default:
        return new Response(JSON.stringify({ error: "Method not supported" }), {
          status: 405,
        });
    }
  } catch (error: any) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message || "Something went wrong" }),
      { status: 500 }
    );
  }
};
