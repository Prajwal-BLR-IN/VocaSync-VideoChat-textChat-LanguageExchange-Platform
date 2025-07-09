import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from "./pages/NotFound";
import toast, {Toaster} from 'react-hot-toast'
import { useQuery } from "@tanstack/react-query";
import { axiosInstanace } from "./lib/axiosInstance";
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Notificaon from './pages/Notification';
import Chat from './pages/Chat';
import Call from './pages/Call';
import Otp from "./pages/Otp";

function App() {

  const {data: authData, isLoading, error} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const {data} =  await axiosInstanace.get('/auth/me')
      return data
    },
    retry: false
  })


  const authUser = authData?.user;

  return (
    <>
    <Toaster />
    <Routes>
      <Route path="/" element={ authUser?  <Home /> : <Navigate to="/login"  /> } />
      <Route path="/signup" element={ !authUser? <Signup /> : <Navigate to='/' /> } />
      <Route path="/verify-email" element={ <Otp />  } />
      <Route path="/login" element={ !authUser? <Login />:  <Navigate to='/' /> } />
      <Route path="/onboarding" element={ authUser? <Onboarding /> : <Navigate to="/login"/> } />
      <Route path="/notifications" element={ authUser? <Notificaon /> : <Navigate to="/login"/>  } />
      <Route path="/call" element={ authUser? <Call /> : <Navigate to="/login"/>  } />
      <Route path="/chat" element={ authUser? <Chat /> : <Navigate to="/login"/> } />
      <Route path="*" element={ <NotFound /> } />
    </Routes>
    </>
  );
}

export default App;
