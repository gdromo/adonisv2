import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';
import TurnoDetalle from '../turnoDetalle/turnosDetalle';


/*import MenuIcon from '@material-ui/icons/Menu';*/
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';

class Turno extends Component {
  

  constructor() {
    super();
    
    this.state = {
    pacienteLocal:null,
    UsuarioLogueado:null,
      };
  }
  componentDidMount() {
    //console.log('El componente está disponible en el DOM Turnos');
    //console.log(this.props.location.Paciente);
    
    if (this.props.location.Paciente === undefined || this.props.location.Paciente.codigo === null || this.props.location.Paciente.codigo === undefined) {
      if (this.props.location.Usuario === null || this.props.location.Usuario === undefined) {

      } else {
        this.setState({ UsuarioLogueado: this.props.location.Usuario,
        });
      }
    }else{
    this.setState({ pacienteLocal: this.props.location.Paciente,
                    UsuarioLogueado: this.props.location.Usuario,
                  });
    }

  }

  render() {

    //console.log('historia', this.props.history);
    //console.log('locación', this.props.location);
    //console.log('match', this.props.match);
    //console.log('Pacientesss', this.state.pacienteLocal);
    
    return (
      <Grid fluid>
        { this.state.UsuarioLogueado == null ?
          <div>
            <p>Debe ingresar Usuario, ir a</p>
            <button onClick={() => { this.props.history.push({ pathname: '/'})}} >login</button>
          </div>
          : 
          this.state.pacienteLocal == null?
           <div>
            <p>No se registro el Paciente</p>
            <button onClick={() => { this.props.history.push({ pathname: '/paciente', Usuario: this.state.UsuarioLogueado})}} >Volver</button>
           </div>
          :
          <Row>
            <Col xs={12} md={12}>
              <Card >
                <CardHeader
                  title= {'Paciente HC: ' + this.state.pacienteLocal.documentoNro + ' - ' + this.state.pacienteLocal.apellido + ', ' + this.state.pacienteLocal.nombre}
                  subheader={'Mutual: ' + this.state.pacienteLocal.mutual + ' - ' + this.state.pacienteLocal.mutualNombre}
                />
                <CardContent>
                <Row>
                  <Col xs={10} md={10}>
                    <Typography variant="h4" gutterBottom>
                      Turnos
                    </Typography>
                  </Col>
                  <Col xs={2} md={2} end="xs">                  
                    <Icon color="error" style={{ fontSize: 30 }}>
                      add_circle
                    </Icon>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={12}>
                    <TurnoDetalle
                    PacienteLocal={this.state.pacienteLocal}
                    UsuarioLogueado={this.state.UsuarioLogueado}
                    ></TurnoDetalle>
                  </Col>
                </Row>
              </CardContent>
            </Card>
          </Col>
          <Col xs={12} md={3}>
            <Button variant="contained" color="primary" 
            onClick={() => { this.props.history.push({ pathname: '/paciente', Usuario: this.state.UsuarioLogueado }) }}
            >
              Volver
            </Button> 
          </Col>
        </Row>
      }
    </Grid>
    );
  }
}

export default withRouter(Turno);