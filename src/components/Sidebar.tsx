import { BarChart } from "@mui/icons-material";
import { Box, Drawer } from "@mui/material";
import PropTypes from "prop-types";
import { NavItem } from "./NavItem";

const items = [
  {
    href: "/main",
    icon: (<BarChart fontSize="small" />),
    title: "Disparo"
  },
  {
    href: "/sessions",
    icon: (<BarChart fontSize="small" />),
    title: "Sessões"
  },
  {
    href: "/campaigns",
    icon: (<BarChart fontSize="small" />),
    title: "Campanhas"
  },
  {
    href: "/números",
    icon: (<BarChart fontSize="small" />),
    title: "Números"
  }

];
const Sidebar = (props: any) => {
  const { open, onClose } = props;

  const content = (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 1.5,
          height: 64
        }}
      >
        <Box sx={{ display: "inline-flex", justifyContent: "center" }}>
          {items.map((item, index) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}/>
          ))
          }
        </Box>
      </Box>
    </>
  );

  return (
    <Drawer
      anchor="top"
      PaperProps={{
        sx: {
          backgroundColor: "secondary.main",
          color: "#FFFFFF",
          width: "100%"
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="permanent"
    >
      {content}
    </Drawer>
  );
};

Sidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};

export default Sidebar;
