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
      Abuscar: null,
      turnos: []
      };
      
  }

  
  componentDidMount() {
    //console.log('El componente está disponible en el DOM');
    //console.log('componentDidMount');
    //console.log(moment().format());
    //console.log(moment().format('YYYY-MM-DD'));
    // inicio
    //console.log('this.props.Abuscar.fecha');
    //console.log(this.props.Abuscar);
    this.setState({turnos: this.props.Abuscar,});
  }

  componentWillReceiveProps(next_props) {
    //console.log('componentWillReceiveProps');

    if (next_props.Abuscar !== undefined && next_props.Abuscar !== null) 
    {
      
      //console.log('next_props.Abuscar.fecha');
      //console.log(next_props.Abuscar.fecha);
      if (next_props.Abuscar.fecha !== undefined && next_props.Abuscar.fecha !== null) {
        this.setState({turnos: next_props.Abuscar,});
      }
      

    }
  }

  seleccionarTurno = (turno) => {
    //console.log('seleccionarTurno');
    //console.log(turno);
    this.props.onSelectTurno(turno);

  }

  render() {
    var TurnoCont = this.state.turnos;
    var  strToComponentsTurnos =
      TurnoCont.map( (turno, i) => {
        return(
        <Col xs={6} md={3} key = {i}>
              <ButtonVerde 
                variant="contained" 
                onClick={() => { this.seleccionarTurno(turno) }}
                >
                {moment(turno.hora).format('HH:mm')}
              </ButtonVerde>
        </Col>
        )});
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