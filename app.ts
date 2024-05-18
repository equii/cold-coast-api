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

const controlIds: number[] = initControlIds();
let currControl = 0;


app.use("/static", express.static(path.resolve(__dirname, "static")));

app.get("/control",  async (req: Request, res: Response) => {
	const controlId = controlIds[currControl % controlIds.length];
	currControl++;
	res.json({id: controlId})
})

app.post('/', async (req: Request, res: Response) => {
	console.log(req.body);
	const input = req.body.key ? req.body : {
		key: "agitate",
		value: 100
	} as IOscMessage;

	const channel = 'message_queue';
	const message = input;

	try {
		publisher.publish(channel, JSON.stringify(message));
		console.log(`Sent: ${message}`, `\t`);
	} catch (e) {
		console.error('PUB ERROR');
		console.error(e, `\t`);
	}

	res.json({success: true});
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

interface IOscMessage {
	key: string;
	value: number;
}

function initControlIds(number?:number) {
	const controlIds: number[] = [];
	const numberOfControls = number || 6;

	while(controlIds.length < numberOfControls) {
		const controlId = Math.floor(Math.random() * (numberOfControls));

		if(controlIds.indexOf(controlId) === -1) {
			controlIds.push(controlId);
		}
	}

	return controlIds;
}