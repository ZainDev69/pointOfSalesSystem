import { useState } from "react";
import { getClientImage } from "../../../utils/avatarUtils";
import { FileUploadButton } from "../../../components/ui/FileUploadButton";

export function PhotoUpload({ client, setPhotoFile, formData }) {
  const [photoPreview, setPhotoPreview] = useState(client?.photo || "");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const imageUrl = photoPreview
    ? photoPreview
    : getClientImage(
        client?.photo,
        formData.personalDetails?.title,
        formData.personalDetails?.gender,
        backendUrl
      );

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center mb-6">
      <img
        src={imageUrl}
        alt="Client"
        className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 shadow mb-2"
      />
      <FileUploadButton label="Change Photo" onChange={handlePhotoChange} />
    </div>
  );
}
