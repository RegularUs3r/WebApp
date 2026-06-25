import { requireAuth } from './middleware/middle';
import express, { Application } from 'express';
import authrouter from './routes/authRoutes';
import router from './routes/routerManager';
import session from 'express-session';
import './types/session';
import path from 'path'

const app: Application = express();

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Cache-control', 'no-cache');
    next();
});

app.use(session({
  secret: process.env.SESSION_SECRET ?? 'change-me-in-env',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 8 * 60 * 60 * 1000 },
}));

app.use('/', authrouter)

app.use(requireAuth);


app.use('/', router)
app.use(express.static(path.join(__dirname, '../../frontend')))

export default app