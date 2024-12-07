import fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import { Database } from 'sqlite3';
import { ProductRoutes } from './routes/products';
import { ProductService } from './services/productService';
import { ProductRepository } from './repositories/productRepository';

const buildApp = async (): Promise<FastifyInstance> => {
	const app = fastify({ logger: true });


	await app.register(cors, {
		origin: ['http://localhost:3002'], // Spécifiez explicitement l'origine de votre frontend
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true
	});

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