import mongoose from 'mongoose';
const db = mongoose.connection;

const uri = process.env.ATLAS_URI;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

db.once('open', () => {
    console.log("MongoDB database connection established successfully");
});

db.on('error', (err) => {
    console.log(err);
});

export default db;