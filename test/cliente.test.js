import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app'; 
import config from '../src/config';


const token = jwt.sign({ id: 1 }, config.jwt_key, { expiresIn: '1h' });

describe('Clientes API', () => {

    it('Debería crear un cliente', async () => {
        const res = await request(app)
            .post('/api/cliente')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Juan Pérez',
                email: 'juan.perez@example.com',
                telefono: '1234567890',
                direccion_envio: 'Calle Falsa 123'
            });

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Cliente registrado');
        expect(res.body).toHaveProperty('id');
    });

    it('Debería obtener un cliente por ID', async () => {
        const resCreate = await request(app)
            .post('/api/cliente')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Ana Gómez',
                email: 'ana.gomez@example.com',
                telefono: '0987654321',
                direccion_envio: 'Avenida Siempre Viva 742'
            });

        const clientId = resCreate.body.id;

        const resGet = await request(app)
            .get(`/api/cliente/${clientId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(resGet.status).toBe(200);
        expect(resGet.body).toHaveProperty('nombre', 'Ana Gómez');
        expect(resGet.body).toHaveProperty('email', 'ana.gomez@example.com');
    });

    it('Debería actualizar un cliente', async () => {
        const resCreate = await request(app)
            .post('/api/cliente')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Carlos Ruiz',
                email: 'carlos.ruiz@example.com',
                telefono: '1122334455',
                direccion_envio: 'Calle de la Luna 9'
            });

        const clientId = resCreate.body.id;

        const resUpdate = await request(app)
            .put(`/api/cliente/${clientId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'carlos.ruiz@newemail.com'
            });

        expect(resUpdate.status).toBe(200);
        expect(resUpdate.body).toHaveProperty('message', 'Cliente actualizado');

        const resGet = await request(app)
            .get(`/api/cliente/${clientId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(resGet.status).toBe(200);
        expect(resGet.body).toHaveProperty('email', 'carlos.ruiz@newemail.com');
    });

    it('Debería eliminar un cliente', async () => {
        const resCreate = await request(app)
            .post('/api/cliente')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Laura Martínez',
                email: 'laura.martinez@example.com',
                telefono: '5566778899',
                direccion_envio: 'Plaza Mayor 1'
            });

        const clientId = resCreate.body.id;

        const resDelete = await request(app)
            .delete(`/api/cliente/${clientId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(resDelete.status).toBe(200);
        expect(resDelete.body).toHaveProperty('message', 'Cliente eliminado');

        const resGet = await request(app)
            .get(`/api/cliente/${clientId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(resGet.status).toBe(404);
        expect(resGet.body).toHaveProperty('message', 'Cliente no encontrado');
    });
});