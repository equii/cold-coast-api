"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const redis = __importStar(require("redis"));
const path = __importStar(require("path"));
const HTTP_PORT = process.env.PORT || 3001;
const REDIS_URL = process.env.REDIS_URL;
const app = (0, express_1.default)();
app.use(bodyParser.json({ limit: '50mb' }));
let publisher;
const controlIds = initControlIds();
let currControl = 0;
app.use("/static", express_1.default.static(path.resolve(__dirname, "static")));
app.get("/control", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const controlId = controlIds[currControl % controlIds.length];
    currControl++;
    res.json({ id: controlId });
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const input = req.body.key ? req.body : {
        key: "agitate",
        value: 100
    };
    const channel = 'message_queue';
    const message = input;
    try {
        publisher.publish(channel, JSON.stringify(message));
        console.log(`Sent: ${message}`, `\t`);
    }
    catch (e) {
        console.error('PUB ERROR');
        console.error(e, `\t`);
    }
    res.json({ success: true });
}));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
app.listen(HTTP_PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${HTTP_PORT}`);
});
function connect() {
    return __awaiter(this, void 0, void 0, function* () {
        publisher = redis.createClient({
            url: REDIS_URL,
        });
        yield publisher.connect();
    });
}
connect();
function initControlIds(number) {
    const controlIds = [];
    const numberOfControls = number || 6;
    while (controlIds.length < numberOfControls) {
        const controlId = Math.floor(Math.random() * (numberOfControls));
        if (controlIds.indexOf(controlId) === -1) {
            controlIds.push(controlId);
        }
    }
    return controlIds;
}
