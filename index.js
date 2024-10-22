
const express = require('express')

const app = express()
app.use(express.json())

const uuid = require('uuid')

const orders = []

//Middleware -> ->
const checkUserid = (request, response, next) => {

  const { id } = request.params

  const index = orders.findIndex(user => user.id === id)

  if (index < 0) {
    return response.status(404).json({ message: "Order not found" })
  }

  request.UserIndex = index
  request.UserId = id

  next()

}
//<- <-


app.get('/orders', (request, response) => {
  console.log(request.method)
  console.log(request.url)

  return response.json(orders)

})


app.post('/orders', (request, response) => {

  const { order, clienteName, price } = request.body
  console.log(request.method)
  console.log(request.url)
  const user = { id: uuid.v4(), order, clienteName, price, status: "Em preparação" }

  orders.push(user)

  return response.status(202).json(user)

})


app.put('/orders/:id', checkUserid, (request, response) => {
  console.log(request.method)
  console.log(request.url)

  const { order, clienteName, price } = request.body

  const index = request.UserIndex
  const id = request.UserId

  const updatedOrder = { id, order, clienteName, price, }

  orders[index] = updatedOrder
  return response.json(updatedOrder)

})


app.patch('/orders/:id', checkUserid, (request, response) => {
  console.log(request.method)
  console.log(request.url)

  const { order, clienteName, price } = request.body

  const index = request.UserIndex


  const updatedOrder = {
    ...orders[index], // Mantém os valores antigos do pedido
    order: order || orders[index].order, // Atualiza se fornecido, ou mantém o anterior
    clienteName: clienteName || orders[index].clienteName, // Atualiza se fornecido
    price: price || orders[index].price, // Atualiza se fornecido
    status: "Pedido Pronto" // Atualiza sempre o status
  };

  orders[index] = updatedOrder
  return response.json(updatedOrder)

})



app.get('/orders/:id', (request, response) => {
  console.log(request.method)
  console.log(request.url)

  const id = (request.params.id)
  const usuario = orders.find(user => user.id === id)

  return response.json(usuario)

})



app.delete('/orders/:id', checkUserid, (request, response) => {
  console.log(request.method)
  console.log(request.url)

  const index = request.UserIndex

  orders.splice(index, 1)

  return response.status(204).json()
})


app.listen(3000)