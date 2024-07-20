import { Router } from 'express'
import {methods as ordenesController} from '../controllers/ordenes.controller'
import verifyToken from '../middleware/auth'

const router = Router()

router.get('/api/orden/:id', verifyToken ,ordenesController.getOrden)
router.post('/api/orden', verifyToken ,ordenesController.createOrden)
router.put('/api/orden/:id', verifyToken ,ordenesController.updateOrden)
router.delete('/api/orden/:id', verifyToken ,ordenesController.deleteOrden)


export default router