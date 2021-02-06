import React from 'react';
import {useHistory, Link} from "react-router-dom";
//Material UI 
import { AppBar, Toolbar, Typography, Button, Hidden} from '@material-ui/core';
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
        <Toolbar>
            
          <Link to={"/"} style={{textDecoration:"none",color:"#393939",fontFamily: "Homework", padding:"0px 10px"}}>
              <img src="municipalidad_logo.png" alt="" width="76px"></img>
          </Link>
            
          <Link to={"/"} style={{textDecoration:"none",color:"#393939",fontFamily: "Homework",}}>
              <Typography variant="h5">
                  Complejo deportivo
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

