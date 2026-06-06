import { useEffect, useState, useRef } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import somPedido from '../../assets/meme-fail-alert-locran-1-00-01.mp3';
import Pendentes from './Pendentes';
import Concluido from './Concluido';
import Carrosel from './Carrosel';

declare global {
    interface Window {
        audioCtx: AudioContext;
        audio: HTMLAudioElement;
    }
}

function Delivery() {

    //NAVEGAÇÃO
    const [section, setSection] = useState<string>('live');

    /////////////////////// AUDIO \\\\\\\\\\\\\\\\\\\\\\\\\\\

    const [sala, setSala] = useState<string>('');
    const [somAtivado, setSomAtivado] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const ativarSom = async () => {
        try {
            const audio = new Audio(somPedido);

            audio.volume = 1;

            // força carregamento
            await audio.load();

            // desbloqueia autoplay
            await audio.play();

            // pausa imediatamente
            audio.pause();

            audio.currentTime = 0;

            audioRef.current = audio;

            setSomAtivado(true);

            console.log('✅ Som ativado');
        } catch (err) {
            console.error('Erro ao ativar som:', err);
        }
    };

    const tocarSom = async () => {
        try {
            if (!audioRef.current) return;

            audioRef.current.currentTime = 0;

            await audioRef.current.play();

            console.log('🔊 Tocando');
        } catch (err) {
            console.error('Erro ao tocar:', err);
        }
    };

    ///////////////////////////////////////////////////////////

    /////////////////////// SIGNALR \\\\\\\\\\\\\\\\\\\\\\\\\\\

    //NOTIFICAÇÃ<O></O>
    const [live, setLive] = useState<Array<Record<string, any>> | null>(null);

    // 1 - CRIAR STATE PARA RECEBER CONEXÃO
    const [connection, setConnection] = useState<HubConnection | null>(null);

    // 2 - CONFIGURAR CONEXÃO APÓS PRIMEIRA RENDERIZAÇÃO
    useEffect(() => {
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
                connection.on('ReceiveMessage', (message: any, sala: string) => {
                    console.log('📩 Servidor - ', message);
                    tocarSom();
                    setSala(sala);
                    setLive((prev) => {
                        if (prev == null) {
                            return [message];
                        }
                        const arrayPedidos = [...prev!, message];
                        console.log('Pedidos recentes:', arrayPedidos);
                        return arrayPedidos;
                    });
                });
            })
            .catch((err) => {
                console.error('Erro na conexão:', err);
            });

        return () => {
            connection.stop();
        };
    }, [connection]);

    /////////////////////////////////////////////////////////////

    /////////////////////////// ACTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    const confirmOrder = async (pedido: Record<string, any>) => {
        try {
            const res = await fetch('http://localhost:5157/api/pedido/confirmar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedido),
            });

            const data = await res.text();

            if (!res.ok) {
                throw new Error(data);
            }

            console.log(data);
            alert(data);

            setLive((): any => {
                const atualizarPedidos = live?.filter((array) => array.id != pedido.id);
                return atualizarPedidos;
            });
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar pedido');
        }
    };

    const cancelOrder = async (pedido: Record<string, any>) => {
        try {
            const res = await fetch('http://localhost:5157/api/pedido/cancelar', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pedido),
            });

            const data = await res.text();

            if (!res.ok) {
                throw new Error(data);
            }

            console.log(data);
            alert(data);

            setLive((): any => {
                const atualizarPedidos = live?.filter(
                    (array) => array.id != pedido.id
                );
                return atualizarPedidos;
            });
        } catch (err) {
            console.error(err);
            alert('Erro ao enviar pedido');
        }
    };
    ///////////////////////////////////////////////////////////

    return (
        <div className="h-screen w-full overflow-hidden  bg-gradient-to-b from-[rgb(96,167,167)] to-[rgb(105,168,126)] flex flex-col items-center font-sans">
            <header className="w-full h-[10vh] py-4 px-[20%] mb-[30px] flex justify-between items-center bg-[rgb(48,83,83)]">
                <h1 className="text-4xl! font-bold text-[#ccc] font-bold">Menu</h1>

                <ul className="flex items-center">
                    <li
                        onClick={() => setSection('live')}
                        className="ml-[30px] list-none cursor-pointer text-[1.3rem] font-bold! text-[#ccc] transition-all hover:border-b hover:border-red-500 hover:text-red-500"
                    >
                        Live
                    </li>

                    <li
                        onClick={() => setSection('pendentes')}
                        className="ml-[30px] list-none cursor-pointer text-[1.3rem] font-bold! text-[#ccc] transition-all hover:border-b  hover:border-red-500 hover:text-red-500"
                    >
                        Pendentes
                    </li>

                    <li
                        onClick={() => setSection('confirmados')}
                        className="ml-[30px] list-none cursor-pointer text-[1.3rem] font-bold! text-[#ccc] transition-all hover:border-b  hover:border-red-500 hover:text-red-500"
                    >
                        Confirmados
                    </li>

                    <li
                        onClick={() => setSection('produtos')}
                        className="ml-[30px] list-none cursor-pointer text-[1.3rem] font-bold! text-[#ccc] transition-all hover:border-b  hover:border-red-500 hover:text-red-500"
                    >
                        Produtos
                    </li>
                </ul>
            </header>
            {section == 'live' ? (
                <>
                    <button
                        className="mb-23 rounded-lg bg-red-500! px-4 py-2 text-base font-bold text-white active:scale-95"
                        onClick={ativarSom}
                    >
                        Ativar Som
                    </button>

                    <section className="flex w-[90%] flex-col items-center">
                        <h1
                            className="
                                text-3xl
                                font-extrabold!
                                animate-[led_8s_linear_infinite]
                            "
                        >
                            LIVE
                        </h1>

                        <div
                            id="mensagens"
                            className="mt-6 mb-6 flex h-[48vh] w-[50%] flex-col gap-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-200/40 p-10 py-8 shadow-lg backdrop-blur-md"
                        >
                            {[...(live || [])].reverse().map((pedido) => (
                                <div
                                    key={pedido.id}
                                    className="rounded-xl border border-white/10 bg-[rgb(48,83,83)]/30 p-4 transition-all duration-200 hover:bg-black/30"
                                >
                                    {/* Header */}
                                    <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                                        <h2 className="text-sm font-semibold text-black">Pedido #{pedido.id}</h2>

                                        <span className="rounded-md bg-red-500 px-2 py-1 text-xs font-medium text-green-300">
                                            Novo
                                        </span>
                                    </div>

                                    {/* Produtos */}
                                    <ul className="flex flex-col gap-2">
                                        {pedido.produtos?.map((produto: any) => (
                                            <li
                                                key={produto.produtoId}
                                                className="flex items-center justify-between rounded-lg bg-white/20  px-3 py-2"
                                            >
                                                <div className="flex flex-col">
                                                    <strong className="text-sm text-black">{produto.nome}</strong>

                                                    <span className="text-xs text-black-400">
                                                        Qtd: {produto.quantidade}
                                                    </span>
                                                </div>

                                                <span className="text-sm font-semibold text-green-300">
                                                    R$ {produto.subtotal}
                                                </span>
                                            </li>
                                        ))}
                                        <div className="flex justify-between items-center gap-24 mt-2 px-8">
                                            <button
                                                className="flex-1"
                                                onClick={async () => {
                                                    cancelOrder(pedido);
                                                }}
                                            >
                                                Cancelar
                                            </button>

                                            <button
                                                className="flex-1 bg-[rgb(025,168,106)]!"
                                                onClick={async () => confirmOrder(pedido)}
                                            >
                                                Confirmar
                                            </button>
                                        </div>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            ) : section == 'pendentes' ? (
                <>
                    <Pendentes />
                </>
            ) : section == 'produtos' ? (
                <div className="flex gap-2 justify-center w-full px-4">
                    <div className="flex flex-col gap-2 items-center flex-1 py-4">
                        <h1 className="text-black font-extrabold! text-[2.5rem]!  ">Mais vendidos:</h1>
                        <Carrosel />
                    </div>
                    <div className='flex-1 border border-red-600 flex flex-col justify-start items-center p-4'>
                        <h3>teste</h3>
                    </div>
                </div>
            ) : section == 'confirmados' ? (
                <>
                    <Concluido />
                </>
            ) : (
                'Erro'
            )}
        </div>
    );
}



export default Delivery;
