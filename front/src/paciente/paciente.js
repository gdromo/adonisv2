import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';
import { urlRest } from '../datos/Config';
import * as moment from 'moment';

/*import MenuIcon from '@material-ui/icons/Menu';*/
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios';

import AutocompletarMutual from '../autocompletarMutual/autocompletarMutual';
/*import { Link } from 'react-router-dom';*/



import LoadingOverlay from 'react-loading-overlay';

const EMAIL_REGEX = new RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);

var token = '';



class Paciente extends Component {
  

  constructor() {
    super();
    this.state = {
    pacienteNombre: "",
    pacienteApellido:"",
    pacienteDni: "",
    pacienteCargando: false,
    codPaciente: null,
    pacienteMutual: "",
    pacienteMutualNombre: "",
    pacienteEmail: "",
    pacienteMutualAfiliado:"",
    pacienteNacimiento: "2019-01-01",
    pacienteCelular: "",
    pacienteTelefono: "",
    validacionError: false,
    ErrorEmail: false,
    ErrorCelular: false,
    ErrorMensaje: "",
    mutualBusq: null,
    UsuarioLogueado:null,
    loading:false,
      };

    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.handleBlur = this.handleBlur.bind(this);
    
  }

  

  handleSubmit(event) {
    //console.log('handleSubmit');
    //console.log(event);
    let paciente = {};
    this.setState({ loading:true,
    });
    paciente.apellido= this.state.pacienteApellido;
    paciente.nombre= this.state.pacienteNombre;
    paciente.codigo= this.state.codPaciente;
    paciente.documentoNro= this.state.pacienteDni;
    paciente.documentoTipo= 1;
    paciente.email= this.state.pacienteEmail;
    paciente.hc= this.state.pacienteDni;
    paciente.mutual= this.state.pacienteMutual;
    paciente.mutualAfiliado= this.state.pacienteMutualAfiliado;
    paciente.mutualNombre= this.state.pacienteMutualNombre;
    paciente.nacimiento= this.state.pacienteNacimiento;
    paciente.telefono= this.state.pacienteTelefono;
    paciente.telefono2= this.state.pacienteCelular;

    this.actualizarPaciente(paciente);
    
    event.preventDefault();
    // do some login logic here, and if successful:


    
    
  }

  
  handleKeyPress(key) {
    //console.log('handleKeyPress');
    //console.log(key);
    
    if (key.key ==='Enter') {
      if (key.target.id === 'pacienteApellido' || key.target.id === 'pacienteNombre')
      { 
        if (this.state.pacienteDni === '')
        { 
          //console.log('handleKeyPress Enter');
          this.buscarporNombre();
        }
      }
      if (key.target.id === 'pacienteDni')
      { 
        if (this.state.pacienteDni === '')
        { 
          if(this.state.pacienteApellido === '' && this.state.pacienteNombre === ''){
            
            this.traerPacientes(this.state.pacienteDni);
          }
        }
      }
    }
    //console.log(key);

    //console.log(key.key);
    //console.log(key.keyCode);
  }
  

  handleBlur({id, value}) {
    //console.log('handleBlur');
    
    //console.log(value);
    //console.log(id);
    //console.log(obj.target.type);
    
    switch (id) {
      case 'pacienteDni':
        //console.log('pacienteDni');
        if(this.state.pacienteApellido === '' && this.state.pacienteNombre === ''){
          //console.log('this.state.pacienteApellido !==');
          this.traerPacientes(value);
        }

        break;
      case 'pacienteEmail':
        if ( value !== ''){
        this.validarEmail(value);
        } else {
          this.setState({
            validacionError: false,
            ErrorEmail: false,
            ErrorMensaje: '',
          });
        }
        break;
      case 'pacienteCelular':
        if ( value !== ''){
          this.validarCelular(value);
        } else {
          this.setState({
            validacionError: false,
            ErrorCelular: false,
            ErrorMensaje: '',
          });
          
        }
        break;
      case 'pacienteMutual':
        
        this.traerMutuales(value);

        break;

      default:
        //Sentencias_def ejecutadas cuando no ocurre una coincidencia con los anteriores casos
        break;
      }
      this.validar(id, value);
    
  }

