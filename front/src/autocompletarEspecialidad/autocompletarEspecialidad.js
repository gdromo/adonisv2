import React from 'react';
import Select from 'react-select';
import { Grid, Row, Col } from 'react-flexbox-grid';
//import Prestadores from '../datos/prestadores';

import axios from 'axios';
import { urlRest } from '../datos/Config';

var token = '';


class autocompletarPrestador extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPrestador: null,
      selectedEspecialidades:null,
      especialidades:[],
      prestadores:[],
      prestadoresFiltro:[],
      };

  }

  handleChangeEspecialidades = (selectedEspecialidades) => {
    this.setState({ selectedEspecialidades });
    //this.props.onSelectEspecialidad(selectedEspecialidades.value); 
   //console.log(`handleChangeEspecialidades:`, selectedEspecialidades);
   //console.log(this.state.prestadores);
   //console.log(this.state.prestadores.filter(prestador => prestador.especialidad === 88));

   var AbuscarPrestador= this.state.prestadores.filter(prestador => prestador.especialidad === selectedEspecialidades.value);
   this.setState({  prestadoresFiltro: AbuscarPrestador, 
                    selectedPrestador: '',
                  });
   //console.log( AbuscarPrestador);

  }

  handleChangePrestador = (selectedPrestador) => {
    this.setState({ selectedPrestador });
    this.props.onSelectEspecialidad(selectedPrestador.value); 
    //console.log(`handleChangePrestador:`, selectedPrestador);
  }
 
  componentDidMount() {
    //console.log('El componente Mutuales está disponible en el DOM');
    token = sessionStorage.getItem("AppOfertaTurnoToken");
    this.TraerEspecialidades();
    this.TraerPrestadores();
  }

  componentWillReceiveProps(next_props) {
    //console.log('componentWillReceiveProps');


    if (next_props.MutualBusq !== undefined && next_props.MutualBusq !== null) 
    {
      if (next_props.MutualBusq.nombre !== undefined ) 
        {
          var especialidadSeleccionada= {};
          //console.log('next_props.MutualBusq.nombre')
          //console.log(next_props.MutualBusq);
          
          especialidadSeleccionada = {
            value:next_props.MutualBusq.codigo,
            label:next_props.MutualBusq.nombre,
          };
          this.setState({selectedEspecialidades: especialidadSeleccionada,});
        }
      if (next_props.MutualBusq.nombre === undefined ) 
        {
          
          //console.log('next_props.MutualBusq.nombre undefined')
          //console.log(next_props.MutualBusq);

          this.setState({selectedEspecialidades: next_props.MutualBusq,});
        }
    }
  }
  
  TraerEspecialidades = () => {
    var  cart = [];
    var config = {
      headers: {'Authorization': `Bearer ${token}`}
    };
    //console.log(`http://ServerGya:8080/api/mutuales`);
      axios.get(`${urlRest}especialidades`,config)
        .then(response => {
          //console.log('respuestaEspecialidades');
          //console.log(response);
          
          //console.log(response.data.length)
          if ( response.data.length !== 0 ){
            var i;
            for (i = 0; i < response.data.length; i++) { 
              //response.data[i].nombre;
              cart[i] = {
                value : response.data[i].codigo,
                label : response.data[i].nombre,
              };
           
              //this.options[value] = response.data[i].codigo;
              //this.options[label] = response.data[i].nombre;
            }
            
            this.setState({
              especialidades:cart,
              
            });

            
          }
            }
        )
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log('Error');
            console.log(e.response);
        });
  }

  TraerPrestadores = () => {
    var  cart = [];
    var config = {
      headers: {'Authorization': `Bearer ${token}`}
    };
    //console.log(`http://ServerGya:8080/api/mutuales`);
      axios.get(`${urlRest}prestadores`, config)
        .then(response => {
          //console.log('respuestaPrestadores');
          //console.log(response);
          
          //console.log(response.data.length)
          if ( response.data.length !== 0 ){
            var i;
            for (i = 0; i < response.data.length; i++) { 
              //response.data[i].nombre;
              cart[i] = {
                value : response.data[i].codigo,
                label : response.data[i].nombre,
                especialidad : response.data[i].especialidad,
              };
           
              //this.options[value] = response.data[i].codigo;
              //this.options[label] = response.data[i].nombre;
            }
            
            this.setState({
              prestadores:cart,
              
            });

            
          }
            }
        )
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log('Error');
            console.log(e.response);
        });
  }


  render() {
    const { selectedEspecialidades,selectedPrestador } = this.state;
    
    return (
      <Grid fluid>
        <Row>
          <Col xs={12}>
            <Select
              value={selectedEspecialidades}
              onChange={this.handleChangeEspecialidades}
              options={this.state.especialidades}
              placeholder="Seleccione una Especialidad"
            />
          </Col>
        </Row>
        <Row>
          <p></p>
        </Row>
        <Row>
          <Col xs={12}>
            <Select
              value={selectedPrestador}
              onChange={this.handleChangePrestador}
              options={this.state.prestadoresFiltro}
              placeholder="Seleccione un Prestador"
            />
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default autocompletarPrestador;