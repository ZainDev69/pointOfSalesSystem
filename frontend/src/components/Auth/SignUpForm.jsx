import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { signup } from "../redux/slice/auth";
import Button from "../UI/Button";

export default function SignUpForm() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [togglePassword, setTogglePassword] = useState(false);
  const [togglePasswordConfirm, setTogglePasswordConfirm] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "First Name must be at least 3 characters")
        .required("First Name is required"),
      lastName: Yup.string()
        .min(3, "Last Name must be at least 3 characters")
        .required("Last Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      console.log("Submitting form with values:", values);

      try {
        await dispatch(signup(values)).unwrap();
        navigate("/products");
      } catch (error) {
        console.error("SignUp Failed: ", error);
        setMessage("Failed to SignUp. Please try again.");
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
          <label className="font-serif mb-2">First Name</label>
          <div className="relative">
            <input
              className="p-3 w-full rounded-md outline-none bg-slate-800 text-white focus:ring-2 focus:ring-indigo-600"
              type="text"
              name="firstName"
              placeholder="Enter FirstName"
              {...formik.getFieldProps("firstName")}
            />
          </div>
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.firstName}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Last Name</label>
          <div className="relative">
            <input
              className="p-3 w-full rounded-md outline-none bg-slate-800 text-white focus:ring-2 focus:ring-indigo-600"
              type="text"
              name="lastName"
              placeholder="Enter LastName"
              {...formik.getFieldProps("lastName")}
            />
          </div>
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.lastName}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Email</label>
          <div className="relative">
            <input
              className="p-3 w-full rounded-md outline-none bg-slate-800 text-white focus:ring-2 focus:ring-indigo-600"
              type="email"
              name="email"
              placeholder="Enter your Email"
              {...formik.getFieldProps("email")}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-2">
          <label className="font-serif mb-2">Password</label>
          <div className="relative flex items-center">
            <input
              type={togglePassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              className="p-3 w-full rounded-md outline-none bg-slate-800 text-white focus:ring-2 focus:ring-indigo-600"
              {...formik.getFieldProps("password")}
            />
            <button
              type="button"
              onClick={() => setTogglePassword(!togglePassword)}
              className="absolute right-3 text-white"
            >
              {togglePassword ? <FaRegEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif my-4">Confirm Password</label>
          <div className="relative flex items-center">
            <input
              type={togglePasswordConfirm ? "text" : "password"}
              name="passwordConfirm"
              placeholder="Enter the Password Again"
              className="p-3 w-full rounded-md outline-none bg-slate-800 text-white focus:ring-2 focus:ring-indigo-600"
              {...formik.getFieldProps("passwordConfirm")}
            />
            <button
              type="button"
              onClick={() => setTogglePasswordConfirm(!togglePasswordConfirm)}
              className="absolute right-3 text-white"
            >
              {togglePasswordConfirm ? <FaRegEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formik.touched.passwordConfirm && formik.errors.passwordConfirm && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.passwordConfirm}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center mt-6">
          <Button type="submit" colorType="primary">
            Sign Up
          </Button>
        </div>
      </form>
    </div>
  );
}
