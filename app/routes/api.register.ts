import { ActionFunctionArgs } from "@remix-run/node";
import { User } from "~/models/User";
import { ConnectDB } from "~/utils/database";
import bcrypt from "bcryptjs";

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    await ConnectDB();
    const data = await request.json();

    if (!data.name || !data.email || !data.password || !data.role) {
      throw new Error("Missing fields");
    }

    const checkUser = await User.findOne({ email: data.email.toLowerCase() });
    if (checkUser) {
      throw new Error("User already exists with this email");
    }

    const hasPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hasPassword,
      role: data.role,
    });

    return new Response(
      JSON.stringify({ message: "Registration successful", user }),
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ message: "Registration failed", error: error.message }),
      {
        status: 500,
      }
    );
  }
};
