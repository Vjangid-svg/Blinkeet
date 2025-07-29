import React, { useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import Axios from "../utils/Axios";
import Summaryapi from "../common/Summaryapi";
import AxiosToastError from "../utils/AxiosToastError";
import { Link, useNavigate } from "react-router-dom";
import fetchUserDetails from "../utils/fetchUserDetails";
import { setUserDetails } from "../store/userSlice";
// for my personel api axios aur baseurl
// import  { baseURL } from "../common/Summaryapi";
// import axios from "axios";

import { useDispatch } from "react-redux";


const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const valideValue = Object.values(data).every((el) => el);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await Axios({
        ...Summaryapi.login,
        data: data,
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("accesstoken", response.data.data.accesstoken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const userDetails = await fetchUserDetails();
        dispatch(setUserDetails(userDetails.data));

        setData({
          email: "",
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }

    //  ye api getting response jo ki greatstack ka follow kia ye bhi working h
//   try {
//   const response = await axios.post(`${baseURL}/api/user/login`, {
//     email: data.email,
//     password: data.password,
//   });

//   console.log("Registering user with data:", data);
//   console.log("API response:", response.data); // debug log

//   if (response.data.success) {
//     toast.success(response.data.message || "Successfully loged in");

//     setData({
//       email: "",
//       password: "",
//     });

//     navigate("/login");
//   } else {
//     toast.error(response.data.message || "Something went wrong!");
//   }

// } catch (error) {
//    toast.error(error.message);
// }

  };
  return (
    <section className="w-full container mx-auto px-2">
      <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-7">
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="grid gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="password">Password :</label>
            <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full outline-none"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <div
                onClick={() => setShowPassword((preve) => !preve)}
                className="cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </div>
            </div>
            <Link
              to={"/forgot-password"}
              className="block ml-auto transition-all duration-300  cursor-pointer text-primary-200 hover:text-green-800"
            >
              Forgot password ?
            </Link>
          </div>

          <button
            disabled={!valideValue}
            className={` ${
              valideValue ? "bg-green-800 cursor-pointer hover:bg-green-700" : "bg-gray-500"
            }    text-white py-2 rounded font-semibold my-3 tracking-wide`}
          >
            Login
          </button>
        </form>

        <p>
          Don't have account?{" "}
          <Link
            to={"/register"}
            className="font-semiboldtransition-all duration-300  text-primary-200 hover:text-green-800 cursor-pointer" 
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
