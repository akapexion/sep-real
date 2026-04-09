import React from "react";
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

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginSection({ Loginuser }) {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:3000/login", data);

      if (res.data.message === "Logged in") {
        const loggedInUser = res.data.registeredUser;

        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("userId", loggedInUser._id);
        localStorage.setItem("token", res.data.token);

        Loginuser(loggedInUser);

        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 1500);
        return;
      }

      toast.error(res.data.message || "Login failed");
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      toast.error(msg);
      console.error("Login error:", error);
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
      }}
    >
      <Toaster position="top-right" />

      <div
        className="rounded-3xl p-8 max-w-md w-full mx-4 glass transform hover:scale-[1.02] transition-all duration-300"
        style={{
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <h3
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "var(--accent)" }}
        >
          Welcome
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="" noValidate>
          <div className="mb-4">
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className={`w-full px-4 py-3 rounded-xl bg-black/60 border ${
                errors.email ? "border-red-500" : "border-blue-900"
              } placeholder-[#aaaaaa] text-white outline-none focus:border-blue-500 transition-colors`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 pl-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              {...register("password")}
              placeholder="Password"
              type="password"
              className={`w-full px-4 py-3 rounded-xl bg-black/60 border ${
                errors.password ? "border-red-500" : "border-blue-900"
              } placeholder-[#aaaaaa] text-white outline-none focus:border-blue-500 transition-colors`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500 pl-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold mt-2 hover:cursor-pointer transition-all duration-300 hover:scale-105 text-white"
            style={{
              background: "var(--accent)",
              boxShadow: "0 0 15px var(--accent)",
            }}
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-6" style={{ color: "var(--text-muted)" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            className="hover:underline font-bold"
            style={{ color: "var(--accent)" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}