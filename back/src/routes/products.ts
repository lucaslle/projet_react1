import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { ProductService } from '../services/productService';
import { Product } from '../models/product';

export const ProductRoutes = (productService: ProductService): FastifyPluginAsync => {
	return async (fastify: FastifyInstance) => {
		fastify.post<{ Body: Product }>('/products', async (request, reply) => {
			try {
				const product = await productService.createProduct(request.body);
				return reply.code(201).send(product);
			} catch (error) {
				return reply.code(400).send({ error: 'Failed to create product' });
			}
		});

		fastify.get('/products', async (request, reply) => {
			try {
				const products = await productService.getAllProducts();
				return reply.send(products);
			} catch (error) {
				return reply.code(500).send({ error: 'Failed to fetch products' });
			}
		});

		fastify.get<{ Params: { id: string } }>('/products/:id', async (request, reply) => {
			try {
				const product = await productService.getProductById(parseInt(request.params.id));
				if (!product) {
					return reply.code(404).send({ error: 'Product not found' });
				}
				return reply.send(product);
			} catch (error) {
				return reply.code(500).send({ error: 'Failed to fetch product' });
			}
		});

		fastify.put<{ Params: { id: string }; Body: Partial<Product> }>(
			'/products/:id',
			async (request, reply) => {
				try {
					await productService.updateProduct(parseInt(request.params.id), request.body);
					return reply.send({ message: 'Product updated successfully' });
				} catch (error) {
					if (error instanceof Error && error.message === 'Product not found') {
						return reply.code(404).send({ error: 'Product not found' });
					}
					return reply.code(500).send({ error: 'Failed to update product' });
				}
			}
		);

		fastify.delete<{ Params: { id: string } }>('/products/:id', async (request, reply) => {
			try {
				await productService.deleteProduct(parseInt(request.params.id));
				return reply.send({ message: 'Product deleted successfully' });
			} catch (error) {
				if (error instanceof Error && error.message === 'Product not found') {
					return reply.code(404).send({ error: 'Product not found' });
				}
				return reply.code(500).send({ error: 'Failed to delete product' });
			}
		});
	};
};