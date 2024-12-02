import React from 'react'
import { NavLink } from "react-router-dom";
import NavButtons from './Buttons/NavButtons';

function LeftSideDashBoard() {
  return (
    <aside className="w-1/5 bg-[#303030] shadow-lg p-6">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-white">John Doe</h2>
          <p className=" text-white">john.doe@example.com</p>
        </div>
        <div className="mt-8">
          <ul>
            <li className="mb-2 text-white">
              Participated-
            </li>
            <li className="mb-2 text-white">
              Won-
            </li>
           
          </ul>
        </div>
        <section>
          <div className="shadow-md rounded-lg">
            <div className="mt-4 grid  gap-4">
            <NavButtons to="/">Dashboard</NavButtons>
            <NavButtons to="/cur-battles">Current Battles</NavButtons>
            <NavButtons to="/prev-battles">Previous Battles</NavButtons>
            <NavButtons to="/alltimeleader-board">All Time Leader Board</NavButtons>
            </div>
          </div>
        </section>
      </aside>
  )
}

export default LeftSideDashBoard