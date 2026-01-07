import React, { useState, useEffect, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import BaseURL from "../assets/baseURL";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const SignUp = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const ASPECT = 1;

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const modalCancelRef = useRef(null);

  const change = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const fileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setTempFile(file);
    setTempImageUrl(url);
    setShowCropModal(true);
  };

  // focus the cancel button when modal opens for keyboard users
  React.useEffect(() => {
    if (showCropModal && modalCancelRef.current) {
      modalCancelRef.current.focus();
    }
  }, [showCropModal]);

  useEffect(() => {
    if (!avatar) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(avatar);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatar]);

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
            if (!blob) return reject(new Error("Canvas empty"));
            resolve(blob);
          },
          "image/jpeg",
          0.9
        );
      };
      image.onerror = reject;
      image.src = imageSrc;
    });
  };

  const applyCrop = async () => {
    try {
      if (!tempImageUrl || !croppedAreaPixels) return;

      const blob = await getCroppedImg(tempImageUrl, croppedAreaPixels);
      const croppedFile = new File([blob], tempFile?.name || "profile.jpg", {
        type: blob.type,
      });

      setAvatar(croppedFile);
      setShowCropModal(false);

      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
      setTempFile(null);
    } catch (err) {
      Swal.fire("Error", "Image crop failed", "error");
    }
  };

  const cancelCrop = () => {
    setShowCropModal(false);
    if (tempImageUrl) URL.revokeObjectURL(tempImageUrl);
    setTempImageUrl(null);
    setTempFile(null);
  };

  const removeAvatar = () => {
    if (preview) URL.revokeObjectURL(preview);
    setAvatar(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const submit = async () => {
    const { username, email, password, address } = values;
    const newErrors = {};

    if (!username) newErrors.username = "Username is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Enter a valid email.";
    if (!password) newErrors.password = "Password is required.";
    if (!address) newErrors.address = "Address is required.";

    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([k, v]) => formData.append(k, v));
      if (avatar) formData.append("avatar", avatar);

      const res = await axios.post(`${BaseURL}api/v1/sign-up`, formData);

      Swal.fire("Success", res.data.message || "Account created", "success");
      navigate("/login");
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Signup failed",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
        <Card className="w-full max-w-md p-6">
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-zinc-200">
            Sign Up
          </h2>

          {["username", "email", "password"].map((field) => (
            <div key={field} className="mb-3">
              <label
                htmlFor={`signup-${field}`}
                className="text-sm capitalize text-gray-600 dark:text-zinc-400"
              >
                {field}
              </label>
              <input
                id={`signup-${field}`}
                type={field === "password" ? "password" : "text"}
                name={field}
                value={values[field]}
                onChange={change}
                className="w-full mt-1 p-3 rounded bg-gray-200 dark:bg-zinc-900"
                aria-invalid={!!formErrors[field]}
                aria-describedby={
                  formErrors[field] ? `signup-${field}-error` : undefined
                }
              />
              {formErrors[field] && (
                <p
                  id={`signup-${field}-error`}
                  className="text-sm text-red-600 mt-1"
                >
                  {formErrors[field]}
                </p>
              )}
            </div>
          ))}

          <div className="mb-3">
            <label
              htmlFor="signup-avatar"
              className="text-sm text-gray-600 dark:text-zinc-400"
            >
              Profile Picture (optional)
            </label>
            <input
              id="signup-avatar"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={fileChange}
              className="w-full mt-1"
            />
            {preview && (
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={preview}
                  alt="preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <Button variant="secondary" onClick={removeAvatar}>
                  Remove
                </Button>
              </div>
            )}
          </div>

          <div className="mb-3">
            <label
              htmlFor="signup-address"
              className="text-sm text-gray-600 dark:text-zinc-400"
            >
              Address
            </label>
            <textarea
              id="signup-address"
              rows="3"
              name="address"
              value={values.address}
              onChange={change}
              className="w-full mt-1 p-3 rounded bg-gray-200 dark:bg-zinc-900"
              aria-invalid={!!formErrors.address}
              aria-describedby={
                formErrors.address ? "signup-address-error" : undefined
              }
            />
            {formErrors.address && (
              <p
                id="signup-address-error"
                className="text-sm text-red-600 mt-1"
              >
                {formErrors.address}
              </p>
            )}
          </div>
          <Button
            onClick={submit}
            className="w-full mt-2"
            loading={submitting}
            disabled={submitting}
          >
            Sign Up
          </Button>

          <p className="text-center mt-4 text-sm text-gray-700 dark:text-zinc-300">
            Already have an account?
            <Link to="/login" className="ml-1 text-blue-500 underline">
              Login
            </Link>
          </p>
        </Card>
      </div>

      {showCropModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cropper-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") cancelCrop();
          }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        >
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 w-full max-w-2xl max-h-[90vh] overflow-auto">
            <h3
              id="cropper-title"
              className="font-semibold mb-2 text-gray-800 dark:text-zinc-200"
            >
              Crop Profile Picture
            </h3>

            <div className="flex gap-4">
              <div className="flex-1 h-80 relative">
                <Cropper
                  image={tempImageUrl}
                  crop={crop}
                  zoom={zoom}
                  aspect={ASPECT}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="w-44">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />

                <div className="mt-4 space-y-2">
                  <Button onClick={applyCrop}>Apply</Button>
                  <button
                    ref={modalCancelRef}
                    onClick={cancelCrop}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 min-h-[44px] bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
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
    </>
  );
};

export default SignUp;
