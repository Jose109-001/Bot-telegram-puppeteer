import { useState, useEffect } from 'react';
// Material
import {
  CircularProgress
} from '@material-ui/core/';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

// Components
import Header from './components/Header';
import Login from './components/Login';
import LoginModal from './components/LoginModal';
import Resources from './components/ResourcesTable';

import "./App.css";

function App() {
  const [state, setState] = useState('loading');
  const [data, setData] = useState();
  const [image, setImage] = useState();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    getStateAndData();
  }, []);

  const getStateAndData = async () => {
    const { state } = await fetch('/api/bot-state').then(res => res.json());

    setState(state); // iddle / initialized

    if (state === 'initialized') {
      getData();
    }
  };

  const initBot = async (username, password) => {
    setState('logging-in');
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        username, password
      })
    };
    
    const response = await fetch("/api/init-bot", options).then((res) =>
      res.json()
    );

    if (response.success) {
      setState(response.state);
      getData();
    } else if (response.message === 'missing chatId') {
      setState('iddle');
      setShowLoginModal(true);
    }
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

  console.log({ state, data, image });

  return (
    <>
      <LoginModal show={showLoginModal} setShow={setShowLoginModal} />
      <Header />
      <Container className="App">
        <Box m={2}>
          {/* Init button */}
          {state === 'iddle' && (
            <Login initBot={initBot} />
          )}

          {/* Loading message  */}
          {state === 'logging-in'
            && (
              <div>
                <CircularProgress />
                Initializing...
              </div>
            )}

          {state === 'validating-login' && (
            <>
              <div>Waiting for login validation...</div>
              <Button onClick={getStateAndData}>Click here when it is completed</Button>
            </>
          )}

          {/* Resources table */}
          {state === 'initialized' && data && (
            <>
              <Resources data={data} />
              <Box m={2}>
                <Button onClick={takeScreenshot} variant="contained" color="primary">
                  {image ? 'Take another screenshot' : 'Take screenshot'}
                </Button>
                {image && <img src={image} />}
              </Box>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;
