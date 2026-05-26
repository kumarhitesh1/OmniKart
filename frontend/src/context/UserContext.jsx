import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [isAuth, setIsAuth] = useState(false);

  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // Load user on app start
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch logged in user
  async function fetchUser() {
    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: { token: Cookies.get("token") },
      });

      setUser(data);
      setIsAuth(true);
    } catch (error) {
      // Reset auth state if user is not logged in
      setIsAuth(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  // Login user with email
  async function loginUser(email, navigate) {
    setBtnLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        email,
      });

      toast.success(data.message);

      localStorage.setItem("email", email);

      navigate("/verify");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  }

  // Verify user OTP
  async function verifyUser(otp, navigate) {
    setBtnLoading(true);

    const email = localStorage.getItem("email");

    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        email,
        otp,
      });

      toast.success(data.message);

      setUser(data.user);
      setIsAuth(true);

      Cookies.set("token", data.token, { expires: 15 });

      localStorage.clear();

      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  }

  // Logout user
  function logoutUser(navigate) {
    Cookies.remove("token");

    setUser(null);
    setIsAuth(false);

    toast.success("Logged out");

    navigate("/login");
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isAuth,
        loading,
        btnLoading,
        loginUser,
        verifyUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);