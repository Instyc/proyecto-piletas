import React from 'react'
import MuiAlert from '@material-ui/lab/Alert';
import {Snackbar, Grid} from '@material-ui/core';

//Subcomponente utilizado para mostrar alertas cuando se lleva a cabo una acción exitosa
function Alerta(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
export default function AlertaMensaje({mensaje, tipo, setabrir, abrir}) {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setabrir(false);
    };
    
    return (
       <div>
           <Grid container>
                <Snackbar open={abrir} autoHideDuration={8000} onClose={handleClose}>
                    <Alerta onClose={handleClose} severity={mensaje.tipo}>
                        {mensaje.descripcion}
                    </Alerta>
                </Snackbar>
            </Grid>
       </div>
    )
}
