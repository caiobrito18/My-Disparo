import { MoreVert, WhatsApp } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, SxProps, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import React, { useState } from "react";
import api from "../services/api";

export interface CardProps{
  session: string
  connection: string
  number: string
  name: string
  sx?: SxProps<Theme>
}

export default function useInstancias (sessionArray: CardProps[] | undefined) {
  const [selected, setSelected] = useState<any[]>([]);

  async function loadInstances (url: string) {
    const req = api(url);
    const data = await req.get("/instance/list?active=true").then((res) => {
      const slist = res.data.data;
      const data = [
        {
          session: "",
          connection: "",
          name: "",
          number: ""
        }
      ];
      for (let i = 0; i < slist.length; i++) {
        data.push({
          session: slist[i].instance_key,
          connection: slist[i].phone_connected ? "conectado" : "desconectado",
          name: slist[i].user.name,
          number: slist[i].user.id
        });
      }
      data.shift();
      return data;
    });
    return data;
  }

  return {
    loadInstances,
    Card: ({ connection, session, name, number, sx }: CardProps) => {
      const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
      const open = Boolean(anchorEl);
      const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
      };
      const handleDeleteInstance = async () => {
        await api("https://api01.siriusalpha.com.br").delete("instance/delete", {
          params: {
            key: session
          }
        }).then(x => console.log(x));
        setAnchorEl(null);
      };
      const handleLogoutInstance = async () => {
        await api("https://api01.siriusalpha.com.br").delete("instance/logout", {
          params: {
            key: session
          }
        }).then(x => console.log(x));
        setAnchorEl(null);
      };
      return (
        <Box sx={{
          ...sx,
          width: 250,
          height: 100,
          borderRadius: "15px",
          backgroundColor: "primary.dark",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "start"
        }}>
          <Box sx={{ display: "inline-flex" }}>
            <Box sx={{ position: "relative", display: "block", top: "0px", right: "0px" }}>
              <IconButton onClick={handleOpen} id={`icon-button-${name}`} sx={{ position: "absolute", top: "0px", right: "-230px" }}>
                <MoreVert />
              </IconButton>
            </Box>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button"
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              PaperProps={{
                style: {
                  backgroundColor: "#000005",
                  color: "#ddf",
                  maxHeight: 48 * 4.5,
                  width: "20ch"
                }
              }}
            >
              <MenuItem onClick={handleDeleteInstance}>
              Delete
              </MenuItem>
              <MenuItem onClick={handleLogoutInstance}>
              Logout
              </MenuItem>
            </Menu>
            <WhatsApp sx={{
              mx: 1,
              color: connection === "conectado"
                ? "primary.contrastText"
                : "error.main"
            }}/>
            <Typography>{session}</Typography>
            <Typography sx={{
              fontSize: 12,
              alignSelf: "end",
              mb: 0.5
            }}>
            ({name})
            </Typography>
          </Box>
          <Box>
            <Typography sx={{
              color: connection === "conectado"
                ? "primary.contrastText"
                : "error.main"
            }}>
              {connection}
            </Typography>
            <Typography>
              Número: {number.split(":")[0]}
            </Typography>
          </Box>
        </Box>
      );
    }
  };
}
