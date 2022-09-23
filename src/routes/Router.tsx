import { BrowserRouter, Route, Routes } from "react-router-dom";
import Disparo from "../pages/Disparo";
import Login from "../pages/Login";

const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Main" element={<Disparo />} />
    </Routes>
  </BrowserRouter>
);

export default Router;
