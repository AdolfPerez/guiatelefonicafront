import axios from "axios"

const urlBase = '/api/persons'

const getAll = () => {
  const response = axios.get(urlBase)
  return response.then(({ data }) => data)
}

const create = newObject => {
  const request = axios.post(urlBase, newObject)
  return request.then(({ data }) => data)
}

const update = (id, newObject) => {
  const request = axios.put(`${urlBase}/${id}`, newObject)
  return request.then(({ data }) => data)
}

const deleteOne = id => {
  const request = axios.delete(`${urlBase}/${id}`)
  return request.then(({ data }) => data)
}

export default { getAll, create, update, deleteOne }