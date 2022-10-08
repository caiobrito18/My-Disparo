import { ThemeProvider } from "@mui/material";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components/MainLayout";
import { theme } from "../css/theme";
import Campaigns from "../pages/Campaigns";
import Disparo from "../pages/Disparo";
import Login from "../pages/Login";
import Sessions from "../pages/Sessions";
import { WebSocketDemo } from "../services/socket";

const Router = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<MainLayout><Outlet/></MainLayout>}>
          <Route path="/main" element={<Disparo /> } />
          <Route path="/socket" element={<WebSocketDemo /> } />
          <Route path="/sessions" element={<Sessions/>} />
          <Route path="/campaigns" element={<Campaigns/>} />
        </Route>
      </Routes>
    </ThemeProvider>
  </BrowserRouter>
);

export default Router;
