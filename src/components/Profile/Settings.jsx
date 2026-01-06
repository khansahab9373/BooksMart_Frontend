import React, { useEffect, useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2"; // Import SweetAlert2
import BaseULR from "../../assets/baseURL";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";

const Settings = () => {
  const [profileData, setProfileData] = useState(null);
  const [value, setValue] = useState({ address: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const dispatch = useDispatch();
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(null);
  const imgRef = useRef(null);
  // react-easy-crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const ASPECT = 1; // fixed aspect ratio (1 = square)

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${BaseULR}api/v1/get-user-information`,
          { headers }
        );
        setProfileData(response.data);
        setValue({ address: response.data.address });
      } catch (error) {
        console.error("Error fetching user data:", error);

        // SweetAlert for error
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch user data.",
        });
      }
    };
    fetchUserData();
  }, []);

  // Handle address change
  const handleAddressChange = (e) => {
    setValue({ ...value, address: e.target.value });
  };

  // Submit updated address
  const submitAddress = async () => {
    setIsSubmitting(true); // Show loading state
    try {
      const response = await axios.put(
        `${BaseULR}api/v1/update-address`,
        value,
        { headers }
      );
      console.log("Address updated successfully:", response.data);

      // SweetAlert for success
      Swal.fire("Updated", "Address updated successfully!", "success");
    } catch (error) {
      console.error("Error updating address:", error);

      // SweetAlert for error
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update the address. Please try again.",
      });
    } finally {
      setIsSubmitting(false); // Hide loading state
    }
  };

  // When user chooses a file, open modal with preview for cropping
  const fileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setTempFile(file);
    setTempImageUrl(url);
    setShowCropModal(true);
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedImg = (imageSrc, pixelCrop) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Canvas is empty"));
            resolve(blob);
          },
          "image/jpeg",
          0.9
        );
      };
      image.onerror = (err) => reject(err);
      image.src = imageSrc;
    });
  };

  const applyCrop = async () => {
    if (!tempImageUrl || !croppedAreaPixels) return;
    try {
      const blob = await getCroppedImg(tempImageUrl, croppedAreaPixels);
      const croppedFile = new File([blob], tempFile.name || "avatar.jpg", {
        type: blob.type,
      });

      if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
      const preview = URL.createObjectURL(croppedFile);
      setCroppedPreviewUrl(preview);
      setAvatarFile(croppedFile);
      setShowCropModal(false);
      if (tempImageUrl) {
        URL.revokeObjectURL(tempImageUrl);
        setTempImageUrl(null);
        setTempFile(null);
      }
    } catch (err) {
      console.error("Crop failed:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to crop image.",
      });
    }
  };

  const cancelCrop = () => {
    setShowCropModal(false);
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
      setTempFile(null);
    }
  };

  const submitAvatar = async () => {
    if (!avatarFile) {
      Swal.fire({
        icon: "warning",
        title: "No file",
        text: "Please choose an image.",
      });
      return;
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("avatar", avatarFile);
    try {
      const response = await axios.put(
        `${BaseULR}api/v1/update-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            id: localStorage.getItem("id"),
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // update UI and redux
      setProfileData({ ...profileData, avatar: response.data.avatar });
      dispatch(authActions.setUser({ avatar: response.data.avatar }));
      // clear local cropped preview after successful upload
      if (croppedPreviewUrl) {
        URL.revokeObjectURL(croppedPreviewUrl);
        setCroppedPreviewUrl(null);
      }
      Swal.fire("Updated", "Avatar updated successfully!", "success");
    } catch (error) {
      console.error("Error updating avatar:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update avatar.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-8">
      {!profileData && (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {profileData && (
        <div className="h-[100%] p-0 md:p-4">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 dark:text-yellow-100 mb-8">
            Settings
          </h1>
          <div className="flex gap-12">
            <div>
              <label
                htmlFor="username"
                className="text-gray-600 dark:text-zinc-400"
              >
                Username
              </label>
              <p className="p-2 rounded bg-gray-200 dark:bg-zinc-800 mt-2 font-semibold text-black dark:text-zinc-100">
                {profileData.username}
              </p>
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-gray-600 dark:text-zinc-400"
              >
                Email
              </label>
              <p className="p-2 rounded bg-gray-200 dark:bg-zinc-800 mt-2 font-semibold text-black dark:text-zinc-100">
                {profileData.email}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <label className="text-gray-600 dark:text-zinc-400">Avatar</label>
              <img
                src={croppedPreviewUrl || profileData.avatar}
                alt="avatar"
                className="h-28 w-28 rounded-full object-cover mt-2 border border-gray-200 dark:border-zinc-700"
              />
              <input
                type="file"
                accept="image/*"
                onChange={fileChange}
                className="mt-3 text-sm text-gray-600 dark:text-zinc-300"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={submitAvatar}
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-60"
                >
                  {isSubmitting ? "Updating..." : "Update Avatar"}
                </button>
                <button
                  onClick={() => {
                    // open crop modal with current profile image
                    setTempImageUrl(profileData.avatar);
                    setShowCropModal(true);
                  }}
                  className="bg-gray-200 dark:bg-zinc-700 text-black dark:text-white px-3 py-1 rounded"
                >
                  Crop Existing
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="address"
              className="text-gray-600 dark:text-zinc-400"
            >
              Address
            </label>
            <textarea
              className="p-2 rounded bg-gray-200 dark:bg-zinc-800 mt-2 font-semibold text-black dark:text-zinc-100"
              rows="5"
              placeholder="Address"
              name="address"
              value={value.address}
              onChange={handleAddressChange}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-yellow-500 text-black dark:text-zinc-900 font-semibold px-3 py-2 rounded hover:bg-yellow-400"
              onClick={submitAddress}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 w-[90%] max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-zinc-200 mb-2">
              Crop Avatar
            </h3>
            <div className="flex gap-4">
              <div className="flex-1 h-96 relative bg-gray-100 dark:bg-zinc-900">
                {tempImageUrl ? (
                  <Cropper
                    image={tempImageUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={ASPECT}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                ) : (
                  <div className="h-64 w-full flex items-center justify-center bg-gray-100 dark:bg-zinc-900">
                    No image
                  </div>
                )}
              </div>
              <div className="w-48 flex flex-col">
                <label className="text-sm text-gray-600 dark:text-zinc-300">
                  Zoom
                </label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="mt-2"
                />

                <p className="text-xs text-gray-500 mt-2">
                  Fixed aspect ratio: {ASPECT}:1
                </p>

                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={applyCrop}
                    className="bg-blue-600 text-white px-3 py-2 rounded"
                  >
                    Apply Crop
                  </button>
                  <button
                    onClick={cancelCrop}
                    className="bg-gray-200 dark:bg-zinc-700 px-3 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
