import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Paciente from './paciente/paciente';
import Turno from './turno/turnos';
import PageError from './PageError/PageError';
import Login from './login/login';
import BuscarporNombre from './buscarporNombre/buscarporNombre';
import TurnoPaciente from './turnoPaciente/turnoPaciente';



import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route
              exact
              path="/"
              component={Login} />
            <Route
              exact
              path="/Paciente"
              component={Paciente} />
            <Route
              exact
              path="/Turno"
              component={Turno} />
            <Route
              exact
              path="/BuscarporNombre"
              component={BuscarporNombre} />
            <Route
              exact
              path="/TurnoPaciente"
              component={TurnoPaciente} />
            <Route component={PageError} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

