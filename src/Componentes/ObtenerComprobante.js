import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {InputLabel, Checkbox,FormControlLabel, Typography, Radio, RadioGroup, TextField, FormControl, Button, Paper, Grid, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import Cargando from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Estilos from '../Estilos.js';

import ModalComprobante from './pdf-comprobante'
import AlertaMensaje from './Alerta.js'

export default function ObtenerComprobante ({ruta}){ 
    const classes = Estilos();
    const [cargando, setcargando] = useState(false);
    
    const [dni, setdni] = useState("");
    const [msj, setmsj] = useState({descripcion:"",tipo:"success"});
    const [abrirAlerta, setabrirAlerta] = useState(false);

    const [turno, setturno] = useState(null);

    async function buscarTurno(e){
        e.preventDefault()
        setcargando(true)
        let personaObtenida = null;
        try{
            personaObtenida = await axios.post(ruta+'/obtener-persona',{dni:dni})
        }catch(error){

        }
        if(personaObtenida){
            //console.log(personaObtenida.data)
            let persona = {...personaObtenida.data}
            let ultimo_turno = persona.turnos[persona.turnos.length-1]
            delete persona.turnos
            ultimo_turno.persona = persona
            
            console.log(ultimo_turno)
            
            setturno(ultimo_turno)
            setcargando(false)
        }else{
            setcargando(false)
            setmsj({descripcion:'El DNI ingresado no se encuentra registrado.', tipo:"error"});
            setabrirAlerta(true)
        }   
    }

    function modificarInput(e){
        if (e.target.value>=0 && e.target.value<=99999999){
            let aux = e.target.value.replace(".", "")
            aux = aux.replace(" ", "")
            setdni(aux)
        }
    }

    return (
        <div className={classes.fondo}>            
            <Paper elevation={3} style={{padding: "10px", background:"lightblue"}}>
                <form onSubmit={buscarTurno}>
                    <FormControl color="primary" fullWidth>
                        <Grid className={classes.pantallaMedia} container direction="row" justify="center" alignItems="center" spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="h3" component="h1" align="center">
                                    Obtener comprobante de turno
                                </Typography>
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                                <Typography variant="body1">
                                    Ingresá tu DNI para buscar tu último turno efectuado
                                </Typography>
                            </Grid>

                            <Grid item lg={2} md={2} sm={12} xs={12}>
                                <TextField
                                onChange={(e)=>{modificarInput(e)}}
                                value={dni}
                                name="dni"
                                className={classes.inputAncho}
                                id="filled-basic"
                                label="DNI"
                                variant="filled"
                                maxLength={50}
                                required/>
                            </Grid>
                            
                            <Grid item xs={12} align="center" style={{margin:"15px"}}>
                                {cargando && <Cargando color="secondary"/>}
                            </Grid>
                            
                            <Grid item xs={12} align="center">
                                <Button className={classes.botones} disabled={cargando || turno!==null} type="submit" size="large" variant="contained" style={{background:"lightgreen"}}>Solicitar</Button>
                            </Grid>
                        </Grid>

                        <AlertaMensaje mensaje={msj} abrir={abrirAlerta} setabrir={setabrirAlerta}/>
                        <ModalComprobante modalDatos={turno} setmodalDatos={setturno} />
                    </FormControl>
                </form>
                
            </Paper>
        </div>
    )
}