import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {z} from 'zod'

const THEME = {
  accent: "#FDC700",
  bg: "#000000",
};
const userSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters").refine((val)=> /^[A-Z]/.test(val),{
    message:"First character must be uppercase"
  } ),
  email:z.email("Invalid email format"),
  password:z.string().min(8,"Password must be 8 characters").refine(
      (val) => /[A-Z]/.test(val),
      { message: "Password must contain at least one uppercase letter" }
    )
    .refine(
      (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
      { message: "Password must contain at least one special character" }
    ),
    
    profilePic:z.any().refine((file) => file != null, { message: "Image is required" })

});

export default function RegisterSectionFitness() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState("");

  const onPick = () => {
    document.getElementById("fitness-file")?.click();
  };

  const onFile = (file) => {
    if (!file) return;
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

  const registerUser = async (e) => {
    e.preventDefault();
    const result = userSchema.safeParse({ name , email,password,profilePic});

  if (!result.success) {
  const formattedErrors = result.error.format();
  
  // Set errors individually
  setError({
    name: formattedErrors.name?._errors[0] || "",
    email: formattedErrors.email?._errors[0] || "",
     password: formattedErrors.password?._errors[0] || "",
     profilePic: formattedErrors.profilePic?._errors[0] || "",
  });

  return; // function exit
}
setError("")

    if (password !== confirm) {
      toast.error("Passwords do not match!");
      return;
    }


    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("profilePic", profilePic);



    try {
        const res = await axios.post("http://localhost:3000/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
  });

      setName("");
      setEmail("");
      setPassword("");
      setConfirm("");
      setProfilePic(null);
      setPreview(null);

      toast.success(res.data?.message || "Registration successful!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
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
        className="flex flex-col md:flex-row rounded-3xl shadow-2xl max-w-3xl w-full mx-4"
        style={{
          border: "1px solid rgba(255,215,0,0.04)",
          backgroundColor: "#000000b0",
          backdropFilter: "blur(2px)",
        }}
      >
        <div
          className="w-full md:w-44 flex flex-col items-center justify-center relative border-b md:border-r md:border-b-0 border-[#FDC700]/10 p-4 md:p-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(253,199,0,0.08), rgba(0,0,0,0.1))",
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
              style={{ color: THEME.accent }}
              className="text-3xl font-extrabold mb-1 drop-shadow"
            >
              Register
            </div>
            <button
              type="button"
              onClick={onPick}
              className="mt-2 px-3 py-1 text-xs rounded-md bg-black/60 border border-[#FDC700]/20 text-[#FDC700] hover:bg-[#FDC700]/10 transition"
            >
              Upload Image
            </button>
            <input
              id="fitness-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setProfilePic(file);
                  onFile(file);
                }
              }}
            />
             <p className="mb-4 text-xs" style={{ color: "red" }}>{error.profilePic}</p>
          </div>
        </div>

        <div className="p-6 flex-1 bg-black/40">
          <h3
            style={{ color: THEME.accent }}
            className="text-xl font-bold mb-3"
          >
            Join the Team
          </h3>
          <form onSubmit={registerUser} className="" noValidate>
            <input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#FDC700]/10 placeholder-[#aaaaaa] text-white outline-none"
            />
              <p className="mb-4 text-xs" style={{ color: "red" }}>{error.name}</p>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#FDC700]/10 placeholder-[#aaaaaa] text-white outline-none"
            />
               <p className="mb-4 text-xs" style={{ color: "red" }}>{error.email}</p>
            <input
              placeholder="Create password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#FDC700]/10 placeholder-[#aaaaaa] text-white outline-none"
            />
             <p className="mb-4 text-xs" style={{ color: "red" }}>{error.password}</p>
            <input
              placeholder="Confirm password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-[#FDC700]/10 placeholder-[#aaaaaa] text-white outline-none"
            />
            <button
              type="submit"
              className="submit-button w-full py-3 rounded-xl font-bold mt-2 hover:cursor-pointer"
              style={{
                background: THEME.accent,
                color: "#000",
              }}
            >
              Start Free
            </button>
          </form>
          <p className="text-center text-white mt-2">
            Already have an account? <Link to="/login" className="text-[#FDC700] hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}