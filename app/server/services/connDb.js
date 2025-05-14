import mongoose from 'mongoose'
import { useRuntimeConfig } from '#imports';

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export const connDb = async () => {
    const config = useRuntimeConfig();
    
    console.log('config.private')
    console.log(config.private.mongoURI)
    console.log('process.env')
    console.log(process.env.mongoURI)
    const mongoUri = config.mongodbUri;
    console.log('MONGO URI:', config.mongodbUri);

    // if a MongoDB connection already exists, reuse the connextion
    if (mongoose.connection.readyState >= 1) {
        return mongoose;
    }

    try {
        // use template from MongoDB with pre-defined client options and env variable defined in the nuxt config file
        await mongoose.connect(mongoURI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        throw new Error('DB connection failed')
    }
}

// need to close the db somewhere sometime
