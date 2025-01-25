import express from 'express';
import router from './routes/auth.routes.js';
const app = express();

app.use("/",router);

export default app;