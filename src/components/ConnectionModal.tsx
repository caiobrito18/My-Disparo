import { Button, FormGroup, Modal, Paper, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { req01 } from "../services/api";
import { sleep } from "../services/sleep";
interface ModalProps{
  opened: boolean
  setOpened: Dispatch<SetStateAction<boolean>>
  loadInstances: () => Promise<void>
}
interface ChildModalProps{
  openedChild: boolean
  setOpenChild: Dispatch<SetStateAction<boolean>>
  qrcode: string
}
const ConnectionModal = ({ opened, setOpened, loadInstances }: ModalProps) => {
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
  const handleClose = async () => {
    await loadInstances();
    setOpened(false);
    setOpenChild(false);
  };

  const ChildModal = ({ openedChild, setOpenChild, qrcode }: ChildModalProps) => (
    <Modal open={openedChild} onClose={handleClose}>
      <Paper sx={{ backgroundColor: "secondary.dark" }}>
        {<div dangerouslySetInnerHTML={ { __html: qrcode } }></div> ?? <Typography> Houve um Erro innesperado por favor tente novamente</Typography>}
      </Paper>
    </Modal>
  );
  return (
    <Modal
      open={opened}
      onClose={handleClose}
      sx={{
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
        <ChildModal openedChild={openChild} setOpenChild={setOpenChild} qrcode={qrCode}/>
      </FormGroup>
    </Modal>
  );
};

export default ConnectionModal;
