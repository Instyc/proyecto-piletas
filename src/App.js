import logo from './logo.svg';
import './App.css';
import {AppBar, Toolbar, Typography, Grid} from '@material-ui/core';
import Formulario from './Componentes/formulario'
import Listado from './Componentes/listado'
import Estilos from './Estilos'
function App() {
  const classes = Estilos();
  const ruta = "https://piletas-sb.herokuapp.com";
  return (
    <div className="App" style={{height: "auto"}}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <img src="munilogo.png" width="76px"></img>
          <Typography variant="h6" style={{cursor:"default"}}>
            Complejo de piletas
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="Inicio">
        <Formulario ruta={ruta}/>
      </div>

      <AppBar  color="secondary" position="relative" bottom="0px" style={{zIndex: 0}}>   
          <Toolbar>
            <Grid container direction="row" alignItems="center" justify="center">
              <Grid item xs={2} sm={2} md={2} lg={2} align="right">
                <img src="logo192.png" width="50px"></img>
              </Grid>
              <Grid item xs={10} sm={6} md={6} lg={6} align="left">
                  <Typography variant="h6">
                    Municipalidad de San Bernardo
                  </Typography>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4} align="center">
                  <Typography>
                    Ante problemas contactar a:
                  </Typography>
                  <a href="#" target="_blank" className={classes.EstiloLink}>a@a.a</a>
              </Grid>
            </Grid>
          </Toolbar>
      </AppBar>
    </div>

  );
}

export default App;
