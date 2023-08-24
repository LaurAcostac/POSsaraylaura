function limpiarCarrito() {
  localStorage.removeItem('carritocookie');
  }

document.getElementById('carritocompra').value = localStorage.getItem('carritocookie'); // Llenamos el input con la información del carrito
console.log(localStorage.getItem('carritocookie'));
// Función para mostrar el contenido del carrito en el formulario
function mostrarCarrito() {
  // Donde se mostrará el contenido del carrito
  const divCarrito = document.getElementById('contenidoCarrito');

    // Obtener el contenido del carrito almacenado en localStorage
    const carrito = JSON.parse(localStorage.getItem('carritocookie')) || [];
    console.log('este es '+carrito)
    // Limpiar el contenido previo del div
    divCarrito.innerHTML = '';

    // Recorrer los productos del carrito y mostrarlos en el formulario
    carrito.forEach((producto) => {
      const divProducto = document.createElement('div');
      divProducto.innerHTML = `
      <div class="form-outline mb-4 col-md-6 d-flex justify-content-between w-100">
      <div class="w-25">
      <img src="https://karibik.vtexassets.com/arquivos/ids/206081-300-300?v=1772756345&width=300&height=300&aspect=true" class="w-100 rounded">
      
      </div>
    <div class="d-flex flex-column justify-content-center align-items-center w-75">
      <h4 style="color: black;">${producto.nombre}</h4>
      <p style="color: black;>$${producto.precio}</p>
      <p style="color: black;>$${producto.precio * producto.cantidad}</p>
      <div class="d-flex align-items-center ms-4 me-4"> 
      <p style="color:black;font-weight: bold">Cantidad:</p><br>
      <input class="form-control form-control-xs ms-2 me-2 text-center" value="${producto.cantidad}" readonly>


    </div>

  </div>
  
</div>
  `;
      divCarrito.appendChild(divProducto);
    });
    let total = 0;
    carrito.forEach((producto) => {
    total += parseFloat(producto.precio * producto.cantidad)
    })
    totalPrecio.innerHTML = `<p class="m-0">Total a pagar: $${total.toFixed(2)}</p>
    `
  }

  function sumar(id){
  carrito.find(producto =>{
    if(producto.id == id){
      producto.cantidad++
    }
  })
  guardarCookies();
  crearCarrito()
}
function restar(id){
  carrito.find(producto =>{
    if(producto.id == id){
      producto.cantidad--
      if(producto.cantidad == 0){
        borrarProducto(id);
      }
    }
  })
  guardarCookies();
  crearCarrito();
}

