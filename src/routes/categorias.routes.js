import { Router } from 'express'
import {methods as categoriasController} from '../controllers/categoria.controller'
import verifyToken from '../middleware/auth'

const router = Router()

router.get('/api/categoria', verifyToken,categoriasController.getCategoria)
router.post('/api/categoria', verifyToken,categoriasController.createCategoria)
router.put('/api/categoria/:id', verifyToken, categoriasController.updateCategoria)
router.delete('/api/categoria/:id', verifyToken,categoriasController.deleteCategoria)

export default router