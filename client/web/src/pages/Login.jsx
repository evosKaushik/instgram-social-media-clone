import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuth.store";
import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import AuthFooter from "../components/auth/AuthFooter";
import { ClipLoader } from "react-spinners";
import AuthLeftPanel from "../components/auth/AuthLeftPanel";
import AuthFooter from "../components/auth/AuthFooter";

// ---------------- SCHEMA ----------------
const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Email or username is required")
    .transform((val) => val.toLowerCase()),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const [focusedField, setFocusedField] = useState(null);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const isEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const onSubmit = async (formData) => {
    const { identifier, password } = formData;

    const payload = isEmail(identifier)
      ? { email: identifier, password }
      : { username: identifier, password };

    const success = await login(payload);

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
        <AuthLeftPanel />

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
            {/* Email or Username field */}
            <div className="relative">
              <div
                className={`w-full border rounded-xl px-3 pt-3 pb-2 bg-background transition-all ${
                  focusedField === "identifier"
                    ? "border-blue-400 ring-1 ring-blue-300"
                    : errors.identifier
                      ? "border-red-400"
                      : "border-border"
                }`}
              >
                <label
                  htmlFor="identifier"
                  className={`absolute left-3 transition-all duration-150 pointer-events-none text-gray-400 ${
                    focusedField === "identifier" || watch("identifier")
                      ? "top-1.5 text-[10px]"
                      : "top-3.5 text-sm"
                  }`}
                >
                  Email or Username
                </label>

                <input
                  id="identifier"
                  type="text"
                  autoComplete="off"
                  {...register("identifier")}
                  onFocus={() => setFocusedField("identifier")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent outline-none text-sm pt-3 text-foreground"
                />
              </div>

              {errors.identifier && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {errors.identifier.message}
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
                    focusedField === "password" || watch("password")
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
              className="w-full h-10 flex justify-center items-center rounded-xl bg-blue-800 text-white text-sm font-semibold transition-opacity mt-1 hover:cursor-pointer"
              style={{
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? <ClipLoader size={16} color="#ffffff" /> : "Login"}
            </button>
          </form>

          {/* Forgot password */}
          <div className="w-full text-center">
            <Link
              to="/forgot-password"
              className="text-foreground text-sm hover:underline"
            >
              Forgot password?
            </Link>
          </div>

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
            <Link to="/signup">Don't have account, Create</Link>
          </button>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <AuthFooter />
    </div>
  );
};

export default Login;
