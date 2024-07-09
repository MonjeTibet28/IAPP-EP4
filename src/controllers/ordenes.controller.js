import {getConnection} from '../database/database'


const createOrden = async (req, res) => {
    try {
        const { cliente_id, productos, total, estado } = req.body;

        if (!cliente_id || !productos || productos.length === 0 || !total || !estado) {
            return res.status(400).json({ 'message': 'Todos los campos son obligatorios' });
        }
        const cn = await getConnection();
        const result = await cn.query(`INSERT INTO ordenes (cliente_id, total, estado) VALUES (?, ?, ?)`, [cliente_id, total, estado]);
        const ordenId = result.insertId;
        productos.forEach(async (producto) => {
            await cn.query(`INSERT INTO detallesOrdenes (orden_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)`,
                 [ordenId, producto.id, producto.cantidad, producto.precio]);
        });

        res.status(201).json({ 'message': 'Orden creada', 'id': ordenId });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const getOrden = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 'message': 'El ID de la orden es obligatorio' });
        }

        const cn = await getConnection();
        const [orden] = await cn.query('SELECT * FROM ordenes WHERE id = ?', [id]);

        if (!orden) {
            return res.status(404).json({ 'message': 'Orden no encontrada' });
        }

        const detalles = await cn.query(`
            SELECT p.id, p.nombre, p.precio, do.cantidad
            FROM detallesOrdenes do
            JOIN productos p ON do.producto_id = p.id
            WHERE do.orden_id = ?
        `, [id]);

        res.status(200).json({ orden, detalles });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


const updateOrden = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!id || !estado) {
            return res.status(400).json({ 'message': 'El ID y el estado son obligatorios' });
        }

        const estadosValidos = ['pendiente', 'enviado', 'entregado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({ 'message': 'Estado inválido. Debe ser uno de: pendiente, enviado, entregado' });
        }


        const cn = await getConnection();
        const result = await cn.query(`UPDATE ordenes SET estado = ? WHERE id = ?`, [estado, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Orden no encontrada' });
        }

        res.status(200).json({ 'message': 'Orden actualizada' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteOrden = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 'message': 'El ID es obligatorio' });
        }

        const cn = await getConnection();
        const result = await cn.query(`DELETE FROM ordenes WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Orden no encontrada' });
        }

        res.status(200).json({ 'message': 'Orden eliminada' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}



export const methods = {
    createOrden, 
    getOrden, 
    updateOrden,
    deleteOrden
}