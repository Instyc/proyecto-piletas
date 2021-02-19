import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {LinearProgress,InputLabel, Checkbox,FormControlLabel, Typography, Radio, RadioGroup, TextField, FormControl, Button, Paper, Grid, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import Cargando from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Estilos from '../Estilos.js';
import Notificacion from './Notificacion.js'
import AlertaMensaje from './Alerta.js'


//Componente utilizado para crear o modificar publicaciones o solicitudes de servicios
export default function Deporte({ruta}) {
    const [siguiente, setsiguiente] = useState(false);
    
    return ( 
        siguiente?<Formulario setsiguiente={setsiguiente} ruta={ruta}/>:<Condiciones setsiguiente={setsiguiente}/>
    );
}

const Condiciones = ({setsiguiente}) => {
    const classes = Estilos();

    return (
        <div className={classes.fondo}>
            <Paper elevation={3} style={{padding: "20px", background:"lightblue", maxWidth:"1200px"}} className="Fondo">
                <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h4" component="h1" align="center">
                            Inscripción a actividades deportivas
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ul style={{textAlign:"left",textJustify:"auto"}}>
                            <li>Los días en donde se puede solicitar turno para realizar actividades deportivas son de martes a domingos.</li>
                            <li>Los turnos para las canchas deportivas son de 20 a 21hs, de 21 a 22hs y de 22 a 23hs.</li>
                            <li>Al momento de ingresar al complejo, deberás presentar tu DNI.</li>
                            <li>Luego de realizado una reserva, deberás esperar 24 horas para poder realizar otra.</li>
                            <li>Para cancelar o modificar los datos de tu reserva, comunicate al correo complejodeportivosb@gmail.com.</li>
                            <strong><li>Es obligatorio el uso de barbijo y elementos de higiene personal dentro del complejo.</li></strong>
                        <br/></ul>       
                    </Grid>
                    <Grid item xs={12}>
                             
                    </Grid>     
                    <Button className={classes.botones} onClick={()=>{setsiguiente(true)}} size="large" variant="contained" color="secondary">Siguiente</Button>
                </Grid>
            </Paper>
        </div>
    )
}

function Alerta({funcionAceptar, persona, deporte}) {
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
          <DialogTitle id="alert-dialog-title">{noEsta?"DNI no encontrado":"Por favor, confirme que sus datos sean correctos"}</DialogTitle>
          <DialogContent>
            {!noEsta && <DialogContentText id="alert-dialog-description">
                Nombre: {persona.nombre}<br/>
                Apellido: {persona.apellido}<br/>
                DNI: {persona.dni}<br/>
                Telefono: {persona.telefono}<br/>
                {persona.domicilio?"Situación: Soy turista":"Localidad: San Bernardo"}<br/>
                Fecha reservada: {deporte.fecha}<br/>
                Deporte: {deporte.tipo}                
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

  const Formulario = ({setsiguiente, ruta}) =>{
    const classes = Estilos();

    const [cargando, setcargando] = useState(false);
    const [abrirConfirmacion, setabrirConfirmacion] = useState(false);
    const [alertaDNI, setalertaDNI] = useState(false);
    const [tildado, settildado] = useState(false);
    const [mensaje, setmensaje] = useState("");
    const [tildadoCovid, settildadoCovid] = useState(false);
    const [disponibles, setdisponibles] = useState(-3);
    const [esperaDisponible, setesperaDisponible] = useState(false);
    const [notificar, setnotificar] = useState(false);
    const [fechaHoy, setfechaHoy] = useState("");
    const [turista, setturista] = useState(false);
    const [abrirAlerta, setabrirAlerta] = useState(false);
    const [cantidadJugadores, setcantidadJugadores] = useState('');
    const [jugadores, setjugadores] = useState([]);
    const [deporteACargar, setdeporteACargar] = useState(null);

    const [noGuardado, setnoGuardado] = useState(false);

    const [cargandoSolicitar, setcargandoSolicitar] = useState(false);
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

    const [jugador, setjugador] = useState({
        dni: "",
        nombre:"",
        apellido: "",
        domicilio: false,
        telefono: "",
        dni_alojado: "",
        nombre_alojado:"",
        apellido_alojado: "",
        domicilio_alojado: ""
    });
    
    const [deporte, setdeporte] = useState({
        fecha: "",
        tipo: "Fútbol",
        horario: "0",
        nombre_equipo: "",
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
        
        setdeporte({
            ...deporte,
            fecha: fecha_
        })
        setcargando(false)
        setesperaDisponible(true)
        axios.get(ruta+'/deportes/count?fecha='+fecha_+'&horario=0'+'&tipo=0')
        .then(response => {
            setdisponibles(2-response.data)
            setesperaDisponible(false)
        }).catch(error => {
            console.log(error.response)
        });
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
    
    function inputDeporte(e){
        setdeporte({
            ...deporte,
            [e.target.name]: e.target.value
        })
    }

    function seleccionarDeporte(e){
        setdeporte({
            ...deporte,
            tipo: e.target.value
        })
        setesperaDisponible(true)
        let _fecha = new Date(deporte.fecha)
        if (_fecha.getUTCDay()!==1){
            axios.get(ruta+'/deportes/count?fecha='+deporte.fecha+'&horario='+deporte.horario+'&tipo='+(e.target.value==="Fútbol"?'0':(e.target.value==="Voley"?'1':'2')))
            .then(response => {
                setdisponibles(2-response.data)
                setesperaDisponible(false)
            }).catch(error => {
                console.log(error.response)
            });
        }else{
            setdisponibles(-2)//Cuando se selecciona un lunes
            setesperaDisponible(false)
        }
    }

    //Método para agregar los datos de un jugador (componente Integrante)
    function guardarIntegrante(integrante_datos,i){
        let aux = jugadores;
        aux[i] = integrante_datos;
        setjugadores([...aux])
    }

    function seleccionarHorario(e){
        setdeporte({
            ...deporte,
            horario: Number(e.target.value)
        })
        setesperaDisponible(true)
        let _fecha = new Date(deporte.fecha)
        if (_fecha.getUTCDay()!==1){
            axios.get(ruta+'/deportes/count?fecha='+deporte.fecha+'&horario='+e.target.value+'&tipo='+(deporte.tipo==="Fútbol"?'0':(deporte.tipo==="Voley"?'1':'2')))
            .then(response => {
                setdisponibles(2-response.data)
                setesperaDisponible(false)
            }).catch(error => {
                console.log(error.response)
            });
        }else{
            setdisponibles(-2)//Cuando se selecciona un lunes
            setesperaDisponible(false)
        }
    }

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
        setcantidadJugadores('')
        setjugadores([])
        setdeporte({
            fecha: deporte.fecha,
            tipo: "Fútbol",
            horario: '0',
            nombre_equipo: "",
        });
    }


    async function alertaPregunta(e){
        e.preventDefault();
        setcargandoSolicitar(true)

        let vacio = jugadores.some((jug)=> (jug.nombre==="" || jug.dni==="" || jug.apellido===""))

        if(!vacio){
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
                    setmsj({descripcion:'El DNI ingresado no se encuentra registrado, por favor, ingrese otro.',tipo:"error"})
                    setabrirAlerta(true)
                }   
            }else{
                setcargandoSolicitar(false)
                setabrirConfirmacion(true)
                setcargandoSolicitar(false)
            }
        }else{
            setcargandoSolicitar(false)
            setmsj({descripcion:"Debe guardar los datos de los integrantes del equipo antes de realizar el turno.",tipo:"warning"})
            setabrirAlerta(true)
        }
    }

    async function solicitarDeporte(boole){
        setabrirConfirmacion(false)
        setcargandoSolicitar(true)
        let tipo_ = deporte.tipo === "Fútbol"?'0':(deporte.tipo==="Voley"?'1':'2')
        let deporte_ = {...deporte};

        deporte_.tipo = Number(tipo_);
        if(boole){
            if(tildado){
                let respuesta = await axios.post(ruta+'/turno-deporte-creada',{persona: persona, deporte: deporte_, personas: jugadores})
                setcargandoSolicitar(false)
                if (respuesta.data.tipo==="success"){
                    limpiarVariables()
                    setdisponibles(disponibles-1)
                }
                setmsj({descripcion:respuesta.data.mensaje,tipo:respuesta.data.tipo});
                setabrirAlerta(true)
            }else{
                let respuesta = await axios.post(ruta+'/turno-deporte-nueva',{persona: persona, deporte: deporte_, personas: jugadores})
                setcargandoSolicitar(false)
                if (respuesta.data.tipo==="success"){
                    limpiarVariables()
                    setdisponibles(disponibles-1)
                }
                setmsj({descripcion:respuesta.data.mensaje,tipo:respuesta.data.tipo});
                setabrirAlerta(true)
            }
        }else{
            setcargandoSolicitar(false)
        }
    }
    
    function desplegarJugadores(cant){
        setjugadores([])
        setcantidadJugadores(cant)
        for (let i = 0; i < cant-1; i++) {
            setjugadores(elemento => [...elemento, jugador])
        }
    }

    function seleccionarFecha(e){
        setdeporte({...deporte, fecha: e.target.value})
        setesperaDisponible(true)
        let _fecha = new Date(e.target.value)
        if (_fecha.getUTCDay()!==1){
            axios.get(ruta+'/deportes/count?fecha='+e.target.value+'&horario='+deporte.horario+'&tipo='+(deporte.tipo==="Fútbol"?'0':(deporte.tipo==="Voley"?'1':'2')))
            .then(response => {
                setdisponibles(2-response.data)
                setesperaDisponible(false)
            }).catch(error => {
                console.log(error.response)
            });
        }else{
            setdisponibles(-2)//Cuando se selecciona un lunes
            setesperaDisponible(false)
        }
    }
    
    return (
        <div className={classes.fondo}>
            <Paper elevation={3} style={{padding: "10px", background:"lightblue"}}>
                <form onSubmit={alertaPregunta}>
                    <FormControl color="primary" fullWidth>
                        <Grid className={classes.pantallaMedia} container direction="row" justify="center" alignItems="center" spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="h3" component="h1" align="center">
                                    Turnos de canchas deportivas
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6" component="h1" align="center">
                                    Complete los campos abajo indicados para realizar la reserva de la cancha. Una persona (la que indica los datos iniciales) será la encargada de cargar los datos personales de los demás integrantes del equipo.
                                </Typography>
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={tildado}
                                        onChange={()=>{settildado(!tildado)}}
                                        name="checkedF"
                                        color="primary"
                                    />
                                }
                                label="Ya he realizado una reserva alguna vez"
                                />
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
                                        <MenuItem value={false} onClick={()=>setturista(false)}>San Bernardo</MenuItem>
                                        <MenuItem value={true} onClick={()=>setturista(true)}>Soy turista</MenuItem>
                                    </Select>
                                </FormControl>
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

                            <Grid item lg={2} md={2} sm={12} xs={12}>
                                <FormControl className={classes.inputAncho}>
                                    <InputLabel id="demo-simple-select-label" style={{margin:"7px 10px"}}>Deporte</InputLabel>
                                    <Select
                                        value={deporte.tipo}
                                        name="tipo"
                                        onChange={seleccionarDeporte}
                                        id="tipo"
                                        variant="filled"
                                        required
                                    >
                                        <MenuItem value={"Fútbol"}>Fútbol</MenuItem>
                                        <MenuItem value={"Voley"}>Voley</MenuItem>
                                        <MenuItem value={"Básquet"}>Básquet</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item lg={3} md={3} sm={12} xs={12} align="center">
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="Horario" name="horario" value={String(deporte.horario)} onChange={seleccionarHorario}>
                                    <FormControlLabel value={"0"} control={<Radio />} label="De 20 a 21 hs" />
                                    <FormControlLabel value={"1"} control={<Radio />} label="De 21 a 22 hs" />
                                    <FormControlLabel value={"2"} control={<Radio />} label="De 22 a 23 hs" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

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
                                value={deporte.fecha}
                                style={{boxSizing: "border-box", padding:"0px 10px",background:"rgba(0,0,0,.1)", borderRadius:"5px",border:"none"}}/>
                            </Grid>

                            <Grid item lg={3} md={3} sm={12} xs={12} align="center">
                                {esperaDisponible && <Typography align="center" variant="h6">Cargando...</Typography>}
                                {esperaDisponible && <LinearProgress color="secondary"/>}
                                <Typography color="secondary"> {disponibles===-1?"":(disponibles===-2?"Los días lunes no se puede reservar.":(disponibles===1?`${disponibles} lugar disponible`:(disponibles===-3?"":`${disponibles} lugares disponibles`)))} </Typography>
                            </Grid>

                            {deporte.tipo!=='' && <Grid item lg={6} md={6} sm={12} xs={12} align="right">
                                <TextField
                                onChange={inputDeporte}
                                value={deporte.nombre_equipo}
                                name="nombre_equipo"
                                id="filled-basic"
                                label="Nombre del equipo"
                                variant="filled"
                                maxLength={50}
                                required/>
                            </Grid>}

                            {deporte.tipo!=='' && <Grid item lg={6} md={6} sm={12} xs={12} align="left">
                                <FormControl style={{width:"190px"}}>
                                    <InputLabel id="demo-simple-select-label" style={{margin:"7px 10px"}}>Cantidad de jugadores</InputLabel>
                                    <Select
                                        value={cantidadJugadores}
                                        name="cantidad"
                                        id="cantidad"
                                        variant="filled"
                                        required
                                    >
                                        <MenuItem value={"2"} onClick={()=>desplegarJugadores(2)}>2</MenuItem>
                                        <MenuItem value={"3"} onClick={()=>desplegarJugadores(3)}>3</MenuItem>
                                        <MenuItem value={"4"} onClick={()=>desplegarJugadores(4)}>4</MenuItem>
                                        <MenuItem value={"5"} onClick={()=>desplegarJugadores(5)}>5</MenuItem>
                                        <MenuItem value={"6"} onClick={()=>desplegarJugadores(6)}>6</MenuItem>
                                        {deporte.tipo!=="Voley" && <MenuItem value={"7"} onClick={()=>desplegarJugadores(7)}>7</MenuItem>}
                                    </Select>
                                </FormControl>
                            </Grid>}
                        </Grid>

                        {jugadores.map((integrante, i) => (             
                            <Integrante integrante={integrante} key={i} i={i} guardarIntegrante={guardarIntegrante}/>
                        ))}
                        {
                            noGuardado && <Alert variant="filled" severity="error">
                                Debe guardar los datos de los jugadores.
                            </Alert>
                        }

                        <Grid className={classes.pantallaMedia} container direction="row" justify="center" alignItems="center" spacing={1}>
                            <br/>
                            <Typography variant="h4" component="h4" align="center">
                                Declaracion Jurada de Síntomas de COVID-19
                            </Typography>                                

                            <Grid item sm={12}>
                                <img src="../sintomas.jpg" width="100%" alt=""></img>
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

                        {abrirConfirmacion && <Alerta funcionAceptar={solicitarDeporte} persona={persona} deporte={deporte}/>}

                        {notificar && <Notificacion funcionAceptar={setnotificar} mensaje={mensaje}/>}
                        <AlertaMensaje mensaje={msj} abrir={abrirAlerta} setabrir={setabrirAlerta}/>
                    </FormControl>
                </form>
            </Paper>
        </div>
    )
}

const Integrante = React.memo(({integrante, i, guardarIntegrante}) =>{
    const classes = Estilos();
    const [turista, setturista] = useState(false);
    const [datosIntegrante, setdatosIntegrante] = useState(integrante);
    const [guardar, setguardar] = useState(false);

    function inputJugadores(e){
        if (!guardar){
            switch (e.target.name) {
                case "dni":
                    if (e.target.value>=0 && e.target.value<=99999999){
                        let aux = e.target.value.replace(".", "")
                        aux = aux.replace(" ", "")
                        setdatosIntegrante({...datosIntegrante, [e.target.name]: aux})
                    }
                    break;
                case "dni_alojado":
                    if (e.target.value>=0 && e.target.value<=99999999){
                        let aux = e.target.value.replace(".", "")
                        aux = aux.replace(" ", "")
                        setdatosIntegrante({...datosIntegrante, [e.target.name]: aux})
                    }
                    break;
                case "telefono":
                    if (e.target.value>=0 && e.target.value<=9999999999999){
                        let aux = e.target.value.replace(".", "")
                        aux = aux.replace(" ", "")
                        setdatosIntegrante({...datosIntegrante, [e.target.name]: aux})
                    }
                    break;
                default:
                    setdatosIntegrante({...datosIntegrante, [e.target.name]: e.target.value})
                    break;
            }
        }
    }

    function guardarDatos(){
        if(guardar){
            setguardar(false)
            guardarIntegrante({
                dni: "",
                nombre:"",
                apellido: "",
                domicilio: false,
                telefono: "",
                dni_alojado: "",
                nombre_alojado:"",
                apellido_alojado: "",
                domicilio_alojado: ""
            },i)
        }else{
            setguardar(true)
            guardarIntegrante(datosIntegrante,i)
        }
    }

    return (
        <Grid className={classes.pantallaMedia} style={{background:guardar?"lightgreen":""}} container direction="row" justify="center" alignItems="center" spacing={1}>
            <Grid item lg={12} md={12} sm={12} xs={12} align="left">
                <Typography variant="h6">Jugador {i+2}:</Typography>
            </Grid>

            <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextField
                onChange={inputJugadores}
                value={datosIntegrante.dni}
                name="dni"
                className={classes.inputAncho}
                id="filled-basic"
                label="DNI"
                variant="filled"
                maxLength={50}
                required
                />
            </Grid>
            
            <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextField
                onChange={(e)=>{inputJugadores(e,i)}}
                value={datosIntegrante.nombre}
                name="nombre"
                className={classes.inputAncho}
                id="filled-basic"
                label="Nombre"
                variant="filled"
                maxLength={50}
                required
                />
            </Grid>

            <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextField
                onChange={inputJugadores}
                value={datosIntegrante.apellido}
                name="apellido"
                className={classes.inputAncho}
                id="filled-basic"
                label="Apellido"
                variant="filled"
                maxLength={50}
                required
                />
            </Grid>
                
            <Grid item lg={2} md={2} sm={12} xs={12}>
                <TextField
                    onChange={inputJugadores}
                    value={datosIntegrante.telefono}
                    name="telefono"
                    className={classes.inputAncho}
                    id="filled-basic"
                    label="Número de celular"
                    variant="filled"
                    maxLength={50}
                />
            </Grid>

            <Grid item lg={2} md={2} sm={12} xs={12}>
                <FormControl className={classes.inputAncho}>
                    <InputLabel id="demo-simple-select-label" style={{margin:"7px 10px"}}>Localidad</InputLabel>
                    <Select
                        value={datosIntegrante.domicilio}
                        name="domicilio"
                        onChange={inputJugadores}
                        id="domicilio"
                        variant="filled"
                        required
                    >
                        <MenuItem value={false} onClick={()=>{if(!guardar)setturista(false)}}>San Bernardo</MenuItem>
                        <MenuItem value={true} onClick={()=>{if(!guardar)setturista(true)}}>Soy turista</MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {/*Selecciona la opcion Soy turista */}
            {turista && <Grid container direction="row" justify="center" alignItems="center" spacing={1} style={{margin:"10px"}}>
                <Alert variant="filled" severity="info">
                    Ingrese los datos de la persona con la cual se encuentra alojada. Al momento de asistir al complejo, deberá presentar una fotocopia del DNI de dicha integrante.
                </Alert>

                <Grid item lg={2} md={2} sm={12} xs={12}>
                    <TextField
                    onChange={inputJugadores}
                    value={datosIntegrante.dni_alojado}
                    name="dni_alojado"
                    className={classes.inputAncho}
                    id="filled-basic"
                    label="DNI"
                    variant="filled"
                    maxLength={50}
                    required
                    />
                </Grid>

                <Grid item lg={3} md={3} sm={12} xs={12}>
                    <TextField
                    onChange={inputJugadores}
                    value={datosIntegrante.nombre_alojado}
                    name="nombre_alojado"
                    className={classes.inputAncho}
                    id="filled-basic"
                    label="Nombre"
                    variant="filled"
                    maxLength={50}
                    required
                    />
                </Grid>

                <Grid item lg={3} md={3} sm={12} xs={12}>
                    <TextField
                    onChange={inputJugadores}
                    value={datosIntegrante.apellido_alojado}
                    name="apellido_alojado"
                    className={classes.inputAncho}
                    id="filled-basic"
                    label="Apellido"
                    variant="filled"
                    maxLength={50}
                    required
                    />
                </Grid>

                <Grid item lg={3} md={3} sm={12} xs={12}>
                    <TextField
                    onChange={inputJugadores}
                    value={datosIntegrante.domicilio_alojado}
                    name="domicilio_alojado"
                    className={classes.inputAncho}
                    id="filled-basic"
                    label="Domicilio"
                    variant="filled"
                    maxLength={50}
                    required
                    />
                </Grid>
            </Grid>}
            <Grid item lg={2} md={2} sm={12} xs={12}>
                <Button className={classes.botones} onClick={guardarDatos} size="small" variant="outlined" color="secondary">{guardar?"Editar":"Guardar"}</Button>
            </Grid>
        </Grid>
    );
})