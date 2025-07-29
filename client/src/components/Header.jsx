import React from "react";
import logo from "../assets/logo.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import UserMenu from "./UserMenu";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { useState } from "react";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useEffect } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import { useRef } from "react";
const Header = () => {
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const menuRef = useRef();
  // const [totalPrice,setTotalPrice]=useState(0)
  // const [totalQty,setTotalQty]=useState(0)
  const cartItem = useSelector((state) => state.cartItem.cart);
  // console.log("cartItem", cartItem)
  const [openCartSection, setOpenCartSection] = useState(false);

  // const totalQty = cartItem.reduce((acc, item) => acc + item.quantity, 0);
  // const totalPrice = cartItem.reduce((acc, item) => acc + (item.productId?.price || 0) * item.quantity, 0);

  const [isMobile] = useMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const isSearchPage = location.pathname === "/search";

  const { totalPrice, totalQty } = useGlobalContext();
  const user = useSelector((state) => state?.user);
  // console.log("user from store", user);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login")
      return
    }
    navigate("/user")
  }
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenUserMenu(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  //   useEffect(()=>{
  // const qty = cartItem.reduce((preve,curr)=>{
  //   return preve + curr.quantity
  // },0)
  // setTotalQty(qty)
  // console.log(qty);

  // const tPrice = cartItem.reduce((preve,curr)=>{
  //   return preve + (curr.productId.price*curr.quantity)
  // },0)
  // setTotalPrice(tPrice)
  // console.log(tPrice);

  //   },[cartItem])

  return (
    <header className="h-24 lg:h-20 lg:shadow-md sticky top-0 z-40 flex flex-col justify-center gap-1 bg-white">
      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto flex items-center px-2 justify-between ">
          {/**logo */}
          <div className="h-full">
            <Link to={"/"} className="h-full flex justify-center items-center">
              <img
                src={logo}
                width={170}
                height={60}
                alt="logo"
                className="hidden lg:block"
              />
              <img
                src={logo}
                width={120}
                height={60}
                alt="logo"
                className="lg:hidden"
              />
            </Link>
          </div>

          {/**Search */}
          <div className="hidden lg:block">
            <Search />
          </div>
          {/* my cart */}
          <div>
            {/* this button is user icon only display in mobile */}
            <button onClick={handleMobileUser} className="text-neutral-600 cursor-pointer lg:hidden">
              <FaUser size={26} />
            </button>

            {/* for desktop show this cart intead of user */}

            <div className="hidden  lg:flex gap-10  items-center">
              {user?._id ? (
                <div className="relative " ref={menuRef}>
                  <div
                    onClick={() => setOpenUserMenu((preve) => !preve)}
                    className="flex   select-none items-center gap-1 cursor-pointer"
                  >
                    <p>Account</p>
                    {openUserMenu ? (
                      <GoTriangleUp size={25} />
                    ) : (
                      <GoTriangleDown size={25} />
                    )}
                  </div>
                  {openUserMenu && (
                    <div className=" absolute right-0 top-12 ">
                      <div className="bg-white rounded p-4 min-w-52  lg:shadow-lg ">
                        <UserMenu close={handleCloseUserMenu} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={redirectToLoginPage}
                  className="cursor-pointer text-lg px-2"
                >
                  Login
                </button>
              )}

              <button onClick={() => setOpenCartSection(true)} className="flex items-center gap-2 transition-all duration-300 bg-green-800 hover:bg-green-700 px-3 py-2 rounded text-white ">
                <div className="animate-bounce cursor-pointer">
                  <BsCart4 size={26} />
                </div>
                <div className=" font-semibold text-sm cursor-pointer">
                  {cartItem[0] ? (
                    <div>
                      <p>{totalQty} Items</p>
                      <p>{DisplayPriceInRupees(totalPrice)}</p>

                    </div>
                  ) : (
                    <p>My Cart</p>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-2 lg:hidden">
        <Search />
      </div>
      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;
