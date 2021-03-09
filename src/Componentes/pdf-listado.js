
import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography} from '@material-ui/core';

import { PDFDownloadLink, Page, Font, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';
import {Table, TableBody, TableCell, TableHeader, DataTableCell} from '@david.kucsai/react-pdf-table'
Font.register({ family: 'Akaya Telivigala', src: 'https://fonts.googleapis.com/css2?family=Akaya+Telivigala&display=swap'});

const styles = StyleSheet.create({
  page: {
    padding: 25,
  },
  leyenda: {
    fontSize: 18,
    fontWeight: 'ultrabold',
    padding: 12,
    textAlign: 'justify',
  },
  sub: {
    fontSize: 18,
    padding: 10,
  },
  turista: {
    fontSize: 15,
    padding: 20,
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

function Comprobante({turnos, fecha}){
    let fecha_emision = fechaEmision()
  return(
    <Document>
        <Page size="A4" style={styles.page}>
            <View>
                <Image src="municipalidad_logo.png" style={{width:"150", padding:"5",margin:"auto"}}></Image>
                <Text style={{margin:"auto",fontSize: 25}}>Complejo Recreativo</Text>
                <Text style={styles.sub}>Turnos para la fecha {fecha}</Text>
                <Text style={styles.sub}>Fecha de emisión del listado: {fecha_emision}</Text>
                <Table
                    data={turnos}
                >
                    <TableHeader>
                        <TableCell style={{padding: 3, textAlign:"center"}}>
                            Apellido y Nombre
                        </TableCell>
                        <TableCell style={{padding: 3, textAlign:"center"}} textAlign="center">
                            DNI
                        </TableCell>
                        <TableCell style={{padding: 3, textAlign:"center"}} textAlign="center">
                            Nº turno
                        </TableCell>
                        <TableCell style={{padding: 3, textAlign:"center"}} textAlign="center">
                            Área
                        </TableCell>
                        <TableCell style={{padding: 3, textAlign:"center"}} textAlign="center">
                            Domicilio
                        </TableCell>
                    </TableHeader>
                    <TableBody>
                        <DataTableCell style={{padding: 5}} getContent={(r) => r.persona.apellido+" "+r.persona.nombre}/>
                        <DataTableCell style={{padding: 5, textAlign:"center"}} getContent={(r) => r.persona.dni}/>
                        <DataTableCell style={{padding: 5, textAlign:"center"}} getContent={(r) => r.id}/>
                        <DataTableCell style={{padding: 5, textAlign:"center"}} getContent={(r) =>
                            r.area===0?"Pileta":r.area===1?"Camping":"Ambos"
                        }/>
                        <DataTableCell style={{padding: 5, textAlign:"center"}} getContent={(r) =>
                            r.persona.domicilio===true?"Soy turista":(r.persona.domicilio===false?"San Bernardo":r.persona.domicilio_alojado)
                        }/>
                    </TableBody>
                </Table>
                
                <Text style={styles.turista}>Datos de los turistas</Text>
                <Table
                    data={turnos.filter(turno => turno.persona.domicilio === true)}
                >
                    <TableHeader>
                        <TableCell style={{padding: 3, textAlign:"center"}} textAlign="center">
                            DNI (solicitante)
                        </TableCell>
                        <TableCell style={{padding: 3, textAlign:"center"}} textAlign="center">
                            Apellido y nombre (alojado)
                        </TableCell>
                        <TableCell style={{padding: 3, textAlign:"center"}} textAlign="center">
                            DNI (alojado)
                        </TableCell>
                        <TableCell style={{padding: 3, textAlign:"center"}} textAlign="center">
                            Domicilio (alojado)
                        </TableCell>
                    </TableHeader>
                    <TableBody>
                        <DataTableCell style={{padding: 5}} getContent={(r) => r.persona.dni}/>
                        <DataTableCell style={{padding: 5}} getContent={(r) => r.persona.apellido_alojado+" "+r.persona.nombre_alojado}/>
                        <DataTableCell style={{padding: 5}} getContent={(r) => r.persona.dni_alojado}/>
                        <DataTableCell style={{padding: 5, textAlign:"center"}} getContent={(r) => r.persona.domicilio_alojado}/>
                    </TableBody>
                </Table>
            </View>
        </Page>
    </Document>
  )
}

export default function LinkDescarga({turnos, fecha}){
    const [listo, setlisto] = React.useState(false);

    useEffect(()=>{
        if(turnos.length!==0){
            setTimeout(function(){ 
                setlisto(true)
             }, 1000);
             console.log(turnos)
        }
    },[turnos])

    return(
        listo && <div>
            <Button>
                <PDFDownloadLink document={<Comprobante turnos={turnos} fecha={fecha}/>} fileName={`listado_${fecha}.pdf`}>
                {({ blob, url, loading, error }) => (loading ? 'Cargando...' : 'Descargar listado')}
                </PDFDownloadLink>
            </Button>
        </div>
    )
}
