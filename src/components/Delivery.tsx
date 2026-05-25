import { useEffect, useState, useContext } from 'react';
import { Context } from '../context/ContextProvider';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
//import  PedidoForm from './PedidoForm';

function Delivery() {
    
    //CONTEXT
    const { setMessage } = useContext(Context)!;

    // 1 - CRIAR STATE PARA RECEBER CONEXÃO
    const [connection, setConnection] = useState<HubConnection | null>(null);

    // 2 - CONFIGURAR CONEXÃO APÓS PRIMEIRA RENDERIZAÇÃO
    useEffect(() => {
        setMessage('Delivery');

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
                console.log('✅ Conectado ao Delivery');

                connection.invoke('EntrarSala', 'loja');

                // ESCUTA MENSAGEM DO SERVIDOR
                connection.on('ReceiveMessage', (message: any) => {
                    console.log('📩 Mensagem recebida do servidor:', message);
                });
            })
            .catch((err) => {
                console.error('Erro na conexão:', err);
            });

        return () => {
            connection.stop();
        };
    }, [connection]);

    return (
        <div>
        </div>
    );
}

export default Delivery;