  validar(id, value) {
    //console.log('validar');
    switch (id) {
      case 'pacienteDni':

        break;
      case 'pacienteEmail':
        if ( value !== ''){
        this.validarEmail(value);
        } else {
          this.setState({
            validacionError: false,
            ErrorEmail: false,
            ErrorMensaje: '',
          });
        }
        break;
      case 'pacienteCelular':
        if ( value !== ''){
          this.validarCelular(value);
        } else {
          this.setState({
            validacionError: false,
            ErrorCelular: false,
            ErrorMensaje: '',
          });
          
        }
        break;
      
      default:
        //Sentencias_def ejecutadas cuando no ocurre una coincidencia con los anteriores casos
        break;
    }
  }

async traerPacientes (dni) {
  //console.log('traerPacientes');
  //console.log(urlRest)
  //console.log(this.state.UsuarioLogueado.token);

  var config = {
    headers: {'Authorization': `Bearer ${token}`}
  };
    if (dni !== '') {
      
      this.setState({
        pacienteCargando: true,
      });
      
      //console.log(`${urlRest}pacientes/?documento=${dni}`);
      //console.log(`${urlRest}pacientes/?nombre=Guille`);
      
      //console.log(config);
      await axios.get(`${urlRest}pacientes/?documento=${dni}`, 
        config )
        .then(response => {
          //console.log('respuesta');
          //console.log(response);
            if ( response.data.length !== 0 ){
              /*var mutualBusqueda = {
                value:(response.data[0].mutualCodigo !== null)?response.data[0].mutualCodigo:'',
                label:(response.data[0].mutualNombre !== null)?response.data[0].mutualNombre:'',
              };
              this.setState({
                mutualBusq: mutualBusqueda,
                pacienteCargando: false,
              });*/
              
              //console.log('respuesta 2');
              //console.log(response.data[0].mutualCodigo);
              //console.log(response.data[0]);
              this.traerMutuales((response.data[0].mutual !== null)?response.data[0].mutual:'');
              this.setState({
                pacienteCargando: false,
              });

              this.setState({
                pacienteNombre: (response.data[0].nombre !== null)?response.data[0].nombre:'',
                pacienteApellido: (response.data[0].apellido !== null)?response.data[0].apellido:'',
                pacienteDni: (response.data[0].documentoNro !== null)?response.data[0].documentoNro:'',
                pacienteCelular: (response.data[0].telefono2 !== null)?response.data[0].telefono2:'',
                pacienteMutual: (response.data[0].mutual  !== null)?response.data[0].mutual:'',
                pacienteMutualNombre: (response.data[0].mutualNombre !== null)?response.data[0].mutualNombre:'',
                pacienteMutualAfiliado: (response.data[0].mutualAfiliado !== null)?response.data[0].mutualAfiliado:'',
                pacienteTelefono: (response.data[0].telefono !== null)?response.data[0].telefono:'',
                codPaciente:(response.data[0].codigo !== null)?response.data[0].codigo:'',
                pacienteEmail: (response.data[0].email !== null)?response.data[0].email:'',
                pacienteNacimiento: (response.data[0].nacimiento !== null)?
                  (moment(response.data[0].nacimiento).format('YYYY-MM-DD') > '1860-01-01')?
                    moment(response.data[0].nacimiento).format('YYYY-MM-DD')
                  :
                    '1980-01-01'
                :
                  '1980-01-01',
              });
              //console.log(response.data[0].nombre);
              
              //this.render();
            } else {
              //console.log('response.data.length == 0');
              alert('El DNI no se encuentra Registrado como perteneciente a un paciente');
            }
        })
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log('Error');
            console.log(e.response);
        });
      this.setState({
          pacienteCargando: false,
        });
        
    }
          
  }
  
