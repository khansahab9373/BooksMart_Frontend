import React, { useEffect, useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import axios from "axios";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2"; // Import SweetAlert2
import BaseURL from "../../assets/baseURL";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import Card from "../ui/Card";
import Button from "../ui/Button";

const Settings = () => {
  const [profileData, setProfileData] = useState(null);
  const [value, setValue] = useState({ address: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState(null);
  const imgRef = useRef(null);
  const modalCancelRef = useRef(null);
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
        setError(null);
        const response = await axios.get(
          `${BaseURL}api/v1/get-user-information`,
          { headers },
        );
        setProfileData(response.data);
        setValue({ address: response.data.address });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to fetch user data. Please try again.");
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
    const errs = {};
    if (!value.address || value.address.trim() === "") {
      errs.address = "Address cannot be empty.";
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true); // Show loading state
    try {
      const response = await axios.put(
        `${BaseURL}api/v1/update-address`,
        value,
        { headers },
      );
      console.log("Address updated successfully:", response.data);

      // SweetAlert for success
      Swal.fire("Updated", "Address updated successfully!", "success");
    } catch (error) {
      console.error("Error updating address:", error);
      console.error("Error updating address:", error);
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

  React.useEffect(() => {
    if (showCropModal && modalCancelRef.current) modalCancelRef.current.focus();
  }, [showCropModal]);

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
          pixelCrop.height,
        );
        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Canvas is empty"));
            resolve(blob);
          },
          "image/jpeg",
          0.9,
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
      const croppedFile = new File(
        [blob],
        tempFile.name || "Profile Picture.jpg",
        {
          type: blob.type,
        },
      );

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
        `${BaseURL}api/v1/update-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            id: localStorage.getItem("id"),
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      // update UI and redux
      setProfileData({ ...profileData, avatar: response.data.avatar });
      dispatch(authActions.setUser({ avatar: response.data.avatar }));
      // clear local cropped preview after successful upload
      if (croppedPreviewUrl) {
        URL.revokeObjectURL(croppedPreviewUrl);
        setCroppedPreviewUrl(null);
      }
      Swal.fire("Updated", "Profile Picture updated successfully!", "success");
    } catch (error) {
      console.error("Error updating Profile Picture:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update Profile Picture.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white px-4 py-8">
      {!profileData && !error && (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {!profileData && error && (
        <div className="w-full h-[100%] flex items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <p className="text-lg text-gray-700 dark:text-zinc-200 mb-3">
                {error}
              </p>
              <div className="flex justify-center">
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {profileData && (
        <div className="h-[100%] p-0 md:p-4">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-800 dark:text-yellow-100 mb-8">
            Settings
          </h1>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="w-full md:w-auto">
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
            <div className="w-full md:w-auto">
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
            <div className="flex flex-col items-center w-full md:w-auto">
              <label className="text-gray-600 dark:text-zinc-400">
                Profile Picture
              </label>
              <img
                src={croppedPreviewUrl || profileData.avatar}
                alt="Profile Picture"
                className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover mt-2 border border-gray-200 dark:border-zinc-700"
              />
              <input
                id="settings-avatar"
                type="file"
                accept="image/*"
                onChange={fileChange}
                className="mt-3 text-sm text-gray-600 dark:text-zinc-300"
                aria-label="Choose profile picture"
              />
              <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
                <button
                  onClick={submitAvatar}
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white px-3 py-2 rounded disabled:opacity-60 w-full sm:w-auto text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                  aria-label="Update profile picture"
                >
                  {isSubmitting ? "Updating..." : "Update Profile Picture"}
                </button>
                <button
                  onClick={() => {
                    // open crop modal with current profile image
                    setTempImageUrl(profileData.avatar);
                    setShowCropModal(true);
                  }}
                  className="bg-gray-200 dark:bg-zinc-700 text-black dark:text-white px-3 py-2 rounded w-full sm:w-auto text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                  aria-label="Crop existing profile picture"
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
              id="settings-address"
              className="p-3 rounded bg-gray-200 dark:bg-zinc-800 mt-2 font-semibold text-black dark:text-zinc-100 w-full"
              rows="5"
              placeholder="Address"
              name="address"
              value={value.address}
              onChange={handleAddressChange}
              aria-invalid={!!fieldErrors.address}
              aria-describedby={
                fieldErrors.address ? "settings-address-error" : undefined
              }
            />
            {fieldErrors.address && (
              <p
                id="settings-address-error"
                className="text-sm text-red-600 mt-2"
              >
                {fieldErrors.address}
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={submitAddress}
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-cropper-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") cancelCrop();
          }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <h3
              id="settings-cropper-title"
              className="text-lg font-semibold text-gray-800 dark:text-zinc-200 mb-2"
            >
              Crop Profile Picture
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 h-auto sm:h-96 relative bg-gray-100 dark:bg-zinc-900">
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
              <div className="w-full sm:w-48 flex flex-col">
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
                    className="bg-blue-600 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                    aria-label="Apply crop"
                  >
                    Apply Crop
                  </button>
                  <button
                    ref={modalCancelRef}
                    onClick={cancelCrop}
                    className="bg-gray-200 dark:bg-zinc-700 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
                    aria-label="Cancel crop"
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
