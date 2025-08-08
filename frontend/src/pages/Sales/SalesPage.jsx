import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSales } from "../../components/redux/slice/sales";

const SalesPage = () => {
  const dispatch = useDispatch();
  const sales = useSelector((state) => state.sales.sales);
  const [filteredSales, setFilteredSales] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    dispatch(getSales());
  }, [dispatch]);

  useEffect(() => {
    filterSales(filterType);
  }, [sales, filterType]);

  // Function to filter sales and calculate total revenue
  const filterSales = (type) => {
    const now = new Date();
    let filtered = [];

    if (sales.length > 0) {
      filtered = sales.filter((sale) => {
        const saleDate = new Date(sale.createdAt);

        if (type === "today") {
          return saleDate.toDateString() === now.toDateString();
        } else if (type === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return saleDate >= weekAgo;
        } else if (type === "month") {
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          return saleDate >= monthAgo;
        }
        return true;
      });
    }

    setFilteredSales(filtered);

    // Calculate total revenue
    const revenue = filtered.reduce((acc, sale) => acc + sale.price, 0);
    setTotalRevenue(revenue);
  };

  // Function to export sales as a CSV file
  const exportToCSV = () => {
    if (filteredSales.length === 0) {
      alert("No sales data available to export.");
      return;
    }

    const headers = "ID, Name, Price, Date\n";
    const csvRows = filteredSales.map((sale) => {
      return `${sale._id}, ${sale.name}, ${sale.price}, ${new Date(
        sale.createdAt
      ).toLocaleDateString()}`;
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + headers + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="text-black my-[100px] flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-5">Sales Dashboard</h1>

      <div className="flex gap-6 mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="text-xl font-semibold">
          Total Sales:{" "}
          <span className="text-indigo-500">{filteredSales.length}</span>
        </div>
        <div className="text-xl font-semibold">
          Total Revenue:{" "}
          <span className="text-green-600">${totalRevenue.toFixed(2)}</span>
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
        >
          Export as CSV
        </button>
      </div>

      <div className="flex gap-4 mb-5">
        {["all", "today", "week", "month"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`cursor-pointer px-4 py-2 rounded-md ${
              filterType === type ? "bg-gray-800 text-white" : "bg-gray-300"
            }`}
          >
            {type === "all"
              ? "All Sales"
              : type.charAt(0).toUpperCase() + type.slice(1) + "'s Sales"}
          </button>
        ))}
      </div>

      {/* Filter Sales Card is here now */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full px-10 mt-8">
        {filteredSales.length > 0 ? (
          filteredSales.map((sale) => (
            <div
              key={sale._id}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-bold text-indigo-500">{sale.name}</h2>
              <p className="text-white">Price: ${sale.price.toFixed(2)}</p>
              <p className="text-white">
                Date:{" "}
                {new Date(sale.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">No sales found</p>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
