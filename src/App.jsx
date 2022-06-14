import React, { useState, useEffect } from 'react'
import operaciones from './services/operaciones'

const Notification = ({ message, color }) => {
  if (message === null) {
    return null
  }
  return (
    <div style={{
      color: color,
      background: `lightgrey`,
      fontSize: 20,
      borderStyle: `solid`,
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }} className='exito'>
      {message}
    </div>
  )
}

const Filter = props => <div>filter shown with <input value={props.value} onChange={props.onChange} /></div>

const PersonForm = props => <form onSubmit={props.onSubmit}>
  <div>name: <input value={props.valueName} onChange={props.onChangeName} /></div>
  <div>number: <input type="number" value={props.valueNumber} onChange={props.onChangeNumber} /></div>
  <div><button type="submit" onClick={props.onClick}>add</button></div>
</form>

const Persons = ({ imprimir, funcionDelete }) => <ul>{
  imprimir.map(
    person => <li key={person.name}> {person.name} {person.number} <button onClick={
      () => funcionDelete(person)
    }>delete</button> </li>
  )
}</ul>

const App = () => {

  const [persons, setPersons] = useState([])
  const [imprimir, setImprimir] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [color, setColor] = useState(null)

  const funcionFiltro = event => {
    setSearch(event.target.value)
    let found = []
    persons.forEach(person => {
      if (person.name.toLowerCase().slice(0, event.target.value.length) === event.target.value.toLowerCase()) {
        found.push(person)
        setImprimir(found)
      }
    }
    )
  }

  const funcionNombre = event => {
    setNewName(event.target.value)
    persons.forEach(
      person => {
        if (event.target.value === person.name) alert(`${event.target.value} is already added to phonebook`)
      }
    )
  }

  const funcionNumero = event => {
    setNewNumber(event.target.value)
  }

  const funcionAgregar = () => {
    let found = false
    persons.forEach(person => {
      if (person.name === newName) {
        found = person
      }
    })
    if (found) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        if (newNumber && newNumber.length > 7) {
          operaciones.update(found.id, { ...found, number: newNumber })
            .then(
              actualizado => {
                console.clear()
                console.log(`actualizado`, actualizado)
                operaciones.getAll()
                  .then(
                    obtenido => {
                      console.log(`obtenido`, obtenido)
                      setImprimir(obtenido)
                      setPersons(obtenido)
                      setNewName('')
                      setNewNumber('')
                    }
                  )
              }
            )
            .catch(
              error => {
                console.clear()
                console.error(error)
                operaciones.getAll()
                  .then(
                    obtenido => {
                      console.log(`obtenido`, obtenido)
                      setImprimir(obtenido)
                      setPersons(obtenido)
                    }
                  )
                setMessage(`Information of ${newName} has already been removed from server`)
                setColor(`red`)
                setTimeout(() => {
                  setMessage(null)
                }, 3000)
              }
            )
        } else {
          setMessage(`El numero debe contener por lo menos ocho digitos`)
          setColor(`red`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)

        }
      }
    } else {
      operaciones.create({ name: newName, number: newNumber })
        .then(agregado => {
          console.clear()
          console.log(`agregado`, agregado)
          setPersons(persons.concat(agregado))
          setImprimir(persons.concat(agregado))
          setNewName('')
          setNewNumber('')
          setMessage(`Added ${agregado.name}`)
          setColor(`green`)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
        .catch(
          error => {
            setMessage(error.response.data.error)
            setColor(`red`)
            setTimeout(() => {
              setMessage(null)
            }, 3000)
          }
        )
    }
  }

  const funcionDelete = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      operaciones.deleteOne(person.id)
        .then(
          eliminado => {
            console.clear()
            console.log(`eliminado`, eliminado)
            operaciones.getAll()
              .then(
                obtenido => {
                  console.log(`obtenido`, obtenido)
                  setImprimir(obtenido)
                  setPersons(obtenido)
                }
              )
          }
        )
    }
  }

  useEffect(() => {
    operaciones.getAll()
      .then(obtenido => {
        console.clear()
        console.log(`obtenido`, obtenido)
        setPersons(obtenido)
        setImprimir(obtenido)
      })
  }, [])

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={message} color={color} />
      <Filter value={search} onChange={funcionFiltro} />
      <h2>add a new</h2>
      <PersonForm
        onSubmit={event => event.preventDefault()}
        valueName={newName}
        onChangeName={funcionNombre}
        valueNumber={newNumber}
        onChangeNumber={funcionNumero}
        onClick={funcionAgregar}
      />
      <h2>Numbers</h2>
      <Persons imprimir={imprimir} funcionDelete={funcionDelete} />
    </>
  )
}
export default App