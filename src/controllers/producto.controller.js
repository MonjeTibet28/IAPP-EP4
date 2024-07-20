import {getConnection} from '../database/database'

const createProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, cantidad_stock, categoria_id, detalles } = req.body;

        if (!nombre || !precio || !cantidad_stock || !categoria_id) {
            return res.status(400).json({ 'message': 'Todos los campos son obligatorios' });
        }
        const cn = await getConnection();
        const [categoria] = await cn.query('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
           if (!categoria) {
               return res.status(400).json({ 'message': 'ID de categoría no válida' });
           }
        const result = await cn.query(`INSERT INTO productos (nombre, descripcion, precio, cantidad_stock, categoria_id) VALUES (?, ?, ?, ?, ?)`,
             [nombre, descripcion, precio, cantidad_stock, categoria_id]);
        const productoId = result.insertId;
        if (detalles && detalles.length > 0) {
            detalles.forEach(async (detalle) => {
                await cn.query(`INSERT INTO detallesProductos (producto_id, detalle, valor) VALUES (?, ?, ?)`, [productoId, detalle.detalle, detalle.valor]);
            });
        }
        res.status(201).json({ 'message': 'Producto creado', 'id': productoId });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const getProducto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 'message': 'El ID del producto es obligatorio' });
        }

        const cn = await getConnection();
        const [producto] = await cn.query('SELECT * FROM productos WHERE id = ?', [id]);
        if (!producto) {
            return res.status(404).json({ 'message': 'Producto no encontrado' });
        }

        const detalles = await cn.query('SELECT * FROM detallesProductos WHERE producto_id = ?', [id]);

        res.status(200).json({ producto, detalles });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, cantidad_stock, categoria_id } = req.body;

        if (!id || (!nombre && !descripcion && !precio && !cantidad_stock && !categoria_id)) {
            return res.status(400).json({ 'message': 'El ID y al menos un campo para actualizar son obligatorios' });
        }

        const cn = await getConnection();
        const result = await cn.query(`UPDATE productos SET nombre = IFNULL(?, nombre), descripcion = IFNULL(?, descripcion), precio = IFNULL(?, precio),
             cantidad_stock = IFNULL(?, cantidad_stock), categoria_id = IFNULL(?, categoria_id) WHERE id = ?`, [nombre, descripcion, precio, cantidad_stock, categoria_id, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Producto no encontrado' });
        }

        res.status(200).json({ 'message': 'Producto actualizado' });
    } catch (error) {
        res.status  (500).send(error.message);
    }
}

const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 'message': 'El ID es obligatorio' });
        }

        const cn = await getConnection();

        const detalles = await cn.query(`SELECT * FROM detalles WHERE producto_id = ?`, [id]);

        if (detalles.length > 0) {
            return res.status(400).json({ 'message': 'No se puede eliminar el producto porque tiene detalles asociados' });
        }

        const result = await cn.query(`DELETE FROM productos WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Producto no encontrado' });
        }

        res.status(200).json({ 'message': 'Producto eliminado' });
    } catch (error) {
       // console.error('Error al eliminar el producto:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 'message': 'No se puede eliminar el producto porque tiene detalles asociados' });
        }
        res.status(500).json({ 'message': 'Error al eliminar el producto' });

    }
}



export const methods = {
    createProducto,
    getProducto,
    updateProducto,
    deleteProducto
}