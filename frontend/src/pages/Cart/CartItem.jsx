import { useDispatch } from "react-redux";
import Button from "../../components/UI/Button";
import UpdateCartQuantity from "../../components/UI/updateCartQuantity";
import { removeItem } from "../../components/redux/slice/cart";

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  return (
    <div className="mt-5 flex justify-between gap-5">
      <div>
        <p className="flex items-center justify-between gap-3 text-gray-500 font-roboto">
          <span>{item.quantity}</span>
          <span>&times; </span>
          <span>{item.name}</span>
        </p>
      </div>

      <div className="mb-4">
        <p className="flex items-center justify-between gap-3 text-gray-500 font-roboto">
          <span>${item.price}</span>
          <span>
            <UpdateCartQuantity itemId={item.itemId} quantity={item.quantity} />
          </span>
          <Button
            onClick={() => dispatch(removeItem(item.itemId))}
            colorType="primary"
          >
            Remove
          </Button>
        </p>
      </div>
    </div>
  );
}
