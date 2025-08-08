import { useNavigate } from "react-router-dom";
import Card from "../../components/UI/Card";
import Button from "./../../components/UI/Button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts } from "../../components/redux/slice/product";
import Loading from "./../../components/UI/Loader";
import Error from "./../../components/UI/Error";
import { useSearch } from "../../components/context/SearchContext";

export default function ProductPage() {
  const { searchQuery } = useSearch();

  const [selectedCategory, setSelectedCategory] = useState("all");

  const products = useSelector((state) => state.product.products);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredProducts = products
    .filter(
      (product) =>
        selectedCategory === "all" || product.category === selectedCategory
    )
    .filter((product) =>
      product.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <div className="my-[100px]">
      <h1 className="text-5xl font-serif text-center my-8">Our Products</h1>
      <div className="flex justify-between mx-8">
        <div className="flex gap-2 items-center">
          <p className=" text-lg font-serif">Sort by Category</p>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="transition-colors duration-300 rounded  bg-indigo-600 text-white hover:bg-indigo-700 p-2 text-center outline-none cursor-pointer"
          >
            <option
              value="all"
              className="bg-white focus:bg-gray-100 text-gray-600"
            >
              All
            </option>
            {products
              .map((product) => product.category)
              .filter(
                (category, index, self) => self.indexOf(category) === index
              )
              .map((category, index) => (
                <option
                  key={index}
                  value={category}
                  className="bg-white focus:bg-gray-100 text-gray-600"
                >
                  {category}
                </option>
              ))}
          </select>
        </div>
        {currentUser.role === "admin" && (
          <div className="text-right px-5">
            <Button
              colorType="primary"
              onClick={() => navigate("/add-product")}
            >
              Add Product
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-6 py-5 ">
        {loading ? (
          <Loading />
        ) : // <p>Loading...</p>
        error ? (
          <Error message={error} />
        ) : filteredProducts.length === 0 ? (
          <Error message="No product found" />
        ) : (
          filteredProducts.map((product, index) => (
            <Card key={index} data={product} />
          ))
        )}
      </div>
    </div>
  );
}
