import React, { useState } from "react";
import { close, logo, menu } from "../assets"; // Ensure these paths are correct
import { navLinks } from "../constants";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="hoobank" className="w-[124px] h-[32px]" />
      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((el, index) => (
          <li
            key={el.id}
            className={`font-poppins font-normal cursor-pointer text-[16px] ${
              index === navLinks.length - 1 ? "mr-0" : "mr-10"
            } text-white`}
          >
            {el.id === "login" || el.id === "signup" ? (
              <IsLogOrSign status={el.id} />
            ) : (
              <a href={`#${el.id}`}>{el.title}</a>
            )}
          </li>
        ))}
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle((prev) => !prev)}
        />

        <div
          className={`${
            toggle ? "flex" : "hidden"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex flex-col justify-end items-center flex-1">
            {navLinks.map((el, index) => {
              return (
                <li
                  key={el.id}
                  className={`font-poppins font-normal cursor-pointer text-[16px] ${
                    index === navLinks.length - 1 ? "mr-0" : "mb-4"
                  } text-white`}
                >
                  {el.id === "login" || el.id === "signup" ? (
                    <IsLogOrSign status={el.id} />
                  ) : (
                    <a href={`#${el.id}`}>{el.title}</a>
                  )}
                  {/* <a href={`#${el.id}`}>{el.title}</a> */}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

function IsLogOrSign({ status }) {
  const navigate = useNavigate();
  if (status === "login") {
    return <button onClick={() => navigate("/login")}>Log In</button>;
  }
  if (status === "signup") {
    return <button onClick={() => navigate("/signup")}>Sign Up</button>;
  }
}

export default NavBar;
