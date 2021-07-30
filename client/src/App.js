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
import Resources from './components/ResourcesTable';

import "./App.css";

function App() {
  const [state, setState] = useState('loading');
  const [data, setData] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    (async () => {
      const { state } = await fetch('/api/bot-state').then(res => res.json());

      setState(state); // iddle / initialized

      if (state === 'initialized') {
        getData();
      }
    })();
  }, []);

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
      setState('initialized');
      getData();
    } else if (response.message === 'missing chatId') {
      alert('Please, go to https://t.me/node_express_game_bot and run this command: /setchatid\nCome back here after that and submit the form again');
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
