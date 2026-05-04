import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Layout from "./Layout.jsx";
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";
import { lazy } from "react";
// import Home from "./pages/Home";
const Home = lazy(() => import("./pages/Home.jsx"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { RequireAuth } from "./components/RequireAuth.jsx";
import { PublicOnly } from "./components/PublicOnly.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <RequireAuth>
            <Home />
          </RequireAuth>
        ),
      },
      {
        path: "/:username",
        element: (
          <RequireAuth>
            <Profile />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <PublicOnly isPublic={true}>
        <Login />
      </PublicOnly>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicOnly>
        <Signup />
      </PublicOnly>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
