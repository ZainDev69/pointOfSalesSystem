import { useSearch } from "../context/SearchContext";

export default function Search() {
  const { searchQuery, handleSearchChange } = useSearch();

  return (
    <div className="flex gap-5">
      <div className="relative">
        <input
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          type="text"
          placeholder="Search..."
          name="products"
          className="text-white w-28 sm:w-64 sm:focus:w-72 focus:outline-none transition-all duration-300 caret-red-500 focus:w-60 bg-slate-700 rounded p-2 placeholder-white font-[italic] outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <i className="absolute fa fa-search text-white py-1 right-3 top-2 "></i>
      </div>
    </div>
  );
}
