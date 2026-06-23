import express, { Application } from 'express';
import router from './routes/routerManager'; 
import path from 'path'

const app: Application = express();

app.use(express.json())
app.use('/api', router)
app.use(express.static(path.join(__dirname, '../../frontend')))

export default app