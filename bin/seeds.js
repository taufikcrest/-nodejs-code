const path = require('path');
const { Seeder } = require('mongo-seeding');
const config = require('../config');

// database configs
const dbConfig = {
	database: config.DB_URI,
	dropCollections: false
};

const seeder = new Seeder(dbConfig);

const collections = seeder.readCollectionsFromPath(
	path.resolve('./database/seeders'),
	{
		transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId]
	}
);

console.log('Seeding starting');
seeder
	.import(collections)
	.then(() => {
		console.log('Seeding done');
	})
	.catch(err => {
		console.log('Error in seeding', err.message);
	});