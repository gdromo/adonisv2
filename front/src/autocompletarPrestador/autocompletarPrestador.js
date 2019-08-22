import React from 'react';
import Select from 'react-select';
//import Prestadores from '../datos/prestadores';

import axios from 'axios';
import { urlRest } from '../datos/Config';


var options = [];
var token = '';

class autocompletarPrestador extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      prestadores:[],
      };

  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.onSelectPrestador(selectedOption.value); 
    //console.log(`Option selected:`, selectedOption);
  }
  componentDidMount() {
    //console.log('El componente Mutuales está disponible en el DOM');
    
    token = sessionStorage.getItem("AppOfertaTurnoToken");
    this.TraerPrestadores();
  }

  componentWillReceiveProps(next_props) {
    //console.log('componentWillReceiveProps');


    if (next_props.MutualBusq !== undefined && next_props.MutualBusq !== null) 
    {
      if (next_props.MutualBusq.nombre !== undefined ) 
        {
          var prestadorSeleccionado= {};
          //console.log('next_props.MutualBusq.nombre')
          //console.log(next_props.MutualBusq);
          
          prestadorSeleccionado = {
            value:next_props.MutualBusq.codigo,
            label:next_props.MutualBusq.nombre,
          };
          this.setState({selectedOption: prestadorSeleccionado,});
        }
      if (next_props.MutualBusq.nombre === undefined ) 
        {
          
          //console.log('next_props.MutualBusq.nombre undefined')
          //console.log(next_props.MutualBusq);

          this.setState({selectedOption: next_props.MutualBusq,});
        }
    }
  }
  
  TraerPrestadores = () => {
    var  cart = [];
    var config = {
      headers: {'Authorization': `Bearer ${token}`}
    };
    //console.log(`http://ServerGya:8080/api/mutuales`);
      axios.get(`${urlRest}prestadores`, config)
        .then(response => {
          //console.log('respuesta');
          //console.log(response);
          
          //console.log(response.data.length)
          if ( response.data.length !== 0 ){
            var i;
            for (i = 0; i < response.data.length; i++) { 
              //response.data[i].nombre;
              cart[i] = {
                value : response.data[i].codigo,
                label : response.data[i].nombre
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
    const { selectedOption } = this.state;
    options = this.state.prestadores;
    return (
      <div>
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          placeholder="Seleccione un Prestador"
        />
      </div>
    );
  }
}

export default autocompletarPrestador;