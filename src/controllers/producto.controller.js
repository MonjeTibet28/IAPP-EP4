import {getConnection} from '../database/database'

const createProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, cantidad_stock, categoria_id } = req.body;

        if (!nombre || !precio || !cantidad_stock || !categoria_id) {
            return res.status(400).json({ 'message': 'Todos los campos son obligatorios' });
        }
 
        const cn = await getConnection();
        const [categoria] = await cn.query('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
        
        if (!categoria) {
            return res.status(400).json({ 'message': 'ID de categoría no válida' });
        }

        const result = await cn.query(`INSERT INTO productos (nombre, descripcion, precio, cantidad_stock, categoria_id) 
            VALUES (?, ?, ?, ?, ?)`, [nombre, descripcion, precio, cantidad_stock, categoria_id]);

        res.status(201).json({ 'message': 'Producto creado', 'id': result.insertId });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getProducto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 'message': 'El ID es obligatorio' });
        }

        const cn = await getConnection();
        const result = await cn.query(`SELECT * FROM productos WHERE id = ?`, [id]);

        if (result.length === 0) {
            return res.status(404).json({ 'message': 'Producto no encontrado' });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

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
        const result = await cn.query(`DELETE FROM productos WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Producto no encontrado' });
        }

        res.status(200).json({ 'message': 'Producto eliminado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}



export const methods = {
    createProducto,
    getProducto,
    updateProducto,
    deleteProducto
}