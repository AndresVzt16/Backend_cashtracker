import colors from 'colors'
import server from './server'

const port = process.env.PORT || 4000

server.listen(port,() => {
    console.log(colors.cyan.bold(`SERVIDOR INICIADO`))
    console.log(colors.cyan.bold(`REST API iniciada en el puerto: ${port}`))
})
