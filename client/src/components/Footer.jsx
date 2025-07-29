import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 ">
      <div className="container flex mx-auto p-4 text-center flex-col md:flex-row md:justify-between gap-3">
        <p>© Blink Commerce Private Limited, 2016-2025</p>
        <div className="flex items-center gap-4  justify-center text-2xl">
          <a
            href=""
            className="hover:text-primary-100 transition-all duration-300 ease-in-out"
          >
            <FaFacebook />
          </a>
          <a
            href=""
            className="hover:text-primary-100 transition-all duration-300 ease-in-out"
          >
            <FaInstagram />
          </a>
          <a
            href=""
            className="hover:text-primary-100 transition-all duration-300 ease-in-out"
          >
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
