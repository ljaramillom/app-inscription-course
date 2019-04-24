socket = io()

const formulario = document.querySelector('#formulario')
const mensaje = formulario.querySelector('#texto')
const messages = document.querySelector('#messages')

formulario.addEventListener('submit', (datos) => {
    datos.preventDefault()
    const texto = datos.target.elements.texto.value
    const username = datos.target.elements.username.value
    socket.emit('texto', {
        username: username,
        mensaje: texto
    }, () => {
        mensaje.value = ''
        mensaje.focus()
    })
})

socket.on("texto", (text) => {
    console.log(text);
    messages.innerHTML = messages.innerHTML + text.username + ': ' + text.mensaje + '<br>'
})