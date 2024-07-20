import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app';
import config from '../src/config';

const token = jwt.sign({ id: 1 }, config.jwt_key, { expiresIn: '1h' });

describe('Órdenes API', () => {
    let testOrderId;

    beforeAll(async () => {
        const createRes = await request(app)
            .post('/api/orden')
            .set('Authorization', `Bearer ${token}`)
            .send({
                cliente_id: 1,
                productos: [
                    { id: 1, cantidad: 2, precio: 10.00 },
                    { id: 2, cantidad: 1, precio: 20.00 }
                ],
                total: 40.00,
                estado: 'pendiente'
            });

        if (createRes.status === 201 && createRes.body.id) {
            testOrderId = createRes.body.id;
        } else {
            throw new Error('No se pudo crear una orden de prueba');
        }
    });

    it('Debería crear una nueva orden', async () => {
        const res = await request(app)
            .post('/api/orden')
            .set('Authorization', `Bearer ${token}`)
            .send({
                cliente_id: 1,
                productos: [
                    { id: 1, cantidad: 2, precio: 10.00 },
                    { id: 2, cantidad: 1, precio: 20.00 }
                ],
                total: 40.00,
                estado: 'pendiente'
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Orden creada');
        expect(res.body).toHaveProperty('id');
    });

    it('Debería obtener una orden específica', async () => {
        const res = await request(app)
            .get(`/api/orden/${testOrderId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('orden');
        expect(res.body).toHaveProperty('detalles');
    });

    it('Debería actualizar el estado de una orden', async () => {
        const res = await request(app)
            .put(`/api/orden/${testOrderId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                estado: 'enviado'
            });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Orden actualizada');
    });

    

    it('No debería eliminar una orden con detalles asociados', async () => {
        const createRes = await request(app)
            .post('/api/orden')
            .set('Authorization', `Bearer ${token}`)
            .send({
                cliente_id: 1,
                productos: [
                    { id: 1, cantidad: 2, precio: 10.00 },
                    { id: 2, cantidad: 1, precio: 20.00 }
                ],
                total: 40.00,
                estado: 'pendiente'
            });

        if (createRes.status === 201 && createRes.body.id) {
            const createdOrderId = createRes.body.id;

            const deleteRes = await request(app)
                .delete(`/api/orden/${createdOrderId}`)
                .set('Authorization', `Bearer ${token}`);
            
            expect(deleteRes.status).toBe(400);
            expect(deleteRes.body).toHaveProperty('message', 'La orden no se puede eliminar porque tiene detalles asociados');
        } else {
            throw new Error('No se pudo crear una orden para verificar la restricción de integridad');
        }
    });
});
