import { ThemeProvider } from "@mui/material";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components/MainLayout";
import { theme } from "../css/theme";
import Disparo from "../pages/Disparo";
import Login from "../pages/Login";
import Sessions from "../pages/Sessions";

const Router = () => (
  <BrowserRouter>
  <ThemeProvider theme={theme}>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<MainLayout><Outlet/></MainLayout>}>
        <Route path="/main" element={<Disparo /> } />
        <Route path="/sessions" element={<Sessions/>} />
      </Route>
    </Routes>
  </ThemeProvider>
  </BrowserRouter>
);

export default Router;
