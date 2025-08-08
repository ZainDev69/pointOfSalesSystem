import { useNavigate } from "react-router-dom";
import Button from "../../components/UI/Button";

function EmptyCart() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between my-[100px] mx-12">
      <Button onClick={() => navigate("/products")} colorType="primary">
        Back to Products
      </Button>

      <p className="mx-5 mt-7 font-roboto text-lg">
        Your cart is Still empty. Start adding some Items :)
      </p>
    </div>
  );
}

export default EmptyCart;
