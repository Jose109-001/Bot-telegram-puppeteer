import { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Input,
    Button,
    FormHelperText
} from '@material-ui/core';
import useStyles from './styles';

const Login = ({ type, onSubmit, error }) => {
    const classes = useStyles();
    const [username, setUsername] = useState('josephgaspar725@gmail.com');
    const [password, setPassword] = useState('##Gasper12345678');

    return (
        <>
            {/* Username */}
            <FormControl className={classes.marginRight}>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                    value={username}
                    onChange={({ target }) => setUsername(target.value)}
                    id="username" />
                {!error && (
                    <FormHelperText>
                        {type === 'auth' && 'System Username'}
                        {type === 'bot-init' && 'Type your Ikariam username here'}
                    </FormHelperText>
                )}
                {error && (
                    <FormHelperText error>
                        Invalid username or password
                    </FormHelperText>
                )}
            </FormControl>

            {/* Password */}
            <FormControl>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                    type="password"
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    id="password" />
                {!error && (
                    <FormHelperText>
                        {type === 'auth' && 'System Password'}
                        {type === 'bot-init' && 'Type your Ikariam password here'}
                    </FormHelperText>
                )}
                {error && (
                    <FormHelperText error>
                        Invalid username or password
                    </FormHelperText>
                )}
            </FormControl>

            {/* Submit button */}
            <Button
                onClick={() => onSubmit(username, password)}
                variant="contained"
                color="primary">
                {type === 'auth' && 'Login'}
                {type === 'bot-init' && 'Init bot'}
            </Button>
        </>
    );
};

export default Login;