import { ShoppingCart, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../redux/slice/cart";
import { deleteProduct } from "../redux/slice/product";
import { useNavigate } from "react-router-dom";

export default function Card({ data }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id, name, price, image, description, stockQuantity } = data;

  const cartStock = useSelector((state) =>
    state.cart.cart
      .filter((item) => item.itemId === _id)
      .reduce((total, item) => total + item.quantity, 0)
  );

  function handleAddToCart() {
    const newItem = {
      itemId: _id,
      name,
      quantity: 1,
      price,
      totalPrice: price * 1,
    };
    if (cartStock < 1) {
      dispatch(addItem(newItem));
    } else {
      alert("Go to cart Page to increase its quantity");
    }
  }

  function handleDeleteProduct() {
    dispatch(deleteProduct(_id));
  }

  function handleEditProduct() {
    navigate("/edit-product", { state: { product: data } });
  }

  return (
    <div className="flex flex-col w-[250px] items-center justify-center rounded-md p-3 my-5 relative">
      <img
        src={`${import.meta.env.VITE_API_URL}/img/products/${image}`}
        alt="Image"
        className={` object-contain w-[200px] h-[200px] rounded-md my-4 ${
          data.stockQuantity === 0 ? "" : "hover:opacity-60 cursor-pointer"
        }`}
      />

      <div className="mb-4 text-center">
        <p className="text-md font-poppins">{name}</p>
        <p className="text-sm font-cursive text-gray-600 ">{description}</p>
        {stockQuantity === 0 ? (
          <div className="flex items-center justify-center mt-5 bg-red-600 text-white font-bold rounded-md p-2 w-full">
            <span className="mr-2">Out of Stock</span>
            <Trash2 size={18} />
          </div>
        ) : (
          <p className="font-cursive mt-3 bg-green-500 rounded-md p-2">
            Stock Quantity - {stockQuantity}
          </p>
        )}
      </div>

      {stockQuantity > 0 && user.role !== "admin" ? (
        <div className="mt-2 flex items-center justify-between gap-10">
          <p className="text-sm font-cursive text-gray-600 ">${price}</p>
          <button
            onClick={handleAddToCart}
            className="flex text-lg items-center gap-3 font-cursive bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 cursor-pointer rounded-sm"
          >
            <span>Cart</span>
            <ShoppingCart className="w-[15px] h-[15px]" />
          </button>
        </div>
      ) : (
        ""
      )}
      {user.role === "admin" ? (
        <div className="flex items-center justify-between w-full mt-3">
          <button
            onClick={() => handleEditProduct()}
            className="flex text-sm items-center gap-2 font-serif bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 cursor-pointer rounded-sm"
          >
            <span>Edit</span>
            <Pencil size={15} />
          </button>
          <button
            onClick={() => handleDeleteProduct()}
            className="flex text-sm items-center gap-2 font-serif bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 cursor-pointer rounded-sm"
          >
            <span>Delete</span>
            <Trash2 size={15} />
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
