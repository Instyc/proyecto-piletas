import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {LinearProgress,InputLabel, Checkbox,FormControlLabel, Typography, Radio, RadioGroup, TextField, FormControl, Button, Paper, Grid, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import Cargando from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Estilos from '../Estilos.js';
import Notificacion from './Notificacion.js'
import AlertaMensaje from './Alerta.js'
import {Link} from "react-router-dom";

import ModalComprobante from './pdf-comprobante'

//Componente utilizado para crear o modificar publicaciones o solicitudes de servicios
export default function Inicio({ruta}) {
    const [siguiente, setsiguiente] = useState(false);
    return ( 
        siguiente?<Formulario setsiguiente={setsiguiente} ruta={ruta}/>:<Condiciones setsiguiente={setsiguiente}/>
    );
}

const Condiciones = ({setsiguiente}) => {
    const classes = Estilos();

    return (
        <div className={classes.fondo}>
            <Paper elevation={3} style={{padding: "20px", background:"lightblue", maxWidth:"1600px"}} className="Fondo">

                <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h1" align="center">
                            Condiciones para realizar una reserva para las piletas
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ul style={{textAlign:"left",textJustify:"auto"}}>
                            <li>Los días habilitados para asistir al complejo son de martes a domingo.</li>
                            <li>Los horarios de apertura del complejo son: martes a viernes de 14 a 22 hs, sábados de 14 a 00 hs y domingos de 9:30 a 00 hs. El sector de las piletas cierra a las 20 hs.</li>
                            <li>Al momento de ingresar al complejo, deberás presentar tu DNI y un certificado de buena salud expedido por un organismo público.</li>
                            <li>Luego de haber realizado una reserva, deberás esperar 24 horas luego de asistido al complejo para poder realizar otra. Solo se puede tener un turno activo a la vez.</li>
                            <li>La entrada al complejo es totalmente gratuita.</li>
                            <li>Para poder realizar una reserva, debés tener un domicilio real en San Bernardo que pueda ser comprobado mediante tu DNI.</li>
                            <li>En caso de no poseer un domicilio en San Bernardo y estar vacacionando en nuestra ciudad desde <strong>otra provincia</strong>, deberás presentar también una fotocopia del documento de la persona con la que te estás alojando.</li>
                            <li>Si realizás una reserva 72 horas antes de asistir al complejo, deberás realizar una actualización de la declaración jurada sobre síntomas de COVID-19 al momento de ingresar.</li>
                            <li>Para cancelar una reserva, comunicate al correo complejodeportivosb@gmail.com junto con tus datos y una foto del frente y dorso de tu documento.</li>
                            <li>Tené en cuenta que si querés anotar a tu grupo familiar, deberás pedir turno para cada integrante de tu familia.</li>
                            <li>Si realizás una reserva y luego no asistís al complejo (sin haber cancelado el turno), <strong style={{backgroundColor:"lightyellow"}}>no vas a poder sacar un nuevo turno por los próximos 5 días.</strong></li>
                            <strong><li >Es obligatorio el uso de barbijo y elementos de higiene personal dentro del complejo. El complejo se reserva el derecho de admisión.</li></strong>
                        <br/></ul>       
                    </Grid>
                    <Grid  item xs={6}>
                        <Link to={"/comprobante"} style={{textDecoration:"none", padding: 0, color:"black"}}>
                            <Button>Obtener comprobante de turno</Button>
                        </Link>
                    </Grid>
                    <Grid  item xs={6}>
                        <Button className={classes.botones} onClick={()=>{window.scrollTo(0, 0); setsiguiente(true)}} size="large" variant="contained" color="secondary">Siguiente</Button>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    )
}

function Alerta({funcionAceptar, persona, turno}) {
    const [open, setOpen] = useState(true);
    const [cargando, setcargando] = useState(false)
    const [noEsta, setnoEsta] = useState(persona.nombre==="")
    //Ejecutamos la función que se pasa como parámetro
    const handleClose = (boole) => {
      setcargando(true)
      funcionAceptar(boole)
      setcargando(false)
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
          <DialogTitle id="alert-dialog-title">{noEsta?"DNI no encontrado":"Por favor, confirme que los datos sean correctos"}</DialogTitle>
          <DialogContent>
            {!noEsta && <DialogContentText id="alert-dialog-description">
                Nombre: {persona.nombre}<br/>
                Apellido: {persona.apellido}<br/>
                DNI: {persona.dni}<br/>
                Telefono: {persona.telefono}<br/>
                {(persona.domicilio==="Turista" || persona.domicilio===true)?"Situación: Soy turista":
                ((persona.domicilio==="San Bernardo" || persona.domicilio===false)?"Localidad: San Bernardo":"Localidad: "+persona.domicilio_alojado)}<br/>
                Fecha reservada: {turno.fecha}<br/>
                Área: {turno.area===0?"Pileta":(turno.area===1?"Camping":"Camping y pileta")}
            </DialogContentText>}
            {noEsta && <DialogContentText id="alert-dialog-description">
                El DNI introducido no se encuentra registrado. Por favor, ingrese todos sus datos destildando la opción "Ya he realizado una reserva alguna vez".
            </DialogContentText>}
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{handleClose(false)}} variant="contained" color="secondary">
              Cancelar
            </Button>
            <Button onClick={()=>{handleClose(true)}} variant="contained" style={{background:"lightgreen"}} disabled={noEsta} autoFocus>
              Confirmar
            </Button>
            {cargando && <Cargando/>}
          </DialogActions>
        </Dialog>
      </div>
    );
  }

