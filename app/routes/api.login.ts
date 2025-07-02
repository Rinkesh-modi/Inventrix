import { ActionFunctionArgs } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { User } from "~/models/User";
import { ConnectDB } from "~/utils/database";
import { generateToken } from "~/utils/JWTAuth";

export const loader = async () => {
  ConnectDB();
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    await ConnectDB();
    const data = await request.json();

    if (!data.email || !data.password || !data.role) {
      throw new Error("Missing email or password or role");
    }

    const user = await User.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const isValidRole = user.role === data.role;
    if (!isValidRole) {
      throw new Error("Invalid role");
    }

    const token = generateToken(user._id.toString());

    // Here you would typically set a session or token for the user
    return new Response(
      JSON.stringify({ message: "Login successful", token: token }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({ message: "Login failed", error: error.message }),
      {
        status: 500,
      }
    );
  }
};
