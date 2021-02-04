import React,{useState, useEffect} from 'react';
import axios from 'axios';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Paper, Grid } from '@material-ui/core';
import Cargando from '@material-ui/core/LinearProgress';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Estilos from '../Estilos.js';

const useRowStyles = makeStyles({
  root: {    '& > *': {
      borderBottom: 'unset',
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
      console.log(response.data)
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
          {`${Turno.persona.apellido} ${Turno.persona.nombre}`}
        </StyledTableCell>
        <StyledTableCell align="center">{Turno.persona.dni}</StyledTableCell>
        <StyledTableCell align="center">
          <Button size="small" variant="contained" color={Turno.asistencia?"primary":"secondary"} onClick={asignarAsistencia}>{Turno.asistencia?"SI":"NO"}</Button>
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Grid container>
                <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                  <Typography variant="h6" gutterBottom component="div">
                    Teléfono: {Turno.persona.telefono!==""?Turno.persona.telefono:"N/A"}
                  </Typography>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                  <Typography variant="h6" gutterBottom component="div">
                    {Turno.persona.domicilio?" Localidad: San Bernardo":" Situación: Turista"}
                  </Typography>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} align="center">
                  <Typography variant="h6" gutterBottom component="div">
                    Área: {Turno.persona.area===0?"Pileta":Turno.persona.area===1?"Camping":"Pileta y camping"}
                  </Typography>
                </Grid>
              </Grid>
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

  useEffect(()=>{
    let date_ = new Date();
    let mes = date_.getMonth() + 1
    if(mes < 10)
        mes = "0"+mes
    let dia = date_.getDay()
    if(dia < 10)
        dia = "0"+dia
    
    setfechaHoy(date_.getFullYear()+"-"+mes+"-"+dia)

    setesperaDisponible(true)
    axios.get(ruta+'/turnos?fecha='+date_.getFullYear()+"-"+mes+"-"+dia)
    .then(response => {
        setturnos(response.data)
        setesperaDisponible(false)
    }).catch(error => {
        console.log(error.response)
    });
  },[])

  function seleccionarFecha(e){
    setesperaDisponible(true)
    setfechaHoy(e.target.value)
    if (mensaje!=="")
      setmensaje("")
    let _fecha = new Date(e.target.value)
    if (_fecha.getUTCDay()!==1){
        axios.get(ruta+'/turnos?fecha='+e.target.value)
        .then(response => {
            console.log(response.data);
            setturnos([])
            setturnos(response.data)
            if (response.data.length===0)
              setmensaje("No existen reservas para el día seleccionado.")
            setesperaDisponible(false)
        }).catch(error => {
            console.log(error.response)
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
        <Typography align="left">
            Seleccione una fecha:
        </Typography>
        <input
        className={classes.inputAncho}
        id="date"
        type="date"
        value={fechaHoy}
        onChange={seleccionarFecha}
        style={{boxSizing: "border-box", padding:"0px 15px", fontSize:"15px", background:"rgba(0,0,0,.1)", borderRadius:"5px",border:"none"}}/>

        {esperaDisponible && <Cargando color="secondary"/>}
        {mensaje===""?(<TableContainer component={Paper} style={{maxWidth:"1000px",margin:"10px auto"}}>
          <Table aria-label="collapsible table">
            <TableHead>
              <StyledTableRow>
                <StyledTableCell align="left">Apellido y nombre</StyledTableCell>
                <StyledTableCell align="center">DNI</StyledTableCell>
                <StyledTableCell align="center">Asistencia</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {turnos.map((turno,i) => (
                <Row key={i} turno={turno} ruta={ruta} usuario={usuario}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>):(<Typography variant="h4"><br/>{mensaje}</Typography>)}
      </Paper>
    </div>
   
  );
}