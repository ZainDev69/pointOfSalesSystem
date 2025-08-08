import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart } from "../../components/redux/slice/cart";
import EmptyCart from "../../components/UI/EmptyCart";
import CartItem from "./CartItem";
import OrderSummary from "../../components/UI/OrderSummary";
import ProductModal from "../../components/UI/ProductModal";
import { useState } from "react";

export default function CartPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector(getCart);

  const handleCloseModal = () => {
    dispatch(clearCart());
    setIsModalOpen(false);
    navigate("/products");
  };

  if (cart.length === 0) return <EmptyCart />;

  return (
    <div className="flex flex-col my-[100px] items-center justify-center">
      <div className="self-start mt-4 mx-4">
        <Button onClick={() => navigate("/products")} colorType="primary">
          Back to Products
        </Button>
      </div>

      <ProductModal
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onClose={handleCloseModal}
        products={cart}
      />

      <h1 className="text-black mt-4 text-4xl font-semibold text-center">
        Your Cart
      </h1>

      <div className="my-8 flex justify-between gap-[150px]">
        <div>
          <ul className="divide-y divide-stone-200 border-b mt-3">
            {cart.map((item) => (
              <CartItem item={item} key={item.itemId} />
            ))}
          </ul>

          <div className="mt-6 space-x-2 text-center">
            <Button colorType="primary" onClick={() => dispatch(clearCart())}>
              Clear cart
            </Button>
          </div>
        </div>
        <OrderSummary setIsModalOpen={setIsModalOpen} />
      </div>
    </div>
  );
}
