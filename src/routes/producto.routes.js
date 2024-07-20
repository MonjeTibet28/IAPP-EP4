import { Router } from 'express'
import {methods as productoController} from '../controllers/producto.controller'
import verifyToken from '../middleware/auth'

const router = Router()

router.get('/api/producto/:id', verifyToken, productoController.getProducto)
router.post('/api/producto', verifyToken ,productoController.createProducto)
router.put('/api/producto/:id', verifyToken ,productoController.updateProducto)
router.delete('/api/producto/:id', verifyToken ,productoController.deleteProducto)

export default router