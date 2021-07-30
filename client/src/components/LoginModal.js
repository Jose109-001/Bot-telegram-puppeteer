
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core/';

export default function LoginModal ({ show, setShow }) {
const handleClose = () => setShow(false);
  return (
    <Dialog
        open={show}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">You need to set up your Telegram chat first</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please, go to <a target="_blank" href="https://t.me/node_express_game_bot">https://t.me/node_express_game_bot</a> 
            or search for <b>@node_express_game_bot</b> in Telegram 
            and run this command: <b>/setchatid</b> <br />
            Come back here after that and submit the form again
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
  );
}