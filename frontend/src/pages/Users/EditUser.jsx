import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import Button from "../../components/UI/Button";
import { useDispatch } from "react-redux";
import { updateUser } from "../../components/redux/slice/users";

export default function EditUser() {
  const location = useLocation();
  const user = location.state?.user;

  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(user?.photo || null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      photo: user.photo,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      role: Yup.string().required("Role is required"),
      photo: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("role", values.role);
      formData.append("photo", values.photo);

      try {
        dispatch(updateUser({ id: user._id, userData: formData }));
        navigate("/users");
      } catch (error) {
        console.error("Updating User Failed: ", error);
        setMessage("Failed to update the user");
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue("photo", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (!user) {
    return <p className="text-red-500">Error: User data not found!</p>;
  }

  return (
    <div className="bg-slate-900 w-[400px] mx-auto my-[100px] text-white flex justify-center items-center p-12 rounded-2xl">
      <form onSubmit={formik.handleSubmit} className="w-full">
        {message && (
          <div className="text-white bg-red-600 rounded-lg p-2 mb-4 text-center">
            {message}
          </div>
        )}
        <h1 className="font-serif text-2xl mb-6 text-center">Edit User</h1>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Profile Photo</label>
          <div className="flex flex-col items-center gap-2">
            <div className="w-40 h-20 border-2 border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-slate-800">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <UploadCloud className="text-gray-400 w-10 h-10" />
              )}
            </div>
            <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2">
              <UploadCloud className="w-5 h-5" />
              Select Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">First Name</label>
          <input
            className="p-3 w-full rounded-md bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            {...formik.getFieldProps("firstName")}
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="text-red-500 font-sm mt-1">
              {formik.errors.firstName}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Last Name</label>
          <input
            className="p-3 w-full rounded-md bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            {...formik.getFieldProps("lastName")}
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="text-red-500 font-sm mt-1">
              {formik.errors.lastName}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Email</label>
          <input
            className="p-3 w-full rounded-md bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-600"
            type="email"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 font-sm mt-1">
              {formik.errors.email}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Role</label>
          <input
            className="p-3 w-full rounded-md bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            {...formik.getFieldProps("role")}
          />
          {formik.touched.role && formik.errors.role && (
            <div className="text-red-500 font-sm mt-1">
              {formik.errors.role}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center mt-6">
          <Button colorType="primary">Update User</Button>
        </div>
      </form>
    </div>
  );
}
