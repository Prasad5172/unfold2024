import React from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Currbattles from "./Pages/Currbattles";
import Prevbattles from "./Pages/Prevbattles";
import LeaderBoard from "./Pages/LeaderBoard";
import AllTimeLeaderBoard from "./Pages/AllTimeLeaderBoard";
import ConnetToWallet from "./ConnectToWallet";
import LandingComponent from "./Pages/LandingComponent";
import { toastSuccess } from "./Utils/ToastFunctions";
import BattleMemes from "./Pages/BattleMemes";
import SelectNftsToBattle from "./Pages/SelectNftsToBattle";

function RightDashBoard() {
  
  return (
    <>
      {/* Right Dashboard Content */}
      <main className="flex-1 px-6 overflow-auto bg-[#121212]">
        <Routes>
          <Route exact path="/" element={<Dashboard />} />
          <Route exact path="/cur-battles" element={<Currbattles />} />
          <Route exact path="/prev-battles" element={<Prevbattles />} />
          <Route exact path="/battles/:id" element={<LeaderBoard />} />
          <Route exact path="/alltimeleader-board" element={<AllTimeLeaderBoard />} />
          <Route exact path="/battle/:battleId/:category" element={<BattleMemes />} />
          <Route exact path="/selectmeme/:battleId" element={<SelectNftsToBattle />} />
        </Routes>
      </main>
    </>
  );
}

export default RightDashBoard;
