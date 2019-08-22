import React, { Component } from 'react';

import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';


import AutocompletarEstudio from '../autocompletarEstudio/autocompletarEstudio';
import AutocompletarPrestador from '../autocompletarPrestador/autocompletarPrestador';
import AutocompletarEspecialidad from '../autocompletarEspecialidad/autocompletarEspecialidad';
import TurnosHorarios from '../turnoHorarios/turnosHorarios';
import TurnoDias from '../turnoDias/turnoDias';

/*import MenuIcon from '@material-ui/icons/Menu';*/
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import * as moment from 'moment';
import axios from 'axios';
import { urlRest } from '../datos/Config';

class TurnoDetalle extends Component {
  constructor() {
    super();
    this.state = {
      codEstudio: null,
      estudioNombre: '',
      codPrestador: null,
      codEspecialidad: null,
      fechaEstudio: null,
      optionEstudio: "estudio",
      turnoAbuscar: null,
      turnoAbuscarHora: null,
      codTurno:{},
      msjConfirmar: false,
      TurnoConfimado: null,
      fechaSeleccionada: false,
      pacienteLocal:null,
      UsuarioLogueado:null,
      fechasTurnos:[],
      turnosDisponibles:[],
      loading:false,
      msjTurnoConfirmado:false,
      msjTurnoConfirmadoMsj: '',
      mensajeError:{
        open:false,
        msj:'',
      },
      };
    
      this.TraerEstudio = this.TraerEstudio.bind(this);
      this.TraerPrestador = this.TraerPrestador.bind(this);
      this.TraerEspecilidad = this.TraerEspecilidad.bind(this);
      this.validar = this.validar.bind(this);
      
  }

  CerrarmsjConfirmar = () => {
    this.setState({msjConfirmar: false,
                    TurnoConfimado: 'No',
    });
  }

  ConfirmarmsjConfirmar = () => {
    
    this.setState({msjConfirmar: false,
                    TurnoConfimado: 'Si',
                    turnoAbuscar: null,
                     fechaEstudio: null,
    });
    this.actualizarTurno();
    //console.log('Turno Registrado');
  }

  CerrarmsjTurnoConfirmado = () => {
    this.setState({msjTurnoConfirmado: false,
    });
  }
  CerrarmsjError = () => {
    var mensajeError = this.state.mensajeError;
    mensajeError['open'] = false;
    mensajeError['msj'] = '';
    
    this.setState({ mensajeError: mensajeError,
      });
  }

  

  async TraerEstudio(EstudioCod) { 
    //console.log('TraerEstudio');
    //console.log(EstudioCod);
    await this.setState({ codEstudio: EstudioCod.value,
                    estudioNombre: EstudioCod.label,
                    turnoAbuscar: null});
    this.validar();
  }

  async TraerPrestador(PrestadorCod) {
    await this.setState({codPrestador: PrestadorCod,
                    turnoAbuscar: null});
    this.validar();
  };

  async TraerEspecilidad(EspecilidadCod) { 
    
    await this.setState({codEspecialidad: EspecilidadCod,
                    turnoAbuscar: null});
    this.validar();

  };

  TraerTurno = (TurnoCod) => {
    //console.log('TraerTurno')
    this.setState({codTurno: TurnoCod,
                   msjConfirmar: true});
    
  };

  TraerFecha = (fechaTurno) => {
    //console.log('TraerFecha');
    //console.log(moment(fechaTurno).format('YYYY-MM-DD'));
    
    
    var AbuscarTurno= this.state.turnosDisponibles.filter(turno => moment(turno.fecha).format('YYYY-MM-DD') === moment(fechaTurno).format('YYYY-MM-DD'));
    
    //console.log('AbuscarTurno');
    //console.log(AbuscarTurno);

    this.setState({ fechaEstudio: moment(fechaTurno).format('YYYY-MM-DD'),
                    fechaSeleccionada: true,
                    turnoAbuscarHora: AbuscarTurno
                  });
    
  };

  valueToState = ({ id, value, checked, type, name }) => {
    this.setState({turnoAbuscar: null});
    if (id==="") { id=name;}
    this.setState(() => {
      return { [id]: type === "checkbox" ? checked : value };
    });
  };
  
  componentDidMount() {
    //console.log('El componente está disponible en el DOM');
    //console.log(moment().format());
    //console.log(moment().format('YYYY-MM-DD'));
    // inicio
    //this.setState({fechaEstudio: "2019-01-15",});
    this.setState({ pacienteLocal: this.props.PacienteLocal,
                    UsuarioLogueado: this.props.UsuarioLogueado,
                  });
  }

