import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {z} from 'zod'

const THEME = {
  accent: "#FDC700",
  bg: "#000000",
};
const loginSchema=  z.object({
   email:z.email("Invalid email format").min(1,"Enter email"),
  password:z.string("").min(1,"Password requires"),
    
})

export default function LoginSection({ Loginuser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = loginSchema.safeParse({email,password})
     if (!result.success) {
  const formattedErrors = result.error.format();
  
  // Set errors individually
  setError({
   
    email: formattedErrors.email?._errors[0] || "",
     password: formattedErrors.password?._errors[0] || "",
     
  });

  return; // function exit
}

    try {
      const res = await axios.post(
        "http://localhost:3000/login",
        { email, password }
      );

      if (res.data.message === "Logged in") {
        const loggedInUser = res.data.registeredUser; 

        localStorage.setItem("user", JSON.stringify(loggedInUser));

        localStorage.setItem("userId", loggedInUser._id);

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
      <Toaster position="top-right"  />

      <div
        className="rounded-3xl shadow-2xl p-6 bg-black/40 max-w-md w-full mx-4"
        style={{
          border: "1px solid rgba(255,215,0,0.04)",
          backgroundColor: "#000000b0",
          backdropFilter: "blur(2px)",
        }}
      >
        <h3
          style={{ color: THEME.accent }}
          className="text-xl font-bold mb-3 text-center"
        >
          Welcome Back
        </h3>

        <form onSubmit={handleLogin} className="" noValidate>
          <input
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#FDC700]/10 placeholder-[#aaaaaa] text-white outline-none"
          />
           <p className="mb-4 text-xs" style={{ color: "red" }}>{error.email}</p>
          <input
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#FDC700]/10 placeholder-[#aaaaaa] text-white outline-none"
          />
 <p className="mb-4 text-xs" style={{ color: "red" }}>{error.password}</p>          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold mt-2 hover:cursor-pointer transition"
            style={{
              background: THEME.accent,
              color: "#000",
            }}
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-white mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#FDC700] hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}