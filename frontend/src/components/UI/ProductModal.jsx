import { useCart } from "../context/CartContext";
import DateTimeDisplay from "./DateTimeDisplay";

const ProductModal = ({ isOpen, onClose, products }) => {
  const { totalPrice, discount, finalAmount } = useCart();
  if (!isOpen) return null;

  return (
    <div
      className=" flex items-center justify-center fixed rounded-md w-[400px] font-inter"
      style={{ pointerEvents: "auto" }}
    >
      <div className=" bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white relative w-[400px]  p-6  rounded-md font-inter">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-2 right-3 text-gray-500 text-2xl hover:text-white"
        >
          ✖
        </button>
        <div className="w-full">
          <h1 className="mt-5 text-xl font-semibold text-center">
            Sales Receipt
          </h1>
          <p className="text-sm mt-5 self-end text-center">
            <DateTimeDisplay />
          </p>

          <table className="w-full mt-5 text-sm table-auto">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="px-2 py-1 text-left">Product</th>
                <th className="px-2 py-1 text-left">Qty</th>
                <th className="px-2 py-1 text-left">Price</th>
                <th className="px-2 py-1 text-left">Disc</th>
                <th className="px-2 py-1 text-left">Amt</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b border-gray-600">
                  <td className="px-2 py-1">{product.name}</td>
                  <td className="px-2 py-1">{product.quantity}</td>
                  <td className="px-2 py-1">${product.price}</td>
                </tr>
              ))}
              <tr>
                <td className="px-2 py-1"></td>
                <td className="px-2 py-1"></td>
                <td className="px-2 py-1"></td>
                <td className="px-2 py-1">${discount.toFixed(2)}</td>
                <td className="px-2 py-1">${totalPrice.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-4">
            <p className="mt-2 font-semibold text-center">
              <span className="text-center">Total:</span> $
              {finalAmount.toFixed(2)}
            </p>
          </div>

          <p className="mt-6 text-center text-sm text-gray-300 font-serif">
            Thank you for shopping. Have a nice day!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
