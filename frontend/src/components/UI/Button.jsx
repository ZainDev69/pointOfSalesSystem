// ✅ FIXED Button component
export default function Button({
  onClick,
  colorType,
  children,
  type = "button",
  ...props
}) {
  let className =
    "px-4 py-2 rounded-md font-semibold transition cursor-pointer";
  if (colorType === "primary") {
    className += " bg-indigo-600 text-white hover:bg-indigo-700";
  }

  return (
    <button
      type={type} // ✅ allow override from parent
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
