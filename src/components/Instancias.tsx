import { WhatsApp } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { TableColumn, TableRow } from "react-data-table-component";
import api from "../services/api";

interface DataRow {
  sessao: string
  conexao: string
  name: string
  id: string
}
interface CardProps{

}

export default function useInstancias () {
  const columns: Array<TableColumn<DataRow>> = [
    {
      name: "sessão",
      selector: (row) => row.sessao
    },
    {
      name: "conexão",
      selector: (row) => row.conexao
    },
    {
      name: "id",
      selector: (row) => row.id
    },
    {
      name: "name",
      selector: (row) => row.name
    }
  ];
  // @ts-ignore
  const [instanceArray, setInstanceArray] = useState<DataRow[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [url, setUrl] = useState("");

  const handleSelected = ({ selectedRows }: TableRow) => {
    // @ts-expect-error
    setSelected(selectedRows);
  };

  async function loadInstances (e: FormEvent, url: string) {
    e.preventDefault();
    const req = api(url);
    await req.get("/instance/list?active=true").then((res) => {
      const slist = res.data.data;
      console.log(slist);
      const data = [
        {
          sessao: "",
          conexao: "",
          name: "",
          id: ""
        }
      ];
      for (let i = 0; i < slist.length; i++) {
        console.log(slist[i].phone_connected);
        data.push({
          sessao: slist[i].instance_key,
          conexao: slist[i].phone_connected ? "conectado" : "desconectado",
          name: slist[i].user.name,
          id: slist[i].user.id
        });
      }
      data.shift();
      return setInstanceArray(data);
    });
    console.log(instanceArray);
  }

  return {
    sessoes: selected,
    Card:()=>(
      <Box sx={{
        width:200,
        height:100,
        borderRadius:"15px",
        backgroundColor:"primary.dark",
        p:2,
        display:'flex',
        flexDirection:"column",
        alignItems:"start"
      }}>
        <Box sx={{display:'flex'}}>
        <WhatsApp sx={{mx:1}}/>
        <Typography>Conexão 1</Typography>
        </Box>
        <Typography>Conectado</Typography>
      </Box>
    )
  };
}
