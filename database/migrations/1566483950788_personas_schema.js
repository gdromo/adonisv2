'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonasSchema extends Schema {
  up () {
    this.create('personas', (table) => {
      table.increments()
      table.string('nombre', 80).notNullable()
      table.string('apellido')
      table.string('dni')
      table.datetime('fNacimiento')
      table.string('telefono')
      table.string('direccion')
      table.string('sexo')
      table.boolean('emailVerificado')
      table.timestamps()
    })
  }

  down () {
    this.drop('personas')
  }
}

module.exports = PersonasSchema
