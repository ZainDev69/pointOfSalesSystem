import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";
import { totalCartItems } from "../redux/slice/cart";

export default function CartButton({ onClick }) {
  const cartItems = useSelector(totalCartItems);
  return (
    <button
      onClick={onClick}
      className=" cursor-pointer relative p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300"
    >
      <ShoppingCartIcon className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 bg-red-600 text-xs text-white px-1.5 py-0.5 rounded-full ">
        {cartItems}
      </span>
    </button>
  );
}
