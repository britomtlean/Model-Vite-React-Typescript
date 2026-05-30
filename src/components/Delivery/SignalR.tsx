import { useEffect, useState, useContext } from 'react';
import { Context } from '../../context/ContextProvider';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

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
    const { setMessage, setContato, contato } = useContext(Context)!;

    //WHATSAPP -- IDENTIFICADOR DO CLIENTE NO SIGNALR
    //const [contato, setContato] = useState<string | null>(null);

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
                const whatsapp = prompt('Digite seu whatsapp')!;
                setContato(():any =>{connection.invoke('EntrarSala', `${whatsapp}`); return whatsapp});
                //connection.invoke('EntrarSala', `${connection.connectionId}`);


                // ESCUTA MENSAGEM DO SERVIDOR
                connection.on('ReceiveMessage', (message: string) => {
                    console.log('📩 Servidor - ', message);
                    setMessage(message)
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
            contatoCliente: contato,
            enderecoCliente: 'XXXXXXXX',
        };

        try {
            await connection.invoke('CreatePedido', pedido);

            console.log('✅ Pedido enviado: ', pedido);
        } catch (err) {
            console.error('Erro ao enviar:', err);
        }
    }

    async function pagamento(){
        const res = await fetch('http://localhost:5157/api/payment', {
            method: 'POST',
        });

        const data = await res.json();
        window.location.href = data.url;



    }


    return (
        <div className="flex gap-4">
            <button onClick={pagamento}>Pagar Online</button>
            <button onClick={sendMessage}>Pagar Na Entrega</button>
        </div>
    );
}

export default SignalR;
