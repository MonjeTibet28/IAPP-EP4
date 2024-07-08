import { Router } from 'express'
import {methods as productoController} from '../controllers/producto.controller'

const router = Router()

router.get('/api/producto/:id', productoController.getProducto)
router.post('/api/producto', productoController.createProducto)
router.put('/api/producto/:id', productoController.updateProducto)
router.delete('/api/producto/:id', productoController.deleteProducto)

export default router