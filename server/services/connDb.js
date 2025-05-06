import mongoose from 'mongoose'
import { useRuntimeConfig } from '#imports';

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export const connDb = async () => {
    // if a MongoDB connection already exists, reuse the connextion
    if (mongoose.connection.readyState >= 1) {
        return mongoose;
    }

    try {
        const config = useRuntimeConfig();

        // use template from MongoDB with pre-defined client options and env variable defined in the nuxt config file
        await mongoose.connect(config.private.mongoURI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        throw new Error('DB connection failed')
    }
}

// need to close the db somewhere sometime
