import { Box, Button, FormControl, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ConnectionModal from "../components/ConnectionModal";
import useInstancias, { CardProps } from "../components/Instancias";
import { req01 } from "../services/api";
import { sleep } from "../services/sleep";
const Sessions = () => {
  const [session, setSession] = useState<CardProps[]>();
  const [selected, setSelected] = useState<CardProps[]>([]);
  const [opened, setOpened] = useState(false);
  const [campaign, setCampaign] = useState("");

  async function handleinstance () {
    const sessions: CardProps[] = await loadInstances();
    setSession(sessions);
  }

  useEffect(() => () => {
    handleinstance().catch(err => console.log(err));
  }, []);
  const { Card, loadInstances }: any = useInstancias(session);

  const handleReconnect = async () => {
    await req01.get("instance/restore");
    await sleep(3000);
    await handleinstance();
  };
  const handleSelection = (_e: React.MouseEvent, item: CardProps) => {
    _e.stopPropagation();
    const newarr = selected;
    if (!selected.find(el => el.number === item.number)) {
      return setSelected([...selected, item]);
    }
    return setSelected(newarr.filter(el => el.number !== item.number));
  };
  const handleCampaign = async () => {
    await req01.post("custom/campanha", {
      sessions: selected,
      status: "Livre",
      campaign
    });
  };
  return (
    <Box sx={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
      position: "absolute",
      width: "100%"
    }}>
      <Typography>Conexões</Typography>
      <Box>
        <Button onClick={handleReconnect}>Reconectar</Button>
        <Button onClick={() => setOpened(true)}>Criar Sessão</Button>
      </Box>
      <ConnectionModal opened={opened} setOpened={setOpened} loadInstances={handleinstance}/>
      <Typography>conexões Selecionadas</Typography>
      <FormControl sx={{ justifyContent: "center", alignItems: "center" }}>
        <Button onClick={handleCampaign}>Criar Campanha</Button>
        <TextField
          margin="normal"
          required
          fullWidth
          id="campaign"
          label="Nome da Campanha"
          name="email"
          sx={{ border: "primary.light", width: 300 }}
          autoComplete="email"
          value={campaign}
          onChange={(e) => setCampaign(e.target.value)}
          autoFocus
        />
      </FormControl>
      <Grid container
        columns={4}
        sx={{
          display: "flex",
          justifyContent: "space-around",
          minHeight: 145
        }}>
        {selected?.map((s, k) => (
          <Grid item key={k}>
            <Button disableRipple sx={{ width: 210, height: 25, transform: "translate(0, 50px)" }} onClick={(e) => handleSelection(e, s)}></Button>
            <Card
              sx={{ m: 1 }}
              connection={s.connection}
              reloadInstances={handleinstance}
              name={s.name}
              number={s.number}
              session={s.session}
            />
          </Grid>
        )
        )}
      </Grid>
      <Typography>conexões disponíveis</Typography>
      <Grid container
        columns={4}
        sx={{
          display: "flex",
          justifyContent: "space-around"
        }}>
        {session?.map((s, k) => (
          <Grid item key={k}>
            <Button disableRipple sx={{ width: 210, height: 25, transform: "translate(0, 50px)" }} onClick={(e) => handleSelection(e, s)}></Button>
            <Card
              sx={{ m: 1 }}
              connection={s.connection}
              reloadInstances={handleinstance}
              name={s.name}
              number={s.number}
              session={s.session}
            />
          </Grid>
        )
        )}
      </Grid>
    </Box>
  );
};

export default Sessions;
