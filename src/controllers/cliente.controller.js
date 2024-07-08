import {getConnection} from '../database/database'

const createCliente = async (req, res) => {
    try {
        const { nombre, email, telefono, direccion_envio } = req.body;

        if (!nombre || !email || !telefono || !direccion_envio) {
            return res.status(400).json({ 'message': 'Todos los campos son obligatorios' });
        }

        const cn = await getConnection();
        const result = await cn.query(`INSERT INTO clientes (nombre, email, telefono, direccion_envio) VALUES (?, ?, ?, ?)`, [nombre, email, telefono, direccion_envio]);

        res.status(201).json({ 'message': 'Cliente registrado', 'id': result.insertId });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const getCliente = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 'message': 'El ID es obligatorio' });
        }

        const cn = await getConnection();
        const result = await cn.query(`SELECT * FROM clientes WHERE id = ?`, [id]);

        if (result.length === 0) {
            return res.status(404).json({ 'message': 'Cliente no encontrado' });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, telefono, direccion_envio } = req.body;

        if (!id || (!nombre && !email && !telefono && !direccion_envio)) {
            return res.status(400).json({ 'message': 'El ID y al menos un campo para actualizar son obligatorios' });
        }

        const cn = await getConnection();
        const result = await cn.query(`UPDATE clientes SET nombre = IFNULL(?, nombre), email = IFNULL(?, email), 
            telefono = IFNULL(?, telefono), direccion_envio = IFNULL(?, direccion_envio) WHERE id = ?`, [nombre, email, telefono, direccion_envio, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Cliente no encontrado' });
        }

        res.status(200).json({ 'message': 'Cliente actualizado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteCliente = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 'message': 'El ID es obligatorio' });
        }

        const cn = await getConnection();
        const result = await cn.query(`DELETE FROM clientes WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Cliente no encontrado' });
        }

        res.status(200).json({ 'message': 'Cliente eliminado' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

export const methods ={
    createCliente, 
    getCliente,
    updateCliente,
    deleteCliente
}