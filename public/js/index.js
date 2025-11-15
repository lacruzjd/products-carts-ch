// acciones de los productos
const addProductButtons = document.querySelectorAll('.add-product')

addProductButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        const cartId = btn.getAttribute('data-cartid')
        const productId = btn.getAttribute('data-productid')

        try {
            const response = await fetch(`api/carts/${cartId}/product/${productId}`,
                {
                    method: 'POST',
                })


            Swal.fire({
                title: '¡Producto Agregado!',
                text: 'El producto ha sido añadido al carrito exitosamente.',
                icon: 'success',
                confirmButtonText: 'Continuar Comprando',
                showCancelButton: true,
                cancelButtonText: 'Ir al Carrito'
            }).then((result) => {
                if (result.isConfirmed) {
                } else if (result.isDismissed) {
                    window.location.href = `/carts/${cartId}`
                }
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error desconocido al añadir el producto.')
            }

        } catch (error) {
            console.error('Error al añadir producto al carrito:', error)

            Swal.fire({
                title: 'Error al Añadir Producto',
                text: error.message || 'Hubo un problema inesperado. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            }).then(() => {

            })

        } finally {

            btn.disabled = false;
        }
    })
})

// Acciones del carrito
const button = document.querySelectorAll('.delete-product-cart')
if (button) {
    button.forEach(btn => {
        btn.onclick = async (e) => {
            const productId = btn.getAttribute('data-productId')
            const cartId = btn.getAttribute('data-cartId')
            await fetch('/carts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cid: cartId, pid: productId })
            })

            btn.parentElement.remove()

        }
    })
}

const buttonDeletProducts = document.querySelector('#vaciar-carrito')
if (buttonDeletProducts) {
    buttonDeletProducts.onclick = async () => {
        const cartId = buttonDeletProducts.getAttribute('data-cartId')
        await fetch(`/carts/${cartId}`, {
            method: 'DELETE'
        })

        const productNodes = buttonDeletProducts.parentElement.querySelectorAll('article')
        productNodes.forEach(p => p.remove())
        buttonDeletProducts.remove()
    }
}

async function actualizarCantidad(value, cid, pid) {
    await fetch(`${cid}/product/${pid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: value })
    })
}



