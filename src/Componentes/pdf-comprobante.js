
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { PDFDownloadLink, Page, Font, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';
Font.register({ family: 'Akaya Telivigala', src: 'https://fonts.googleapis.com/css2?family=Akaya+Telivigala&display=swap'});

const styles = StyleSheet.create({
  container:{
    width: "100%"
  },
  subtitulo: {
    padding: 10,
    width: 10,
    fontSize: 20,
  },
  leyenda: {
    fontSize: 18,
    fontWeight: 'ultrabold',
    padding: 12,
    textAlign: 'justify',
  },
  sub: {
    padding: 8,
    fontSize: 18,
  },
  datos: {
    fontSize: 15,
  },
  turno:{
      border: "solid thin red",
      backgroundColor: "lightblue",
      margin: "10px"
  },
  persona:{
      border: "solid 1px red",
      backgroundColor: "lightgreen",
      margin: "10px"
  }
});

function cero(num){
  if(num < 10)
    num = "0"+num
  return num
}

function fechaEmision(){
  let fecha = new Date();
  let mes = cero(fecha.getMonth() + 1)
  let dia = cero(fecha.getDate())
  let min = cero(fecha.getMinutes())
  let seg = cero(fecha.getSeconds())
  let hora = cero(fecha.getHours())
  
  let fecha_ = dia+"/"+mes+"/"+fecha.getFullYear()+" "+hora+":"+min+":"+seg
  return fecha_
}

function Comprobante({modalDatos}){
  let fecha = fechaEmision()
  return(
    <Document>
    <Page size="A4">
      <View>
        <Image src="municipalidad_logo.png" style={{width:"150", padding:"5",margin:"auto"}}></Image>
        <Text style={{margin:"auto",fontSize: 25}}>Complejo Recreativo</Text>
        
        <Text style={styles.subtitulo}>Comprobante de turno</Text>
        <View style={styles.turno}>
          <Text style={styles.sub}>Fecha de emisión del comprobante: <Text style={styles.datos}>{fecha}</Text></Text>
          <Text style={styles.sub}>N° de turno: <Text style={styles.datos}>#{`${modalDatos.id}`}</Text></Text>
          <Text style={styles.sub}>Fecha: <Text style={styles.datos}>{`${modalDatos.fecha}`}</Text></Text>
          <Text style={styles.sub}>Área: <Text style={styles.datos}>{modalDatos.area===0?"Pileta":modalDatos.area===1?"Camping":"Camping y pileta"}</Text></Text>
        </View>

        <View style={styles.persona}>
            <Text style={{fontSize: 18, padding: 5}}>Datos del solicitante: </Text>
            <Text style={styles.sub}>Nombre y apellido: <Text style={styles.datos}>{`${modalDatos.persona.nombre} ${modalDatos.persona.apellido}`}</Text></Text>
            <Text style={styles.sub}>DNI: <Text style={styles.datos}>{modalDatos.persona.dni}</Text></Text>
            <Text style={styles.sub}>Teléfono: <Text style={styles.datos}>{modalDatos.persona.telefono!==""?modalDatos.persona.telefono:"N/A"}</Text></Text>
            <Text style={styles.sub}>
              {modalDatos.persona.domicilio===true?"Situación: ":(modalDatos.persona.domicilio===false?"Localidad: ":"Localidad: ")}
              <Text style={styles.datos}>{modalDatos.persona.domicilio===true?"Soy turista":(modalDatos.persona.domicilio===false?"San Bernardo":modalDatos.persona.domicilio_alojado)}</Text>
            </Text>
            {
                modalDatos.persona.dni_alojado!=="" && 
                <>
                    <Text style={{fontSize: 18, padding: 5}}>Datos de la persona con la que se aloja: </Text>
                    <Text style={styles.sub}>Nombre y apellido: <Text style={styles.datos}>{`${modalDatos.persona.nombre_alojado} ${modalDatos.persona.apellido_alojado}`}</Text></Text>
                    <Text style={styles.sub}>DNI: <Text style={styles.datos}>{modalDatos.persona.dni_alojado}</Text></Text>
                    <Text style={styles.sub}>Domicilio: <Text style={styles.datos}>{modalDatos.persona.domicilio_alojado}</Text></Text>               
                </>
            }
        </View>
        <Text style={styles.leyenda}>Compruebe que los datos sean correctos. Si sus datos aquí expuestos difieren con los de su documento, NO SE LE PERMITIRÁ EL INGRESO AL COMPLEJO. Para modificar algún campo, comuníquese al correo complejodeportivosb@gmail.com</Text>
        {modalDatos.persona.dni_alojado==="" && <Image src="footer_comprobante.png" style={{height:"100", padding:"5",margin:"auto"}}></Image>}
      </View>
    </Page>
  </Document>
  )
}

function LinkDescarga({modalDatos}){
    return(
        <div>
            <PDFDownloadLink document={<Comprobante modalDatos={modalDatos}/>} fileName={`comprobante-${modalDatos.id}.pdf`}>
            {({ blob, url, loading, error }) => (loading ? 'Cargando...' : 'Descargar comprobante')}
            </PDFDownloadLink>
        </div>
    )
}

export default function ModalComprobante({modalDatos, setmodalDatos}) {
    const [open, setOpen] = React.useState(false);
  
    React.useEffect(()=>{
        if(modalDatos!==null){
            setTimeout(function(){ 
                console.log(modalDatos)
                setOpen(true)
             }, 1000);
        }
    },[modalDatos])

    const handleClose = () => {
        setOpen(false);
        setmodalDatos(null)
    };
  
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
          <DialogContent>
            {open && <LinkDescarga modalDatos={modalDatos}/>}

            <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending anonymous location data to
              Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }