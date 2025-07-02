import { Link, useNavigate } from "@remix-run/react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as yup from "yup";
import CustomButtons from "~/components/auth/CustomButtons";
import { LoginProps } from "~/types/auth";
import { AxiosClient } from "~/utils/AxiosClient";

const LoginPage = () => {
  const [isHide, setIsHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initalState: LoginProps = {
    email: "",
    password: "",
    role: "staff",
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: yup.string().oneOf(["admin", "staff"]).required("Role is required"),
  });

  const handleSubmit = async (
    values: LoginProps,
    helpers: FormikHelpers<LoginProps>
  ) => {
    try {
      setLoading(true);
      console.log("Form submitted with values:", values);
      const response = await AxiosClient.post("/api/login", values);
      if (response.status == 200) {
        console.log("Login successful:", response.data);
        localStorage.setItem("token", response.data.token);
        toast.success("Logged In successfully!");
        helpers.resetForm();
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(
        error.response.data.error || "Logged In failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
              Inventrix
            </h1>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to access your inventory dashboard
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8">
          <Formik
            initialValues={initalState}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <Field
                  name="email"
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border text-black border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                  placeholder="Enter your email address"
                />
                <ErrorMessage
                  name="email"
                  className="text-xs text-accent-error font-medium"
                  component="p"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <Field
                    name="password"
                    type={isHide ? "password" : "text"}
                    id="password"
                    className="w-full px-4 py-3 text-black pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600 transition-colors duration-200"
                    onClick={() => setIsHide(!isHide)}
                  >
                    {isHide ? (
                      <FaEye className="w-5 h-5" />
                    ) : (
                      <FaEyeSlash className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  className="text-xs text-accent-error font-medium"
                  component="p"
                />
              </div>

              {/* Role Selection */}
              <div className="space-y-3">
                <label
                  htmlFor="role-admin"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Login as
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative" htmlFor="role-admin">
                    <Field
                      id="role-admin"
                      type="radio"
                      name="role"
                      value="admin"
                      className="sr-only peer"
                    />
                    <div className="w-full p-3 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:border-primary-300 hover:bg-primary-25 bg-white/70 backdrop-blur-sm">
                      <div className="flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 peer-checked:text-primary-700">
                          👑 Admin
                        </span>
                      </div>
                    </div>
                  </label>
                  <label className="relative" htmlFor="role-staff">
                    <Field
                      id="role-staff"
                      type="radio"
                      name="role"
                      value="staff"
                      className="sr-only peer"
                    />
                    <div className="w-full p-3 border-2 border-gray-200 rounded-lg cursor-pointer transition-all duration-200 peer-checked:border-primary-500 peer-checked:bg-primary-50 hover:border-primary-300 hover:bg-primary-25 bg-white/70 backdrop-blur-sm">
                      <div className="flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700 peer-checked:text-primary-700">
                          👤 Staff
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
                <ErrorMessage
                  name="role"
                  className="text-xs text-accent-error font-medium"
                  component="p"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200 font-medium"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <CustomButtons text="Sign In" type="submit" loading={loading} />
              </div>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-primary-600 hover:text-primary-700 transition-colors duration-200"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </Form>
          </Formik>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{" "}
            <Link
              to="/terms"
              className="text-primary-600 hover:text-primary-700"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-primary-600 hover:text-primary-700"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// import { Link } from "@remix-run/react";
// import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
// import React, { useState } from "react";
// import toast from "react-hot-toast";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import * as yup from "yup";
// import CustomButtons from "~/components/auth/CustomButtons";
// import { LoginProps } from "~/types/auth";
// const LoginPage = () => {
//   const [isHide, setIsHide] = useState(true);
//   const [loading, setLoading] = useState(false);

//   const initalState: LoginProps = {
//     email: "",
//     password: "",
//     role: "staff",
//   };

//   const validationSchema = yup.object().shape({
//     email: yup
//       .string()
//       .email("Invalid email format")
//       .required("Email is required"),
//     password: yup
//       .string()
//       .min(6, "Password must be at least 6 characters")
//       .required("Password is required"),
//     role: yup.string().oneOf(["admin", "staff"]).required("Role is required"),
//   });

//   const handleSubmit = (
//     values: LoginProps,
//     helpers: FormikHelpers<LoginProps>
//   ) => {
//     try {
//       console.log("Form submitted with values:", values);
//       toast.success("Logged In successfully!");
//       helpers.resetForm();
//     } catch (error) {
//       toast.error("Logged In failed. Please try again.");
//     }
//   };

//   return (
//     <Formik
//       initialValues={initalState}
//       validationSchema={validationSchema}
//       onSubmit={handleSubmit}
//     >
//       <Form className=" w-full lg:w-1/2 xl:w-1/3  mx-auto bg-white text-black py-10 px-2 rounded-md border border-yellow-400 font-pregular">
//         <div className="mb-3">
//           <label htmlFor="email">Email</label>
//           <Field
//             name="email"
//             type="email"
//             id="email"
//             className="w-full py-3 px-2 border-b-black border-b  text-black bg-gray-300 outline-none focus:rounded-md focus:bg-gray-200"
//             placeholder="Enter your Email Address"
//           />
//           <ErrorMessage
//             name="email"
//             className="text-xs text-red-500"
//             component={"p"}
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="password">Password</label>
//           <div className="flex items-center gap-x-2 border-b-black border-b  bg-gray-300 outline-none focus:rounded-md focus:bg-gray-200 px-3">
//             <Field
//               name="password"
//               type={isHide ? "password" : "text"}
//               id="password"
//               className="w-full py-3 px-2  bg-transparent outline-none border-none"
//               placeholder="Enter your Password"
//             />
//             <button
//               type="button"
//               className="text-xl"
//               onClick={() => setIsHide(!isHide)}
//             >
//               {isHide ? <FaEye /> : <FaEyeSlash />}
//             </button>
//           </div>
//           <ErrorMessage
//             name="password"
//             className="text-xs text-red-500"
//             component={"p"}
//           />
//         </div>
//         <div className="mb-3">
//           <label htmlFor="role-admin" className="block mb-1 font-semibold">
//             Select Role
//           </label>
//           <div className="flex gap-4">
//             <label htmlFor="role-admin" className="flex items-center gap-1">
//               <Field id="role-admin" type="radio" name="role" value="admin" />
//               <span>Admin</span>
//             </label>
//             <label htmlFor="role-staff" className="flex items-center gap-1">
//               <Field id="role-staff" type="radio" name="role" value="staff" />
//               <span>Staff</span>
//             </label>
//           </div>
//           <ErrorMessage
//             name="role"
//             className="text-xs text-red-500"
//             component="p"
//           />
//         </div>

//         <div className="mb-3">
//           <CustomButtons text="Login" type="submit" loading={loading} />
//         </div>
//       </Form>
//     </Formik>
//   );
// };

// export default LoginPage;
