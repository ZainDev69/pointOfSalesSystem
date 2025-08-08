import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import Button from "./../../components/UI/Button";
import { useDispatch } from "react-redux";
import { addProduct } from "../../components/redux/slice/product";

export default function AddProduct() {
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      image: null,
      stockQuantity: 0,
      category: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number().required("Price is required"),
      image: Yup.mixed().required("Image is required"),
      stockQuantity: Yup.number().required("Stock is required"),
      category: Yup.string().required("Category is required"),
    }),
    onSubmit: async (values) => {
      console.log("Submitting form with values for the Product:", values);
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("stockQuantity", values.stockQuantity);
      formData.append("category", values.category);
      formData.append("image", values.image);
      try {
        dispatch(addProduct(formData));
        navigate("/products");
        console.log(
          "The formik function for adding the Product into DB has done its work now successfully..."
        );
      } catch (error) {
        console.error("Adding Product Failed: ", error);
        setMessage("Failed to Add the Product");
      }
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log("Selected file:", file);
    if (file) {
      formik.setFieldValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-slate-900 w-[400px] mx-auto my-[100px] text-white flex justify-center items-center p-12 rounded-2xl">
      <form onSubmit={formik.handleSubmit} className="w-full">
        {message && (
          <div
            className="text-white bg-red-600 
             rounded-lg p-2 mb-4 text-center"
          >
            {message}
          </div>
        )}
        <h1 className="font-serif text-2xl mb-6 text-center">Add Product</h1>

        {/* Image Upload Field */}
        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Image</label>
          <div className="flex flex-col items-center gap-2">
            {/* Preview */}
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

            {/* File Input */}
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
          {formik.touched.image && formik.errors.image && (
            <div className="text-red-500 font-sm mt-1">
              {formik.errors.image}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Name</label>
          <input
            className="placeholder:text-green-500 p-3 w-full rounded-md bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            name="name"
            placeholder="Name"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="text-red-500 font-sm mt-1">
              {formik.errors.name}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Description</label>
          <input
            className="placeholder:text-green-500 p-3 w-full rounded-md bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            name="description"
            placeholder="Description"
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 font-sm mt-1">
              {formik.errors.description}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Price</label>
          <input
            className="placeholder:text-green-500 p-3 w-full rounded-md bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            name="price"
            placeholder="Price"
            {...formik.getFieldProps("price")}
          />
          {formik.touched.price && formik.errors.price && (
            <div className="text-red-500 font-sm mt-1">
              {formik.errors.price}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Quantity</label>
          <input
            className="placeholder:text-green-500 p-3 w-full rounded-md bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            name="stockQuantity"
            placeholder="Add Stock"
            {...formik.getFieldProps("stockQuantity")}
          />
          {formik.touched.stockQuantity && formik.errors.stockQuantity && (
            <div className="text-red-500 font-sm mt-1">
              {formik.errors.stockQuantity}
            </div>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <label className="font-serif mb-2">Category</label>
          <input
            className=" placeholder:text-green-500 p-3 w-full rounded-md bg-slate-800 text-white outline-none focus:ring-2 focus:ring-indigo-600"
            type="text"
            name="category"
            placeholder="Category"
            {...formik.getFieldProps("category")}
          />
          {formik.touched.category && formik.errors.category && (
            <div className="text-red-500 font-sm mt-1">
              {formik.errors.category}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center mt-6">
          <Button type="submit" colorType="primary">
            Add Product
          </Button>
        </div>
      </form>
    </div>
  );
}
