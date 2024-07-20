import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app'; 
import config from '../src/config';

const token = jwt.sign({ id: 1 }, config.jwt_key, { expiresIn: '1h' });

describe('Categorías API', () => {
    let lastCategoryId;

    beforeAll(async () => {
        const res = await request(app)
            .get('/api/categoria')
            .set('Authorization', `Bearer ${token}`);

        if (res.statusCode === 200 && res.body.length > 0) {
            lastCategoryId = res.body[res.body.length - 1].id; 
        } else {
            throw new Error('No hay categorías disponibles para eliminar');
        }
    });

    it('Debería crear una nueva categoría', async () => {
        const res = await request(app)
            .post('/api/categoria')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Electrónica',
                descripcion: 'Productos electrónicos'
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Categoría creada');
        expect(res.body).toHaveProperty('id');
    });

    it('Debería obtener las categorías', async () => {
        const res = await request(app)
            .get('/api/categoria')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('Debería actualizar una categoría', async () => {
        const res = await request(app)
            .put('/api/categoria/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Electrónica Actualizada',
                descripcion: 'Productos electrónicos actualizados'
            });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Categoría actualizada');
    });

    it('Debería eliminar una categoría', async () => {
        if (!lastCategoryId) {
            throw new Error('No hay categorías para eliminar');
        }

        const res = await request(app)
            .delete(`/api/categoria/${lastCategoryId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Categoría eliminada');
    });
});
