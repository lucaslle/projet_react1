import { Product } from '../models/product';
import { ProductRepository } from '../repositories/productRepository';

export class ProductService {
	constructor(private productRepository: ProductRepository) {}

	async createProduct(product: Product): Promise<Product> {
		return this.productRepository.create(product);
	}

	async getAllProducts(): Promise<Product[]> {
		return this.productRepository.findAll();
	}

	async getProductById(id: number): Promise<Product | null> {
		return this.productRepository.findById(id);
	}

	async updateProduct(id: number, product: Partial<Product>): Promise<void> {
		const existingProduct = await this.productRepository.findById(id);
		if (!existingProduct) {
			throw new Error('Product not found');
		}
		await this.productRepository.update(id, product);
	}

	async deleteProduct(id: number): Promise<void> {
		const existingProduct = await this.productRepository.findById(id);
		if (!existingProduct) {
			throw new Error('Product not found');
		}
		await this.productRepository.delete(id);
	}
}