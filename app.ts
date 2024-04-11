import express, { Express, Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import * as redis from 'redis';
import { RedisClientType } from 'redis';
import * as path from 'path';

const HTTP_PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL;

const app: Express = express();
app.use(bodyParser.json({ limit: '50mb' }));

let publisher: RedisClientType;

app.use("/static", express.static(path.resolve(__dirname, "static")));

app.post('/', async (req: Request, res: Response) => {
	const input = req.body.input || 'a';

	const channel = 'message_queue';
	const message = input;

	try {
		publisher.publish(channel, message);
		console.log(`Sent: ${message}`);
	} catch (e) {
		console.error('PUB ERROR');
		console.error(e, `\t`);
	}

	res.send('Express + TypeScript Server');
});

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(HTTP_PORT, () => {
	console.log(`[server]: Server is running at http://localhost:${HTTP_PORT}`);
});

async function connect() {
	publisher = redis.createClient({
		url: REDIS_URL,
	});

	await publisher.connect();
}

connect();
