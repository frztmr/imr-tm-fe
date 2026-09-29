import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { userState } from "./store/types";
import { login } from "@/store/userSlice";
import Axios from "./config/axios";

import NavBar from "@/components/NavBar";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import FeedNew from "./pages/FeedNew";
import NotFound from "./pages/NotFound";
import TripIndex from "./pages/trip/Trip.Index";
import NewTrip from "./pages/trip/Trip.New";
import TripDetail from "./pages/trip/Trip.Detail";
import NotificationPage from "./pages/Notification";
import MessagesPage from "./pages/Messages";
import Reports from "./pages/Reports";
import User from "./pages/UserPage";
import Settings from "./pages/Settings";
import CategoryItemsPage from "./pages/settings/";
import AdminPage from "./pages/AdminPage";
import AdminSettingsPage from "./pages/settings/AdminSettingsPage";
import PeoplePage from "./pages/PeoplePage";
import SearchPage from "./pages/SearchPage";

const queryClient = new QueryClient();

// =========================================================
// AUTH BOOTSTRAP — cek keep_login sekali saat aplikasi start
// =========================================================
const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const [isChecking, setIsChecking] = useState(true);

  const personalData = useSelector(
    (state: userState) => state.personalData?.personalData?.pid
  );

  useEffect(() => {
    if (personalData) {
      setIsChecking(false);
      return;
    }

    let cancelled = false;
    Axios.get("/auth/keep_login")
      .then((res) => {
        if (cancelled) return;
        if (res.status === 200) {
          dispatch(login(res.data.personal));
        }
      })
      .catch((err) => {
        console.log("err at keep_login", err);
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false);
      });

    return () => {
      cancelled = true;
    };
  }, [personalData, dispatch]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
};

// =========================================================
// PROTECTED ROUTE — hanya boleh diakses jika sudah login
// =========================================================
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const personalData = useSelector(
    (state: userState) => state.personalData?.personalData?.pid
  );

  if (!personalData) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// =========================================================
// PUBLIC ROUTE — kalau sudah login, jangan tampilkan login
// =========================================================
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const personalData = useSelector(
    (state: userState) => state.personalData?.personalData?.pid
  );

  if (personalData) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// =========================================================
// APP
// =========================================================
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <AuthBootstrap>
            <Routes>
              {/* ---------- PUBLIC ---------- */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* ---------- PROTECTED (dengan NavBar global) ---------- */}
              <Route
                element={
                  <ProtectedRoute>
                    <NavBar />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<HomePage />} />
                <Route path="/feed/new" element={<FeedNew />} />

                <Route path="/trips" element={<TripIndex />} />
                <Route path="/trips/new" element={<NewTrip />} />
                <Route path="/trips/:tripId" element={<TripDetail />} />

                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/reports" element={<Reports />} />

                <Route path="/u/:userId" element={<User />} />

                <Route path="/settings" element={<Settings />} />
                <Route
                  path="/settings/:categoryId"
                  element={<CategoryItemsPage />}
                />

                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/settings" element={<AdminSettingsPage />} />

                <Route path="/people" element={<PeoplePage />} />
                <Route path="/search" element={<SearchPage />} />
              </Route>

              {/* ---------- 404 ---------- */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthBootstrap>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;