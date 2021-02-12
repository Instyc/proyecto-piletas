import React, {useState, useEffect} from 'react';

import './App.css';
import {AppBar, Toolbar, Typography, Grid, Button, IconButton} from '@material-ui/core';
import Formulario from './Componentes/Formulario.js'
import Deporte from './Componentes/Deporte.js'
import Listado from './Componentes/Listado.js'
import ListadoDeporte from './Componentes/ListadoDeporte.js'
import Sesion from './Componentes/Sesion.js'
import Nav from './Componentes/Nav.js'
import AlertaMensaje from './Componentes/Alerta.js'
import Estilos from './Estilos.js'
import {HashRouter ,BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Copiar from '@material-ui/icons/FileCopy';
import {Instagram, Facebook} from '@material-ui/icons';

function App() {
  const classes = Estilos();
  //const ruta = "https://piletas-sb.herokuapp.com";
  const ruta = "https://8702aae9d9d1.ngrok.io";
  //const ruta = "http://localhost:1337";
  const [copiado, setcopiado] = useState(false)

  const [usuario, setusuario] = useState({
    datosSesion:{},
    jwt:""
  })

  const [aux, setaux] = useState(false)
  useEffect(()=>{
    setaux(true)
  },[])

  function copiarAlPortapapeles() {
    // Crea un campo de texto "oculto"
    var aux = document.createElement("input");
    // Asigna el contenido del elemento especificado al valor del campo
    aux.setAttribute("value", "complejodeportivosb@gmail.com");
    // Añade el campo a la página
    document.body.appendChild(aux);
    // Selecciona el contenido del campo
    aux.select();
    // Copia el texto seleccionado
    document.execCommand("copy");
    // Elimina el campo de la página
    document.body.removeChild(aux);
    setcopiado(true)
  }

  //Código de guardado del estado de la sesión
  useEffect(()=>{
    let sesion = localStorage.getItem('datosLocal') || null;
    let sesionObjeto = JSON.parse(sesion)
    if(sesionObjeto!==null){
      setusuario(sesionObjeto)
    }
  },[])
  
  return (
    <div className="App" style={{height: "auto"}}>
      <Router basename={process.env.PUBLIC_URL}>
        <Nav setusuario={setusuario} usuario={usuario}/>
        <Switch>
          <Route exact path={"/"}><Formulario ruta={ruta}/></Route>
          <Route exact path={"/deporte/"}><Deporte ruta={ruta}/></Route>
          <Route path={"/sesion/"}>{usuario.jwt!==""?<Redirect to={"/listar/"} />:<Sesion ruta={ruta} setusuario={setusuario}/>}</Route>
          <Route path={"/listar/"}>{aux && usuario.jwt===""?<Redirect to={"/"} />:<Listado usuario={usuario} ruta={ruta}/>}</Route>
          <Route path={"/listarDeporte/"}>{aux && usuario.jwt===""?<Redirect to={"/"} />:<ListadoDeporte usuario={usuario} ruta={ruta}/>}</Route>
          <Route>
            <div className={classes.fondo2} style={{margin:"auto"}}>
              <img src="404.png" alt=""></img>
            </div>
          </Route>
        </Switch>
      </Router>

      <AppBar  position="relative" bottom="0px" style={{zIndex: 0, backgroundColor:"#00CC66"}}>   
          <Toolbar >
            <Grid container direction="row" alignItems="center" justify="center">
              <Grid item xs={2} sm={2} md={2} lg={2} style={{padding: "0px 15px"}} align="right">
                <img src="munilogo.png" alt="" width="50px"></img>
              </Grid>
              <Grid item xs={10} sm={10} md={4} lg={4} align="left">
                  <Typography style={{color: "black"}} variant="h6">
                    Municipalidad de San Bernardo
                  </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={2} lg={2} align="center">
                  <IconButton size="medium" style={{color: "black"}} href="https://www.instagram.com/municipalidad28/"><Instagram/></IconButton>
                  <IconButton size="medium" style={{color: "black"}} href="https://www.facebook.com/MunicipioSanBernardo/"><Facebook/></IconButton>
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4} align="center">
                  <Typography style={{color: "black"}}>
                    Ante cualquier inconveniente con el sitio contactar a:
                  </Typography>
                  <Button style={{textTransform: "lowercase"}} onClick={copiarAlPortapapeles} startIcon={<Copiar/>}>
                    complejodeportivosb@gmail.com
                  </Button>
              </Grid>
            </Grid>
          </Toolbar>
      </AppBar>
      {copiado && <AlertaMensaje mensaje={"Copiado al portapapeles"} abrir={copiado} setabrir={setcopiado}/>}
    </div>
  );
}

export default App;
