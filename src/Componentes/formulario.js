import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {LinearProgress,InputLabel, Checkbox,FormControlLabel, Typography, Radio, RadioGroup, TextField, FormControl, Button, Paper, Grid, Select, MenuItem, Hidden, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';
import Cargando from '@material-ui/core/LinearProgress';
import Alert from '@material-ui/lab/Alert';
import Estilos from '../Estilos.js';

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
            <Paper elevation={3} style={{padding: "20px", background:"LightSkyBlue"}} className="Fondo">
                <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
                    <Grid item xs={12}>
                        <Typography variant="h3" component="h1" align="center">
                            Condiciones para realizar una reserva para las piletas
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <ul style={{textAlign:"left",textJustify:"auto"}}>
                            <li>Para poder realizar una reserva, debe tener un domicilio real en San Bernardo que pueda ser comprobado mediante su DNI.</li>
                            <li>Los días habilitados para asistir al complejo son de martes a domingo. El horario de apertura del complejo es de 14 a 00 hs, y el sector de las piletas cierra a las 20 hs.</li>
                            <li>Al momento de ingresar al complejo, debe presentar su DNI y un certificado de buena sauld expedido por un organismo público.</li>
                            <li>Luego de realizado una reserva, deberá esperar 48 horas para poder realizar otra.</li>
                            <li>La entrada al complejo es totalmente gratuita.</li>
                            <li>En caso de no poseer un domicilio en San Bernardo y estar vacacionando en nuestra ciudad, comunicate al correo x@x.com explicando tu situación para que te podamos ofrecer una solución.</li>
                        </ul>       
                    </Grid>      
                    <Button className={classes.botones} onClick={()=>{setsiguiente(true)}} size="large" variant="contained" color="secondary">Siguiente</Button>
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
          <DialogTitle id="alert-dialog-title">{noEsta?"DNI no encontrado":"Por favor, confirme que sus datos sean correctos"}</DialogTitle>
          <DialogContent>
            {!noEsta && <DialogContentText id="alert-dialog-description">
                Nombre: {persona.nombre}<br/>
                Apellido: {persona.apellido}<br/>
                DNI: {persona.dni}<br/>
                Telefono: {persona.telefono}<br/>
                {persona.domicilio==="San Bernardo"?"Localidad: ":"Situación: "}{persona.domicilio}<br/>
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
            <Button onClick={()=>{handleClose(true)}} variant="contained" color="primary" disabled={noEsta} autoFocus>
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
    const [mensaje, setmensaje] = useState(false);
    const [tildadoCovid, settildadoCovid] = useState(false);
    const [disponibles, setdisponibles] = useState(-1);
    const [esperaDisponible, setesperaDisponible] = useState(false);
    const [fechaReserva, setfechaReserva] = useState("");
    
    //Datos de la pagina
    const [persona, setpersona] = useState({
        dni: "",
        nombre:"",
        apellido: "",
        telefono: "",
        domicilio: "San Bernardo",
        permitido: true,
    }); 
    
    const [turno, setturno] = useState({
        fecha: "",
        area: 2,
        asistencia: false,
        persona: null
    });

    useEffect(()=>{
        let date_ = new Date();
        let mes = date_.getMonth() + 1
        if(mes < 10)
            mes = "0"+mes
        let dia = date_.getDay()
        if(dia < 10)
            dia = "0"+dia

        setturno({
            ...turno,
            fecha: date_.getFullYear()+"-"+mes+"-"+dia
        })

        setesperaDisponible(true)
        axios.get(ruta+'/turnos/count?fecha='+date_.getFullYear()+"-"+mes+"-"+dia)
        .then(response => {
            console.log(response.data);
            setdisponibles(100-response.data)
            setesperaDisponible(false)
        }).catch(error => {
            console.log(error.response)
        });
    },[])

    useEffect(()=>{
        if (alertaDNI)
            setalertaDNI(false)
    },[tildado])

    function modificarInput(e){
        if (alertaDNI){
            setalertaDNI(false)
        }
        setpersona({
            ...persona,
            [e.target.name]: e.target.value
        })
    }

    function seleccionarArea(e){
        setturno({
            ...turno,
            area: Number(e.target.value)
        })
    }

    function limpiarVariables(){
        setpersona({
            dni: "",
            nombre:"",
            apellido: "",
            telefono: "",
            domicilio: "San Bernardo",
            permitido: true,
        });

        setturno({
            fecha: turno.fecha,
            area: 2,
            asistencia: false,
            persona: null
        });
    }

    function alertaPregunta(e){
        e.preventDefault();
        axios.get(ruta+'/personas?dni='+persona.dni)
        .then(response => {
            if(response.data.length === 0 || tildado===true){
                if (tildado && response.data.length !== 0)
                    setpersona({
                        dni: response.data[0].dni,
                        nombre: response.data[0].nombre,
                        apellido: response.data[0].apellido,
                        telefono: response.data[0].telefono,
                        domicilio: response.data[0].domicilio?"San Bernardo":"Soy turista",
                        permitido: response.data[0].permitido,
                    })
                setabrirConfirmacion(true)
            }else{
                setalertaDNI(true)
            }

        }).catch(error => {
            console.log(error.response)
        });
    }

    function solicitarTurno(boole){
        setabrirConfirmacion(false)
        if(boole){
            let aux = persona.domicilio==="San Bernardo"
            let persona_aux = persona;
            persona_aux.domicilio = aux;
            persona_aux.permitido = aux;

            
            axios.get(ruta+'/personas?dni='+persona.dni)
            .then(response => {
                if(response.data.length === 0){
                    axios.post(ruta+'/personas', persona_aux)
                    .then(response => {
                        console.log(response.data);

                        let turno_aux = turno;
                        turno_aux.persona = response.data.id;
                        
                        axios.post(ruta+'/turnos', turno_aux)
                        .then(response => {
                            console.log("Turno realizado correctamente")
                            limpiarVariables()
                            setdisponibles(disponibles-1)
                        }).catch(error => {
                            console.log(error.response)
                        });

                    }).catch(error => {
                        console.log(error.response)
                    });
                }else{
                    let turno_aux = turno;
                    turno_aux.persona = response.data[0].id;

                    let posicion = response.data[0].turnos.length -1
                    let ultTurno = new Date(response.data[0].turnos[posicion].fecha+" 00:00:00");
                    let dosDiasDesp = Date.parse(ultTurno) + 1000*60*60*48 //48 horas a milisegundos

                    if (dosDiasDesp>Date.now() && response.data[0].turnos.length!==0){
                        if (ultTurno<Date.now()){
                            //Usted tiene un turno activo para la fecha XX:XX:XX
                        }else{
                            //Debe esperar XXXXXX tiempo antes de poder volver a realizar una reserva
                        }
                    }else{
                        axios.post(ruta+'/turnos', turno_aux)
                        .then(response => {
                            console.log("Turno realizado correctamente")
                            limpiarVariables()
                            setdisponibles(disponibles-1)
                        }).catch(error => {
                            console.log(error.response)
                        });
                    }
                }
            }).catch(error => {
                console.log(error.response)
            });
        }
    }

    function seleccionarFecha(e){
        setturno({...turno, fecha: e.target.value})
        setesperaDisponible(true)
        axios.get(ruta+'/turnos/count?fecha='+e.target.value)
        .then(response => {
            console.log(response.data);
            setdisponibles(100-response.data)
            setesperaDisponible(false)
        }).catch(error => {
            console.log(error.response)
        });
    }
    
    function x(e){
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            this.setState({value: e.target.value})
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
                                    Turnos de pileta
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
                                    <InputLabel id="demo-simple-select-label" style={{margin:"7px 10px"}}>Domicilio</InputLabel>
                                    <Select
                                        value={persona.domicilio}
                                        name="domicilio"
                                        onChange={modificarInput}
                                        
                                        id="domicilio"
                                        variant="filled"
                                        required
                                    >
                                        <MenuItem value="San Bernardo">San Bernardo</MenuItem>
                                        <MenuItem value="Soy turista">Soy turista</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>}

                            <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                                <input
                                className={classes.inputAncho}
                                onChange={seleccionarFecha}
                                id="date"
                                type="date"
                                required
                                value={turno.fecha}
                                style={{boxSizing: "border-box", padding:"0px 10px",background:"rgba(0,0,0,.1)", borderRadius:"5px",border:"none"}}/>
                            </Grid>

                            <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                                {esperaDisponible && <LinearProgress/>}
                                <Typography color="secondary"> {disponibles===-1?"":`${disponibles} lugares disponibles`} </Typography>
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

                            <br/>
                            <Typography variant="h4" component="h4" align="center">
                                Declaracion Jurada de Síntomas de COVID-19
                            </Typography>                                

                            <Grid item sm={12}>
                                <img src="sintomas.jpg" width="100%"></img>
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
                            
                            <Grid item xs={6} align="center">
                                <Button className={classes.botones} onClick={()=>{setsiguiente(false)}} size="large" variant="contained" color="secondary">Atras</Button>
                            </Grid>
                            
                            <Grid item xs={6} align="center">
                                <Button className={classes.botones} disabled={cargando || disponibles===0} type="submit" size="large" variant="contained" color="primary">Solicitar</Button>
                            </Grid>
                        </Grid>
                        {abrirConfirmacion && <Alerta funcionAceptar={solicitarTurno} persona={persona} turno={turno}/>}
                    </FormControl>
                </form>
                {alertaDNI && <Alert variant="filled" severity="error">
                    El DNI ya se encuentra en uso, seleccione "Ya he realizado una reserva alguna vez" para continuar con la reserva.
                </Alert>}
            </Paper>
        </div>
    )
}