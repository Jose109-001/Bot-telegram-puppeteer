import { useState, useEffect } from "react";

// Material
import { CircularProgress } from "@material-ui/core/";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

// Components
import Header from "./components/Header";
import Login from "./components/Login";
import LoginModal from "./components/LoginModal";
import Resources from "./components/ResourcesTable";

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
    setState("logging-in");

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
    const response = await fetch("/api/screenshot").then((res) => res.blob());
    const image = URL.createObjectURL(response);
    setImage(image);
  };

  const sendAttack = async () => {
    const response = await fetch("/api/attack").then((res) => res.json());
    alert("Attack sent");
  };

  const validateLogin = async (box) => {
    const options = getPostConfig({ box });
    const response = await fetch("/api/validate-login", options).then((res) =>
      res.json()
    );
    setLoginValidationImage(null);
    setState(response.state);
  };

  const Dashboard = () => (
    <>
      <Resources data={data} />
      <Box m={2}>
        <Button
          onClick={takeScreenshot}
          variant="contained"
          color="primary"
        >
          {image ? "Take another screenshot" : "Take screenshot"}
        </Button>
        <Button
          onClick={sendAttack}
          variant="contained"
          color="primary"
        >
          Send attack
        </Button>
        {image && <img src={image} />}
      </Box>
    </>
  );

  const Loading = () => <CircularProgress />;

  const LoginValidation = () => (
    <div>
      <img src={loginValidationImage} />
      <h5>Please select the valid option:</h5>
      {[1,2,3,4].map(n => <Button variant="contained" color="primary" onClick={() => validateLogin(n)}>{n}</Button>)}
    </div>
  );

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
          {state === "iddle" && <Login initBot={initBot} />}

          {/* Loading message  */}
          {state === "logging-in" && <Loading />}

          {/* Login validation */}
          {/*state === 'validating-login' && loginValidationImage &&*/ <LoginValidation />}

          {/* Resources table */}
          {state === "initialized" && data && <Dashboard />}
        </Box>
      </Container>
      <LoginModal show={showLoginModal} setShow={setShowLoginModal} />
    </>
  );
}

export default App;
