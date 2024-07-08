import { Router } from 'express'
import {methods as clienteController} from '../controllers/cliente.controller'

const router = Router()

router.get('/api/cliente/:id', clienteController.getCliente)
router.post('/api/cliente', clienteController.createCliente)
router.put('/api/cliente/:id', clienteController.updateCliente)
router.delete('/api/cliente/:id', clienteController.deleteCliente)

export default router