import jwt from 'jsonwebtoken'
import request from 'supertest'
import app from '../src/app'
import config from '../src/config'

const token = jwt.sign({ id: 1 }, config.jwt_key, { expiresIn: '1h' });

describe('Productos API', () => {
    let lastProductId;

    beforeAll(async () => {
        try {
            const createRes = await request(app)
                .post('/api/producto')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    nombre: 'Producto de Prueba',
                    descripcion: 'Descripción del producto de prueba',
                    precio: 100.00,
                    cantidad_stock: 10,
                    categoria_id: 1,
                    detalles: [{ detalle: 'Color', valor: 'Rojo' }]
                });

            if (createRes.status === 201 && createRes.body.id) {
                lastProductId = createRes.body.id;
            //    console.log('lastProductId:', lastProductId);
            } else {
                throw new Error('No se pudo crear un producto de prueba');
            }
        } catch (error) {
            console.error('Error en beforeAll:', error);
        }
    });

    it('Debería crear un nuevo producto', async () => {
        const res = await request(app)
            .post('/api/producto')
            .set('Authorization', `Bearer ${token}`)
            .send({
                nombre: 'Laptop',
                descripcion: 'Laptop con pantalla de 15 pulgadas',
                precio: 1200,
                cantidad_stock: 10,
                categoria_id: 1,
                detalles: [
                    { detalle: 'Color', valor: 'Negro' },
                    { detalle: 'Procesador', valor: 'Intel i7' }
                ]
            });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Producto creado');
        expect(res.body).toHaveProperty('id');
    });

    it('Debería obtener un producto por ID', async () => {
        if (!lastProductId) {
            throw new Error('No hay productos para obtener');
        }

        const res = await request(app)
            .get(`/api/producto/${lastProductId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('producto');
        expect(res.body).toHaveProperty('detalles');
    });

    it('Debería actualizar un producto existente', async () => {

        const resPut = await request(app).put(`/api/producto/${lastProductId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: 'Producto Actualizado' });
    
        expect(resPut.status).toBe(200);
        expect(resPut.body.message).toBe('Producto actualizado');
    
    });
    
    it('Debería eliminar un producto, o mostrar un error si hay detalles asociados', async () => {
        if (!lastProductId) {
            throw new Error('No hay productos para eliminar');
        }
    
        const res = await request(app)
            .delete(`/api/producto/${lastProductId}`)
            .set('Authorization', `Bearer ${token}`);
            
        if (res.status === 200) {
            expect(res.body).toHaveProperty('message', 'Producto eliminado');
        } else if (res.status === 400) {
            expect(res.body).toHaveProperty('message', 'No se puede eliminar el producto porque tiene detalles asociados');
        } else if (res.status === 500) {
            expect(res.body).toHaveProperty('message', 'Error al eliminar el producto');
        } else {
            
            throw new Error(`Código de estado inesperado: ${res.status}`);
        }
    });
});
