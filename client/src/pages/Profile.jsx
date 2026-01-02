import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [imageUrl, setImageUrl] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadProgress(0);
    setUploadError(null);
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Only images allowed");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Max image size is 2MB");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );
      setImageUrl((prev) => ({ ...prev, avatar: res.data.secure_url }));
      setUploadError(null);
      setUploadProgress(100);
    } catch (err) {
      console.error(err);
      setUploadError("Upload failed");
      setUploadProgress(0);
    }
  };
  useEffect(() => {
    if (!file) return;
    const upload = async () => {
      await handleFileUpload(file);
    };
    upload();
  }, [file]);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="my-7 text-3xl text-center font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => handleFileChange(e)}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={imageUrl.avatar || currentUser.avatar}
          alt="profile"
          className="h-24 w-24 object-cover self-center rounded-full cursor-pointer mt-2"
          onClick={() => {
            fileRef.current.click();
          }}
        />
        <p className="text-sm self-center">
          {uploadError ? (
            <span className="text-red-700">{uploadError}</span>
          ) : uploadProgress > 0 && uploadProgress < 100 ? (
            <span className="text-slate-700">{`Uploading: ${uploadProgress}%`}</span>
          ) : uploadProgress === 100 ? (
            <span className="text-green-700">Image successfully Upload</span>
          ) : null}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
};

export default Profile;
