const socket = io()
const productListRender = document.querySelector('#render-real-time-products')
const form = document.querySelector('#formulario-real-time form')

// Enviar datos del formulario para agregar un nuevo producto
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form)
    const dataProduct = Object.fromEntries(formData.entries())
    let { fotos, ...newProduct } = dataProduct

    fotos = formData.getAll('fotos')

    newProduct.thumbnails = []
    fotos.forEach(foto => {
        if (foto.name) {
            newProduct.thumbnails.push(foto.name)
        }
    })

    try {
        socket.emit('newProduct', { newProduct, fotos }, respuesta => {
            if (respuesta.status === 'ok') {
                form.reset()
            } else {
                Swal.fire('Error:', respuesta.message)
            }
        })
    } catch (error) {
        console.log(error.message)
    }
})

//Renderizar los productos en tiempo real
socket.on('productsList', productsList => {
    productListRender.className = 'products-list'
    productListRender.innerHTML = ''

    productsList.forEach(product => {
        const productoArt = document.createElement('article')
        productoArt.className = 'product'

        if (product.oferta) productoArt.className = 'oferta'
        productoArt.innerHTML = ` 
            <img src="${product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails[0] : 'products/img/noimage.png'}" alt="${product.title}" width="150">
            ${product.oferta ? '<p><strong>Oferta</strong></p>' : ''}
            <h3>${product.title}</h3>
            <p>Codigo: ${product.code}</p>
            <p>Stock: ${product.stock}</p>
            <p class="price">Precio: $${product.price}</p>
            <p>Categoria: ${product.category}</p>
            <p>Description: ${product.description.slice(0, 15).concat('...')}</p>
            <button data-id="${product._id}" id="delete-product-btn">Eliminar</button>`

        productListRender.appendChild(productoArt)
    })
})

//Eliminar Productos
productListRender.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'delete-product-btn') {
        const productId = e.target.getAttribute('data-id')
        const title = e.target.parentElement.querySelector('h3').textContent
        if (productId) {
            try {

                Swal.fire({
                    title: `Quieres Eliminar el Producto ${title}?`,
                    text: "Elegí una opción",
                    showCancelButton: true,
                    confirmButtonText: "Eiminar",
                    denyButtonText: "No Eliminar",
                }).then((result) => {
                    if (result.isConfirmed) {

                        Swal.fire("Eliminado!", title, "success");
                        socket.emit('deleteProduct', productId)
                    } else if (result.isDenied) {

                        Swal.fire("Producto no Eliminado", "", "info");
                    }
                });

            } catch (error) {
                Swal('Error:', error.message)
            }
        }
    }
})

socket.on('disconnect', (reason) => {
    Swal.fire('Desconectado del servidor:', reason)
})

socket.on('error', (error) => {
    Swal.fire('Error:', error.message)
})
