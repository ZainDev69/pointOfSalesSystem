import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import {
  decreaseItemQuantity,
  increaseItemQuantity,
} from "../redux/slice/cart";

export default function UpdateCartQuantity({ quantity, itemId }) {
  const dispatch = useDispatch();

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === itemId)
  );

  const handleDecreaseItem = () => {
    quantity > 1 && dispatch(decreaseItemQuantity(itemId));
  };

  const handleIncreaseItem = () => {
    if (product.stockQuantity > quantity) {
      dispatch(increaseItemQuantity(itemId));
    } else {
      alert("Can't add more for this product.");
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <Button colorType="primary" onClick={handleDecreaseItem}>
        -
      </Button>
      <span className="text-sm font-medium">{quantity}</span>
      <Button colorType="primary" onClick={handleIncreaseItem}>
        +
      </Button>
    </div>
  );
}
