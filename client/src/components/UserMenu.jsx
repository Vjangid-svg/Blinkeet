import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineExternalLink } from "react-icons/hi";
import Divider from "./Divider";
import Axios from "../utils/Axios";
import Summaryapi from "../common/Summaryapi";
import { logout } from "../store/userSlice";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";
import isAdmin from "../utils/isAdmin";

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...Summaryapi.logout,
      });

      console.log("logout", response);
      if (response.data.success) {
        window.alert("Are you sure want to logOut !!");
        if (close) {
          close();
        }
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      AxiosToastError(error);
    }
  };

  const handleClose = () => {
    if (close) {
      close();
    }
  };

  return (
    <div className="bg-white">
      <div className="font-semibold">My Account</div>
      <div className="text-sm flex items-center gap-2">
        <span className="max-w-52 text-ellipsis line-clamp-1">
          {user.name || user.mobile}{" "}
          <span className="text-medium text-red-600">
            {user.role === "ADMIN" ? "(Admin)" : ""}
          </span>
        </span>
        <Link
          onClick={() => handleClose()}
          to={"/dashboard/profile"}
          className="transition-all duration-200 hover:text-primary-200"
        >
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>
      <Divider />

      <div className="text-sm grid gap-1">
        {isAdmin(user.role) && (
          <Link
            onClick={() => handleClose()}
            to={"/dashboard/category"}
            className="px-2 transition-all duration-200  hover:bg-orange-200 py-1"
          >
            Category
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={() => handleClose()}
            to={"/dashboard/subcategory"}
            className="px-2 transition-all duration-200 hover:bg-orange-200 py-1"
          >
            Sub Category
          </Link>
        )}
        {isAdmin(user.role) && (
          <Link
            onClick={() => handleClose()}
            to={"/dashboard/upload-product"}
            className="px-2 transition-all duration-200 hover:bg-orange-200 py-1"
          >
            Upload Product
          </Link>
        )}
         {isAdmin(user.role) && (
          <Link
            onClick={() => handleClose()}
            to={"/dashboard/product"}
            className="px-2 transition-all duration-200 hover:bg-orange-200 py-1"
          >
            Product
          </Link>
        )}

        <Link
          onClick={() => handleClose()}
          to={"/dashboard/my-orders"}
          className="px-2 transition-all duration-200 hover:bg-orange-200 py-1"
        >
          My Orders
        </Link>

        <Link
          onClick={() => handleClose()}
          to={"/dashboard/address"}
          className="px-2 transition-all duration-200  hover:bg-orange-200 py-1"
        >
          Save Address
        </Link>

        <button
          onClick={handleLogout}
          className=" transition-all duration-200 cursor-pointer text-left px-2 hover:bg-orange-200 py-1"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
