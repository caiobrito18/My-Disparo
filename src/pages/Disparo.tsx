import {
  Box,
  Button,
  Checkbox, FormControl,
  FormControlLabel, FormLabel, Grid, List,
  ListItemButton,
  ListItemIcon,
  ListItemText, Paper,
  TextField
} from "@mui/material";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import useInstancias, { CardProps } from "../components/Instancias";
import "../css/App.css";
import { req01 } from "../services/api";
import { Camp } from "./Campaigns";

const Disparo = () => {
  const { Card } = useInstancias();
  const [columns, setColumns] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [number, setNumber] = useState([]);
  const [minWait, setMinWait] = useState(5);
  const [maxWait, setMaxWait] = useState(10);
  const [messageBody, setMessageBody] = useState("");
  const [goodbyeArray, setGoodByeArray] = useState([""]);
  const [greetArray, setGreetArray] = useState([""]);
  const [greet, setGreet] = useState("");
  const [goodbye, setGoodBye] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<Camp[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<Camp[]>([]);
  const [selectedStates, setselectedStates] = useState<string[]>([]);
  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [cep, setCep] = useState("");
  const [bairro, setBairro] = useState("");
  const [end, setEnd] = useState("");
  const [comp, setComp] = useState("");
  const [limit, setLimit] = useState<number | undefined>(100);

  useEffect(() => {
    handleCampaigns().catch((err) => err ? alert(`Houve um erro ao carregar os Campanhas! \n ${err}`) : null);
    handleStates().catch((err) => err ? alert(`Houve um erro ao carregar os filtros! \n ${err}`) : null);
  }, []);
  const customStyles = {
    cells: {
      style: {
        width: "200px",
        justifyContent: "center"
      }
    }
  };
  const handleCampaigns = async () => {
    const data = await req01.get("custom/campanha");
    setCampaigns(data.data);
    return data;
  };
  async function handleStates () {
    const data = (await req01.get<string[]>("custom/states")).data;
    const states = data.map((x: any) => x.UF);
    console.log(states);
    setStates(states);
  }

  function handleMessage () {
    const splitg = greet.split(";");
    const splitgb = goodbye.split(";");
    setGoodByeArray(splitgb);
    setGreetArray(splitg);
  }

  const handleDisparo = async () => {
    handleMessage();
    const sessions = selectedCampaigns[0].SESSOES.map(x => x.session);
    console.log(sessions);
    await req01.post("/custom/disparo", {
      MessageData: {
        MessageBody: messageBody,
        greets: greetArray,
        goodbyes: goodbyeArray,
        sessions
      },
      minWait,
      maxWait,
      Numbers: number
    }).then((res: AxiosResponse<any, any>) => console.log(res.data.data));
  };

  async function handleFilter () {
    await req01.post("/custom/numeros",
      {
        filter: {
          uf: (selectedStates.length !== 0 ? selectedStates : undefined),
          cid: (selectedCities.length !== 0 ? selectedCities : undefined),
          cep: cep.length !== 0 ? cep : undefined,
          bairro: bairro.length !== 0 ? bairro : undefined,
          endereco: end.length !== 0 ? end : undefined,
          complemento: comp.length !== 0 ? comp : undefined
        },
        limit
      }).then((res) => {
      const cols = [
        {
          name: "Telefone",
          selector: (row: any) => row.TELEFONE
        },
        {
          name: "Cidade",
          selector: (row: any) => row.CID_ABREV
        },
        {
          name: "Bairro",
          selector: (row: any) => row.BAIRRO
        }
      ];
      setColumns(cols);
      setData(res.data);
      const numberlist = res.data.map((a: any) => {
        if (a.TELEFONE.match(/^55.{10,11}/)) return a.TELEFONE;
        if (a.TELEFONE.match(/^[92].{10,11}|^[62].{10,11}/)) {
          return `55${a.TELEFONE}`;
        }
      });
      setNumber(numberlist);
    });
  }
  // process CSV data
  const processData = (dataString: string) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == "\"") d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == "\"") d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            // @ts-expect-error
            obj[headers[j]] = d;
          }
        }
        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }
    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: (row: any) => row.TELEFONE
    }));
    const data = list.map(
      // @ts-ignore
      ({ NOME, DOCUMENTO, ENDERECO, CEP, ...rest }) => rest
    );
    const newCols = columns.filter((arr) => {
      if (arr.name == "TELEFONE") {
        return arr;
      }
    });
    setData(data);
    setColumns(newCols);
    console.log("data:", data);
    console.log("columns", newCols, columns);
  };
  // handle file upload
  const handleFileUpload = (e: any) => {
    const file = e.target?.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      // @ts-expect-error
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };
  const toggleCampaigns = async (field: string, index: number, value: Camp) => {
    const newSelection = [...selectedCampaigns];
    if (selectedCampaigns.includes(value)) {
      setSelectedCampaigns(newSelection.filter((x) => x != value));
    } else {
      newSelection.push(value);
      setSelectedCampaigns(newSelection);
    }
  };
  const toggleStates = async (field: string, index: number, value: string) => {
    const newSelection = [...selectedStates];
    if (selectedStates.includes(value)) {
      setselectedStates(newSelection.filter((x) => x != value));
    } else {
      newSelection.push(value);
      setselectedStates(newSelection);
    }

    const data = (await req01.post("custom/cids", { uf: newSelection })).data;
    const cities = data.map((x: any) => x.CIDADE);
    setCities(cities);
  };
  const toggleCities = (field: string, index: number, value: string) => {
    const newSelection = [...selectedCities];
    if (selectedCities.includes(value)) {
      setSelectedCities(newSelection.filter((x) => x != value));
    } else {
      newSelection.push(value);
      setSelectedCities(newSelection);
    }
    console.log(newSelection);
  };

  return (
    <Box sx={{ display: "inline-flex", flexDirection: "row", justifySelf: "center" }}>
      <Box
        id="disparo"
        sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center", JustifyContent: "space-between" }}
      >
        {/* Número de Telefone do cliente */}
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => {
                  document
                    .querySelector("#csvFile")
                    ?.classList.toggle("hidden");
                }}
              />}
            value="envio de arquivos"
            label="Marque para enviar utilizando um arquivo '.CSV'"
            labelPlacement="end"
          />
          <input
            type="file"
            name="csv"
            id="csvFile"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden mb-4"
          />
          <DataTable
            className="w-[100px]"
            theme="dark"
            pagination
            highlightOnHover
            customStyles={customStyles}
            columns={columns}
            data={data}
          />
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-around", gap: 2 }}>
            <FormLabel >Filtros para envios das mensagens: </FormLabel>
            <FormLabel >Estado</FormLabel>
            <Paper elevation={5}
              sx={{ width: 400, height: 100, backgroundColor: "secondary.dark", overflow: "scroll", borderStyle: "dashed", borderColor: "primary.dark", borderWidth: "1px" }}
            >
              <List>
                {states.map((k: string, i: number) => (
                  <ListItemButton
                    key={i}
                    role={undefined}
                    onClick={async () => await toggleStates("state", i, k)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedStates.includes(k)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText id={k} primary={`${k}`} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
            <FormLabel>Cidade</FormLabel>
            <Paper elevation={5}
              sx={{ width: 400, height: 100, backgroundColor: "secondary.dark", overflow: "scroll", borderStyle: "dashed", borderColor: "primary.dark", borderWidth: "1px" }}
            >
              <List>
                {cities.map((k: string, i: number) => (
                  <ListItemButton
                    key={i}
                    role={undefined}
                    onClick={() => toggleCities("state", i, k)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={selectedCities.includes(k)}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText id={k} primary={`${k}`} />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
            <TextField
              label="cep"
              type={"text"}
              id="cep"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />
            <TextField
              label="limit"
              type={"number"}
              id="cep"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            />
            <TextField
              label="bairro"
              type={"text"}
              id="cep"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
            <TextField
              label="Endereço"
              type={"text"}
              id="cep"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
            <TextField
              label="complemento"
              type={"text"}
              id="cep"
              value={comp}
              onChange={(e) => setComp(e.target.value)}
            />

            <Button
              type="button"
              sx={{ backgroundColor: "primary.dark", color: "text.primary" }}
              onClick={handleFilter}
            >
                Filtrar
            </Button>
          </Box>
        </FormControl>
        <FormLabel>Intervalo de envio entre mensagens</FormLabel>
        {/* <FilledInput type="text" value={number} onChange={(e)=>setNumber(e.target.value)}/>  */}
        <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          <TextField
            type={"number"}
            value={minWait}
            className="w-full mx-1"
            onChange={(e) => setMinWait(Number(e.target.value))}
            label="delay mínimo"
          />
          <TextField
            type={"number"}
            value={maxWait}
            className="w-full mx-1"
            onChange={(e) => setMaxWait(Number(e.target.value))}
            label="delay máximo"
          />
        </Box>
        {/* coloca as informações de mensagem */}
        {/* Corpo da Mensagem */}
        {/* Saudação */}
        <Box sx={{ display: "flex", gap: 2, flexDirection: "column", alignItems: "ceenter" }}>
          <TextField
            type={"text"}
            id="saudacoes"
            margin="normal"
            label="Saudações separadas por ;"
            value={greet}
            onChange={(e) => setGreet(e.target.value)}
          />
          {/* Corpo */}
          <TextField
            multiline
            id="Corpo"
            label="Corpo da Mensagem"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            title='Separado com ";"'
          />
          {/* Despedidas */}
          <TextField
            type={"text"}
            rows={10}
            id="lista-texto"
            value={goodbye}
            label="despedidas separadas por ;"
            onChange={(e) => setGoodBye(e.target.value)}
          />
        </Box>
        <Box className="flex gap-2">
          <Button
            onClick={handleDisparo}
          >Disparar</Button>
        </Box>
      </Box>
      <Box>
        <Paper elevation={5}
          sx={{ width: 800, height: 500, backgroundColor: "secondary.dark", overflow: "scroll", borderStyle: "dashed", borderColor: "primary.dark", borderWidth: "1px" }}
        >
          <List>
            {campaigns.map((k: Camp, i: number) => (
              <ListItemButton
                key={i}
                role={undefined}
                onClick={async () => await toggleCampaigns("state", i, k)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selectedCampaigns[0] === k}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                {k.SESSOES?.map((s: CardProps, k: any) => (
                  <Grid item key={k}>
                    <Card
                      sx={{ m: 1 }}
                      connection={s.connection}
                      name={s.name}
                      number={s.number}
                      session={s.session}
                    />
                  </Grid>
                )
                )}
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default Disparo;
