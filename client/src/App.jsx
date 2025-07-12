import "./index.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from "./pages/NotFound";
import { Toaster } from 'react-hot-toast';
import Signup from './pages/Signup';
import Onboarding from './pages/Onboarding';
import Chat from './pages/Chat';
import Call from './pages/Call';
import Otp from "./pages/Otp";
import LoadingScreen from "./components/LoadingScreen";
import { useAuthUser } from "./hooks/useAuthUser";
import Layout from "./components/Layout";
import Notification from "./pages/Notification";

function App() {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isAccountVerified = authUser?.isAccountVerified;
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) return <LoadingScreen />;

  // Handle dynamic home route rendering
  const renderHomeRoute = () => {
    if (isAuthenticated && isAccountVerified && isOnboarded) {
      return (
        <Layout showSidebar >
          <Home />
        </Layout>
    );
    } else if (isAuthenticated && !isAccountVerified) {
      return <Navigate to="/verify-email" />;
    } else if (isAuthenticated && isAccountVerified && !isOnboarded) {
      return <Navigate to="/onboarding" />;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={renderHomeRoute()} />

        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
        />

        <Route path="/verify-email" element={<Otp />} />

        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/onboarding"
          element={isAuthenticated ? (!isOnboarded? (<Onboarding />) : (<Navigate to="/login" />) ) : (<Navigate to="/login" />)}
        />

        <Route
          path="/notifications"
          element={isAuthenticated ? <Notification/> : <Navigate to="/login" />}
        />

        <Route
          path="/call"
          element={isAuthenticated ? <Call /> : <Navigate to="/login" />}
        />

        <Route
          path="/chat"
          element={isAuthenticated ? <Chat /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
