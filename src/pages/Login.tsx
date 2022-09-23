
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container, FormControlLabel, Link, TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../css/theme";

function Copyright (props: any) {
  return (
    <Typography variant="body2" color="text.primary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://siriusalpha.com.br/">
        MR tecnologias
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const SignIn = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password")
    });
  };
  const navigate = useNavigate();
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ bgcolor: "secondary.dark" }} maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Entrar
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              sx={{ border: "primary.light" }}
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              sx={{ borderBlockColor: "#fff", ":root": { borderBlockColor: "#000" } }}
              color="primary"
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: "text.primary" }}
              onClick={() => navigate("/main")}
            >
              Sign In
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
};

export default SignIn;
