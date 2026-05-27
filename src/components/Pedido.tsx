import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

export default function Pedido() {
    const [message, setMessage] = useState('');

    // conexão SignalR
    const [connection, setConnection] = useState<HubConnection | null>(null);

    // mensagens recebidas
    const [pedidos, setPedidos] = useState<any[]>([]);

    // som
    const [somAtivado, setSomAtivado] = useState(false);

    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    // -----------------------------------------
    // CRIA CONEXÃO
    // -----------------------------------------
    useEffect(() => {
        setMessage('Delivery');

        const newConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5157/chat')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    // -----------------------------------------
    // INICIA CONEXÃO
    // -----------------------------------------
    useEffect(() => {
        if (!connection) return;

        connection
            .start()
            .then(() => {
                console.log('✅ Conectado ao Delivery');

                // entra na sala
                connection.invoke('EntrarSala', 'loja');

                // recebe mensagens
                connection.on('ReceiveMessage', (message: any) => {
                    console.log('📩 Mensagem recebida do servidor:', message);

                    // toca som
                    tocarSom();

                    // adiciona pedido
                    setPedidos((prev) => [...prev, message]);
                });
            })
            .catch((err) => {
                console.error('Erro na conexão:', err);
            });

        return () => {
            connection.stop();
        };
    }, [connection]);

    // -----------------------------------------
    // ATIVAR SOM
    // -----------------------------------------
    function ativarSom() {
        const novoAudio = new Audio('/meme-fail-alert-locran-1-00-01.mp3');

        novoAudio.volume = 0.8;

        setAudio(novoAudio);

        setSomAtivado(true);

        console.log('🔊 Som ativado');
    }

    // -----------------------------------------
    // TOCAR SOM
    // -----------------------------------------
    function tocarSom() {
        if (!somAtivado || !audio) return;

        const clone = audio.cloneNode() as HTMLAudioElement;

        clone.currentTime = 0;

        clone.play().catch((err) => {
            console.warn('Erro ao tocar som:', err);
        });
    }

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                padding: '20px',
            }}
        >
            <h1>{message}</h1>

            {!somAtivado && <button onClick={ativarSom}>Ativar Som</button>}

            <div
                id="mensagens"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                {pedidos.map((pedido, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            padding: '12px',
                            background: 'lightgray',
                            borderBottom: '1px solid black',
                        }}
                    >
                        <h3
                            style={{
                                textAlign: 'center',
                            }}
                        >
                            Pedido #{index + 1}
                        </h3>

                        <ul
                            style={{
                                listStyle: 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                padding: '0',
                            }}
                        >
                            {pedido.map((item: any, i: number) => (
                                <li key={i}>
                                    Produto: {item.nome}
                                    {' | '}
                                    Quantidade: {item.quantidade}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
