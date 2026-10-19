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
            .withUrl('https://dotnet-webapi-base-production.up.railway.app/chat')
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
                setContato((): any => {
                    connection.invoke('EntrarSala', `${whatsapp}`);
                    return whatsapp;
                });
                //connection.invoke('EntrarSala', `${connection.connectionId}`);

                // ESCUTA MENSAGEM DO SERVIDOR
                connection.on('ReceiveMessage', (message: string) => {
                    console.log('📩 Servidor - ', message);
                    alert(JSON.stringify(message));
                    setMessage(message);
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
                {
                    produtoId: '6a336ac6ed7b6b3f3340249b',
                    nome: 'Spray Preto Brilhante',
                    quantidade: 500,
                    valorUnitario: 10,
                    subtotal: 5000,
                },
                {
                    produtoId: '6a10d5a2ae6f124854579c0d',
                    nome: 'Advanced',
                    quantidade: 2,
                    valorUnitario: 50,
                    subtotal: 100,
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

    async function pagamento() {
        const pedido: Pedido = {
            produtos: [
                {
                    produtoId: '6a10d5b7ae6f124854579c0e',
                    nome: 'Top Jet',
                    quantidade: 3,
                    valorUnitario: 10,
                    subtotal: 30,
                },
            ],
            valorTotal: 0,
            nomeCliente: 'Teste Cliente 1',
            contatoCliente: contato,
            enderecoCliente: 'XXXXXXXX',
        };

        const res = await fetch('https://dotnet-webapi-base-production.up.railway.app/api/payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pedido),
        });

        const data = await res.json();
        console.log(data);
        if (!res.ok) return;
        window.location.href = data.url;
    }

    return (
        <div className="flex gap-4">
            <button onClick={pagamento}>Pagar Online</button>
            <button onClick={sendMessage}>Pagar Na Entrega</button>

            <button
                onClick={() => {
                    const pedido: Pedido = {
                        produtos: [
                            {
                                produtoId: '6a10d5b7ae6f124854579c0e',
                                nome: 'Top Jet',
                                quantidade: 1,
                                valorUnitario: 10,
                                subtotal: 10,
                            },
                        ],
                        valorTotal: 15,
                        nomeCliente: 'Teste Cliente 1',
                        contatoCliente: contato,
                        enderecoCliente: 'XXXXXXXX',
                    };

                    const numeroPedido = Date.now().toString().slice(-8);

                    const resumoProdutos = pedido.produtos
                        .map((p) => `📌 ${p.quantidade} x ${p.nome} - R$ ${p.subtotal.toFixed(2).replace('.', ',')}`)
                        .join('\n');

                    const mensagem = `SEU PEDIDO: LELECO HAMBURGUERIA PIRAQUÊ

                        Acompanhe abaixo o pedido

                        Pedido nº: #${numeroPedido}
                        Realizado em: ${new Date().toLocaleString('pt-BR')}

                        -----------------------------
                        🍽️ RESUMO DO PEDIDO

                        ${resumoProdutos}

                        -----------------------------
                        💳 PAGAMENTO

                        ▪️ Taxa de Entrega: R$ 5,00
                        ▪️ Valor Total do Pedido: R$ ${pedido.valorTotal.toFixed(2).replace('.', ',')}

                        -----------------------------
                        🏠 ENDEREÇO DE ENTREGA

                        ${pedido.enderecoCliente}

                        ⏲️ Previsão de Entrega: 45 a 80 minutos

                        -----------------------------
                        🤩 ${pedido.nomeCliente}
                        📞 ${pedido.contatoCliente}
                        💳 Crédito

                        Clique no link para acompanhar seu pedido:
                        https://seusite.com/pedido/${numeroPedido}`;

                    window.open(`https://wa.me/5521970076196?text=${encodeURIComponent(mensagem)}`, '_blank');
                }}
            >
                Enviar Pedido pelo WhatsApp
            </button>
        </div>
    );
}

export default SignalR;