  async validar() {
    //console.log('validar');
    
    this.setState({ fechaEstudio: null,
                    loading:true,
                  });
    if (this.state.optionEstudio === 'estudio' && this.state.codEstudio !== null ){
      //console.log('validar Estudio Correcto');
      await this.traerTurnosEstudios();
      if (this.state.turnosDisponibles !== null) {

        this.setState({ fechaSeleccionada:false,
                        turnoAbuscar: true});
      }
      
    }

    if (this.state.optionEstudio === 'prestador' && this.state.codPrestador !== null ){
      //console.log('validar Prestador Correcto');
      await this.traerTurnosPrestador();
      if (this.state.turnosDisponibles !== null) {

        this.setState({ fechaSeleccionada:false,
                        turnoAbuscar: true});
      }
      
    }

    if (this.state.optionEstudio === 'especialidad' && this.state.codEspecialidad !== null ){
      //console.log('validar Especialidad Correcto');
      await this.traerTurnosEspecialidad();
      if (this.state.turnosDisponibles !== null) {

        this.setState({ fechaSeleccionada:false,
                        turnoAbuscar: true});
      }
    }
    
    this.setState({ loading:false,
      });
  } 

  tipoTurno() {
    var respuesta;

    switch(this.state.optionEstudio) {
      case "estudio":
        respuesta = 1;
        break;
      case "prestador":
        respuesta = 2;
        break;
      case "especialidad":
        respuesta = 3;
        break;
      default:
        respuesta = 0;
    }

    return respuesta;
  }
  async traerTurnosEstudios () {
  
    //console.log('traerTurnosEstudios');
    //console.log(`${urlRest}TurnosEquipo/?mutual=${this.state.pacienteLocal.mutual}&estudio=${this.state.codEstudio}`);
    var TurnosEstudios = null;
    var config = {
      headers: {'Authorization': `Bearer ${this.state.UsuarioLogueado.token}`}
    };
    await axios.get(`${urlRest}Turnos/TurnosEquipo/?mutual=${this.state.pacienteLocal.mutual}&estudio=${this.state.codEstudio}`, config)
        .then(response => {
          //console.log('respuesta');
          //console.log(response);
            if ( response.data.length !== 0 ){
              
              //console.log(response.data.length);
              TurnosEstudios = response.data
              //this.setState({turnos: response.data,});

              //console.log('turnos');
              //console.log(this.state.turnos);
              //this.render();
            } else {
              TurnosEstudios=null;
            }

        })
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log('Error');
            console.log(e.response);
        });

        if (TurnosEstudios === null){
          //alert('No hay turnos libres');
          var mensajeError = this.state.mensajeError;
          mensajeError['open'] = true;
          mensajeError['msj'] = 'No hay turnos libres';
          
          this.setState({ turnosDisponibles: TurnosEstudios,
                          mensajeError: mensajeError,
            });

          
        } else {
          this.setState({ fechasTurnos:this.AgruparArrayFecha(TurnosEstudios),
                          turnosDisponibles: TurnosEstudios,});
        }
   
  }

  async traerTurnosPrestador () {
  
    //console.log('traerTurnosPrestador');
    //console.log(`${urlRest}TurnosPrestador/?mutual=${this.state.pacienteLocal.mutual}&prestador=${this.state.codPrestador}`);
    var TurnosPrestador = null;
    var config = {
      headers: {'Authorization': `Bearer ${this.state.UsuarioLogueado.token}`}
    };

    await axios.get(`${urlRest}Turnos/TurnosPrestador/?mutual=${this.state.pacienteLocal.mutual}&prestador=${this.state.codPrestador}`,config)
        .then(response => {
          //console.log('respuesta');
          //console.log(response);
            if ( response.data.length !== 0 ){
              
              //console.log(response.data.length);
              TurnosPrestador = response.data
              //this.setState({turnos: response.data,});

              //console.log('turnos');
              //console.log(this.state.turnos);
              //this.render();
            } else {
              TurnosPrestador=null;
            }

        })
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log('Error');
            console.log(e.response);
        });

        if (TurnosPrestador === null){
          alert('No hay turnos libres');
          this.setState({ turnosDisponibles: TurnosPrestador,});
        } else {
          this.setState({ fechasTurnos:this.AgruparArrayFecha(TurnosPrestador),
                          turnosDisponibles: TurnosPrestador,});
        }
   
  }

  async traerTurnosEspecialidad () {
  
    //console.log('traerTurnosEspecialidad');
    //console.log(`${urlRest}TurnosPrestador/?mutual=${this.state.pacienteLocal.mutual}&especialidad=${this.state.codEspecialidad}`);
    var TurnosEspecialidad = null;
    var config = {
      headers: {'Authorization': `Bearer ${this.state.UsuarioLogueado.token}`}
    };

    await axios.get(`${urlRest}Turnos/TurnosPrestador/?mutual=${this.state.pacienteLocal.mutual}&prestador=${this.state.codEspecialidad}`,config)
        .then(response => {
          //console.log('respuesta');
          //console.log(response);
            if ( response.data.length !== 0 ){
              
              //console.log(response.data.length);
              TurnosEspecialidad = response.data
              //this.setState({turnos: response.data,});

              //console.log('turnos');
              //console.log(this.state.turnos);
              //this.render();
            } else {
              TurnosEspecialidad=null;
            }

        })
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log('Error');
            console.log(e.response);
        });

        if (TurnosEspecialidad === null){
          //alert('No hay turnos libres');
          var mensajeError = this.state.mensajeError;
          mensajeError['open'] = true;
          mensajeError['msj'] = 'No hay turnos libres';
          
          this.setState({ turnosDisponibles: TurnosEspecialidad,
                          mensajeError: mensajeError,
            });
        } else {
          this.setState({ fechasTurnos:this.AgruparArrayFecha(TurnosEspecialidad),
                          turnosDisponibles: TurnosEspecialidad,});
        }
   
  }

  AgruparArrayFecha (miarray) {
    let Fechas = [];

    miarray.forEach(item => {
      if (Fechas.length === 0 || Fechas.length === undefined) {
        Fechas.push({fecha:item.fecha});
      } else {
        let indice = Fechas.findIndex(itemBuscado => itemBuscado.fecha === item.fecha);
        if (indice === -1) {
          Fechas.push({fecha:item.fecha});
        }
      }
  });
    
    return Fechas;
  }

  async actualizarTurno () {
    //console.log(`actualizarTurno`);
    //console.log(Paciente);
    let actualizarTurnoEstado = 0;
    let estudioCod = null;
    let url;

    let respuesta = '';
    
    var config = {
      headers: {'Authorization': `Bearer ${this.state.UsuarioLogueado.token}`}
    };
    
    if(this.state.optionEstudio ==="estudio") {
      estudioCod = this.state.codEstudio;
      url= `${urlRest}Turnos/DarTurno/${this.state.codTurno.codigo}`;
    } else {
      estudioCod = null;
      url= `${urlRest}Turnos/DarTurno/${this.state.codTurno.codigo}`;
    }

    
      //console.log(`Actualizar`);
      //console.log(url);

     

      await axios.put(url, {
        codigo: this.state.codTurno.codigo, //Codigo Turno
        paciente: this.state.pacienteLocal.codigo,  //Codigo Paciente
        estudio: estudioCod,  // si es estudio, codigo Estudio, sino Null
        mutual: this.state.pacienteLocal.mutual, //codigo Mutual
        dioturno: this.state.UsuarioLogueado.codigo, // Codigo Usuario
      }, config)
      .then(function (response) {
        //console.log('response');
        //console.log(response);
        actualizarTurnoEstado = response.status;
        respuesta = response.data;
        
      })
      .catch(function (error) {
        console.log('error');
        console.log(error.response);
      }); 
    
      //this.state.optionEstudio ==="estudio"

    if (actualizarTurnoEstado === 200) {
      //console.log('actualizarTurnoEstado === 200');
      //console.log(respuesta)
      if (respuesta === 'OK') {
        
        this.setState({msjTurnoConfirmadoMsj: 'El turno se Registro Correctamente',
                    msjTurnoConfirmado: true,
          });
      } else {
        this.setState({msjTurnoConfirmadoMsj: respuesta,
                    msjTurnoConfirmado: true,
          });
      }
      
    } else {
      
      this.setState({msjTurnoConfirmadoMsj: 'Error al Registrar Turno vuelve a intentar en un segundo',
                    msjTurnoConfirmado: true,
          });
    }

  }
  
  