traerMutuales (Codigo) {
  var config = {
    headers: {'Authorization': `Bearer ${this.state.UsuarioLogueado.token}`}
  };
    if (Codigo !== '') {
      //console.log(`${urlRest}mutuales/${Codigo}`);
      axios.get(`${urlRest}mutuales/${Codigo}`, config)
        .then(response => {
          //console.log('respuesta');
          //console.log(response);
            if ( response.data.length !== 0 ){
              this.setState({
                mutualBusq:response.data[0],
                pacienteMutualNombre:response.data[0].nombre,
              });
              //console.log('respuesta fin');
              //console.log(response.data[0])
              this.render();
            } else {
              alert('Mutual no vigente');
              this.setState({
                mutualBusq:null,
                pacienteMutualNombre:'',
                pacienteMutual:'',
              });
            }
        })
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log('Error');
            console.log(e.response);
        });
    }
          
  }

  validarEmail(email) {
    const emailIsValid = EMAIL_REGEX.test(email);
      /*console.log('validarEmail');
      console.log(emailIsValid);*/
      if(!emailIsValid){
        this.setState({
          validacionError: true,
          ErrorEmail: true,
          ErrorMensaje: 'Ingrese un Correo Correcto',
        });
      } else {
        this.setState({
          validacionError: false,
          ErrorEmail: false,
          ErrorMensaje: '',
        });
      }

  }

  validarCelular(numero) {
    //console.log('validarCelular');
    
    
    switch (true) {
      case numero.length <= 9:
          //console.log('numero.length <= 9');
          this.setState({
            validacionError: true,
            ErrorCelular: true,
            ErrorMensaje: 'El Celular tiene menos de 10 numero, verifique la caracteristica',
          });
        break;
      case numero.length >= 14:
          //console.log('numero.length >= 14');
          this.setState({
            validacionError: true,
            ErrorCelular: true,
            ErrorMensaje: 'El Celular tiene mas de 13 numero, verifique que sea correcto',
          });
        break;
      case numero.substr(0, 1) === '0':
          //console.log('numero.substr(0, 1) === 0');
          this.setState({
            validacionError: true,
            ErrorCelular: true,
            ErrorMensaje: 'El primer numero del celular no puede ser 0',
          });
        break;
      
      default:
        //Sentencias_def ejecutadas cuando no ocurre una coincidencia con los anteriores casos
        //console.log('default');
        this.setState({
          validacionError: false,
          ErrorCelular: false,
          ErrorMensaje: '',
        });
        break;
    }

  }

  valueToState = ({ id, value, checked, type }) => {
    //console.log('valueToState');
    if (id === 'pacienteDni') {
      this.setState({
        pacienteNombre: "",
        pacienteApellido:"",
        pacienteDni: "",
        codPaciente: null,
        pacienteMutual: "",
        pacienteMutualNombre: "",
        pacienteEmail: "",
        pacienteMutualAfiliado:"",
        pacienteNacimiento: "2019-01-01",
        pacienteCelular: "",
        pacienteTelefono: "",
      });
    }

    this.setState(() => {
      return { [id]: type === "checkbox" ? checked : value };
    });
  };

  TraerMutual = (Mutual) => {
    //console.log('TraerMutual');
    this.setState({ pacienteMutual: Mutual.value,
                    pacienteMutualNombre: Mutual.label,
                    mutualBusq: null
                    });

  };

  async actualizarPaciente (Paciente) {
    //console.log(`actualizarPaciente`);
    //console.log(Paciente);
    let actualizarPacienteEstado = 0;
    var config = {
      headers: {'Authorization': `Bearer ${this.state.UsuarioLogueado.token}`}
    };
    
    if (Paciente.codigo == null) {
      //console.log(`Agregar`);
      //console.log(`${urlRest}pacientes/`);
      await axios.post(`${urlRest}pacientes/`, {
        apellido: this.state.pacienteApellido,
        nombre: this.state.pacienteNombre,
        //codigo: this.state.codPaciente,
        documentoNro: this.state.pacienteDni,
        documentoTipo: 1,
        email: this.state.pacienteEmail,
        hc: this.state.pacienteDni,
        mutual: this.state.pacienteMutual,
        mutualAfiliado: this.state.pacienteMutualAfiliado,
        mutualNombre: this.state.pacienteMutualNombre,
        nacimiento: this.state.pacienteNacimiento,
        telefono: this.state.pacienteTelefono,
        telefono2: this.state.pacienteCelular,
      }, config)
      .then(function (response) {
        //console.log('response');
        //console.log(response);
        Paciente.codigo = response.data;
        actualizarPacienteEstado = response.status;
        this.setState({ loading:false,
        });

      })
      .catch(function (error) {
        console.log('error');
        console.log(error.response);
        this.setState({ loading:false,
        });
      }); 

    } else {
      //console.log(`Actualizar`);
      //console.log(`${urlRest}pacientes/${this.state.codPaciente}`);
      await axios.put(`${urlRest}pacientes/${this.state.codPaciente}`, {
        apellido: this.state.pacienteApellido,
        nombre: this.state.pacienteNombre,
        codigo: this.state.codPaciente,
        documentoNro: this.state.pacienteDni,
        documentoTipo: 1,
        email: this.state.pacienteEmail,
        hc: this.state.pacienteDni,
        mutual: this.state.pacienteMutual,
        mutualAfiliado: this.state.pacienteMutualAfiliado,
        mutualNombre: this.state.pacienteMutualNombre,
        nacimiento: this.state.pacienteNacimiento,
        telefono: this.state.pacienteTelefono,
        telefono2: this.state.pacienteCelular,
      }, config)
      .then(function (response) {
        //console.log('response');
        //console.log(response);
        actualizarPacienteEstado = response.status;
        
        
      })
      .catch(function (error) {
        console.log('error');
        console.log(error.response);
        
      }); 
    }
    
    this.setState({ loading:false,
    });
    //console.log('Paciente');
    //console.log(Paciente);
    //console.log(this.state.UsuarioLogueado);

    if (actualizarPacienteEstado === 200) {
      //console.log('LoginUsuarioEstado === 200');
      //console.log(LoginUsuario);
      this.props.history.push({ pathname: '/Turno', Paciente : Paciente, Usuario: this.state.UsuarioLogueado });
    } else {
      alert('Error al Registrar Paciente vuelve a intentar en un segundo');
      
    }

    //this.props.history.push({ pathname: '/Turno', Paciente : Paciente, Usuario: this.state.UsuarioLogueado });
    
    
}

  post () {
      //console.log(`${urlRest}cirugias/`);
      axios.post(`${urlRest}cirugias/`, {
        nombre: 'Cirugia Guille111'
      })
      .then(function (response) {
        console.log('response');
        console.log(response);
      })
      .catch(function (error) {
        console.log('error');
        console.log(error.response);
      }); 
  }

  buscarporNombre () {
    //console.log(`buscarporNombre`);
    let NombreBusq = '';
    if (this.state.pacienteApellido !== '') {
      if (this.state.pacienteNombre !== '') {
        NombreBusq =  `${this.state.pacienteApellido} ${this.state.pacienteNombre}`;
      } else {
        NombreBusq =  `${this.state.pacienteApellido}`;
      }
    } else {
      if (this.state.pacienteNombre !== '') {
        NombreBusq =  `${this.state.pacienteNombre}`;
      } else {
        NombreBusq =  ``;
      }
    }

    this.props.history.push({ pathname: '/BuscarporNombre', Usuario: this.state.UsuarioLogueado, Busqueda: NombreBusq });
  }

  turnosPaciente () {
    //console.log(`turnosPaciente`);
    //console.log(this.state.codPaciente);
    if (this.state.codPaciente !== null)
    { 
      let pacienteLocal = {};

      pacienteLocal.apellido= this.state.pacienteApellido;
      pacienteLocal.nombre= this.state.pacienteNombre;
      pacienteLocal.codigo= this.state.codPaciente;
      pacienteLocal.documentoNro= this.state.pacienteDni;
      pacienteLocal.documentoTipo= 1;
      pacienteLocal.email= this.state.pacienteEmail;
      pacienteLocal.hc= this.state.pacienteDni;
      pacienteLocal.mutual= this.state.pacienteMutual;
      pacienteLocal.mutualAfiliado= this.state.pacienteMutualAfiliado;
      pacienteLocal.mutualNombre= this.state.pacienteMutualNombre;
      pacienteLocal.nacimiento= this.state.pacienteNacimiento;
      pacienteLocal.telefono= this.state.pacienteTelefono;
      pacienteLocal.telefono2= this.state.pacienteCelular;

      this.props.history.push({ pathname: '/TurnoPaciente', Usuario: this.state.UsuarioLogueado, Paciente: pacienteLocal });
    } else {
      alert('Debe ingresar en un paciente');
    }
  }

  
  

  componentDidMount() {
    
    //console.log('El componente está disponible en el DOM');
    //console.log('Inicio');
    //console.log(this.props.location.PacienteDni);
    token = sessionStorage.getItem("AppOfertaTurnoToken");

    if (this.props.location.Usuario !== undefined) {
      
      this.setState({ UsuarioLogueado: this.props.location.Usuario,
      });
      
    }
    if (this.props.location.PacienteDni !== undefined) {
      this.traerPacientes(this.props.location.PacienteDni);
      
    }
    // inicio
    //localStorage.removeItem('AppPaciente');
  }



  //<pre>{JSON.stringify(this.state, null, 2)}</pre>
