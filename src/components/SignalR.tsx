import { useEffect, useState, useContext } from 'react';
import { Context } from '../context/ContextProvider';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
//import  PedidoForm from './PedidoForm';

type Message = {
    user: string;
    text: string;
};

type Produto = {
    produtoId: string;
    nome: string;
    quantidade: number;
    valorUnitario: number;
    subtotal: number;
};

type Pedido = {
    produtos: Produto[];
    valorTotal: number;
    nomeCliente: string;
    contatoCliente: string;
    enderecoCliente: string;
};

function SignalR() {
    //CONTEXT
    const { setMessage } = useContext(Context)!;

    /*
        const [pedido, setPedido] = useState<Pedido>({
            produtos: [
                {
                    produtoId: '6a10d5b7ae6f124854579c0e',
                    nome: 'Top Jet',
                    quantidade: 0,
                    valorUnitario: 0,
                    subtotal: 0,
                },
            ],
            valorTotal: 0,
            nomeCliente: 'Teste Cliente',
            contatoCliente: '99999-9999',
            enderecoCliente: 'XXXXXXXX',
        });
    */

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

                connection.invoke('EntrarSala', 'cliente');

                // ESCUTA MENSAGEM DO SERVIDOR
                connection.on('ReceiveMessage', (message: Message) => {
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

    async function sendMessage() {
        if (!connection) return;

        const pedido: Pedido = {
            produtos: [
                {
                    produtoId: '6a10d5b7ae6f124854579c0e',
                    nome: 'Top Jet',
                    quantidade: 0,
                    valorUnitario: 0,
                    subtotal: 0,
                },
            ],
            valorTotal: 0,
            nomeCliente: 'Teste Cliente 1',
            contatoCliente: '99999-9999',
            enderecoCliente: 'XXXXXXXX',
        };

        try {
            await connection.invoke('CreatePedido', pedido);

            console.log('✅ Pedido enviado: ', pedido);
        } catch (err) {
            console.error('Erro ao enviar:', err);
        }
    }

    return (
        <div>
            <button onClick={sendMessage}>Enviar mensagem</button>
        </div>
    );
}

export default SignalR;
