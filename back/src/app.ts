import fastify, { FastifyInstance } from 'fastify';
import { Database } from 'sqlite3';
import { ProductRoutes } from './routes/products';
import { ProductService } from './services/productService';
import { ProductRepository } from './repositories/productRepository';

const buildApp = (): FastifyInstance => {
	const app = fastify({ logger: true });

	// Initialize SQLite database
	const db = new Database('stock.db');

	// Initialize dependencies
	const productRepository = new ProductRepository(db);
	const productService = new ProductService(productRepository);

	// Register routes
	app.register(ProductRoutes(productService));

	return app;
};

export { buildApp };