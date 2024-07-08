import express, { urlencoded } from 'express'
import morgan  from 'morgan'
import cliente from './routes/cliente.routes'
import categorias from './routes/categorias.routes'
import ordenes from './routes/ordenes.routes'
import producto from './routes/producto.routes'

const app = express()

app.set('port', 4000)

app.use(morgan('dev'))
app.use(express.json())
app.use(urlencoded({extended: false}))


app.use(cliente)
app.use(categorias)
app.use(ordenes)
app.use(producto)

export default app