import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';


/*import MenuIcon from '@material-ui/icons/Menu';*/
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


import MaterialTable from 'material-table';

import axios from 'axios';
import { urlRest } from '../datos/Config';
import * as moment from 'moment';

//import Typography from '@material-ui/core/Typography';
//import Icon from '@material-ui/core/Icon';

var token = '';


class BuscarporNombre extends Component {
  

  constructor() {
    super();
    this.state = {
    pacientesBusqueda: [],
    UsuarioLogueado:null,
    nombreBuscar:'',
    loading:false,
    pacientesCargados:false
      };
    
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  
  validar() {
    this.setState({ loading:true,
    });
    this.traerPacientes(this.state.nombreBuscar);
  }

  BuscarPacientes(Busqueda) {
    this.setState({ loading:true,
    });
    this.traerPacientes(Busqueda);
  }

  handleSubmit(event) {
    
    this.traerPacientes(this.state.nombreBuscar);
    event.preventDefault();
    // do some login logic here, and if successful:
  }


traerPacientes (nombre) {
  
  var config = {
    headers: {'Authorization': `Bearer ${token}`}
  };
  var  Pacientes = [];
  
    if (nombre.length >= 4) {
      //console.log(`${urlRest}pacientes/?nombre=${nombre}`);
      //console.log(config);
      axios.get(`${urlRest}pacientes/?nombre=${nombre}`, config )
        .then(response => {
          //console.log('respuesta');
          //console.log(response);
          if ( response.data.length !== 0 ){
            var i;
            for (i = 0; i < response.data.length; i++) { 
              //response.data[i].nombre;
                Pacientes[i] = {
                  codigo : (response.data[i].codigo !== null)?response.data[i].codigo:'',
                  hc : (response.data[i].hc !== null)?response.data[i].hc:'',
                  nombre : (response.data[i].nombre !== null)?response.data[i].nombre:'',
                  apellido : (response.data[i].apellido !== null)?response.data[i].apellido:'',
                  mutual : (response.data[i].mutualNombre !== null)?response.data[i].mutualNombre:'',
                  nacimiento : (response.data[i].nacimiento !== null)?moment(response.data[i].nacimiento).format('YYYY-MM-DD'):'1990-01-01',
                };
           
              
              }
            
                this.setState({
                  pacientesBusqueda:Pacientes,
                  pacientesCargados:true,
                  loading:false,
                });

            
            }
          }
        )
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log('Error');
            console.log(e.response);
        });
    } else {
      alert('Debe ingresar al menos 4 caracteres');
      this.setState({
        loading:false,
      });
    }
          
  }


  valueToState = ({ id, value, checked, type }) => {
    //console.log('valueToState');

    this.setState(() => {
      return { [id]: type === "checkbox" ? checked : value };
    });
  };

  seleccionarPacientes (seleccion) {
      //alert("Usted selecciono " + seleccion.hc);
      this.props.history.push({ pathname: '/paciente', Usuario: this.state.UsuarioLogueado, PacienteDni: seleccion.hc }) 
  }

  handleKeyPress(key) {
    //console.log('handleKeyPress');
    //console.log(key);
    
    if (key.key ==='Enter') {
      this.validar()
    }
    
  }

  componentDidMount() {
    
    //console.log('El componente está disponible en el DOM');
    //console.log('Inicio');
    //console.log(this.props.location.Usuario);
    token = sessionStorage.getItem("AppOfertaTurnoToken");

    if (this.props.location.Usuario !== undefined) {
      this.setState({ UsuarioLogueado: this.props.location.Usuario,
                      nombreBuscar:  this.props.location.Busqueda,
      });
    }
    if (this.props.location.Busqueda !== undefined && this.props.location.Busqueda !== null && this.props.location.Busqueda !== '') {
      //console.log('Busqueda');
      //console.log(this.props.location.Busqueda);
      this.BuscarPacientes(this.props.location.Busqueda)
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
                title="Buscar Paciente por Nombre"
                
              />
              <CardContent>
                <form onSubmit={this.handleSubmit}>
                  <Row>
                    <Col xs={12} md={12}>
                      <Card >
                        <CardContent>
                          <Row>
                              <Col xs={12} md={9}>
                                  <TextField
                                    id="nombreBuscar"
                                    label="Ingrese Nombre a Buscar"
                                    margin="normal"
                                    autoComplete='off'
                                    value={this.state.nombreBuscar}
                                    autoFocus 
                                    required
                                    fullWidth
                                    onChange={event => this.valueToState(event.target)}
                                    onKeyPress={event => this.handleKeyPress(event)}
                                  />
                              </Col>
                              
                              <Col xs={12} md={3}>
                                <div className= "wrapper">
                                  <Button variant="contained" color="primary"
                                  size="large"
                                  disabled={this.state.loading}
                                  onClick={() => { this.validar() }}
                                  >
                                    Buscar
                                  </Button> 
                                  {this.state.loading && <CircularProgress size={24} className="buttonProgress" />}
                                </div>
                              </Col>
                          </Row>
                          
                          <Row>
                            { this.state.pacientesCargados ?
                              <Col xs={12} >
                                <div style={{ maxWidth: '100%' }}>
                                  <MaterialTable
                                    title="Pacientes"
                                    columns={[
                                      { title: 'H.C.', field: 'hc' },
                                      { title: 'Nombre', field: 'nombre' },
                                      { title: 'Apellido', field: 'apellido' },
                                      { title: 'Mutual', field: 'mutual' },
                                      
                                      
                                      
                                    ]}
                                    data={this.state.pacientesBusqueda}        
                                    actions={[
                                      {
                                        icon: 'done',
                                        tooltip: 'Seleccionar paciente',
                                        onClick: (event, rowData) => this.seleccionarPacientes(rowData)
                                      }
                                    ]}
                                  />
                                </div>
                              </Col>
                            :
                              <p></p>
                            }
                            <Col xs={12} md={3}>
                              <Button variant="contained" color="primary" 
                              onClick={() => { this.props.history.push({ pathname: '/paciente', Usuario: this.state.UsuarioLogueado }) }}
                              >
                                Volver
                              </Button> 
                            </Col>
                          </Row>
                        </CardContent>
                      </Card>
                    </Col>
                  </Row>
                </form>
              </CardContent>
            </Card>
          </Col>
        </Row>

    </Grid>
    
  );
}
}


export default BuscarporNombre;