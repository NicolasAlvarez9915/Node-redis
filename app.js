const express = require('express');
const app = express();
const port = 3002;

const { 
    crearOrden, 
    agregarProducto, 
    agregarProductoAlCarrito, 
    obtenerOrdenesDeUsuario, 
    obtenerCarrito,
    obtenerDetallesDeProducto,
    obtenerTodosLosProductos,
    obtenerTodasLasOrdenes,
    obtenerOrden 
} = require('./redis/index');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenido a la aplicación CRUD con Redis');
});

app.post('/crear-producto', async (req, res) => {
    const { nombre, precio, descripcion } = req.body;
    res.send(await agregarProducto({ nombre: nombre, precio: precio, descripcion: descripcion}));
});

app.get('/Obtener-productos',async (req, res) => {
    res.send(await obtenerTodosLosProductos());
});

app.get('/Obtener-producto/:id',async (req, res) => {
    res.send(await obtenerDetallesDeProducto(req.params.id));
});

app.get('/obtenerCarrito/:usuarioId',async (req, res) => {
    res.send(await obtenerCarrito(req.params.usuarioId));
});

app.post('/anadir-producto-carrito', async (req, res) =>{
    const { usuarioId, productoId, cantidad } = req.body;
    res.send(await agregarProductoAlCarrito(usuarioId, productoId, cantidad));
});

app.get('/agregar-orden/:usuarioId', async (req, res) =>{
    res.send(await crearOrden(req.params.usuarioId));
});

app.get('/obtener-orden-usuario/:usuarioId', async (req, res) =>{
    res.send(await obtenerOrdenesDeUsuario(req.params.usuarioId));
});

app.get('/obtener-ordenes', async (req, res) =>{
    res.send(await obtenerTodasLasOrdenes());
});

app.get('/obtener-orden/:ordenId', async (req, res) =>{
    res.send(await obtenerOrden(req.params.ordenId));
});

app.listen(port, () => {
    console.log(`Servidor Express iniciado en el puerto ${port}`);
});