import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

   const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const handleResize = () => {
    const checkpoint = window.innerWidth < breakpoint;
    setIsMobile(checkpoint);
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return [isMobile];
};

export default useMobile;
