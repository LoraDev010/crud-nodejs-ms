import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
} from '../../src/services/products.service';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key]?.deleteMany({});
  }
});

describe('ProductsService', () => {
  const sampleProduct = {
    name: 'Laptop Gamer',
    description: 'Laptop para gaming con RTX 4070',
    price: 1200,
    stock: 10,
    category: 'electronics',
  };

  describe('createProduct', () => {
    it('debe crear un producto correctamente', async () => {
      const product = await createProduct(sampleProduct);
      expect(product._id).toBeDefined();
      expect(product.name).toBe('Laptop Gamer');
      expect(product.isActive).toBe(true);
    });
  });

  describe('getAllProducts', () => {
    it('debe retornar productos paginados', async () => {
      await createProduct(sampleProduct);
      await createProduct({ ...sampleProduct, name: 'Mouse Gamer' });

      const { products, total } = await getAllProducts(1, 10);
      expect(products).toHaveLength(2);
      expect(total).toBe(2);
    });

    it('debe filtrar por categoría', async () => {
      await createProduct(sampleProduct);
      await createProduct({ ...sampleProduct, name: 'Silla', category: 'furniture' });

      const { products } = await getAllProducts(1, 10, 'electronics');
      expect(products).toHaveLength(1);
      expect(products[0]?.category).toBe('electronics');
    });
  });

  describe('getProductById', () => {
    it('debe retornar el producto si existe', async () => {
      const created = await createProduct(sampleProduct);
      const found = await getProductById(created._id.toString());
      expect(found.name).toBe('Laptop Gamer');
    });

    it('debe lanzar error si no existe', async () => {
      await expect(getProductById(new mongoose.Types.ObjectId().toString())).rejects.toThrow(
        'Producto no encontrado',
      );
    });
  });

  describe('deleteProduct (soft delete)', () => {
    it('debe marcar el producto como inactivo', async () => {
      const created = await createProduct(sampleProduct);
      await deleteProduct(created._id.toString());
      await expect(getProductById(created._id.toString())).rejects.toThrow('Producto no encontrado');
    });
  });
});
