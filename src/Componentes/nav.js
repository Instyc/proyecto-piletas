import React, { useState} from 'react';
import {useHistory, Link} from "react-router-dom";
//Material UI 
import { AppBar, Toolbar, Typography, Button, Hidden} from '@material-ui/core';
import Estilos from '../Estilos.js'
import Salir from '@material-ui/icons/ExitToApp';

//Componente utilizado para cuando se quiere iniciar sesión
export default function Nav({setusuario,usuario}) {
  const classes = Estilos();
  let history = useHistory();

  const cerrarSesion = () => {
    localStorage.setItem('datosLocal', JSON.stringify(null));
    setusuario({jwt:"",datosSesion:{}})
    if (history!==undefined)
        history.push("/")
  };

  return (
    <AppBar position="static" style={{backgroundColor:"#00CC66"}}>
        <Toolbar>
            
          <Link to={"/"} style={{textDecoration:"none",color:"#393939",fontFamily: "Homework", padding:"10px"}}>
              <img src="munilogo.png" width="76px"></img>
          </Link>
            
          <Link to={"/"} style={{textDecoration:"none",color:"#393939",fontFamily: "Homework",}}>
              <Typography variant="h5">
                  Complejo de piletas
              </Typography>
          </Link>
          
          {usuario.jwt!=="" && <Button startIcon={<Salir/>} variant="contained" onClick={cerrarSesion} style={{marginLeft: "auto"}}>
              <Hidden smDown>
                Cerrar Sesion
              </Hidden>
          </Button>}
        </Toolbar>
    </AppBar>
  );
}

