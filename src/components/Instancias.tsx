import { MoreVert, WhatsApp } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem, SxProps, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import React, { useState } from "react";
import { req01 } from "../services/api";

export interface CardProps{
  session: string
  connection: string
  number: string
  name: string
  moreOptions?: boolean
  reloadInstances?: () => Promise<void>
  sx?: SxProps<Theme>
  selected?: CardProps[]
  setSelected?: React.Dispatch<React.SetStateAction<CardProps[] | undefined>>
}
export default function useInstancias (sessionArray?: CardProps[] | undefined) {
  async function loadInstances () {
    const data = await req01.get("/instance/list?active=true").then((res) => {
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
    Card: ({
      connection,
      session,
      name,
      number,
      sx,
      reloadInstances,
      selected,
      setSelected,
      moreOptions
    }: CardProps) => {
      const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
      const open = Boolean(anchorEl);
      const self: CardProps = {
        connection,
        session,
        name,
        number
      };
      const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(event.currentTarget);
        setAnchorEl(event.currentTarget);
      };
      const handleDeleteInstance = async () => {
        await req01.delete("instance/delete", {
          params: {
            key: session
          }
        }).then(x => console.log(x));
        // @ts-expect-error
        await reloadInstances();
        setAnchorEl(null);
      };
      const handleLogoutInstance = async () => {
        await req01.delete("instance/logout", {
          params: {
            key: session
          }
        }).then(x => console.log(x));
        // @ts-expect-error
        await reloadInstances();
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
              <IconButton onClick={handleOpen} id={`icon-button-${name}`} sx={{ position: "absolute", top: "0px", right: "-230px", display: moreOptions ? "inherit" : "none" }}>
                <MoreVert />
              </IconButton>
            </Box>
            {moreOptions
              ? (<Menu
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
              </Menu>)
              : null}
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
