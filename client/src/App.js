import { useState, useEffect } from "react";

// Material
import { CircularProgress, Typography } from "@material-ui/core/";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

// Components
import Header from "./components/Header";
import Login from "./components/Login";
import LoginModal from "./components/LoginModal";
import Resources from "./components/ResourcesTable";
import LoginValidation from "./components/LoginValidation";

import "./App.css";

const getPostConfig = (body) => ({
  headers: {
    "Content-Type": "application/json",
  },
  method: "POST",
  body: JSON.stringify(body),
});

function App() {
  const [state, setState] = useState("loading");
  const [data, setData] = useState();
  const [image, setImage] = useState();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginValidationImage, setLoginValidationImage] = useState();

  const handleResponseState = async (res) => {
    const response = await res.json();

    setState(response.state);

    if (response.state === 'validating-login') {
      const response = await fetch('/api/get-login-screenshot').then(res => res.blob());
      const image = URL.createObjectURL(response);
      setLoginValidationImage(image);
    }
  };

  const getState = async () => {
    await fetch("/api/bot-state").then(handleResponseState);
  };

  const initBot = async (username, password) => {
    setState("loading");

    const options = getPostConfig({
      username,
      password,
    });

    fetch("/api/init-bot", options).then(handleResponseState);
  };

  const getData = async () => {
    const data = await fetch("/api/get-data").then((res) => res.json());
    setData(data);
  };

  const takeScreenshot = async () => {
    setImage(null);
    const response = await fetch("/api/screenshot").then((res) => res.blob());
    const image = URL.createObjectURL(response);
    setImage(image);
  };

  const stop = async () => {
    const response = await fetch('/api/stop').then(res => res.json());
    setState('iddle');
  };

  const sendAttack = async () => {
    const response = await fetch("/api/attack").then((res) => res.json());
    alert("Attack sent");
  };

  const validateLogin = async (box) => {
    setState('loading');
    const options = getPostConfig({ box });
    const response = await fetch("/api/validate-login", options).then((res) =>
      res.json()
    );
    
    if (response.success) {
      setLoginValidationImage(null);
      setState(response.state);
    } else {
      setState('validating-login');
      alert('Validation failed');
    }
  };

  const Dashboard = () => (
    <>
      <Resources data={data} />
      <Box m={2}>
        <Button
          onClick={takeScreenshot}
          variant="contained"
          color="primary"
          disabled={image === null}
        >
          {image ? "Take another screenshot" : image === null ? "Wait..." : "Take screenshot"}
        </Button>
        <Button
          onClick={sendAttack}
          variant="contained"
          color="primary"
        >
          Send attack
        </Button>
        <Button
          onClick={stop}
          variant="contained"
          color="secondary"
        >
          Stop
        </Button>
        {image && <img src={image} />}
      </Box>
    </>
  );

  const Loading = () => {
    const [message, setMessage] = useState(0);
    const messages = [
      'Please wait',
      'Log-in takes some time...',
      'This will finish shortly, I promise'
    ];

    useEffect(() => {
      let message = 0;
      const updateMessage = () => {
        setMessage(++message);
        if (message === 2) clearInterval(interval);
      };
      const interval = setInterval(updateMessage, 5000);

      return () => clearInterval(interval);;
    }, []);

    return (
      <Box>
        <Typography variant="h4">
          {messages[message]}
        </Typography>
        <CircularProgress />
      </Box>
    );
  };

  useEffect(getState, []);

  useEffect(() => {
    if (state === "initialized") {
      getData();
    }
  }, [state]);
  
  console.log({ state, data, image });

  return (
    <>
      <Header />
      <Container className="App">
        <Box m={2}>
          {/* Init button */}
          {state === "iddle" &&
            <Login initBot={initBot} />
          }

          {/* Loading message  */}
          {state === "loading" &&
            <Loading />
          }

          {/* Login validation */}
          {state === 'validating-login' && loginValidationImage &&
            <LoginValidation
              screenshot={loginValidationImage}
              validateLogin={validateLogin} />
          }

          {/* Resources table */}
          {state === "initialized" && data &&
            <Dashboard />
          }
        </Box>
      </Container>
      <LoginModal show={showLoginModal} setShow={setShowLoginModal} />
    </>
  );
}

export default App;
