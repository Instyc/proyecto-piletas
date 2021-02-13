import React,{useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from "react-router-dom";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Paper, Grid } from '@material-ui/core';
import Cargando from '@material-ui/core/LinearProgress';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Estilos from '../Estilos.js';

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

  return (
    <React.Fragment>
      <StyledTableRow className={classes.root}>
        <StyledTableCell align="left" component="th" scope="row" onClick={() => setOpen(!open)}>
          <IconButton aria-label="expand row" size="small" >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {Turno.nombre_equipo}
        </StyledTableCell>
        <StyledTableCell align="center">{Turno.tipo===0?"Fútbol":(Turno.tipo===1?"Voley":"Básquet")}</StyledTableCell>
        <StyledTableCell align="center">{Turno.horario===0?"De 20 a 21 hs":(Turno.horario===1?"De 21 a 22 hs":"De 22 a 23 hs")}</StyledTableCell>

      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
                {Turno.personas.map((persona,i) => (
                    <Grid key={i} container>
                        <Grid item lg={6} md={6} sm={12} xs={12} align="center">
                            <Typography variant="subtitle1" gutterBottom component="div">
                                Apellido y nombre: {`${persona.apellido} ${persona.nombre}`}
                            </Typography>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12} align="center">
                            <Typography variant="subtitle1" gutterBottom component="div">
                                DNI: {persona.dni}
                            </Typography>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12} align="center">
                            <Typography variant="subtitle1" gutterBottom component="div">
                                Teléfono: {persona.telefono!==""?persona.telefono:"N/A"}
                            </Typography>
                        </Grid>
                        {persona.domicilio &&
                            <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                                <Typography variant="subtitle1" gutterBottom component="div">
                                Datos de la persona con la que se aloja:
                                </Typography>
                            </Grid>}
                        {persona.domicilio &&
                            <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                                <Typography variant="subtitle1" gutterBottom component="div">
                                DNI: {persona.dni_alojado}
                                </Typography>
                            </Grid>}
                        {persona.domicilio &&
                            <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                                <Typography variant="subtitle1" gutterBottom component="div">
                                Apellido y Nombre: {`${persona.apellido_alojado} ${persona.nombre_alojado}`}
                                </Typography>
                            </Grid>}
                        {persona.domicilio &&
                            <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                                <Typography variant="subtitle1" gutterBottom component="div">
                                Domicilio: {persona.domicilio_alojado}
                                </Typography>
                            </Grid>}
                        <Grid item lg={12} md={12} sm={12} xs={12} align="center">
                            <hr/>
                        </Grid>
                    </Grid>
                ))}
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
  const [deportes, setdeportes] = useState([]);
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
      axios.get(ruta+'/deportes?fecha='+date_.getFullYear()+"-"+mes+"-"+dia,
      {headers: {'Authorization': auth_init}})
      .then(response => {
          setdeportes([])
          setdeportes(response.data)
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
        axios.get(ruta+'/deportes?fecha='+e.target.value,
        {headers: {'Authorization': auth}})
        .then(response => {
            setdeportes([])
            setdeportes(response.data)
            if (response.data.length===0)
              setmensaje("No existen reservas para el día seleccionado.")
            setesperaDisponible(false)
        }).catch(error => {
            console.log(error.response)
            setesperaDisponible(false)
        });
    }else{
        setdeportes([])
        setmensaje("Los días lunes no se pueden realizar reservas.")
        setesperaDisponible(false)
    }
  }

  return (
    <div className={classes.fondo2} style={{margin:"auto"}}>
      <Paper elevation={3} style={{width:"100%",margin:"10px auto",padding: "20px", background:"lightblue"}} className="Fondo">
        <Typography variant="h3" component="h1" align="center">
            Administrar turnos de canchas deportivas
        </Typography>
        <Grid container>
          <Grid item lg={3} md={3} sm={4} xs={4} align="left">
            <Typography variant="subtitle1" gutterBottom component="div">
              Seleccione una fecha:
            </Typography>
          </Grid>
          <Grid item lg={9} md={9} sm={8} xs={8} align="right">
            <Link to={"/listar/"} style={{textDecoration:"none", padding: 0, color:"black"}}>
              <Button align="right" color="primary" style={{marginLeft: "auto"}}>
                Listado de turnos de pileta
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
        {mensaje===""?(<TableContainer component={Paper} style={{maxWidth:"1000px",margin:"10px auto", background:"rgba(0,0,0,0)"}}>

          <Table aria-label="collapsible table" style={{background:"rgba(0,0,0,.1)"}}>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="left">Nombre del Equipo</StyledTableCell>
                <StyledTableCell align="center">Deporte</StyledTableCell>
                <StyledTableCell align="center">Horario</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {deportes.map((turno,i) => (
                <Row key={i} turno={turno} ruta={ruta} usuario={usuario}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>):(<Typography variant="h4"><br/>{mensaje}</Typography>)}
      </Paper>
    </div>
   
  );
}