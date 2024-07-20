import { Router } from 'express'
import {methods as clienteController} from '../controllers/cliente.controller'
import verifyToken from '../middleware/auth'

const router = Router()

router.get('/api/cliente/:id',verifyToken , clienteController.getCliente)
router.post('/api/cliente', verifyToken ,clienteController.createCliente)
router.put('/api/cliente/:id', verifyToken ,clienteController.updateCliente)
router.delete('/api/cliente/:id', verifyToken ,clienteController.deleteCliente)

export default router