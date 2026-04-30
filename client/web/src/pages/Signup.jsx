import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.store";

// ---------------- SCHEMA ----------------
const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name should be more than  3 characters")
    .max(16, "Full name cannot exceed 16 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username can't more than 20 characters")
    .regex(/^(?!_)(?!.*__)[a-zA-Z0-9_]{3,20}(?<!_)$/, "Invalid username format")
    .transform((val) => val.toLowerCase())
    .refine((val) => !val.startsWith("_"), {
      message: "Username cannot start with '_'",
    })
    .refine((val) => !val.endsWith("_"), {
      message: "Username cannot end with '_'",
    })
    .refine((val) => !val.includes("__"), {
      message: "Username cannot contain consecutive underscores",
    }),
  email: z.email().min(3, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const [focusedField, setFocusedField] = useState(null);
  const signup = useAuthStore((s) => s.signup);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const nameVal = watch("name", "");
  const usernameVal = watch("username", "");
  const emailVal = watch("email", "");
  const passwordVal = watch("password", "");

  const onSubmit = async (formData) => {
    const success = await signup(formData);

    if (success) {
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans">
      {/* ── MAIN CONTENT ── */}
      <main className="flex flex-1 items-center justify-center py-8 gap-8  mx-auto w-full bg-background">
        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex flex-col flex-1 max-w-[60%] ">
          {/* Logo */}
          <div className="md:absolute md:left-4 md:top-4 2xl:left-12 2xl:top-12">
            <img
              src="./Instagram.png"
              alt="Instagram Logo"
              className="size-16"
            />
          </div>
          <div className="flex justify-center items-center flex-col h-full">
            {/* Headline */}
            <h1 className="text-4xl leading-tight font-light text-foreground mb-10">
              See everyday moments from <br />
              your{" "}
              <span
                className="font-normal"
                style={{
                  background:
                    "linear-gradient(90deg, #FF5C00, #FF0069, #D300C5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                close friends.
              </span>
            </h1>

            {/* Phone mockup illustration */}
            <div className="relative w-full max-w-md 2xl:max-w-lg">
              <img
                src="./signup.png"
                alt="Phone Mockup"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="hidden lg:block w-px self-stretch bg-border mx-2" />

        {/* ── RIGHT PANEL (login form) ── */}
        <div className="w-full max-w-md lg:w-[30%]  flex flex-col items-start justify-center gap-4 py-6">
          {/* Mobile logo */}
          <div className="size-16 lg:hidden mb-2 mx-auto">
            <img src="./Instagram.png" alt="Instagram Logo" />
          </div>

          <h2 className="text-[1.05rem] font-semibold text-foreground mb-1 tracking-wide">
            Log into Instagram
          </h2>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-3"
          >
            {/* Name field */}
            <div className="relative">
              <div
                className={`w-full border rounded-xl px-3 pt-3 pb-2 bg-background transition-all ${
                  focusedField === "name"
                    ? "border-blue-400 ring-1 ring-blue-300"
                    : errors.name
                      ? "border-red-400"
                      : "border-border"
                }`}
              >
                <label
                  htmlFor="name"
                  className={`absolute left-3 transition-all duration-150 pointer-events-none text-gray-400 ${
                    focusedField === "name" || nameVal
                      ? "top-1.5 text-[10px]"
                      : "top-3.5 text-sm"
                  }`}
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent outline-none text-sm pt-3 text-foreground"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            {/* Username field */}
            <div className="relative">
              <div
                className={`w-full border rounded-xl px-3 pt-3 pb-2 bg-background transition-all ${
                  focusedField === "username"
                    ? "border-blue-400 ring-1 ring-blue-300"
                    : errors.username
                      ? "border-red-400"
                      : "border-border"
                }`}
              >
                <label
                  htmlFor="username"
                  className={`absolute left-3 transition-all duration-150 pointer-events-none text-gray-400 ${
                    focusedField === "username" || usernameVal
                      ? "top-1.5 text-[10px]"
                      : "top-3.5 text-sm"
                  }`}
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  {...register("username")}
                  onFocus={() => setFocusedField("username")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent outline-none text-sm pt-3 text-foreground"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors?.username?.message}
                </p>
              )}
            </div>
            {/* Email field */}
            <div className="relative">
              <div
                className={`w-full border rounded-xl px-3 pt-3 pb-2 bg-background transition-all ${
                  focusedField === "email"
                    ? "border-blue-400 ring-1 ring-blue-300"
                    : errors.email
                      ? "border-red-400"
                      : "border-border"
                }`}
              >
                <label
                  htmlFor="email"
                  className={`absolute left-3 transition-all duration-150 pointer-events-none text-gray-400 ${
                    focusedField === "email" || emailVal
                      ? "top-1.5 text-[10px]"
                      : "top-3.5 text-sm"
                  }`}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  {...register("email")}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent outline-none text-sm pt-3 text-foreground"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            {/* Password field */}
            <div className="relative">
              <div
                className={`w-full border rounded-xl px-3 pt-3 pb-2 bg-background transition-all ${
                  focusedField === "password"
                    ? "border-blue-400 ring-1 ring-blue-300"
                    : errors.email
                      ? "border-red-400"
                      : "border-border"
                }`}
              >
                <label
                  htmlFor="password"
                  className={`absolute left-3 transition-all duration-150 pointer-events-none text-gray-400 ${
                    focusedField === "password" || passwordVal
                      ? "top-1.5 text-[10px]"
                      : "top-3.5 text-sm"
                  }`}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent outline-none text-sm pt-3 text-foreground"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Log in button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-blue-800 text-white text-sm font-semibold transition-opacity mt-1 hover:cursor-pointer"
              style={{
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>
          </form>


          {/* Divider */}
          <div className="w-full flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-gray-400 font-semibold tracking-widest">
              OR
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Create account */}
          <button
            type="button"
            className="w-full border rounded-xl py-2.5 text-sm font-semibold text-[#0095f6] border-border hover:bg-muted transition-colors hover:cursor-pointer"
          >
            <Link to="/login">
            Already have account, Login
            </Link>
          </button>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="w-full border-t border-border py-5 px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>English ▾</span>
            <span>© 2026 Instagram from Meta</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Signup;
