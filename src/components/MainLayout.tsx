import { styled } from "@mui/material/styles";
import { useState } from "react";
import Sidebar from "./Sidebar";

const LayoutRoot = styled("div")(({ theme }) => ({
  position: "relative",
  top: 0,
  maxWidth: "100%",
  flexDirection: "column",
  paddingTop: 64
}));

export const MainLayout = (props: any) => {
  const { children } = props;
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Sidebar
        onClose={() => setSidebarOpen(false)}
        open={isSidebarOpen}
      />
      <LayoutRoot>
        {children}
      </LayoutRoot>
    </>
  );
};
