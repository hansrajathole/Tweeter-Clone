import app from './src/app.js';
import dotenv from 'dotenv';
import connectMongoDB from './src/db/connectMongoDB.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
console.log(PORT);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});