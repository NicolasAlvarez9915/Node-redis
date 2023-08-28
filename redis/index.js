const redis = require('redis');
const uuid = require('uuid');
const client = redis.createClient();

client.on('error', (error) => {
    console.error('Error de Redis:', error);
});

async function agregarProducto(producto) {
    const newGuid = uuid.v4();
    client.connect();
    await client.hSet(`producto:${newGuid}`, "id", newGuid);
    await client.hSet(`producto:${newGuid}`, "precio", producto.precio);
    await client.hSet(`producto:${newGuid}`, "descripcion", producto.descripcion); 
    await client.hSet(`producto:${newGuid}`, "nombre", producto.nombre);
    let response = await client.hGetAll(`producto:${newGuid}`);
    client.quit();
    return response;
}

async function agregarProductoAlCarrito(usuarioId, productoId, cantidad) {
    client.connect();

    let carrito = await client.hGetAll(`carrito:${usuarioId}`);

    if (JSON.stringify(carrito) === '{}'){
        carrito = {
            usuarioId: usuarioId,
            productos:"[]"
        }
    }

    let productos = JSON.parse(carrito.productos);
    productos.push({productoId: productoId, cantidad: cantidad});
    carrito.productos = JSON.stringify(productos);

    await client.hSet(`carrito:${usuarioId}`, "usuarioId", carrito.usuarioId);
    await client.hSet(`carrito:${usuarioId}`, "productos", carrito.productos);

    carrito = await client.hGetAll(`carrito:${usuarioId}`);	
    carrito.productos = JSON.parse(carrito.productos);

    client.quit();
    return carrito;
}

async function crearOrden(usuarioId) {
    const ordenId = uuid.v4();
    client.connect();
    const carrito = await obtenerCarrito(usuarioId, false);
    await client.hSet(`orden:${ordenId}`, "usuario", usuarioId);
    await client.hSet(`orden:${ordenId}`, "carrito", JSON.stringify(carrito));
    await client.rPush(`ordenes:${usuarioId}`, ordenId);
    let response = await client.del(`carrito:${usuarioId}`);
    client.quit();
    return {ordenId, usuarioId, carrito, "carritoReiniciado": response == 1}
}

async function obtenerDetallesDeProducto(productoId) {
    client.connect();
    let producto = await client.hGetAll(`producto:${productoId}`);
    client.quit();
    return producto;
}


async function obtenerTodosLosProductos() {
    client.connect();
    const productosIds = await client.keys('producto:*');
    let productos = [];
    for (let i = 0; i < productosIds.length; i++){
        let producto = await client.hGetAll(productosIds[i]);
        productos.push(producto);
    }
    client.quit();
    return productos;
}

async function obtenerTodasLasOrdenes() {
    client.connect();
    const ordenesIds = await client.keys('orden:*');
    let ordenes = [];
    for (let i = 0; i < ordenesIds.length; i++){
        let orden = await client.hGetAll(ordenesIds[i]);
        orden.ordenId = ordenesIds[i];
        orden.carrito = JSON.parse(orden.carrito);
        ordenes.push(orden);
    }
    client.quit();
    return ordenes;
}

async function obtenerOrden(ordenId) {
    client.connect();
    let orden = await client.hGetAll(ordenId);
    orden.ordenId = ordenId;
    orden.carrito = JSON.parse(orden.carrito);
    client.quit();
    return orden
}

async function obtenerOrdenesDeUsuario(usuarioId) {
    client.connect();
    let ordenes = await client.lRange(`ordenes:${usuarioId}`, 0, -1);
    let detalles = [];
    for (let i = 0; i < ordenes.length; i++) {
        let  orden = await client.hGetAll(`orden:${ordenes[i]}`);
        orden.ordenId = `orden:${ordenes[i]}`;
        orden.carrito = JSON.parse(orden.carrito);
        detalles.push(orden);
    }
    client.quit();
    return detalles;
}

async function obtenerCarrito(usuarioId,conectar = true) {
    if(conectar)client.connect();
    let carrito = await client.hGetAll(`carrito:${usuarioId}`);
    if(JSON.stringify(carrito) !== '{}'){
        let productos = JSON.parse(carrito.productos);
        let detalleProductos = [];
        carrito.total = 0;
        for (let i = 0; i < productos.length; i++) {
            let producto = await client.hGetAll(`producto:${productos[i].productoId}`);
            producto.cantidad = productos[i].cantidad;
            detalleProductos.push(producto);
            carrito.total += producto.cantidad * producto.precio;
        }
        if(conectar)client.quit();
        carrito.productos = detalleProductos;
    }
    return carrito;
}


module.exports = { obtenerOrden, 
    crearOrden, 
    agregarProducto, 
    obtenerTodosLosProductos, 
    obtenerDetallesDeProducto, 
    agregarProductoAlCarrito, 
    obtenerOrdenesDeUsuario, 
    obtenerCarrito, 
    obtenerTodasLasOrdenes 
}