import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { auth } from './routes/auth';
import { configDotenv } from 'dotenv';
import { activities } from './routes/activities';

configDotenv();

const app = new Hono();

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

app.route('/auth', auth);
app.route('/activities', activities);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
