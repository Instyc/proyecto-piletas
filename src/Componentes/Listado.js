import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Paper, Grid } from '@material-ui/core';
import Cargando from '@material-ui/core/LinearProgress';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Estilos from '../Estilos.js';
import {Check as Si, Close as No} from '@material-ui/icons/';

const useRowStyles = makeStyles({
  root: {    '& > *': {
      borderBottom: 'unset',
      padding:"5px",
    },
  },
});

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

function Row({turno, ruta, usuario}) {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  const [Turno, setTurno] = useState(turno);
  const [juramento_dias, setjuramento_dias] = useState(false);

  useEffect(()=>{
    let fecha = new Date(turno.fecha+" 23:59:59")
    let fecha_turno = new Date(turno.created_at);
    let dias = parseInt((fecha - fecha_turno)/1000/60/60/24);
    
    setjuramento_dias(dias>2)
  },[])

  let auth = 'Bearer '+usuario.jwt;

  function asignarAsistencia(){
    let asis = !Turno.asistencia;
    axios.put(ruta+'/turnos/'+Turno.id,{
      asistencia: asis
    },{headers: {'Authorization': auth}})
    .then(response => {
      setTurno({
        ...Turno,
        asistencia: !Turno.asistencia
      })
    }).catch(error => {
      console.log(error.response)
    });
  }

  function asignarDeclaracion(){
    let dec = !Turno.declarado;
    axios.put(ruta+'/turnos/'+Turno.id,{
      declarado: dec
    },{headers: {'Authorization': auth}})
    .then(response => {
      setTurno({
        ...Turno,
        declarado: !Turno.declarado
      })
    }).catch(error => {
      console.log(error.response)
    });
  }

  return (
    <React.Fragment>
      <StyledTableRow className={classes.root}>
        <StyledTableCell align="left" component="th" scope="row" onClick={() => setOpen(!open)}>
          <IconButton aria-label="expand row" size="small" >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {`${Turno.persona.apellido} ${Turno.persona.nombre}`}
        </StyledTableCell>
        <StyledTableCell align="center">{Turno.persona.dni}</StyledTableCell>
        <StyledTableCell align="center">
          <Button size="small" variant="contained" style={{margin:"5px",}} color={Turno.asistencia?"primary":"secondary"} onClick={asignarAsistencia}>{Turno.asistencia?"Si":"No"}</Button>
          {juramento_dias && <Button size="small" variant="contained" color={Turno.declarado?"primary":"secondary"} onClick={asignarDeclaracion}>{Turno.declarado?<Si/>:<No/>}</Button>}
        </StyledTableCell>

      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Grid container>
                <Grid item lg={3} md={3} sm={12} xs={12} align="center">
                  <Typography variant="subtitle1" gutterBottom component="div">
                    Teléfono: {Turno.persona.telefono!==""?Turno.persona.telefono:"N/A"}
                  </Typography>
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12} align="center">
                  <Typography variant="subtitle1" gutterBottom component="div">
                    {Turno.persona.domicilio?" Situación: Turista":" Localidad: San Bernardo"}
                  </Typography>
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12} align="center">
                  <Typography variant="subtitle1" gutterBottom component="div">
                    Área: {Turno.area===0?"Pileta":Turno.area===1?"Camping":"Pileta y camping"}
                  </Typography>
                </Grid>
                <Grid item lg={3} md={3} sm={12} xs={12} align="center">
                  <Typography variant="subtitle1" gutterBottom component="div">
                    Fecha de solicitud: {}{Turno.created_at.split("T")[0]}
                  </Typography>
                </Grid>
              </Grid>
              {
                Turno.persona.domicilio &&
                <Grid container>
                  <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <hr/>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                    <Typography variant="subtitle1" gutterBottom component="div">
                      Datos de la persona con la que se aloja:
                    </Typography>
                  </Grid>
                  <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                    <Typography variant="subtitle1" gutterBottom component="div">
                      DNI: {Turno.persona.dni_alojado}
                    </Typography>
                  </Grid>
                  <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                    <Typography variant="subtitle1" gutterBottom component="div">
                      Apellido y Nombre: {`${Turno.persona.apellido_alojado} ${Turno.persona.nombre_alojado}`}
                    </Typography>
                  </Grid>
                  <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                    <Typography variant="subtitle1" gutterBottom component="div">
                      Domicilio: {Turno.persona.domicilio_alojado}
                    </Typography>
                  </Grid>
                </Grid>
              }
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}


