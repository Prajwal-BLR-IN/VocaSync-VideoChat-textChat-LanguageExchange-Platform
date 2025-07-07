import "./index.css";
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from "./pages/NotFound";
import toast, {Toaster} from 'react-hot-toast'
import { useQuery } from "@tanstack/react-query";
import axios from 'axios'
import { axiosInstanace } from "./lib/axiosInstance";

function App() {

  const {data, isLoading, error} = useQuery({
    queryKey: ["todo"],
    queryFn: async () => {
      const {data} =  await axiosInstanace.get('https://localhost:4001/api/auth/me')
      return data
    }
  })

  console.log("is loading ", isLoading)
  console.log(data)
  console.log("got error ",error) 

  return (
    <>
    <Toaster />
    <button onClick={() => toast.success("Hey look me")} >click here</button>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={ <Login /> } />
      <Route path="*" element={ <NotFound /> } />
    </Routes>
    </>
  );
}

export default App;
