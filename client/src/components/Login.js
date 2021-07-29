import { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Input,
    Button,
    FormHelperText
} from '@material-ui/core';

const Login = ({ initBot }) => {
    const [username, setUsername] = useState('josephgaspar725@gmail.com');
    const [password, setPassword] = useState('##Gasper12345678');

    console.log({ username, password })

    return (
        <>
            {/* Username */}
            <FormControl mr={2}>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input value={username} onChange={({ target }) => setUsername(target.value)} id="username" />
                <FormHelperText>Type your Ikariam username here</FormHelperText>
            </FormControl>

            {/* Password */}
            <FormControl>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input type="password" value={password} onChange={({ target }) => setPassword(target.value)} id="password" />
                <FormHelperText>Type your Ikariam password here</FormHelperText>
            </FormControl>

            {/* Submit button */}
            <Button onClick={() => initBot(username, password)} variant="contained" color="primary">Init bot</Button>
        </>
    );
};

export default Login;