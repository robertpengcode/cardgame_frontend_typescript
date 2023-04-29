import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './index.css';
import { GameContextProvider } from "./context/GameContext";
import Home from "./page/Home";
import CreateBattle from "./page/CreateBattle";
import Battle from "./page/Battle";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GameContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/battle/:battleId" element={<Battle />} />
          <Route path="/create-battle" element={<CreateBattle />} />
        </Routes>
      </GameContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);