render() {
  //console.log('render paciente');
  

  return (
    <Grid fluid>
      
      { this.state.UsuarioLogueado == null ?
        <div>
          <p>Debe ingresar Usuario, ir a</p>
          <button onClick={() => { this.props.history.push({ pathname: '/'})}} >login</button>
        </div>
        :
        <LoadingOverlay
        active={this.state.pacienteCargando}
        spinner
        text='Buscando paciente ...'
        >
          <Row>
            <Col xs={12} md={12}>
              <Card >
                <CardHeader
                  title="Oferta de Turnos"
                  subheader =
                  {
                    this.setState.UsuarioLogueado === null ?
                      "Subtitulo"
                    :
                      "Usuario: " + this.state.UsuarioLogueado.nombre
                  }
                  
                />
                <CardContent>
                  <form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col xs={12} md={12}>
                        <Card >
                          <CardContent>
                            <Row>
                              <Col xs={12} md={12}>
                                <Typography variant="h4" gutterBottom>
                                  Paciente
                                </Typography>
                              </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={3}>
                                  <TextField
                                    id="pacienteDni"
                                    label="DNI"
                                    margin="normal"
                                    autoComplete='off'
                                    value={this.state.pacienteDni}
                                    autoFocus 
                                    required
                                    onChange={event => this.valueToState(event.target)}
                                    onBlur={event => this.handleBlur(event.target)}
                                    onKeyPress={event => this.handleKeyPress(event)}
                                  />
                                </Col>
                                <Col xs={12} md={3}>
                                    <TextField
                                      id="pacienteApellido"
                                      label="Apellido"
                                      value={this.state.pacienteApellido}
                                      fullWidth
                                      margin="normal"
                                      autoComplete='off'
                                      required
                                      
                                      onChange={event => this.valueToState(event.target)}
                                      onBlur={event => this.handleBlur(event.target)}
                                      onKeyPress={event => this.handleKeyPress(event)}
                                    />
                                </Col>
                                <Col xs={12} md={3}>
                                    <TextField
                                      id="pacienteNombre"
                                      label="Nombre"
                                      value={this.state.pacienteNombre}
                                      fullWidth
                                      margin="normal"
                                      autoComplete='off'
                                      required
                                      
                                      onChange={event => this.valueToState(event.target)}
                                      onBlur={event => this.handleBlur(event.target)}
                                      onKeyPress={event => this.handleKeyPress(event)}
                                    />
                                </Col>
                                <Col xs={12} md={3}>
                                  <Row>
                                    <Button variant="contained"
                                      className= "PacienteBotonera"
                                      onClick={() => { this.buscarporNombre() }}
                                    >
                                      Buscar Por Nombre
                                    </Button> 
                                    </Row>
                                    <Row>
                                      <p></p>
                                    </Row>
                                    <Row>
                                    <Button variant="contained" color="primary" 
                                      className= "PacienteBotonera"
                                      onClick={() => { this.turnosPaciente() }}
                                    >
                                      Consultar/Anular Turnos
                                    </Button> 
                                  </Row>
                                </Col>
                            </Row>
                            <Row>
                              <Col xs={12} md={3}>
                                  <TextField
                                    id="pacienteMutual"
                                    label="Codigo Mutal"
                                    value={this.state.pacienteMutual}
                                    margin="normal"
                                    autoComplete='off'
                                    required
                                    
                                    onChange={event => this.valueToState(event.target)}
                                    onBlur={event => this.handleBlur(event.target)}
                                  />
                              </Col>
                              <Col xs={12} md={6} className= "PacienteMutual">
                                <AutocompletarMutual 
                                MutualBusq={this.state.mutualBusq}
                                onSelectMutual={this.TraerMutual}
                                />
                                  
                              </Col>
                              <Col xs={12} md={3}>
                                
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} md={3}>
                                <TextField
                                  id="pacienteMutualAfiliado"
                                  label="Numero Afiliado"
                                  value={this.state.pacienteMutualAfiliado}
                                  fullWidth
                                  
                                  margin="normal"
                                  autoComplete='off'
                                  onChange={event => this.valueToState(event.target)}
                                  onBlur={event => this.handleBlur(event.target)}
                                />
                              </Col>
                              <Col xs={12} md={3}>
                              <TextField
                                id="pacienteNacimiento"
                                label="Fecha Nacimiento"
                                value={this.state.pacienteNacimiento}
                                type="date"
                                
                                margin="normal"
                                onChange={event => this.valueToState(event.target)}
                                onBlur={event => this.handleBlur(event.target)}
                                InputLabelProps={{
                                  shrink: true,
                                }}
                              />
                              </Col>
                              <Col xs={12} md={3}>
                              
                                  
                            
                              </Col>
                              <Col xs={12} md={3}>
                              
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} md={6}>
                                <TextField
                                  id="pacienteEmail"
                                  label="Email"
                                  value={this.state.pacienteEmail}
                                  /*className={classes.textField}*/
                                  type="email"
                                  name="email"
                                  autoComplete='off'
                                  
                                  //autoComplete="email"
                                  margin="normal"
                                  fullWidth
                                  
                                  onChange={event => this.valueToState(event.target)}
                                  onBlur={event => this.handleBlur(event.target)}
                                  InputLabelProps={{
                                    error: this.state.ErrorEmail,
                                  }}
                                  /*variant="outlined"*/
                                />
                              </Col>
                              <Col xs={12} md={3}>
                                <TextField
                                  id="pacienteCelular"
                                  label="Celular"
                                  value={this.state.pacienteCelular}
                                  fullWidth
                                  margin="normal"
                                  autoComplete='off'
                                  InputLabelProps={{
                                    error: this.state.ErrorCelular,
                                  }}
                                  required
                                  onChange={event => this.valueToState(event.target)}
                                  onBlur={event => this.handleBlur(event.target)}
                                />
                              </Col>
                              <Col xs={12} md={3}>
                                <TextField
                                  id="pacienteTelefono"
                                  label="Telefono"
                                  value={this.state.pacienteTelefono}
                                  fullWidth
                                  margin="normal"
                                  autoComplete='off'
                                  
                                  onChange={event => this.valueToState(event.target)}
                                  onBlur={event => this.handleBlur(event.target)}
                                  
                                />
                              </Col>
                            </Row>
                              <Col xs={12} md={12}>
                              {
                                this.state.validacionError ?
                                  <div className="ErrorPaciente">
                                    {this.state.ErrorMensaje}
                                  </div>  :
                                  <p></p>
                              }
                                
                              </Col>
                            <Row>
                            </Row>
                          </CardContent>
                        </Card>
                      </Col>
                    </Row>
                    <Row>
                      <p></p>
                    </Row>
                    <Row >
                      <Col xs={12} md={6} end="xs">
                        <Button variant="contained" size="large" color="secondary" 
                          onClick={() => { this.props.history.push({ pathname: '/'})}}
                          >
                          LOGOUT  
                          <Icon>exit_to_app</Icon>
                        </Button>
                      </Col>
                      <Col xs={12} md={6} end="xs">
                        <Row end="xs">
                          <div className= "wrapper">
                            <Button variant="contained" size="large" color="primary" 
                              type="submit"
                              disabled={this.state.validacionError || this.state.loading}
                              >
                              Dar Turno / Guardar 
                              <Icon>send</Icon>
                            </Button>
                            {this.state.loading && <CircularProgress size={24} className="buttonProgress" />}
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </form>
                </CardContent>
              </Card>
            </Col>
          </Row>
        </LoadingOverlay>  
      }
      
    </Grid>
    
  );
}
}


export default Paciente;