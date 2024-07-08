import { Router } from 'express'
import {methods as ordenesController} from '../controllers/ordenes.controller'

const router = Router()

router.get('/api/orden/:id', ordenesController.getOrden)
router.post('/api/orden', ordenesController.createOrden)
router.put('/api/orden/:id', ordenesController.updateOrden)
router.delete('/api/orden/:id', ordenesController.deleteOrden)


export default router