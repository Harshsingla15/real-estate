import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  userUpdateStart,
  userUpdateFailure,
  userUpdateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutFailure,
  signOutStart,
  signOutSuccess,
} from "../redux/user/userSlice.js";
const Profile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef(null);
  const dispatch = useDispatch();

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
      setUpdatedData((prev) => ({ ...prev, avatar: res.data.secure_url }));
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

  const handleChange = (e) => {
    setUpdatedData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(userUpdateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(userUpdateFailure(data.message));
        return;
      }
      dispatch(userUpdateSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(userUpdateFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess());
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="my-7 text-3xl text-center font-semibold">Profile</h1>
      <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4">
        <input
          onChange={(e) => handleFileChange(e)}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={updatedData.avatar || currentUser.avatar}
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
            <span className="text-green-700">Image successfully uploaded</span>
          ) : null}
        </p>
        <input
          onChange={(e) => handleChange(e)}
          type="text"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          className="border p-3 rounded-lg"
        />
        <input
          onChange={(e) => handleChange(e)}
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
        />
        <input
          onChange={(e) => handleChange(e)}
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          disabled={loading}
          className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "User updated successfully!" : ""}
      </p>
    </div>
  );
};

export default Profile;
