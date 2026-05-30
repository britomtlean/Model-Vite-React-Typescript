import { useEffect, useState, useContext } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Context } from '../../../context/ContextProvider';

function Aguarde() {
    const { setMessage, contato } = useContext(Context)!;
    setMessage('Aguardando confirmação, por favor aguarde!');

    // 1 - CRIAR STATE PARA RECEBER CONEXÃO
    const [connection, setConnection] = useState<HubConnection | null>(null);

    // 2 - CONFIGURAR CONEXÃO APÓS PRIMEIRA RENDERIZAÇÃO
    useEffect(() => {
        setMessage('SignalR');

        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5157/chat')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    // 3 - INICIAR CONEXÃO E RECEBER MENSAGENS
    useEffect(() => {
        if (!connection) return;

        connection
            .start()
            .then(() => {
                console.log('✅ Conectado ao SignalR');
                //connection.invoke('EntrarSala', `${connection.connectionId}`);
                console.log(contato)
                connection.invoke('EntrarSala', contato);

                // ESCUTA MENSAGEM DO SERVIDOR
                connection.on('ReceiveMessage', (message: string) => {
                    console.log('📩 Servidor - ', message);
                    window.location.href = message;
                });
            })
            .catch((err) => {
                console.error('Erro na conexão:', err);
            });

        return () => {
            connection.stop();
        };
    }, [connection]);

    return <div></div>;
}

export default Aguarde;
