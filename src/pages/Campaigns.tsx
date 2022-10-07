import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import useInstancias, { CardProps } from "../components/Instancias";
import { req01 } from "../services/api";
interface Response{
  CAMPANHA: string
  SESSOES: CardProps[]
  STATUS: string
}
const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Response[]>([]);
  const handleCampaings = async () => {
    const data = await req01.get("custom/campanha");
    setCampaigns(data.data);
    return data;
  };
  useEffect(() => {
    handleCampaings().catch(err => console.log(err));
  }, []);
  const { Card } = useInstancias();
  return (
    <Box>
      {campaigns.map(
        (e) => (
          <Box>
            <Typography>{e.CAMPANHA}</Typography>
            <Grid container>
              {e.SESSOES?.map((s: CardProps, k: any) => (
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
        )
      )}
    </Box>
  );
};

export default Campaigns;
