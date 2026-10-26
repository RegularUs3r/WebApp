import { requireAuth } from './middleware/middle';
import express, { Application } from 'express';
import authrouter from './routes/authRoutes';
import router from './routes/routerManager';
import session from 'express-session';
import './types/session';
import path from 'path'

const FRONTEND_DIR = path.join(process.cwd(), 'frontend')

const app: Application = express();

const PUBLIC_PWA = ['/manifest.webmanifest', '/sw.js', '/offline.html',
                    '/images/icon-192.png', '/images/icon-512.png']

app.get(PUBLIC_PWA, (req, res) => {
  if (req.path === '/sw.js') {
    res.setHeader('Content-Type', 'application/javascript')
    res.setHeader('Service-Worker-Allowed', '/')
  }
  if (req.path.endsWith('.webmanifest')) res.type('application/manifest+json')
  res.sendFile(path.join(FRONTEND_DIR, req.path))
})


app.use(express.json())
app.get('/images/favicon.png', (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIR, 'images', 'favicon.png'))
})
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
app.use(express.static(FRONTEND_DIR))

export default app