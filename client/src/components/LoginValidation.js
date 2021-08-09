import { Box, Button } from "@material-ui/core/";

const LoginValidation = ({ validateLogin, screenshot }) => (
    <Box className="flex-start">
        <img src={screenshot} />
        <Box>
            {[1,2,3,4].map(n =>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => validateLogin(n)}>
                    {n}
                </Button>
            )}
        </Box>
    </Box>
);

export default LoginValidation;