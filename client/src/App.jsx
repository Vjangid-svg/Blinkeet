import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from "./store/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setAllCategory,
  setAllSubCategory,
  setLoadingCategory,
} from "./store/productSlice";
import UserMenuMobile from "./pages/UserMenuMobile";
import Dashboard from "./layout/Dashboard";
import Profile from "./pages/Profile";
import MyOrders from "./pages/MyOrders";
import Address from "./pages/Address";
import UserProfileAvatarEdit from "./components/UserProfileAvtarUpload";
import Category from "./pages/Category";
import SubCategory from "./pages/SubCategory";
import UploadProduct from "./pages/UploadProduct";
import ProductAdmin from "./pages/ProductAdmin";
import AdminPermission from "./layout/AdminPermission";
import Summaryapi from "./common/Summaryapi";
import Axios from "./utils/Axios";
import ProductListPage from "./pages/ProductListPage";
import ProductDisplayPage from "./pages/ProductDisplayPage";
// import { handleAddItemCart } from "../src/store/cartProduct"; // ✅ path might differ
import GlobalProvider from "./provider/GlobalProvider";
import CartMobileLink from "./components/CartMobile";
import CartMobile from "./pages/CartMobile";
import CheckoutPage from "./pages/CheckoutPage";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
const App = () => {
  // const user = useSelector((state) => state?.user);

  const dispatch = useDispatch();

  const fetchUser = async () => {
    const userData = await fetchUserDetails();
    // console.log("userData : ", userData.data);
    dispatch(setUserDetails(userData.data));
  };
  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const response = await Axios({
        ...Summaryapi.getCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(
          setAllCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...Summaryapi.getSubCategory,
      });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(
          setAllSubCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      console;
    }
  };


  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
    // fetchCartItem();
  }, []);


  return (

    <GlobalProvider>
      <Toaster />
      <Header />
      <div className="min-h-[78vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/verify-forgot-password-otp"
            element={<OtpVerification />}
          />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/user" element={<UserMenuMobile />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Profile />} />
            <Route path="profile" element={<Profile />} />
            <Route path="my-orders" element={<MyOrders />} />
            <Route path="address" element={<Address />} />
            <Route path="upload-avatar" element={<UserProfileAvatarEdit />} />
            <Route
              path="category"
              element={
                <AdminPermission>
                  <Category />
                </AdminPermission>
              }
            />
            <Route
              path="subcategory"
              element={
                <AdminPermission>
                  <SubCategory />
                </AdminPermission>
              }
            />
            <Route
              path="upload-product"
              element={
                <AdminPermission>
                  <UploadProduct />
                </AdminPermission>
              }
            />
            <Route
              path="product"
              element={
                <AdminPermission>
                  <ProductAdmin />
                </AdminPermission>
              }
            />
            <Route path="my-orders" element={<MyOrders />} />
          </Route>
          <Route path=":category">
            <Route path=":subCategory" element={<ProductListPage />} />
          </Route>
          <Route path="product/:product" element={<ProductDisplayPage />} />
          <Route path="cart" element={<CartMobile />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="success" element={<Success />} />
          <Route path="cancel" element={<Cancel />} />
        </Routes>
      </div>
      {location.pathname !== "/checkout" && (
        <CartMobileLink />
      )
      }
      <Footer />

    </GlobalProvider>

  );
};

export default App;
