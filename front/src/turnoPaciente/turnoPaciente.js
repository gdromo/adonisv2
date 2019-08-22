import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';


/*import MenuIcon from '@material-ui/icons/Menu';*/
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

import MaterialTable from 'material-table';

import axios from 'axios';
import { urlRest } from '../datos/Config';
import * as moment from 'moment';

var token = '';

class TurnoPaciente extends Component {
  

  constructor() {
    super();
    this.state = {
    paciente: null,
    UsuarioLogueado:null,
    turnos:[],
    turnoBorrar:{
      fecha:null,
      hora:null,
    },
    ventanaModal:false,
    msjTurnoConfirmado:false,
    msjTurnoConfirmadoMsj: '',
    loading:true,
      };

    
    
    //this.handleBlur = this.handleBlur.bind(this);
    
  }

  


traerTurnoPacientes (codigo) {
  //console.log('traerTurnoPacientes');
  if (this.paciente !== null) {
    var Turnos = [];
    var config = {
      headers: {'Authorization': `Bearer ${token}`}
    };
    
      //console.log(`${urlRest}Turnos/TurnosPaciente/?paciente=${codigo}`);
      //console.log(config);
      axios.get(`${urlRest}Turnos/TurnosPaciente/?paciente=${codigo}`, config )
        .then(response => {
          //console.log('respuesta');
          //console.log(response);
            if ( response.data.length !== 0 ){
              var i;
              for (i = 0; i < response.data.length; i++) { 
                //response.data[i].nombre;
                  Turnos[i] = {
                    codigo : (response.data[i].codigo !== null)?response.data[i].codigo:'',
                    fecha : (response.data[i].fecha !== null)?moment(response.data[i].fecha).format('DD/MM/YYYY'):'01/02/2010',
                    hora : (response.data[i].hora !== null)?moment(response.data[i].hora).format('HH:MM'):'10:00',
                    prestador: (response.data[i].equipoCod !== 0)?response.data[i].equipoNom:response.data[i].prestadorNom,
                    estudio : (response.data[i].estudioNom !== null)?response.data[i].estudioNom:'',
                    dioTurno : (response.data[i].dioTurno !== null)?response.data[i].dioTurno:'',
                    aCancelar : (response.data[i].aCancelar !== null)?response.data[i].aCancelar:false,
                    mutual : (response.data[i].mutualNom !== null)?response.data[i].mutualNom:'',
                  };
            
                
                }
              
              this.setState({
                turnos:Turnos,
                loading:false,
              });
              
              //console.log(response.data[0].nombre);
        }
        })
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log('Error');
            console.log(e.response);
            this.setState({
              loading:false,
            });
        });
      }  
      
    this.setState({
        loading:false,
      });
  }

  async cancelarTurno () {
    //console.log(`actualizarTurno`);
    //console.log(Paciente);
    let cancelarTurnoEstado = 0;
    let url;

    let respuesta = '';
    
    var config = {
      headers: {'Authorization': `Bearer ${token}`}
    };
    
    url= `${urlRest}Turnos/Cancelar/${this.state.turnoBorrar.codigo}`;

    
      //console.log(`Actualizar`);
      //console.log(`${urlRest}Turnos/DarTurno/${this.state.codTurno.codigo}`);
      

      await axios.put(url, {
        
      }, config)
      .then(function (response) {
        //console.log('response');
        //console.log(response);
        cancelarTurnoEstado = response.status;
        respuesta = response.data;
        
      })
      .catch(function (error) {
        console.log('error');
        console.log(error.response);
      }); 
    
      //this.state.optionEstudio ==="estudio"

    if (cancelarTurnoEstado === 200) {
      //console.log('actualizarTurnoEstado === 200');
      //console.log(respuesta)
      if (respuesta === 'OK') {
        
        this.setState({msjTurnoConfirmadoMsj: 'El turno se Cancelo Correctamente',
                    msjTurnoConfirmado: true,
          });
        this.QuitarTurno(this.state.turnoBorrar.codigo);

      } else {
        this.setState({msjTurnoConfirmadoMsj: respuesta,
                    msjTurnoConfirmado: true,
          });
      }
      
    } else {
      
      this.setState({msjTurnoConfirmadoMsj: 'Error al cancelar Turno vuelve a intentar en un segundo',
                    msjTurnoConfirmado: true,
          });
    }

  }

  valueToState = ({ id, value, checked, type }) => {
    //console.log('valueToState');

    this.setState(() => {
      return { [id]: type === "checkbox" ? checked : value };
    });
  };

  

  imprimir (seleccion) {
    alert("Usted imprime " + seleccion);
  }

  CerrarmsjTurnoConfirmado = () => {
    this.setState({msjTurnoConfirmado: false,
    });
  }

  borrar (seleccion) {
    //console.log('borrar');
    //console.log(seleccion);
    //alert("Usted borra " + seleccion);
    this.setState({ turnoBorrar: seleccion,
                    ventanaModal:true,
    });
  }

  CerrarModal = () => {
    alert("Usted no borra ");
    this.setState({ ventanaModal:false,
    });
  }

  ConfirmarModal = () => {
    //alert("Usted borra ");
    this.setState({ ventanaModal:false,
    });
    this.cancelarTurno();

    
    //console.log('Turno Registrado');
  }

  QuitarTurno = (codTurno) => {
    //console.log('QuitarTurno');
    var TurnosFiltro= this.state.turnos.filter(turno => turno.codigo !== codTurno);
    
    //console.log(TurnosFiltro);
    //console.log(AbuscarTurno);

    this.setState({ turnos: TurnosFiltro,
                  });
    
  };

  componentDidMount() {
    
    //console.log('El componente está disponible en el DOM');
    //console.log('Inicio');
    //console.log(this.props.location.Usuario);
    token = sessionStorage.getItem("AppOfertaTurnoToken");
    if (this.props.location.Usuario !== undefined) {
      //console.log('this.props.location.Usuario');
      this.setState({ UsuarioLogueado: this.props.location.Usuario,
      });
    }
    if (this.props.location.Paciente !== undefined) {
      //console.log('this.props.location.Paciente');
      this.setState({ paciente: this.props.location.Paciente,
      });

      this.traerTurnoPacientes(this.props.location.Paciente.codigo);
    }
    
  }

  //<pre>{JSON.stringify(this.state, null, 2)}</pre>

  
