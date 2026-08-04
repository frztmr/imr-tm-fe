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
import Index from "./pages/Index";
import NewPost from "./pages/Feed.New";
import NotFound from "./pages/NotFound";

import TripIndex from "./pages/trip/Trip.Index";
import NewTrip from "./pages/trip/Trip.New"; 

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
          <Route path="/" element={<Index />} /> 
          {/* <Route path="/your-page/:parameterThatPassToJsx" element={<Element />} /> */}
          
          <Route path="/feed/new" element={<NewPost />} /> 

          
          <Route path="/trips/" element={<TripIndex />} /> 
          <Route path="/trips/new" element={<NewTrip />} /> 


          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

    </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
