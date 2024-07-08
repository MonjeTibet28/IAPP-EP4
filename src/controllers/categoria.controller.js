import {getConnection} from '../database/database'

const createCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({ 'message': 'El nombre es obligatorio' });
        }

        const cn = await getConnection();
        const result = await cn.query(`INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)`, [nombre, descripcion]);

        res.status(201).json({ 'message': 'Categoría creada', 'id': result.insertId });
    } catch (error) {
        res.status(500).send(error.message);
    }
}


const getCategoria = async (req, res) =>{
    try {
        
        const cn = await getConnection()
        cn.query(`SELECT * FROM categorias`, (error, results) => {
            if (error) {
                return res.status(500).send(error.message);
            }

            res.status(200).json(results);
        });


    } catch (error) {
        res.status(500)
        res.send(error.message)
    }
}

const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        if (!id) {
            return res.status(400).json({ 'message': 'El ID es obligatorio' });
        }

        const cn = await getConnection();
        const result = await cn.query(`UPDATE categorias SET nombre = ?, descripcion = ? WHERE id = ?`, [nombre, descripcion, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Categoría no encontrada' });
        }

        res.status(200).json({ 'message': 'Categoría actualizada' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}

const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ 'message': 'El ID es obligatorio' });
        }

        const cn = await getConnection();
        const result = await cn.query(`DELETE FROM categorias WHERE id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ 'message': 'Categoría no encontrada' });
        }

        res.status(200).json({ 'message': 'Categoría eliminada' });
    } catch (error) {
        res.status(500).send(error.message);
    }
}


export const methods = {
    getCategoria,
    createCategoria,
    updateCategoria,
    deleteCategoria
} 