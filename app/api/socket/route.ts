'use server'

import { Server } from 'socket.io';

export async function handler(req: any, res: any) {
    if (res.socket.server.io) {
        console.log('Socket já está rodando');
    } else {
        console.log('Iniciando Socket.io...');
        const io = new Server(res.socket.server);
        res.socket.server.io = io;

        io.on('connection', (socket) => {
            socket.on('send-message', (obj) => {
                // Envia para todos, incluindo quem enviou
                io.emit('receive-message', obj);
            });
        });
    }
    res.end();
}