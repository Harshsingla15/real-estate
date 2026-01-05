import axios from "axios";
import { useState } from "react";

const CreateListing = () => {
  const [file, setFiles] = useState([]);
  const [uploadImageError, setUploadImageError] = useState(null);
  const [uploadData, setUploadData] = useState({
    imageUrls: [],
  });
  const [uploading, setUploading] = useState(false);
  console.log(uploadData);
  const handleImageSubmit = () => {
    setUploading(true);
    if (file.length === 0) {
      setUploadImageError("Please select at least one image");
      setUploading(false);
      return;
    }

    if (file.length + uploadData.imageUrls.length > 6) {
      setUploadImageError("You can upload a maximum of 6 images");
      setUploading(false);
      return;
    }
    setUploadImageError(null);
    const promises = [];
    for (let i = 0; i < file.length; i++) {
      promises.push(handleFileUpload(file[i]));
    }
    Promise.all(promises)
      .then((urls) => {
        setUploadData((prev) => ({
          ...prev,
          imageUrls: prev.imageUrls.concat(urls),
        }));
      })
      .catch((error) => {
        setUploadImageError(error.message);
        setUploading(false);
      })
      .finally(() => {
        setUploading(false);
      });
  };
  const handleFileUpload = async (imageFile) => {
    if (!imageFile) throw new Error("No file");
    if (!imageFile.type.startsWith("image/")) {
      throw new Error("Only images allowed");
    }
    if (imageFile.size > 2 * 1024 * 1024) {
      throw new Error("Image size must be less than 2 MB");
    }
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      formData
    );
    return res.data.secure_url;
  };
  const handleRemoveImage = (index) => {
    setUploadData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold my-7 text-center">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            minLength={10}
            maxLength={62}
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            id="name"
            className="border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min={1}
                max={10}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={1}
                max={10}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min={1}
                max={10}
                className="p-3 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={(e) => handleImageSubmit(e)}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm font-semibold">
            {uploadImageError && uploadImageError}
          </p>
          {uploadData.imageUrls.length > 0 &&
            uploadData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border border-gray-300 items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="h-20 w-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleRemoveImage(index);
                  }}
                  className="p-3 font-semibold text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="p-3 bg-slate-700 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
