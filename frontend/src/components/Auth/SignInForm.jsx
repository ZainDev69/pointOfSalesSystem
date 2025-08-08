import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/slice/auth";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import Button from "../UI/Button";

export default function SignInForm() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [toggle, setToggle] = useState(false);
  const dispatch = useDispatch();

  const TogglePassword = () => {
    setToggle((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await dispatch(loginUser(values)).unwrap();
        setMessage(`Sign-In Successfully!`);
        navigate("/products");
      } catch (error) {
        console.error("Login failed:", error);
        setMessage("Invalid email or password");
      }
    },
  });

  return (
    <div className="bg-slate-900 rounded-lg mt-8 text-white flex flex-col w-[400px] p-14 justify-center items-center shadow-lg">
      <form onSubmit={formik.handleSubmit} className="w-full">
        {message && (
          <div className="text-white bg-red-600 rounded-lg p-2 mb-4 text-center">
            {message}
          </div>
        )}
        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Email address</label>
          <div className="relative">
            <input
              className="p-3 w-full rounded-md outline-none bg-slate-800 text-white focus:ring-2 focus:ring-indigo-600"
              type="email"
              name="email"
              placeholder="Enter your Email"
              {...formik.getFieldProps("email")}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Password</label>
          <div className="relative flex items-center">
            <input
              type={toggle ? "text" : "password"}
              name="password"
              placeholder="Enter your Password"
              className="p-3 w-full rounded-md outline-none bg-slate-800 text-white focus:ring-2 focus:ring-indigo-600"
              {...formik.getFieldProps("password")}
            />
            <button
              type="button"
              onClick={TogglePassword}
              className="absolute right-3 text-white"
            >
              {toggle ? <FaRegEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center mt-6">
          <Button type="submit" colorType="primary">
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