render() {
  //console.log('render paciente');
  return (
    <Grid fluid>
        <Row>
          <Col xs={12} md={12}>
            <Card >
              <CardHeader
                title="Turno del Paciente"
                subheader =
                  {
                    this.state.paciente === null ?
                      "Paciente"
                    :
                      `${this.state.paciente.apellido}, ${this.state.paciente.nombre}`
                  }
              />
              <CardContent>
                { this.state.loading ?
                  <div className="TurnoPacienteLoading">
                    <CircularProgress size={80} className="buttonProgress" />
                  </div>
                :
                  <Row>
                    <Col xs={12} >
                      <div style={{ maxWidth: '100%' }}>
                        <MaterialTable
                          title="Turnos"
                          columns={[
                            { title: 'Fecha', field: 'fecha' },
                            { title: 'Hora', field: 'hora' },
                            { title: 'Mutual', field: 'mutual' },
                            { title: 'Prestador/Equipo', field: 'prestador' },
                            { title: 'Estudio', field: 'estudio' },
                           
                            
                          ]}
                          data={this.state.turnos}   
                          actions={[
                            rowData => ({
                              icon: 'delete',
                              tooltip: 'Cancelar Turno',
                              onClick: (event, rowData) =>this.borrar(rowData),
                              disabled: !rowData.aCancelar
                            })
                          ]}     
                        />
                      </div>
                    </Col>
                    <Col xs={12} md={3}>
                      <Button variant="contained" color="primary" 
                      onClick={() => { this.props.history.push({ pathname: '/paciente', Usuario: this.state.UsuarioLogueado, PacienteDni: this.state.paciente.documentoNro }) }}
                      >
                        Volver
                      </Button> 
                    </Col>
                  </Row>
                }
              </CardContent>
            </Card>
          </Col>
        </Row>
        <Dialog
        open={this.state.ventanaModal}
        onClose={this.CerrarModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Desea Cancelar el Turno?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {
              `Para el dia ${this.state.turnoBorrar.fecha} a la hora ${this.state.turnoBorrar.hora} con ${this.state.turnoBorrar.prestador}.` 
            }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.CerrarModal} color="primary">
              No
            </Button>
            <Button onClick={this.ConfirmarModal} color="primary" autoFocus>
              Si
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog //Turno cancelado confirmacion
        open={this.state.msjTurnoConfirmado}
        onClose={this.CerrarmsjTurnoConfirmado}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" >
            <Row>
              <Col xs={12} md={12}>
                {this.state.msjTurnoConfirmadoMsj}
                <p></p>
              </Col>
            </Row>
            <Row end="xs">
              <Col xs={12} md={12}>
                <Button onClick={this.CerrarmsjTurnoConfirmado} color="primary">
                  OK
                </Button>
              </Col>
            </Row>
          </DialogTitle>
        </Dialog>

    </Grid>
    
  );
}
}


export default TurnoPaciente;