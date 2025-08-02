// ClientComponents/FileUploadButton.jsx
export function FileUploadButton({
  label = "Upload",
  accept = "image/*",
  onChange,
}) {
  return (
    <label className="bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-md shadow cursor-pointer inline-block">
      {label}
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}
