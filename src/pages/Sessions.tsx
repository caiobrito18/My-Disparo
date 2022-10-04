import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ConnectionModal from "../components/ConnectionModal";
import useInstancias, { CardProps } from "../components/Instancias";
import { req01 } from "../services/api";
import { sleep } from "../services/sleep";
const Sessions = () => {
  const [session, setSession] = useState<CardProps[]>();
  const [opened, setOpened] = useState(false);
  async function handleinstance () {
    const sessions: CardProps[] = await loadInstances();
    console.log(sessions);
    setSession(sessions);
  }

  useEffect(() => () => {
    handleinstance().catch(err => console.log(err));
  }, []);
  const { Card, loadInstances } = useInstancias(session);

  const handleReconnect = async () => {
    await req01.get("instance/restore");
    await sleep(3000);
    await handleinstance();
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
      <Button onClick={handleReconnect}>Reconectar</Button>
      <Button onClick={() => setOpened(true)}>Criar Sessão</Button>
      <ConnectionModal opened={opened} setOpened={setOpened} loadInstances={handleinstance}/>
      <Grid container
        columns={4}
        sx={{
          display: "flex",
          justifyContent: "space-around"
        }}>
        {session?.map((s, k) => (
          <Grid item key={k}>
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
