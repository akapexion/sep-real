import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const THEME = {
  accent: "#2563eb",
  bg: "#000000",
};

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters")
      .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
      .refine((val) => /^[A-Z]/.test(val), {
        message: "First character must be uppercase",
      }),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    profilePic: z
      .any()
      .refine((file) => file instanceof File, { message: "Profile picture is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterSectionFitness() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [isHorizontal, setIsHorizontal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const profilePicValue = watch("profilePic");

  const onPick = () => {
    document.getElementById("fitness-file")?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("profilePic", file, { shouldValidate: true });

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setPreview(e.target.result);
        setIsHorizontal(img.naturalWidth > img.naturalHeight);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("profilePic", data.profilePic);

    try {
      const res = await axios.post("http://localhost:3000/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data?.message || "Registration successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      console.error("Register error:", error);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('fitness.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <Toaster position="top-right" />
      <div
        className="flex flex-col md:flex-row rounded-3xl max-w-3xl w-full mx-4 glass transform hover:scale-[1.01] transition-all duration-300"
        style={{
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <div
          className="w-full md:w-44 flex flex-col items-center justify-center relative border-b md:border-r md:border-b-0 p-4 md:p-0"
          style={{
            borderColor: "var(--border)",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {preview ? (
              <img
                src={preview}
                alt="User upload"
                className="w-full h-full opacity-90 rounded-3xl"
                style={{ objectFit: isHorizontal ? "contain" : "cover" }}
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80"
                alt="default"
                className="w-full h-full object-cover opacity-40"
              />
            )}
          </div>
          <div className="z-10 flex flex-col items-center justify-center text-center">
            <div
              className="text-3xl font-extrabold mb-2 drop-shadow-lg"
              style={{ color: "var(--text-primary)" }}
            >
              Register
            </div>
            <button
              type="button"
              onClick={onPick}
              className={`mt-2 px-4 py-2 text-xs rounded-lg border font-bold transition-all duration-300 hover:scale-105 ${
                errors.profilePic ? "border-red-500" : ""
              }`}
              style={{
                background: "var(--bg-card)",
                borderColor: errors.profilePic ? "#ef4444" : "var(--accent)",
                color: errors.profilePic ? "#ef4444" : "var(--accent)",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              }}
            >
              Upload Image
            </button>
            <input
              id="fitness-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            {errors.profilePic && (
              <p className="mt-2 text-[10px] uppercase font-bold text-red-500 bg-black/50 px-2 py-0.5 rounded">
                {errors.profilePic.message}
              </p>
            )}
          </div>
        </div>

        <div className="p-8 flex-1" style={{ background: "rgba(0,0,0,0.3)" }}>
          <h3
            className="text-2xl font-bold mb-6 text-center"
            style={{ color: "var(--accent)" }}
          >
            Join the Team
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <input
                {...register("name")}
                placeholder="Full name"
                className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 border ${
                  errors.name ? "border-red-500" : "border-transparent"
                }`}
                style={{
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                }}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500 pl-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("email")}
                placeholder="Email"
                type="email"
                className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 border ${
                  errors.email ? "border-red-500" : "border-transparent"
                }`}
                style={{
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                }}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 pl-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("password")}
                placeholder="Create password"
                type="password"
                className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 border ${
                  errors.password ? "border-red-500" : "border-transparent"
                }`}
                style={{
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                }}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 pl-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <input
                {...register("confirmPassword")}
                placeholder="Confirm password"
                type="password"
                className={`w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 border ${
                  errors.confirmPassword ? "border-red-500" : "border-transparent"
                }`}
                style={{
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                }}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 pl-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold mt-4 hover:cursor-pointer transition-all duration-300 hover:scale-105 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "var(--accent)",
                boxShadow: "0 0 15px var(--accent)",
              }}
            >
              {isSubmitting ? "Processing..." : "Start Free"}
            </button>
          </form>
          <p className="text-center mt-6" style={{ color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="hover:underline font-bold"
              style={{ color: "var(--accent)" }}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}