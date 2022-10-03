import { Box, Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ConnectionModal from "../components/ConnectionModal";
import useInstancias, { CardProps } from "../components/Instancias";
import api from "../services/api";
import { sleep } from "../services/sleep";
const Sessions = () => {
  const req = api("https://api01.siriusalpha.com.br");
  const [session, setSession] = useState<CardProps[]>();
  async function handleinstance () {
    const sessions: CardProps[] = await loadInstances("https://api01.siriusalpha.com.br");
    console.log(sessions);
    setSession(sessions);
  }
  useEffect(() => () => {
    handleinstance().catch(err => console.log(err));
  }, []);
  const { Card, loadInstances } = useInstancias(session);

  const handleReconnect = async () => {
    await req.get("instance/restore");
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
      <ConnectionModal opened={false}/>
      <Grid container
        columns={4}
        sx={{
          display: "flex",
          justifyContent: "space-between"
        }}>
        {session?.map((s, k) => (
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
      </Grid>
    </Box>
  );
};

export default Sessions;
