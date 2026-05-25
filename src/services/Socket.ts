import { io, Socket as SocketIOClient } from 'socket.io-client';

export default class Socket {
    //VARIAVEL PARA ABRIR CONEXÃO
    private static socket: SocketIOClient;

    static connection(user: string): void {
        if (!this.socket) {
            if (!this.socket) {
                this.socket = io('localhost:3000', {
                    transports: ['websocket'], // força websocket
                    withCredentials: true,
                });

                this.socket.on('connect', () => {
                    console.log('✅ Conectado com ID:', this.socket.id);
                    this.socket.emit('register', user); // ✔ agora sim
                });

                this.socket.on('connect_error', (err) => {
                    console.error('❌ Erro na conexão:', err.message);
                });
            }
        }
    }

    static sendMessage(user: string, message: string, send: string): void {
        if (!this.socket) {
            this.connection(user);
        }

        if (this.socket.connected) {
            this.socket.emit('message',
                {
                id: this.socket.id,
                user: user,
                message: message,
                data: new Date(),
                send: send,
                }
            );
        } else {
            this.socket.once('connect', () => {
                this.socket.emit('message', {
                    id: this.socket.id,
                    user,
                    message,
                    data: new Date(),
                    send,
                });
            });
        }
    }

    static getSocket(callback: (data: any) => void) {
        if (!this.socket) {
            return alert('Socket não conectado');
        }

        this.socket.off('send'); // limpa antes
        this.socket.on('send', callback); //Usa socket.on() para enviar através da callback
    }
}
