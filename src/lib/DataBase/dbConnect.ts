import mongoose, { Mongoose } from 'mongoose';

interface ConnectionObject {
  isConnected?: number;
}

const connection: ConnectionObject={};

export async function dbConnect() :Promise<void>{
  
  if (connection.isConnected) {
    console.log('Database Connected');
    return;
  }

  try{
     
    const db = await mongoose.connect(process.env.MONGODB_URI || '');
    
    connection.isConnected = db.connections[0].readyState;
    // console.log('Database Connected');
    return;

  }catch(error){
    console.log(error);
    process.exit(1);
  }
}



// interface CachedMongoose {
//   conn: Mongoose | null;
//   promise: Promise<Mongoose> | null;
// }

// const MONGODB_URI: string = process.env.MONGODB_URI || '';

// if (!MONGODB_URI) {
//   throw new Error(
//     'Please define the MONGODB_URI environment variable inside .env.local'
//   );
// }

// let cached = global as typeof global & {
//   mongoose: CachedMongoose;
// };

// if (!cached.mongoose) {
//   cached.mongoose = { conn: null, promise: null };
// }

// async function dbConnect(): Promise<Mongoose> {
//   if (cached.mongoose.conn) {
//     return cached.mongoose.conn;
//   }

//   if (!cached.mongoose.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.mongoose.promise = mongoose.connect(MONGODB_URI, opts)
//       .then((instance) => {
//         console.log('MongoDB connected successfully.');
//         return instance;
//       })
//       .catch((error) => {
//         console.error('MongoDB connection error:', error);
//         cached.mongoose.promise = null;
//         throw error;
//       });
//   }

//   cached.mongoose.conn = await cached.mongoose.promise;
//   return cached.mongoose.conn;
// }

// export default dbConnect;