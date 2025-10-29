import { io, Socket } from 'socket.io-client';

type MsgHandler = (msg: any) => void;

export default class NetworkManager {
  private static instance: NetworkManager;
  private socket!: Socket;
  private handlers: MsgHandler[] = [];

  static getInstance() {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
  }

  async connect() {
    return new Promise<void>((resolve) => {
      this.socket = io((import.meta.env.VITE_SERVER_URL as string) || 'http://localhost:4000', { transports: ['websocket'] });
      this.socket.on('connect', () => {
        console.log('connected to server', this.socket.id);
        resolve();
      });

      this.socket.on('message', (msg) => {
        this.handlers.forEach(h => h(msg));
      });
    });
  }

  send(msg: any) {
    this.socket.emit('message', msg);
  }

  onMessage(handler: MsgHandler) {
    this.handlers.push(handler);
  }
}
