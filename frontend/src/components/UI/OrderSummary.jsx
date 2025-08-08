import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/UI/Button";
import { totalCartPrice } from "../../components/redux/slice/cart";
import { useCart } from "../context/CartContext";
import { updateBulk } from "../redux/slice/product";

export default function OrderSummary({ setIsModalOpen }) {
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const CartTotalPrice = useSelector(totalCartPrice);
  const soldItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  const {
    discount,
    setDiscount,
    finalAmount,
    setFinalAmount,
    totalPrice,
    setTotalPrice,
  } = useCart();

  function handleDiscount() {
    if (!isDiscountApplied) {
      const discountAmount = totalPrice * 0.05;
      setDiscount(discountAmount);
      setIsDiscountApplied(true);
    }
  }

  function handlePayNow() {
    setIsModalOpen(true);
    dispatch(updateBulk(soldItems));
  }

  useEffect(() => {
    setTotalPrice(CartTotalPrice);
  }, [CartTotalPrice]);

  useEffect(() => {
    setFinalAmount(totalPrice - discount);
  }, [setFinalAmount, totalPrice, discount]);

  return (
    <div className="bg-gray-200 rounded-md w-[300px] flex flex-col py-5 font-inter">
      <h2 className="text-xl text-start ml-4 mb-2">Order summary</h2>
      <p className="text-start mx-4 my-3 text-gray-600 flex justify-between">
        <span>Subtotal</span>
        <span>${totalPrice.toFixed(2)}</span>
      </p>
      <hr className="text-gray-400 mx-2" />
      <p className="text-start mx-4 my-3 text-gray-600 flex justify-between">
        <button
          onClick={handleDiscount}
          disabled={isDiscountApplied}
          className={`px-2 py-2 text-white rounded-sm text-sm ${
            isDiscountApplied
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-slate-900 hover:bg-slate-800 cursor-pointer"
          }`}
        >
          {isDiscountApplied ? "Discount Applied" : "Apply 5% Discount"}
        </button>
        <span>${discount.toFixed(2)}</span>
      </p>
      <hr className="text-gray-400 mx-2" />
      <p className="text-start mx-4 my-3 text-gray-600 flex justify-between">
        <span>Order Total</span>
        <span>${finalAmount.toFixed(2)}</span>
      </p>
      <hr className="text-gray-400 mx-2" />
      <div className="text-center mt-4 ">
        <Button colorType="primary" onClick={handlePayNow}>
          Pay Now
        </Button>
      </div>
    </div>
  );
}
