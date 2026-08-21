import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const queryClient = new QueryClient();

// ============= COMPONENT ================ //
import NavBar from "@/components/NavBar";
import MainLayout from "./components/layout/MainLayout";



// =============== PAGES ================== //
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

import User from './pages/UserPage'

import Settings from './pages/Settings'
import CategoryItemsPage from './pages/settings/'

import AdminPage from './pages/AdminPage'
import AdminSettingsPage from './pages/settings/AdminSettingsPage'

import PeoplePage from './pages/PeoplePage'

import SearchPage from './pages/SearchPage'

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <NavBar /> //Ini untuk navbarnya. jadi global dia
            }
          >
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/your-page/:parameterThatPassToJsx" element={<Element />} /> */}

            <Route path="/feed/new" element={<FeedNew />} />


            <Route path="/trips/" element={<TripIndex />} />
            <Route path="/trips/new" element={<NewTrip />} />
            <Route path="/trips/:tripId" element={<TripDetail />} />

            <Route path="/notifications" element={<NotificationPage />} />



            <Route path="/messages" element={<MessagesPage />} />


            <Route path="/reports" element={<Reports />} />

            <Route path="/u/:userId" element={<User />} />


            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/:categoryId" element={<CategoryItemsPage />} />

            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />

            <Route path="/people" element={<PeoplePage />} />
            <Route path="/search" element={<SearchPage />} />

            <Route path="*" element={<NotFound />} />  {/* Ini untuk not found page*/}
          </Route>
        </Routes>

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
