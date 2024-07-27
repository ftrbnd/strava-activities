import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { auth } from './routes/auth';
import { configDotenv } from 'dotenv';
import { activities } from './routes/activities';
import { env } from 'hono/adapter';
import { getSignedCookie } from 'hono/cookie';

configDotenv();

const app = new Hono();

app.get('/', async (c) => {
	const { COOKIE_SECRET } = env<{ COOKIE_SECRET: string }>(c);
	const access_token = await getSignedCookie(c, COOKIE_SECRET, 'access_token');

	return c.text(`Hello Hono! \nAccess token: ${access_token}`);
});

app.route('/auth', auth);
app.route('/activities', activities);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
