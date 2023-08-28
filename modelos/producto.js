export default class Producto {
    id = "";
    nombre = "";
    precio = "";
    descripcion = "";
};

/*
const express = require('express');
const uuid = require('uuid');

const { 
    crearOrden, 
    agregarProducto, 
    agregarProductoAlCarrito, 
    obtenerOrdenesDeUsuario, 
    obtenerCarrito 
} = require('./redis/index');

const app = express();
const port = 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenido a la aplicación CRUD con Redis');
});

app.post('/crear-producto', async (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    const newGuid = uuid.v4();
    await agregarProducto({id: newGuid, nombre: nombre, precio: precio, descripcion: descripcion});
    res.send(`Producto creado con exito ${newGuid}`);
});

app.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
});



// Consultar un registro
app.get('/consultar/:clave', async (req, res) => {
    const clave = req.params.clave;
    await client.connect();
    let response = await client.get(clave);
    res.send(response);
});

// Actualizar un registro
app.put('/actualizar/:clave', async (req, res) => {
    const clave = req.params.clave;
    const nuevoValor = req.body.valor;
    await client.connect();
    let response = await client.set(clave, nuevoValor);
    red.send(response);
});


// Eliminar un registro
app.delete('/eliminar/:clave', async (req, res) => {
    const clave = req.params.clave;
    await client.connect();

    let response = await client.del(clave);
    res.send(response==0);
});



*/