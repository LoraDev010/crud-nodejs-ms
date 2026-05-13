import { Product, IProduct } from '../models/product.model';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

export async function getAllProducts(
  page = 1,
  limit = 10,
  category?: string,
): Promise<{ products: IProduct[]; total: number }> {
  const filter: Record<string, unknown> = { isActive: true };
  if (category) filter['category'] = category;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Product.countDocuments(filter),
  ]);

  return { products, total };
}

export async function getProductById(id: string): Promise<IProduct> {
  const product = await Product.findById(id);
  if (!product || !product.isActive) throw new Error('Producto no encontrado');
  return product;
}

export async function createProduct(dto: CreateProductDto): Promise<IProduct> {
  const product = new Product(dto);
  return product.save();
}

export async function updateProduct(id: string, dto: UpdateProductDto): Promise<IProduct> {
  const product = await Product.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true });
  if (!product) throw new Error('Producto no encontrado');
  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const result = await Product.findByIdAndUpdate(id, { $set: { isActive: false } });
  if (!result) throw new Error('Producto no encontrado');
}
