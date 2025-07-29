import React from "react";
import UserMenu from "../components/UserMenu";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  console.log("user dashboard", user);
  return (
   <div className="bg-blue-50">
      <div className="container mx-auto bg-gray-50 lg:flex gap-4">
    {/* Sidebar */}
    <div className=" hidden md:block   ps-3  w-full md:w-[250px]  sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto border-r border-gray-300 bg-gray-50">
      <UserMenu />
    </div>

    {/* Main Content */}
    <div className= "  ps-3 pt-3  flex-1 bg-blue-50 min-h-[75vh]">
      <Outlet />
    </div>
  </div>
</div>

  );
};

export default Dashboard;
