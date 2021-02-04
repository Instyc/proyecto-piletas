import React, { useState} from 'react';
//Material UI 
import {Grid, Link as LinkMUI,  LinearProgress, Typography, TextField, Hidden, Button, Divider, } from '@material-ui/core';

//Librerias
import {Link} from "react-router-dom";
import axios from 'axios'

import Estilos from '../Estilos.js'
import {useHistory } from "react-router-dom";

//Componente utilizado para cuando se quiere iniciar sesión
export default function IniciarSesion({ruta,setusuario}) {
  const classes = Estilos();
  let history = useHistory();
  const [open, setOpen] = useState(false);
  const [cargando, setcargando] = useState(false);
  const [alerta, setalerta] = useState("");
  const [pwd_olvidada, setpwd_olvidada] = useState(false);

  //Los datos inician vacíos
  const [datos, setdatos] = useState({
    email:"",
    contrasena:""
  });
  
  //Ejecutado cada vez que se ingresa algún valor en los campos
  const cambiarInput = (e) =>{
    if (alerta!=="")
        setalerta("")
    let valor = e.target.value;
    let campo = e.target.name;
    setdatos({
        ...datos,
        [campo]: valor
    })        
  }
  
  //Función ejecutada al presionar el botón de iniciar sesión
  const iniciarSesion = () =>{
    setcargando(true)
    if (alerta!=="")
        setalerta("")

    if (datos.email==="" || datos.contrasena===""){
        setalerta('Faltan rellenar campos');
        setcargando(false)
    }
    axios
    .post(ruta+"/auth/local/", {
    identifier: datos.email,
    password: datos.contrasena
    })
    .then(response => {
        console.log(response.data)
        setusuario(response.data)

        localStorage.setItem('datosLocal', JSON.stringify({
            jwt: response.data.jwt,
            datosSesion: response.data.user
        }));
        
        setcargando(false)
        setOpen(false)

        history.push("/listar")
    })
    .catch(error => {
    // Ocurrió un error
    let err = JSON.parse(error.response.request.response).message[0].messages[0].id;
    console.log("Error: ",err)
    if(err==="Auth.form.error.invalid")
        setalerta('Usuario/correo o contraseña incorrectos'); 
    setcargando(false)
    });    
  }

  return (
    <div className={classes.fondo2} style={{margin:"auto"}}>
        <div className="Fondo"  style={{maxWidth:300}}>
            <Grid  container direction="row" justify="center"  spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5" component="h1" align="center" className={classes.form}>
                      Iniciar Sesión
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                <TextField
                    onChange={cambiarInput}
                    name="email"
                    value={datos.email}
                    className={classes.inputAncho}
                    id="filled-basic"
                    label="Usuario/Correo electrónico"
                    variant="filled"
                    required
                />
                </Grid>
                <Divider/>
                
                <Grid item xs={12}>
                    <TextField
                    onChange={cambiarInput}
                    name="contrasena"
                    value={datos.contrasena}
                    required
                    type="password"
                    label="Contraseña"
                    variant="filled"
                    style={{marginTop:"15px"}}
                    className={classes.inputAncho}
                    />
                </Grid>
                
                <div className={classes.inputAncho} hidden={!cargando}>
                    <LinearProgress color="secondary"/>
                </div>

                <Hidden xlDown={alerta===""}>
                    <Typography color="error">
                        {alerta}
                    </Typography>
                </Hidden>

                <Grid item xs={12} align="center">
                    <Button
                        onClick={iniciarSesion}
                        size="large"
                        variant="contained"
                        color="secondary">
                        Iniciar Sesión
                    </Button>
                </Grid>
            </Grid>
        </div>
    </div>
  );
}