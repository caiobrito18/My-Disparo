import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useInstancias, { CardProps } from "../components/Instancias";
const Sessions = () => {
  const [session, setSession] = useState<CardProps[]>();
  useEffect(() => {
    async function handleinstance () {
      const sessions = await loadInstances("https://api01.siriiusalpha.com.br");
      console.log(sessions);
      setSession(sessions);
    }
    return () => {
      handleinstance().catch(err => console.log(err));
    };
  }, []);
  const { Card, loadInstances } = useInstancias(session);

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
