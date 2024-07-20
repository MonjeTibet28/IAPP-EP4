import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../src/app'; 
import config from '../src/config';

const secretKey = config.jwt_key || '';

describe('Auth Middleware', () => {
  const token = jwt.sign({ id: 1, username: 'admin' }, secretKey, { expiresIn: '1h' });

  // Pruebas para la ruta de categoría
  describe('Rutas de Categoría', () => {
    it('Debería rechazar solicitudes sin un token JWT al obtener categorías', async () => {
      const res = await request(app)
        .get('/api/categoria');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Acceso denegado');
    });

    it('Debería aceptar solicitudes con un token JWT válido al obtener categorías', async () => {
      const res = await request(app)
        .get('/api/categoria')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
    });
  });

  // Pruebas para la ruta de cliente
  describe('Rutas de Cliente', () => {
    it('Debería rechazar solicitudes sin un token JWT al obtener clientes', async () => {
      const res = await request(app)
        .get('/api/cliente/1');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Acceso denegado');
    });

    it('Debería aceptar solicitudes con un token JWT válido al obtener clientes', async () => {
      const res = await request(app)
        .get('/api/cliente/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
    });
  });

  // Pruebas para la ruta de orden
  describe('Rutas de Orden', () => {
    it('Debería rechazar solicitudes sin un token JWT al obtener ordenes', async () => {
      const res = await request(app)
        .get('/api/orden/1');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Acceso denegado');
    });

    it('Debería aceptar solicitudes con un token JWT válido al obtener ordenes', async () => {
      const res = await request(app)
        .get('/api/orden/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
    });
  });

  // Pruebas para la ruta de producto
  describe('Rutas de Producto', () => {
    it('Debería rechazar solicitudes sin un token JWT al obtener productos', async () => {
      const res = await request(app)
        .get('/api/producto/1');

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Acceso denegado');
    });

    it('Debería aceptar solicitudes con un token JWT válido al obtener ordenes', async () => {
      const res = await request(app)
        .get('/api/producto/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
    });
  });
});
