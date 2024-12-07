import { buildApp } from './app';
const start = async () => {
	try {
		const app = await buildApp();
		await app.listen({
			port: 3000,
			host: '0.0.0.0'
		});
		console.log('Serveur démarré sur http://localhost:3000');
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

start();