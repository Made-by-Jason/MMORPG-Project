import express from 'express';
import http from 'http';
import { initSocket } from './network/socket';
import { startTickLoop } from './tickloop';

const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const server = http.createServer(app);
const io = initSocket(server);

// start tick loop
startTickLoop(io);

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
