import React from 'react';
import Select from 'react-select';

import axios from 'axios';
import { urlRest } from '../datos/Config';



var options = [];
var token = '';


class autocompletarMutual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      mutuales:[],
      };

  }

  handleChange = (selectedOption) => {
    //console.log('handleChange');
    this.setState({ selectedOption });
    this.props.onSelectMutual(selectedOption); 
    //console.log(`Option selected:`, selectedOption);
  }
  
  componentDidMount() {
    //console.log('El componente Mutuales está disponible en el DOM');
    token = sessionStorage.getItem("AppOfertaTurnoToken");
    this.TraerMutuales();
  }

  componentWillReceiveProps(next_props) {
    //console.log('componentWillReceiveProps');


    if (next_props.MutualBusq !== undefined && next_props.MutualBusq !== null) 
    {
      if (next_props.MutualBusq.nombre !== undefined ) 
        {
          var mutualSeleccionada= {};
          //console.log('next_props.MutualBusq.nombre')
          //console.log(next_props.MutualBusq);
          
          mutualSeleccionada = {
            value:next_props.MutualBusq.codigo,
            label:next_props.MutualBusq.nombre,
          };
          this.setState({selectedOption: mutualSeleccionada,});
        }
      if (next_props.MutualBusq.nombre === undefined ) 
        {
          
          //console.log('next_props.MutualBusq.nombre undefined')
          //console.log(next_props.MutualBusq);

          this.setState({selectedOption: next_props.MutualBusq,});
        }
    }
  }
  
  TraerMutuales = () => {
    var  cart = [];
    var config = {
      headers: {'Authorization': `Bearer ${token}`}
    };
    //console.log(`http://ServerGya:8080/api/mutuales`);
      axios.get(`${urlRest}mutuales`, config)
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
              mutuales:cart,
              
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
      
      /*console.log('options222222');
      console.log(this.state.mutuales);
      console.log(this.state.selectedOption);*/
      options = this.state.mutuales;
    return (
      <div>
        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={options}
          placeholder="Seleccione una Mutual"
          
        />
      </div>
    );
  }
}

export default autocompletarMutual;