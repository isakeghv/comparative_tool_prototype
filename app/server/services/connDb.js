import mongoose from 'mongoose'
import { useRuntimeConfig } from '#imports';

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

export const connDb = async () => {
    // const config = useRuntimeConfig();    
    console.log(process.env.MONGO_URI, 'process.env')

    // if a MongoDB connection already exists, reuse the connextion
    if (mongoose.connection.readyState >= 1) return mongoose;

    const uri = process.env.MONGO_URI

    if (uri) console.log(uri, 'URI');
    else console.log('No uri found')

    try {
        // use template from MongoDB with pre-defined client options and env variable defined in the nuxt config file
        await mongoose.connect(process.env.MONGO_URI, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.log(err)
        throw new Error('DB connection failed')
    }
}

// need to close the db somewhere sometime
