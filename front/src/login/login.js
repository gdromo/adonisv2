import React, { Component } from 'react';

import { Grid, Row, Col } from 'react-flexbox-grid';
import '../App.css';


/*import MenuIcon from '@material-ui/icons/Menu';*/
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import cyan from '@material-ui/core/colors/cyan';


import { withStyles } from '@material-ui/core/styles';

import { urlRest } from '../datos/Config';
import axios from 'axios';

/*
const ButtonVerde = withStyles(theme => ({
  root: {
    color: theme.palette.getContrastText(cyan[500]),
    backgroundColor: cyan[500],
    margin: '5px',
    //minWidth: 30,
    width: '250px',
    height: '50px',
    '&:hover': {
      backgroundColor: cyan[700],
    },
  },
}))(Fab);
*/

const ButtonVerde = withStyles(theme => ({
  root: {
    color: 'white',
    background: 'linear-gradient(45deg, #21d4fd 10%, #b721ff 80%)',
    //background: 'linear-gradient(right, #21d4fd, #b721ff, #21d4fd, #b721ff)',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    margin: '5px',
    //minWidth: 30,
    width: '250px',
    height: '50px',
    '&:hover': {
      backgroundColor: cyan[700],
    },
  },
}))(Fab);


class Login extends Component {
  constructor() {
    super();
    this.state = {
      Usuario: {  usuario: '',
                  password: '',
                  token: '',
                  nombre:'',
      },
      errorUsuario:false,
      errorPassword:false,
      errorPasswordMsj:'',
      cargandoLogin:false,
    };
      
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  valueToState = ({ id, value }) => {
    let LoginUsuario = {};
    
    this.setState({ errorUsuario: false,
                    errorPassword: false,
      })

    LoginUsuario['usuario']= this.state.Usuario.usuario;
    LoginUsuario['password']= this.state.Usuario.password;
    LoginUsuario['token']= this.state.Usuario.token;
    
    LoginUsuario[id]= value;

    this.setState({
      Usuario: LoginUsuario,
    });
  };

  
  componentDidMount() {
    //console.log('El componente está disponible en el DOM');
    //console.log('componentDidMount');
    //console.log(this.state.cargandoLogin);
    //console.log(moment().format());
    //console.log(moment().format('YYYY-MM-DD'));
    // inicio
    sessionStorage.removeItem('AppOfertaTurnoToken');
    //console.log(this.urlRest);
  }

  componentWillReceiveProps(next_props) {
    //console.log('componentWillReceiveProps');

  }
  handleSubmit(event) {
    //console.log('handleSubmit');
    //console.log(event);
    this.setState({cargandoLogin: true,
      
      });
    this.Login();
    
    event.preventDefault();
    // do some login logic here, and if successful:
    
  }

  Login = () => {
    //console.log('Login');

    if (this.state.Usuario.usuario !== '' && this.state.Usuario.password !== '')
    {
      this.loginUsuario();
      
    } else {
      if (this.state.Usuario.usuario === '') {
        this.setState({errorUsuario: true,});
      }
      if (this.state.Usuario.password === '') {
        this.setState({errorPassword: true,
                      errorPasswordMsj: 'Debe ingresar Password'
                      });
      }
    };
    
  }

  async loginUsuario () {
    //console.log(`loginUsuario`);
    let LoginUsuario = {};
    let LoginUsuarioEstado = 0;
    let LoginUsuarioToken = '';
      //console.log(`${urlRest}usuarios/?usuario=${this.state.Usuario.usuario}&password=${this.state.Usuario.password}`);
        
      await axios.post(`${urlRest}usuarios/login/`, {
          nombreUsuario: this.state.Usuario.usuario,
          password:this.state.Usuario.password,
        })
        .then(function (response) {
          //console.log('response');
          //console.log(response);
          //console.log(response.data.token);
          LoginUsuarioEstado = response.status;
          LoginUsuarioToken = response.data.token;
          sessionStorage.setItem('AppOfertaTurnoToken', LoginUsuarioToken);
        })
        .catch(function (error) {
          console.log('error');
          console.log(error.response);
        }); 
        var config = {
          headers: {'Authorization': `Bearer ${LoginUsuarioToken}`}
        };

        //console.log(`${urlRest}usuarios?usuario=${this.state.Usuario.usuario}`);
        //console.log(config);
        await axios.get(`${urlRest}usuarios?usuario=${this.state.Usuario.usuario}`, config )
        .then(response => {
          //console.log('respuesta');
          //console.log(response);
           //Datos Usuario
          LoginUsuario['usuario']= this.state.Usuario.usuario;
          LoginUsuario['password']= this.state.Usuario.password;
          LoginUsuario['token']= LoginUsuarioToken
          LoginUsuario['nombre']= response.data[0].nombreCompleto;
          LoginUsuario['codigo']= response.data[0].codigo;
        })
        .catch(e => {
            // Podemos mostrar los errores en la consola
            console.log('Error');
            console.log(e.response);
        });

      if (LoginUsuarioEstado === 200) {
        //console.log('LoginUsuarioEstado === 200');
        //console.log(LoginUsuario);
        this.props.history.push({ pathname: '/paciente', Usuario: LoginUsuario });
      } else {
        this.setState({ errorPassword: true,
                        errorPasswordMsj: 'Usuario o Password incorrecto',
                        cargandoLogin:false,
          });
      }
      
    
}


  
  render() {
    
    return (
      <Grid fluid>
        <form onSubmit={this.handleSubmit}>
          <div className="LoginFondo">
            <Row center="xs">
              <Col xs={12} sm={5} md={4} >
                <Card >
                  <CardContent className="LoginCard">
                      <Row center="xs" className="LoginCabecera">
                        <Typography variant="h4" gutterBottom>
                          Login
                        </Typography>
                      </Row>
                      <Row center="xs" className="LoginIcono">
                        <Icon  style={{ fontSize: 80 }}>
                          account_circle
                        </Icon>
                      </Row>
                      <Row center="xs" className="LoginUsuario">
                        <Col xs={12} sm={10}>
                          <TextField
                            id="usuario"
                            label="Usuario"
                            value={this.state.Usuario.usuario} 
                            onChange={event => this.valueToState(event.target)}
                            margin="normal"
                            fullWidth
                            required
                            autoFocus
                            autoComplete='off'
                          />
                          {
                            this.state.errorUsuario ?
                            <p>Debe ingresar Usuario</p>:
                            <p></p>
                          }
                        </Col>
                      </Row>
                      <Row center="xs" className="LoginPassword">
                        <Col xs={12} sm={10}>
                          <TextField
                            id="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            value={this.state.Usuario.password} 
                            onChange={event => this.valueToState(event.target)}
                            margin="normal"
                            fullWidth
                            required
                          />
                          {
                            this.state.errorPassword ?
                            <p>{this.state.errorPasswordMsj}</p>:
                            <p></p>
                          }
                        </Col>
                      </Row>
                      <Row center="xs">
                        <div className="LoginBoton">
                          { this.state.cargandoLogin ?
                            <CircularProgress />
                          :  
                            <ButtonVerde 
                            variant="extended" 
                            type="submit"
                            
                            >
                            Login
                            </ButtonVerde>
                          }
                        </div>
                      </Row>
                  </CardContent>
                </Card>
              </Col>
            </Row>
          </div>
        </form>
      </Grid>
    );
  }
}

export default Login;
