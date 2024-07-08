import { Router } from 'express'
import {methods as categoriasController} from '../controllers/categoria.controller'

const router = Router()

router.get('/api/categoria', categoriasController.getCategoria)
router.post('/api/categoria', categoriasController.createCategoria)
router.put('/api/categoria/:id', categoriasController.updateCategoria)
router.delete('/api/categoria/:id', categoriasController.deleteCategoria)

export default router