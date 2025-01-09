import express from 'express';
import { createExpressMiddleware, } from '@trpc/server/adapters/express';
import cors from 'cors';
import { renderTrpcPanel } from 'trpc-panel';
import { appRouter } from './controllers';
import config from './config';
export default function createApp(db) {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use('/api/health', (_, res) => {
        res.status(200).send('OK');
    });
    app.use('/api/v1/trpc', createExpressMiddleware({
        createContext: ({ req, res }) => ({
            db,
            req,
            res,
        }),
        router: appRouter,
    }));
    if (config.env === 'development') {
        app.get('/api/v1/trpc-panel', (_, res) => {
            res.send(renderTrpcPanel(appRouter, {
                url: `http://localhost:${config.port}/api/v1/trpc`,
                transformer: 'superjson',
            }));
        });
    }
    return app;
}
