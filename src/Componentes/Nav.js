import React from 'react';
import {useHistory, Link} from "react-router-dom";
//Material UI 
import { AppBar, Toolbar, Typography, Button, Hidden, Grid} from '@material-ui/core';
import Salir from '@material-ui/icons/ExitToApp';

//Componente utilizado para cuando se quiere iniciar sesión
export default function Nav({setusuario,usuario}) {
  let history = useHistory();

  const cerrarSesion = () => {
    localStorage.setItem('datosLocal', JSON.stringify(null));
    setusuario({jwt:"",datosSesion:{}})
    if (history!==undefined)
      history.push("/")
  };

  return (
    <AppBar position="static" style={{backgroundColor:"#00CC66"}}>
        <Toolbar style={{position:"relative"}}>
        <Grid container>        
          <Grid item lg={6} md={6} sm={12} xs={12} align="left">
              <Link to={"/"} style={{textDecoration:"none", padding: 0, color:"black"}}>
                  <Button align="left" startIcon={<img src="municipalidad_logo.png" alt="" width="50px"></img>} color="default" style={{marginLeft: "auto"}}>
                    <Typography variant="h5">
                        Complejo deportivo
                    </Typography>
                  </Button>
              </Link>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12} align="right">
              <Link to={"/deporte/"} style={{textDecoration:"none", padding: 0, color:"black"}}>
                  <Button align="right" startIcon={<img src="deporte.png" alt="" width="50px"></img>} color="default" style={{marginLeft: "auto"}}>
                      Reserva de canchas deportivas
                  </Button>
              </Link>
            {usuario.jwt!=="" && <Button startIcon={<Salir/>} variant="contained" onClick={cerrarSesion} style={{marginLeft: "auto"}}>
                <Hidden smDown>
                  Cerrar Sesion
                </Hidden>
            </Button>}
          </Grid>
        </Grid>
            


        </Toolbar>
    </AppBar>
  );
}

