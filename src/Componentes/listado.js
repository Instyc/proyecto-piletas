import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
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

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      { date: '2020-01-05', customerId: '11091700', amount: 3 },
      { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <StyledTableRow className={classes.root} onClick={() => setOpen(!open)}>
        <StyledTableCell align="left" component="th" scope="row">
          <IconButton aria-label="expand row" size="small" >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
          {row.name}
        </StyledTableCell>
        <StyledTableCell align="center">{row.calories}</StyledTableCell>
        <StyledTableCell align="center">
          <Button size="small" variant="contained" color="secondary">NO</Button>
        </StyledTableCell>
      </StyledTableRow>
      <StyledTableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Número de celular: 36655565
              </Typography>
              <Typography variant="h6" gutterBottom component="div">
                Localidad: Samber
              </Typography>
              <Typography variant="h6" gutterBottom component="div">
                Área reservada: Ambos
              </Typography>
            </Box>
          </Collapse>
        </StyledTableCell>
      </StyledTableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    calories: PropTypes.number.isRequired,
    carbs: PropTypes.number.isRequired,
    fat: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        customerId: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
    ).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    protein: PropTypes.number.isRequired,
  }).isRequired,
};

const rows = [
  createData('Frozen yoghurt', 42171487, 6.0, 24, 4.0, 3.99),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
  createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
  createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
  createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
];

export default function CollapsibleTable() {
  const classes = Estilos();
  return (
    <div style={{margin:"10px"}}>
      <Paper elevation={3} style={{maxWidth:"1000px",margin:"auto",padding: "20px", background:"LightSkyBlue"}} className="Fondo">
        <Typography variant="h3" component="h1" align="center">
            Administrar turnos
        </Typography>
        <Typography align="left">
            Seleccione una fecha:
        </Typography>
        <input className={classes.inputAncho} id="date" type="date" style={{boxSizing: "border-box", padding:"15px", fontSize:"15px", background:"rgba(0,0,0,.1)", borderRadius:"5px",border:"none"}}/>

        <TableContainer component={Paper} style={{maxWidth:"1000px",margin:"10px auto"}}>
        <Table aria-label="collapsible table">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell align="left">Apellido y nombre</StyledTableCell>
              <StyledTableCell align="center">DNI</StyledTableCell>
              <StyledTableCell align="center">Asistencia</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Row key={row.name} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    </div>
   
  );
}

/*import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Estilos from '../Estilos.js';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "orangered",
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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const useStyles = makeStyles({
  table: {
    minWidth: "400px",
  },
});

export default function CustomizedTables() {
  const classes2 = Estilos();

  return (
    <TableContainer component={Paper}>
      <Table >
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Apellido y Nombre</StyledTableCell>
            <StyledTableCell align="center">DNI</StyledTableCell>
            <StyledTableCell align="center">Número de celular</StyledTableCell>
            <StyledTableCell align="center">Localidad</StyledTableCell>
            <StyledTableCell align="center">Área reservada</StyledTableCell>
            <StyledTableCell align="center">Asistencia</StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row) => (
            <StyledTableRow  key={row.name}>
                <StyledTableCell align="center" component="th" scope="row">
                {row.name}
                </StyledTableCell>
                <StyledTableCell align="center">1</StyledTableCell>
                <StyledTableCell align="center">3</StyledTableCell>
                <StyledTableCell align="center">4</StyledTableCell>
                <StyledTableCell align="center">5</StyledTableCell>
                <StyledTableCell align="center">
                <Button size="large" variant="contained" color="secondary">No asistió</Button>
            </StyledTableCell>
        </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
*/