import { ActionFunctionArgs } from "@remix-run/node";
import mongoose from "mongoose";
import { User } from "~/models/User";
import { ConnectDB } from "~/utils/database";
import { verifyToken } from "~/utils/JWTAuth";

export const loader = async ({ request }: ActionFunctionArgs) => {
  try {
    const header = await request.headers.get("Authorization");
    if (!header) {
      throw new Error("Unauthorized access");
    }

    const token = header.split(" ")[1];
    if (!token) {
      throw new Error("Token not found");
    }

    const user = verifyToken(token);

    await ConnectDB();
    const findUser = await User.findById(user).select("name email role");
    return new Response(JSON.stringify(findUser), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        message: "Failed to fetch profile data",
        error: error.message,
      })
    );
  }
};