const Formulario = ({setsiguiente, ruta, usuario}) =>{
    const classes = Estilos();

    const [cargando, setcargando] = useState(false);
    const [abrirConfirmacion, setabrirConfirmacion] = useState(false);
    const [tildado, settildado] = useState(false);
    const [mensaje, setmensaje] = useState("");
    const [tildadoCovid, settildadoCovid] = useState(false);
    const [disponibles, setdisponibles] = useState(-4);
    const [esperaDisponible, setesperaDisponible] = useState(false);
    const [notificar, setnotificar] = useState(false);
    const [fechaHoy, setfechaHoy] = useState("");
    const [turista, setturista] = useState(false);
    const [abrirAlerta, setabrirAlerta] = useState(false);
    const [checkedLocalidad, setcheckedLocalidad] = useState(false);
    const [cargandoSolicitar, setcargandoSolicitar] = useState(false);
    
    const [modalDatos, setmodalDatos] = useState(null);

    const [msj, setmsj] = useState({descripcion:"",tipo:"success"});
    

    //Datos de la pagina
    const [persona, setpersona] = useState({
        dni: "",
        nombre:"",
        apellido: "",
        domicilio: '',
        telefono: "",
        dni_alojado: "",
        nombre_alojado:"",
        apellido_alojado: "",
        domicilio_alojado: ""
    }); 
    
    const [turno, setturno] = useState({
        fecha: "",
        area: 2,
        tipo: 0,
        asistencia: false,
        declarado: false,
        persona: null
    });

    useEffect(()=>{
        setcargando(true)
        let date_ = new Date();
        let mes = date_.getMonth() + 1
        if(mes < 10)
            mes = "0"+mes
        let dia = date_.getDate()
        if(dia < 10)
            dia = "0"+dia
        
        let fecha_ = date_.getFullYear()+"-"+mes+"-"+dia

        setfechaHoy(fecha_)
        
        setturno({
            ...turno,
            fecha: fecha_
        })
        setcargando(false)
        setesperaDisponible(true)

        if (fecha_ === "2021-03-09"){
            setdisponibles(-3)//Día no hábil
            setesperaDisponible(false)
        }else{
            if (date_.getUTCDay()!==1){
                axios.get(ruta+'/turnos/count?fecha='+fecha_+'&tipo=0')
                .then(response => {
                    setdisponibles(150-response.data)
                    setesperaDisponible(false)
                }).catch(error => {
                    console.log(error.response)
                });
            }else{
                setdisponibles(-2)//Cuando se selecciona un lunes
                setesperaDisponible(false)
            }
        }
    },[])

    function modificarInput(e){
        switch (e.target.name) {
            case "dni":
                if (e.target.value>=0 && e.target.value<=99999999){
                    let aux = e.target.value.replace(".", "")
                    aux = aux.replace(" ", "")
                    setpersona({
                        ...persona,
                        [e.target.name]: aux
                    })
                }
                break;
            case "dni_alojado":
                if (e.target.value>=0 && e.target.value<=99999999){
                    let aux = e.target.value.replace(".", "")
                    aux = aux.replace(" ", "")
                    setpersona({
                        ...persona,
                        [e.target.name]: aux
                    })
                }
                break;
            case "telefono":
                if (e.target.value>=0 && e.target.value<=9999999999999){
                    let aux = e.target.value.replace(".", "")
                    aux = aux.replace(" ", "")
                    setpersona({
                        ...persona,
                        [e.target.name]: aux
                    })
                }
                break;
            default:
                setpersona({
                    ...persona,
                    [e.target.name]: e.target.value
                })
                break;
        }
    }

    function seleccionarArea(e){
        setturno({
            ...turno,
            area: Number(e.target.value)
        })
    }

    useEffect(()=>{
        if (persona.domicilio==="Turista" || persona.domicilio==="Localidad"){
            setpersona({
                ...persona,
                domicilio_alojado: ''
            })
        }
    },[persona.domicilio])

    function limpiarVariables(){
        setpersona({
            dni: "",
            nombre:"",
            apellido: "",
            telefono: "",
            domicilio: '',
            dni_alojado: "",
            nombre_alojado:"",
            apellido_alojado: "",
            domicilio_alojado: ""
        });
        setturista(false)
        setturno({
            fecha: turno.fecha,
            area: 2,
            tipo: 0,
            asistencia: false,
            declarado: false,
            persona: null
        });
    }

    async function alertaPregunta(e){
        e.preventDefault();
        setcargandoSolicitar(true)
        if(tildado){
            let personaObtenida = null;
            try{
                personaObtenida = await axios.post(ruta+'/obtener-persona',{dni:persona.dni})
            }catch(error){

            }
            if(personaObtenida){
                personaObtenida = personaObtenida.data
                setpersona({
                    dni: personaObtenida.dni,
                    nombre: personaObtenida.nombre,
                    apellido: personaObtenida.apellido,
                    domicilio: personaObtenida.domicilio,
                    telefono: personaObtenida.telefono,
                    dni_alojado: personaObtenida.dni_alojado,
                    nombre_alojado: personaObtenida.nombre_alojado,
                    apellido_alojado: personaObtenida.apellido_alojado,
                    domicilio_alojado: personaObtenida.domicilio_alojado,
                })
                setcargandoSolicitar(false)
                setabrirConfirmacion(true)
                setcargandoSolicitar(false)
            }else{
                setcargandoSolicitar(false)
                setmsj({descripcion:'El DNI ingresado no se encuentra registrado, por favor ingrese sus datos.',tipo:"error"});
                setabrirAlerta(true)
            }   
        }else{
            setcargandoSolicitar(false)
            setabrirConfirmacion(true)
            setcargandoSolicitar(false)
        }
    }

    async function solicitarTurno(boole){
        setabrirConfirmacion(false)
        setcargandoSolicitar(true)
        let domicilio_ = persona.domicilio==="San Bernardo"?false:(persona.domicilio==="Turista"?true:null)
        let persona_ = {...persona};
        persona_.domicilio = domicilio_
        if(boole){
            if(tildado){
                let respuesta = await axios.post(ruta+'/turno-pileta-creada',{persona: persona_, turno: turno})
                setcargandoSolicitar(false)

                if(respuesta.data.tipo==="success"){
                    setmodalDatos(respuesta?.data.data)
                    setdisponibles(disponibles-1)
                }
                
                limpiarVariables();
                setmsj({descripcion:respuesta.data.mensaje,tipo:respuesta.data.tipo});
                setabrirAlerta(true)
            }else{
                let respuesta = await axios.post(ruta+'/turno-pileta-nueva',{persona: persona_, turno: turno})

                setcargandoSolicitar(false)
                if(respuesta.data.tipo==="success"){
                    setmodalDatos(respuesta?.data.data)
                    limpiarVariables();
                    setdisponibles(disponibles-1)
                }
                setmsj({descripcion:respuesta.data.mensaje,tipo:respuesta.data.tipo});
                setabrirAlerta(true)
            }
        }else{
            limpiarVariables()
            setcargandoSolicitar(false)
        }
    }

    function otraLocalidad(identificador){
        setesperaDisponible(true)
        //0: San Bernardo, 1: Turista, 2: Otra localidad
        setturista(identificador===1)
        let tipo_ = identificador===2?1:0
        setturno({...turno, tipo: tipo_})
        comprobarDisponibles(turno.fecha, tipo_)
    }

    function seleccionarFecha(e){
        setturno({...turno, fecha: e.target.value})
        setesperaDisponible(true)
        comprobarDisponibles(e.target.value, turno.tipo)
    }

    function reservaAlgunaVez(){
        settildado(!tildado)
        setesperaDisponible(true)        
        setcheckedLocalidad(turno.tipo===1)
        comprobarDisponibles(turno.fecha, turno.tipo)
    }
    
    function metodoLocalidad(){
        setcheckedLocalidad(!checkedLocalidad)
        setesperaDisponible(true)
        let _tipo = checkedLocalidad?0:1
        comprobarDisponibles(turno.fecha, _tipo)
    }
    
    function comprobarDisponibles(fecha, tipo){
        let _fecha = new Date(fecha)
        if (fecha === "2021-03-09"){
            setdisponibles(-3)//Día no hábil
            setesperaDisponible(false)
        }else{
            if (_fecha.getUTCDay()!==1){
                axios.get(ruta+'/turnos/count?fecha='+fecha+'&tipo='+tipo)
                .then(response => {
                    tipo===1?setdisponibles(50-response.data):setdisponibles(150-response.data)
                    setesperaDisponible(false)
                }).catch(error => {
                    console.log(error.response)
                });
            }else{
                setdisponibles(-2)//Cuando se selecciona un lunes
                setesperaDisponible(false)
            }
        }
    }

    return (
        <div className={classes.fondo}>
            <ModalComprobante modalDatos={modalDatos} setmodalDatos={setmodalDatos}/>
            
            <Paper elevation={3} style={{padding: "10px", background:"lightblue"}}>
                <form onSubmit={alertaPregunta}>
                    <FormControl color="primary" fullWidth>
                        <Grid className={classes.pantallaMedia} container direction="row" justify="center" alignItems="center" spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="h3" component="h1" align="center">
                                    Turnos de pileta
                                </Typography>
                            </Grid>

                            <Grid item lg={6} md={6} sm={12}>
                                <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={tildado}
                                        onChange={reservaAlgunaVez}
                                        name="checkedF"
                                        color="primary"
                                    />
                                }
                                label="Ya he realizado una reserva alguna vez"
                                />
                            </Grid>

                            <Grid item lg={6} md={6} sm={12}>
                                <Link to={"/comprobante"} style={{textDecoration:"none", padding: 0, color:"black"}}>
                                    <Button>Obtener comprobante de turno</Button>
                                </Link>
                            </Grid>

                            <Grid item lg={2} md={2} sm={12} xs={12}>
                                <TextField
                                onChange={modificarInput}
                                value={persona.dni}
                                name="dni"
                                className={classes.inputAncho}
                                id="filled-basic"
                                label="DNI"
                                variant="filled"
                                maxLength={50}
                                required/>
                            </Grid>

                            
                            {!tildado && <Grid item lg={3} md={3} sm={12} xs={12}>
                                <TextField
                                onChange={modificarInput}
                                value={persona.nombre}
                                name="nombre"
                                className={classes.inputAncho}
                                id="filled-basic"
                                label="Nombre"
                                variant="filled"
                                maxLength={50}
                                required/>
                            </Grid>}

                            {!tildado && <Grid item lg={3} md={3} sm={12} xs={12}>
                                <TextField
                                onChange={modificarInput}
                                value={persona.apellido}
                                name="apellido"
                                className={classes.inputAncho}
                                id="filled-basic"
                                label="Apellido"
                                variant="filled"
                                maxLength={50}
                                required/>
                            </Grid>}
                                
                            {!tildado && <Grid item lg={2} md={2} sm={12} xs={12}>
                                <TextField
                                    onChange={modificarInput}
                                    value={persona.telefono}
                                    name="telefono"
                                    className={classes.inputAncho}
                                    id="filled-basic"
                                    label="Número de celular"
                                    variant="filled"
                                    maxLength={50}
                                />
                            </Grid>}

                            {!tildado && <Grid item lg={2} md={2} sm={12} xs={12}>
                                <FormControl className={classes.inputAncho}>
                                    <InputLabel id="demo-simple-select-label" style={{margin:"7px 10px"}}>Localidad</InputLabel>
                                    <Select
                                        value={persona.domicilio}
                                        name="domicilio"
                                        onChange={modificarInput}
                                        id="domicilio"
                                        variant="filled"
                                        required
                                    >
                                        <MenuItem value={"San Bernardo"} onClick={()=>{otraLocalidad(0)}}>San Bernardo</MenuItem>
                                        <MenuItem value={"Turista"} onClick={()=>{otraLocalidad(1)}}>Soy turista</MenuItem>
                                        <MenuItem value={"Localidad"} onClick={()=>{otraLocalidad(2)}}>Soy de otra localidad</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>}

                            {persona.domicilio==="Localidad" && !tildado && <Grid item lg={2} md={2} sm={12} xs={12}>
                                <TextField
                                onChange={modificarInput}
                                value={persona.domicilio_alojado}
                                name="domicilio_alojado"
                                className={classes.inputAncho}
                                id="filled-basic"
                                label="Localidad"
                                variant="filled"
                                maxLength={50}
                                required/>
                            </Grid>}

                            {/*Selecciona la opcion Soy turista */}
                            {turista && !tildado && <Grid container direction="row" justify="center" alignItems="center" spacing={1} style={{margin:"10px"}}>
                                <Alert variant="filled" severity="info">
                                    Ingrese los datos de la persona con la cual se encuentra alojada. Al momento de asistir al complejo, deberá presentar una fotocopia del DNI de dicha persona.
                                </Alert>

                                <Grid item lg={2} md={2} sm={12} xs={12}>
                                    <TextField
                                    onChange={modificarInput}
                                    value={persona.dni_alojado}
                                    name="dni_alojado"
                                    className={classes.inputAncho}
                                    id="filled-basic"
                                    label="DNI"
                                    variant="filled"
                                    maxLength={50}
                                    required/>
                                </Grid>

                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <TextField
                                    onChange={modificarInput}
                                    value={persona.nombre_alojado}
                                    name="nombre_alojado"
                                    className={classes.inputAncho}
                                    id="filled-basic"
                                    label="Nombre"
                                    variant="filled"
                                    maxLength={50}
                                    required/>
                                </Grid>

                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <TextField
                                    onChange={modificarInput}
                                    value={persona.apellido_alojado}
                                    name="apellido_alojado"
                                    className={classes.inputAncho}
                                    id="filled-basic"
                                    label="Apellido"
                                    variant="filled"
                                    maxLength={50}
                                    required/>
                                </Grid>

                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <TextField
                                    onChange={modificarInput}
                                    value={persona.domicilio_alojado}
                                    name="domicilio_alojado"
                                    className={classes.inputAncho}
                                    id="filled-basic"
                                    label="Domicilio"
                                    variant="filled"
                                    maxLength={50}
                                    required/>
                                </Grid>
                            </Grid>}

                            <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                                <Typography align="center" variant="h6">
                                    Seleccione la fecha a reservar
                                </Typography>
                                <input
                                className={classes.inputAncho}
                                onChange={seleccionarFecha}
                                id="date"
                                type="date"
                                min={fechaHoy}
                                required
                                value={turno.fecha}
                                style={{boxSizing: "border-box", padding:"0px 10px",background:"rgba(0,0,0,.1)", borderRadius:"5px",border:"none"}}/>
                            </Grid>

                            {tildado && <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                                <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checkedLocalidad}
                                        onChange={metodoLocalidad}
                                        name="otra_localidad"
                                        color="primary"
                                    />
                                }
                                label="Ver cupo para otras localidades"
                                />
                            </Grid>}

                            <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                                {esperaDisponible && <Typography align="center" variant="h6">Cargando...</Typography>}
                                {esperaDisponible && <LinearProgress color="secondary"/>}
                                <Typography color="secondary"> {disponibles===-1?"0 lugares disponibles":(disponibles===-2?"Los días lunes no se puede reservar.":(disponibles===1?`${disponibles} lugar disponible`:(disponibles===-3?"El complejo permancerá cerrado esta fecha. Por favor, seleccione una distinta.":(disponibles===-4?"":`${disponibles} lugares disponibles`))))} </Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="Turno" name="turno" value={String(turno.area)} onChange={seleccionarArea}>
                                    <FormControlLabel value={"0"} control={<Radio />} label="Pileta" />
                                    <FormControlLabel value={"1"} control={<Radio />} label="Camping" />
                                    <FormControlLabel value={"2"} control={<Radio />} label="Ambos" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {tildado && <Grid item lg={12} md={12} sm={12} xs={12} align="justify">
                                <Typography align="justify" variant="body1">
                                    *Si necesitás cambiar algún dato que proporcionaste anteriormente, podés enviar un correo a complejoderpotivosb@gmail.com para modificarlo*
                                </Typography>
                            </Grid>}

                            <br/>
                            <Typography variant="h4" component="h4" align="center">
                                Declaración Jurada de Síntomas de COVID-19
                            </Typography>                                

                            <Grid item sm={12}>
                                <img src="sintomas.jpg" width="100%" alt=""></img>
                                <br/>
                                <br/>
                                <Typography fontWeight="fontWeightBold" align="justify">
                                    Si tenés dos o más de los siguientes síntomas: fiebre de 37,5°C, tos, dolor de garganta, dificultad respiratoria, dolor muscular, cefalea, diarrea y/o vómitos, o si tenés solo pérdida brusca de gusto u olfato, comunicate al cel 3735604561 de 09 a 11hs y de 17 a 20 hs sin excepción.
                                </Typography>
                            </Grid>

                            <FormControlLabel
                            control={
                                <Checkbox
                                    checked={tildadoCovid}
                                    onChange={()=>{settildadoCovid(!tildadoCovid)}}
                                    name="tildadoCovid"
                                    required
                                />
                            }
                            label="Declaro bajo juramento que no tengo síntomas de COVID-19"
                            />
                            <Grid item xs={12} className={classes.inputAncho}>
                                {cargando && <Cargando/>}
                            </Grid>

                            
                            <Grid item xs={12} align="center" style={{margin:"15px"}}>
                                {cargandoSolicitar && <LinearProgress color="secondary"/>}
                            </Grid>

                            <Grid item xs={6} align="center">
                                <Button className={classes.botones} onClick={()=>{setsiguiente(false)}} size="large" variant="contained" color="secondary">Atras</Button>
                            </Grid>
                            
                            <Grid item xs={6} align="center">
                                <Button className={classes.botones} disabled={cargando || disponibles<=0} type="submit" size="large" variant="contained" style={{background:"lightgreen"}}>Solicitar</Button>
                            </Grid>
                        </Grid>
                        {abrirConfirmacion && <Alerta funcionAceptar={solicitarTurno} persona={persona} turno={turno}/>}
                        {notificar && <Notificacion funcionAceptar={setnotificar} mensaje={mensaje}/>}

                        <AlertaMensaje mensaje={msj} abrir={abrirAlerta} setabrir={setabrirAlerta}/>
                    </FormControl>
                </form>
            </Paper>
        </div>
    )
}