const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

async function connectToDatabase() {
    const Db= process.env.ATLAS_URI;
    const client = new MongoClient(Db);

    await client.connect()


    try {
        const collections = await client.db("Webware").collections()
        collections.forEach((collection) => console.log(collection.s.namespace.collection))
    } catch (e) {
        console.error(e)
    } finally {
        await client.close()
    }
}

connectToDatabase()