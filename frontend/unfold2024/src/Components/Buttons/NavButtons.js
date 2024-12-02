import React from "react";
import { NavLink } from "react-router-dom";
import "./NavButton.css";

function NavButtons({ to, children }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `glow-on-hover p-4 rounded-lg text-center transition duration-300 ${
          isActive ? "glow-on-hover-active" : ""
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default NavButtons;
