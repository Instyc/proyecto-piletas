import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';

export default function Notificacion({funcionAceptar, mensaje}) {
  const [open, setOpen] = useState(true);
  const handleClose = (boole) => {
    funcionAceptar(false)
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={()=>{handleClose(false)}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Reserva no realizada</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {mensaje}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{handleClose(true)}} variant="contained" style={{background:"lightgreen"}} autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}