import { Button, FormGroup, Modal, Paper, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { req01 } from "../services/api";
import { sleep } from "../services/sleep";
interface ModalProps{
  opened: boolean
}
interface ChildModalProps{
  opened: boolean
  setOpenChild: Dispatch<SetStateAction<boolean>>
  qrcode: string
}
const ConnectionModal = ({ opened }: ModalProps) => {
  const [openChild, setOpenChild] = useState(false);
  const [id, setId] = useState("");
  const [qrCode, setQrCode] = useState<string>("");
  const handleCreateSession = async () => {
    await req01.get("instance/init", {
      params: {
        key: id
      }
    });
    await sleep(2000);
    const res = await req01.get("instance/qr", {
      params: {
        key: id
      }
    });
    console.log(typeof (res.data), res);
    setQrCode(res.data);
    setOpenChild(true);
  };

  const ChildModal = ({ opened, setOpenChild, qrcode }: ChildModalProps) => (
    <Modal open={opened} onClose={() => setOpenChild(false)}>
      <Paper sx={{ backgroundColor: "secondary.dark" }}>
        {<div dangerouslySetInnerHTML={ { __html: qrcode } }></div> ?? <Typography> Houve um Erro innesperado por favor tente novamente</Typography>}
      </Paper>
    </Modal>
  );
  return (
    <Modal open={opened} sx={{
      position: "absolute" as "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "secondary.main",
      border: "2px solid #000",
      borderRadius: "10px",
      boxShadow: 24,
      p: 4
    }} >
      <FormGroup>
        <TextField InputProps={{ disableUnderline: true }}
          label="Nome Da Sessão"
          variant="filled"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          sx={{
            backgroundColor: "primary.dark",
            color: "text.primary",
            borderRadius: "15px",
            width: "100%"
          }}/>
        <Button onClick={handleCreateSession}>Criar Sessão</Button>
        <ChildModal opened={openChild} setOpenChild={setOpenChild} qrcode={qrCode}/>
      </FormGroup>
    </Modal>
  );
};

export default ConnectionModal;
