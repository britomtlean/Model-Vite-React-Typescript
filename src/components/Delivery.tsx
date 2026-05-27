import { useEffect, useState, useRef } from 'react';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import somPedido from '../assets/meme-fail-alert-locran-1-00-01.mp3';

//const audio = new Audio(somPedido);
//import  PedidoForm from './PedidoForm';

declare global {
    interface Window {
        audioCtx: AudioContext;
        audio: HTMLAudioElement;
    }
}

function Delivery() {

    /////////////////////// AUDIO \\\\\\\\\\\\\\\\\\\\\\\\\\\

    const [sala, setSala] = useState<string>("");
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
                    setSala(sala)
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

    return (
        <div className="max-h-screen w-full overflow-hidden bg-gradient-to-b from-[rgb(96,167,167)] to-[rgb(105,168,126)] flex flex-col items-center font-sans">
            <header className="w-full h-[10vh] py-4 px-[5%] mb-[60px] flex justify-between items-center bg-[rgb(48,83,83)]">
                <h1 className="text-4xl! font-bold text-[#ccc] font-bold">Menu</h1>

                <ul className="flex items-center">
                    <li className="ml-[30px] list-none cursor-pointer text-base font-light text-[#ccc] transition-all hover:border-b hover:border-yellow-400 hover:text-yellow-400">
                        Delivery
                    </li>

                    <li className="ml-[30px] list-none cursor-pointer text-base font-light text-[#ccc] transition-all hover:border-b hover:border-yellow-400 hover:text-yellow-400">
                        Produtos
                    </li>

                    <li className="ml-[30px] list-none cursor-pointer text-base font-light text-[#ccc] transition-all hover:border-b hover:border-yellow-400 hover:text-yellow-400">
                        Clientes
                    </li>
                </ul>
            </header>

            <button
                className="mb-8 rounded-lg bg-red-500 px-4 py-2 text-base font-bold text-white active:scale-95"
                onClick={ativarSom}
            >
                Ativar Som
            </button>

            {/* PEDIDOS */}
            <section className="flex w-[90%] flex-col items-center">
                <h1 className="text-3xl font-bold text-gray-100!">Central de pedidos:</h1>

                <div
                    id="mensagens"
                    className="mt-6 mb-6 flex h-[40vh] w-[50%] flex-col gap-3 overflow-y-auto rounded-2xl border border-white/10 bg-slate-200/40 p-10 py-8 shadow-lg backdrop-blur-md"
                >
                    {[...(live || [])].reverse().map((pedido) => (
                        <div
                            key={pedido.id}
                            className="rounded-xl border border-white/10 bg-[rgb(48,83,83)]/30 p-4 transition-all duration-200 hover:bg-black/30"
                        >
                            {/* Header */}
                            <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2">
                                <h2 className="text-sm font-semibold text-black">Pedido #{pedido.id}</h2>

                                <span className="rounded-md bg-green-500/15 px-2 py-1 text-xs font-medium text-green-300">
                                    Novo
                                </span>

                                <button
                                    onClick={async () => {
                                        try {
                                            const res = await fetch('http://localhost:5157/api/pedido', {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify(pedido)
                                            });

                                             const text = await res.text();

                                            if (!res.ok) {
                                                throw new Error(text);
                                            }

                                            console.log(text);
                                            alert(text);
                                            setLive((): any => {
                                                //const pedidosAntigos = prev;
                                                const atualizarPedidos = live?.filter((array) => array.id != pedido.id);
                                                return atualizarPedidos;
                                            })
                                        } catch (err) {
                                            console.error(err);
                                            alert('Erro ao enviar pedido');
                                        }
                                    }}
                                >
                                    Confirmar
                                </button>
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

                                            <span className="text-xs text-black-400">Qtd: {produto.quantidade}</span>
                                        </div>

                                        <span className="text-sm font-semibold text-green-300">
                                            R$ {produto.subtotal}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mb-5 flex items-center justify-center gap-2">
                    <label className="text-base text-white">Filtrar por data:</label>

                    <input type="date" className="rounded-md border-none p-2 text-base" />

                    <button className="rounded-lg bg-red-500 px-4 py-2 text-base font-bold text-white active:scale-95">
                        Limpar
                    </button>
                </div>

                <div className="h-[600px] w-full overflow-y-auto rounded-lg"></div>

                <div></div>
            </section>

            {/* PRODUTOS */}
            <section className="hidden w-[90%] flex-col items-center">
                <h1 className="text-3xl font-bold text-white">Produtos</h1>

                <div className="mt-8 mb-10 flex h-[50vh] w-full flex-col items-center justify-start overflow-y-auto rounded-lg border border-[#ccc] bg-white/15 backdrop-blur-md">
                    <ul className="w-full"></ul>
                </div>

                <div className="flex w-full items-center justify-center">
                    <button className="flex-1 bg-red-500 py-4 text-base text-white">Cadastrar</button>

                    <button className="flex-1 bg-red-500 py-4 text-base text-white">Estoque</button>
                </div>
            </section>

            {/* CLIENTES */}
            <section className="hidden w-[90%] flex-col items-center">
                <h1 className="text-3xl font-bold text-white">Clientes</h1>
            </section>

            {/* CADASTRO */}
            <section className="hidden w-[90%] flex-col items-center pb-10">
                <h1 className="text-3xl font-bold text-white">Cadastrar Produto</h1>

                <form className="mt-10 mb-10 flex h-[60vh] w-full flex-col items-center justify-center overflow-y-auto rounded-lg border border-[#ccc] bg-white/15 px-[5%] py-[60px] backdrop-blur-md">
                    <label className="mb-10 w-full">
                        <h3 className="mb-2 text-xl text-white">Nome do produto *</h3>

                        <input
                            type="text"
                            className="block h-24 w-full rounded-lg border-2 border-white/20 bg-[rgba(209,209,209,0.397)] p-2 text-base outline-none"
                        />
                    </label>

                    <label className="mb-10 w-full">
                        <h3 className="mb-2 text-xl text-white">Descrição</h3>

                        <textarea
                            rows={3}
                            className="block h-24 w-full rounded-lg border-2 border-white/20 bg-[rgba(209,209,209,0.397)] p-2 text-base outline-none"
                        ></textarea>
                    </label>

                    <label className="mb-10 w-full">
                        <h3 className="mb-2 text-xl text-white">Valor (ex: 8.50) *</h3>

                        <input
                            type="text"
                            className="block h-24 w-full rounded-lg border-2 border-white/20 bg-[rgba(209,209,209,0.397)] p-2 text-base outline-none"
                        />
                    </label>

                    <label className="mb-10 w-full">
                        <h3 className="mb-2 text-xl text-white">Estoque *</h3>

                        <input
                            type="number"
                            className="block h-24 w-full rounded-lg border-2 border-white/20 bg-[rgba(209,209,209,0.397)] p-2 text-base outline-none"
                        />
                    </label>

                    <label className="mb-10 w-full">
                        <h3 className="mb-2 text-xl text-white">Imagem do produto (PNG/JPG) *</h3>

                        <input
                            type="file"
                            className="block h-24 w-full rounded-lg border-2 border-white/20 bg-[rgba(209,209,209,0.397)] p-2 text-base outline-none"
                        />
                    </label>

                    <div className="flex w-full items-center gap-3">
                        <button className="w-full rounded-lg bg-blue-600 py-8 text-base text-white">
                            Enviar produto
                        </button>

                        <div className="text-lg text-white">Enviando…</div>
                    </div>
                </form>

                <div className="mb-5 text-[2.5rem]"></div>

                <div className="flex max-h-[500px] w-full items-center justify-center gap-3">
                    <div className="flex flex-col items-start justify-center">
                        <div className="flex-[4]">
                            <img alt="preview da imagem" className="max-w-[350px]" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <small></small>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Delivery;
