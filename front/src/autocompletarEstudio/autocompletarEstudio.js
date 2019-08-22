import React from 'react';
import Select from 'react-select';
//import Estudios from '../datos/estudios';

import axios from 'axios';
import { urlRest } from '../datos/Config';


var options = [];
var token = '';

class autocompletarEstudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      estudios:[],
      };

  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.onSelectEstudio(selectedOption); 
    //console.log(`Option selected:`, selectedOption);
  }

  componentDidMount() {
    //console.log('El componente Mutuales está disponible en el DOM');
    token = sessionStorage.getItem("AppOfertaTurnoToken");
    this.TraerEstudios();
  }

  componentWillReceiveProps(next_props) {
    //console.log('componentWillReceiveProps');


    if (next_props.MutualBusq !== undefined && next_props.MutualBusq !== null) 
    {
      if (next_props.MutualBusq.nombre !== undefined ) 
        {
          var estudioSeleccionado= {};
          //console.log('next_props.MutualBusq.nombre')
          //console.log(next_props.MutualBusq);
          
          estudioSeleccionado = {
            value:next_props.MutualBusq.codigo,
            label:next_props.MutualBusq.nombre,
          };
          this.setState({selectedOption: estudioSeleccionado,});
        }
      if (next_props.MutualBusq.nombre === undefined ) 
        {
          
          //console.log('next_props.MutualBusq.nombre undefined')
          //console.log(next_props.MutualBusq);

          this.setState({selectedOption: next_props.MutualBusq,});
        }
    }
  }
  
  TraerEstudios = () => {
    var  cart = [];
    var config = {
      headers: {'Authorization': `Bearer ${token}`}
    };
    //console.log(`http://ServerGya:8080/api/mutuales`);
      axios.get(`${urlRest}estudios`, config)
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
              estudios:cart,
              
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

  handleKeyPress(key) {
    //console.log('handleKeyPress');
    //console.log(key);
    
    if (key.key ==='Enter') {
      //console.log('handleKeyPress Enter');
      

    }
    //console.log(key);

    //console.log(key.key);
    //console.log(key.keyCode);
  }

  render() {
    const { selectedOption } = this.state;
    options = this.state.estudios;

    return (
      <div>
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          onKeyDown={event => this.handleKeyPress(event)}
          options={options}
          placeholder="Seleccione un Estudio"
        />
      </div>
    );
  }
}

export default autocompletarEstudio;