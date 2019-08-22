import React, { Component } from 'react';

import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';



/*import MenuIcon from '@material-ui/icons/Menu';*/
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';

//import red from '@material-ui/core/colors/red';

import { withStyles } from '@material-ui/core/styles';

import * as moment from 'moment';





const ButtonVerde = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
    margin: '5px',
    //minWidth: 30,
    width: '100%',
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}))(Button);
/*
const ButtonRojo = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    margin: '5px',
    //minWidth: 30,
    width: '100%',
    '&:hover': {
      backgroundColor: red[700],
    },
  },
}))(Button);
*/




class TurnosHorarios extends Component {
  constructor() {
    super();
    this.state = {
      fechas: null,
      turnos: []
      };
      
  }

  
  componentDidMount() {
    //console.log('El componente está disponible en el DOM');
    //console.log('componentDidMount');
    //console.log(moment().format());
    //console.log(moment().format('YYYY-MM-DD'));
    // inicio
    
    //console.log(this.props.Abuscar);
    this.setState({fechas: this.props.Abuscar,});

    
  }

  componentWillReceiveProps(next_props) {
    //console.log('componentWillReceiveProps');

    if (next_props.Abuscar !== undefined && next_props.Abuscar !== null) 
    {
     
      this.setState({fechas: next_props.Abuscar,});
    }
  }

  seleccionarTurno = (turno) => {
    //console.log('turno Fecha');
    //console.log(turno);
    
    //console.log(moment(turno.fecha).format('YYYY-MM-DD'));
    this.props.onSelectFecha(moment(turno.fecha).format('YYYY-MM-DD'));

  }

  

  

  render() {
    var TurnoFechas = this.state.fechas;
    var  strToComponentsTurnos =
      TurnoFechas !== null ?
      TurnoFechas.map( (turno, i) => (
        <Col xs={6} md={3} key = {i}>
          <ButtonVerde 
            variant="contained" 
            onClick={() => { this.seleccionarTurno(turno) }}
            >
            {moment(turno.fecha).format('DD/MM/YYYY')}
          </ButtonVerde>
        </Col>
        ))
        :
        <p></p>
        ;
    return (
      <Grid fluid>
          <Card >
            <CardContent >
                <Row>
                  {strToComponentsTurnos}
                </Row>
            </CardContent>
          </Card>
      </Grid>
    );
  }
}

export default TurnosHorarios;