//<pre>{JSON.stringify(this.state, null, 2)}</pre>
  render() {

    return (
      <Grid fluid>
        
        <Row>
          <Col xs={12} md={12}>
            <Card >
              <CardContent className="TurnoDetalleCard">
                <form>
                  <Row>
                    <Col xs={12} md={5}>
                    {
                      this.state.optionEstudio === "estudio" ?
                        <div className="TurnoDetalleSelect">
                          <AutocompletarEstudio onSelectEstudio={this.TraerEstudio}/>
                        </div>
                        :
                          this.state.optionEstudio === "prestador" ?
                          <div className="TurnoDetalleSelect">
                            <AutocompletarPrestador onSelectPrestador={this.TraerPrestador}/>
                          </div>
                          :
                          <div className="TurnoDetalleSelectEspecialidad">
                            <AutocompletarEspecialidad onSelectEspecialidad={this.TraerEspecilidad}/>
                          </div>  
                    }
                    </Col>
                    <Col xs={12} md={2}>
                      <FormControl className="TurnoDetalleOption">
                        <RadioGroup
                        name="optionEstudio"
                        value={this.state.optionEstudio}
                        onChange={event => this.valueToState(event.target)}
                        >
                          <FormControlLabel className="TurnoDetalleOptionLabel"
                            value="estudio"
                            control={<Radio color="primary" />}
                            label="Estudio"
                            
                          />
                          <FormControlLabel className="TurnoDetalleOptionLabel"
                            value="prestador"
                            control={<Radio color="primary" />}
                            label="Prestador"
                          />
                          <FormControlLabel className="TurnoDetalleOptionLabel"
                            value="especialidad"
                            control={<Radio color="primary" />}
                            label="Especialidad"
                          />
                          
                        </RadioGroup>
                        
                      </FormControl>
                    </Col>
                    <Col xs={12} md={3}>
                      <div className="TurnoDetalleFecha">
                         Fecha
                         {
                            this.state.fechaEstudio !== null ? 
                            <Typography variant="h5" gutterBottom>
                              {moment(this.state.fechaEstudio).format('DD/MM/YYYY')}
                            </Typography>
                            :
                            <p></p>
                         }
                        
                      </div>
                    </Col>
                    <Col xs={12} md={2}>
                      <div className= "wrapper">
                        <Button variant="contained" color="primary" 
                          
                          onClick={() => { this.validar() }}
                          disabled={this.state.loading}
                          >
                          Buscar
                        </Button>
                        {this.state.loading && <CircularProgress size={24} className="buttonProgress" />}
                      </div>
                    </Col>
                  </Row>
                </form>
                <Row>
                  <Col xs={12} md={12}>
                  {
                      this.state.turnoAbuscar !== null ?
                        this.state.fechaSeleccionada ?
                          <div>
                            <TurnosHorarios 
                            Abuscar={this.state.turnoAbuscarHora}
                            onSelectTurno={this.TraerTurno}
                            />
                          </div>
                          :
                          <div>
                            <TurnoDias 
                            Abuscar={this.state.fechasTurnos}
                            onSelectFecha={this.TraerFecha}
                            />
                          </div>
                        :
                        <p></p>
                    }
                    
                  </Col>
                </Row>
              </CardContent>
            </Card>
          </Col>
        </Row>
        <Dialog
        open={this.state.msjConfirmar}
        onClose={this.CerrarmsjConfirmar}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Desea Confirmar el Turno?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            {
              this.state.optionEstudio ==="estudio" ?
                `Para el dia  ${moment(this.state.fechaEstudio).format('DD/MM/YYYY')} y la hora ${moment(this.state.codTurno.hora).format('HH:mm')} ` +
                `, para el estudio: ${this.state.estudioNombre} en el equipo : ${this.state.codTurno.equipoNom}.`
                
              :
                `Para el dia ${moment(this.state.fechaEstudio).format('DD/MM/YYYY')} y la hora ${moment(this.state.codTurno.hora).format('HH:mm')}, ` +
                `para el prestador :  ${this.state.codTurno.prestadorNom}.`
            }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.CerrarmsjConfirmar} color="primary">
              No
            </Button>
            <Button onClick={this.ConfirmarmsjConfirmar} color="primary" autoFocus>
              Si
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog //Turno Confirmado
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
        <Dialog //Mensaje Error
        open={this.state.mensajeError.open}
        onClose={this.CerrarmsjError}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title" >
            <Row>
              <Col xs={12} md={12}>
                {this.state.mensajeError.msj}
                <p></p>
              </Col>
            </Row>
            <Row end="xs">
              <Col xs={12} md={12}>
                <Button onClick={this.CerrarmsjError} color="primary">
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

export default TurnoDetalle;