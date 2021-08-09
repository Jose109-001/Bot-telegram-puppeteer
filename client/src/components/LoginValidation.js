import { Box, Button, Typography } from "@material-ui/core/";

const LoginValidation = ({ validateLogin, screenshot }) => (
    <>
        <Typography variant="h3">
            You need to prove that this is not a bot!
        </Typography>
        <Typography variant="subtitle2">
            Choose the correct answer, clicking on the numbers 1-4, being 1 the first one and 4 the last box
        </Typography>
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
    </>
);

export default LoginValidation;
