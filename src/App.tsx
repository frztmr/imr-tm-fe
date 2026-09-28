

// =============== REACT REQUIREMENT ============= //
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate, BrowserRouter, Routes, Route } from "react-router-dom";

// ============== REDUX REQUIREMENT ============== //
import { userState } from './store/types'
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/userSlice";
import Axios from "./config/axios";


// ================ COMPONENT =================== //
import NavBar from "@/components/NavBar";
import MainLayout from "./components/layout/MainLayout";
const queryClient = new QueryClient();


// ================== PAGES ===================== //
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

const App = () => {

  const dispatch = useDispatch()
  // const navigate = useNavigate();

  const personalData = useSelector((state: userState) => state.personalData).personalData.pid;

  // // next, ini ada request bawa user_id untuk ke backend untuk access token dan refresh token

  if (!personalData) {
    //sudah tidak ada data user di redux
    Axios.get('/auth/keep_login')
      .then((res) => {
        if (res.status === 200) {
          dispatch(login(res.data.personal))

          console.log("res.status === 200", res)
        } else if (res.status === 201) {
          // navigate("/login");
          console.log("res.status === 201", res)
        }
        // console.log("res att app tsx", res)
      })
      .catch((err) => {
        console.log("err at app.tsx", err)
        // navigate("/login");
      })
    console.log("personalData at app.tsx is invalid ", personalData)
  } else {
    //masih ada data user di redux
    console.log("personalData at app.tsx is is valid ", personalData)
  }
  
  // // Nyalakan ini hanya jika anda mau testing
  // const after_treatment = useSelector((state: userState) => state.personalData).personalData;
  // console.log("state.personal redux di app.tsx: after_treatment", after_treatment)

  return (
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
  )
};

export default App;