export default function Listado({ruta,usuario}) {
  const classes = Estilos();
  const [fechaHoy, setfechaHoy] = useState("");
  const [mensaje, setmensaje] = useState("");
  const [esperaDisponible, setesperaDisponible] = useState(false);
  const [turnos, setturnos] = useState([]);
  const [auth, setauth] = useState('Bearer '+usuario.jwt);
  
  useEffect(()=>{
    if(usuario.jwt!==""){
      let auth_init = 'Bearer '+usuario.jwt;
      let date_ = new Date();
      let mes = date_.getMonth() + 1
      if(mes < 10)
          mes = "0"+mes
      let dia = date_.getDate()
      if(dia < 10)
          dia = "0"+dia
      
      setfechaHoy(date_.getFullYear()+"-"+mes+"-"+dia)
      
      setesperaDisponible(true)
      axios.get(ruta+'/turnos?fecha='+date_.getFullYear()+"-"+mes+"-"+dia,
      {headers: {'Authorization': auth_init}})
      .then(response => {
        let turnos_ordenados = response.data;
        // array temporal contiene objetos con posición y valor de ordenamiento
        var arregloAux = turnos_ordenados.map(function(arreglo,i) {
          return { index: i, value: arreglo.persona.apellido.toLowerCase() };
        })
        // ordenando el array mapeado que contiene los valores reducidos
        arregloAux.sort(function(a, b) {
          if (a.value > b.value) {
            return 1;
          }
          if (a.value < b.value) {
            return -1;
          }
          return 0;
        });
        // contenedor para el orden resultante
        var resultado = arregloAux.map(function(arreglo){
          return turnos_ordenados[arreglo.index];
        });
        
        setturnos(resultado)
        setesperaDisponible(false)
      }).catch(error => {
        console.log(error.response)
        setesperaDisponible(false)
      });
    }
  },[usuario])

  function seleccionarFecha(e){
    setesperaDisponible(true)
    setfechaHoy(e.target.value)
    if (mensaje!=="")
      setmensaje("")
    let _fecha = new Date(e.target.value)
    if (_fecha.getUTCDay()!==1){
        axios.get(ruta+'/turnos?fecha='+e.target.value,
        {headers: {'Authorization': auth}})
        .then(response => {
            setturnos([])
            let turnos_ordenados = response.data;
            // array temporal contiene objetos con posición y valor de ordenamiento
            var arregloAux = turnos_ordenados.map(function(arreglo, i) {
              return { index: i, value: arreglo.persona.apellido.toLowerCase() };
            })
            // ordenando el array mapeado que contiene los valores reducidos
            arregloAux.sort(function(a, b) {
              if (a.value > b.value) {
                return 1;
              }
              if (a.value < b.value) {
                return -1;
              }
              return 0;
            });
            // contenedor para el orden resultante
            var resultado = arregloAux.map(function(arreglo){
              return turnos_ordenados[arreglo.index];
            });
            setturnos(resultado)
            if (response.data.length===0)
              setmensaje("No existen reservas para el día seleccionado.")
            setesperaDisponible(false)
        }).catch(error => {
            console.log(error.response)
            setesperaDisponible(false)
        });
    }else{
        setturnos([])
        setmensaje("Los días lunes no se pueden realizar reservas.")
        setesperaDisponible(false)
    }
  }

  return (
    <div className={classes.fondo2} style={{margin:"auto"}}>
      <Paper elevation={3} style={{width:"100%",margin:"10px auto",padding: "20px", background:"lightblue"}} className="Fondo">
        <Typography variant="h3" component="h1" align="center">
            Administrar turnos
        </Typography>
        <Grid container>
          <Grid item lg={3} md={3} sm={4} xs={4} align="left">
            <Typography variant="subtitle1" gutterBottom component="div">
              Seleccione una fecha:
            </Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={8} align="right">
            <Link to={"/listarDeporte"} style={{textDecoration:"none", padding: 0, color:"black"}}>
              <Button align="right" color="primary" style={{marginLeft: "auto"}}>
                Listado de reservas deportivas
              </Button>
            </Link>
          </Grid>
        </Grid>
        <input
        className={classes.inputAncho}
        id="date"
        type="date"
        value={fechaHoy}
        onChange={seleccionarFecha}
        style={{boxSizing: "border-box", padding:"0px 15px", fontSize:"15px", background:"rgba(0,0,0,.1)", borderRadius:"5px",border:"none"}}/>

        {esperaDisponible && <Cargando color="secondary"/>}
        {turnos.length!==0?(<TableContainer component={Paper} style={{maxWidth:"1000px",margin:"10px auto", background:"rgba(0,0,0,0)"}}>
          <Typography align="justify" style={{fontWeight:"bold", padding:"10px"}}>
            Declaración Jurada de Síntomas de COVID-19 para personas que hayan solicitado un turno hace más de 72 horas: presione en "X" en el caso de que la persona en cuestión haya renovado su declaración jurada y asegure no poseer síntomas de COVID-19 al momento de asistir al complejo.
          </Typography>

          <Table aria-label="collapsible table" style={{background:"rgba(0,0,0,.1)"}}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="left">Apellido y nombre</StyledTableCell>
                <StyledTableCell align="center">DNI</StyledTableCell>
                <StyledTableCell align="center">Asistencia/*Juramento*</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {turnos.map((turno,i) => (
                <Row key={i} turno={turno} ruta={ruta} usuario={usuario}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>):(<Typography variant="h4"><br/>No hay turnos para el día seleccionado.</Typography>)}
      </Paper>
    </div>
   
  );
}
