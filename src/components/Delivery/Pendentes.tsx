import { useEffect, useState } from "react";

interface ProdutoPedido {
    produtoId: string;
    nome: string;
    quantidade: number;
    valorUnitario: number;
    subtotal: number;
}

interface Pedido {
    id: string;
    dataOriginal: string;
    data: string;
    valorTotal: number;
    status: boolean | null;
    nomeCliente: string;
    contatoCliente: string;
    enderecoCliente: string;
    produtos: ProdutoPedido[];
}

export default function Pendentes() {
    const [vendas, setVendas] = useState<Pedido[]>([]);
    const [ultimaLista, setUltimaLista] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const [paginaAtual, setPaginaAtual] = useState<number>(1);

    const REGISTROS_POR_PAGINA = 6;

    const [dataSelecionada, setDataSelecionada] = useState<string>(
        new Date().toLocaleDateString("sv-SE", {
            timeZone: "America/Sao_Paulo",
        })
    );

    /************** FUNÇÕES **************/

    function getDataLocalFormatada(data: string): string {
        return new Date(data).toLocaleDateString("sv-SE", {
            timeZone: "America/Sao_Paulo",
        });
    }

    /************** FETCH **************/

async function carregarPedidos(): Promise<void> {
    try {
        const res = await fetch('http://localhost:5157/api/pedido', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }

        const data = await res.json();

        const novosPedidos: Pedido[] = data.map((p: any) => ({
            id: p.id,
            dataOriginal: p.dataPedido,
            data: new Date(p.dataPedido).toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
            }),
            valorTotal: p.valorTotal,
            status: p.status,
            nomeCliente: p.nomeCliente,
            contatoCliente: p.contatoCliente,
            enderecoCliente: p.enderecoCliente,
            produtos: p.produtos,
        }));

        const jsonString = JSON.stringify(novosPedidos);

        if (jsonString !== ultimaLista) {
            setVendas(novosPedidos);
            setUltimaLista(jsonString);
        }

        setLoading(false);
    } catch (err) {
        console.error(err);
        setLoading(false);
    }
}

    /************** AÇÕES **************/

    async function handleConcluir(id: number): Promise<void> {
        const confirmar = confirm(
            "Deseja marcar esta venda como concluída?"
        );

        if (!confirmar) return;

        try {
            const res = await fetch(
                `https://servidor-sistema-vendas.up.railway.app/vendas/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: "concluido",
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Erro ao concluir venda");
            }

            alert("Venda concluída com sucesso!");

            await carregarPedidos();
        } catch (err) {
            if (err instanceof Error) {
                alert("Erro: " + err.message);
            }
        }
    }

    /************** EFFECT **************/

    useEffect(() => {
        carregarPedidos();

        const interval = setInterval(() => {
            carregarPedidos();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    /************** FILTRO **************/

    const vendasFiltradas = vendas.filter((v) => {
        const dataLocal = getDataLocalFormatada(v.dataOriginal);

        return (!dataSelecionada || dataLocal === dataSelecionada) && v.status == null;
    });

    /************** PAGINAÇÃO **************/

    const totalPaginas = Math.ceil(
        vendasFiltradas.length / REGISTROS_POR_PAGINA
    );

    const inicio = (paginaAtual - 1) * REGISTROS_POR_PAGINA;
    const fim = inicio + REGISTROS_POR_PAGINA;

    const vendasPaginadas = vendasFiltradas.slice(inicio, fim);

    const totalPedidos = vendasFiltradas.reduce((acumulador, item) => {
        return acumulador + item.valorTotal;
    }, 0);

    /************** RENDER **************/

    if (loading) {
        return (
            <div className="flex items-center justify-center p-10 text-2xl font-bold text-white">
                Carregando...
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col items-center gap-5 p-10 text-white">
            <h1 className="text-4xl font-bold">Gerenciamento de Vendas</h1>

            <div className="flex items-center gap-3">
                <input
                    type="date"
                    value={dataSelecionada}
                    onChange={(e) => {
                        setDataSelecionada(e.target.value);
                        setPaginaAtual(1);
                    }}
                    className="rounded-lg border border-gray-500 bg-gray-700 px-4 py-2 outline-none"
                />

                <button
                    onClick={() => {
                        setDataSelecionada('');
                        setPaginaAtual(1);
                    }}
                    className="rounded-lg bg-red-500 px-5 py-2 font-bold transition hover:bg-red-600"
                >
                    Limpar Filtro
                </button>
            </div>

            {vendasFiltradas.length === 0 ? (
                <div className="mt-10 text-2xl font-bold">Nenhuma venda encontrada</div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl border border-gray-600 bg-gray-900 shadow-2xl">
                        <table className="min-w-[900px]">
                            <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left">ID</th>
                                    <th className="px-6 py-4 text-left">Cliente</th>
                                    <th className="px-6 py-4 text-left">Contato</th>
                                    <th className="px-6 py-4 text-left">Valor</th>
                                    <th className="px-6 py-4 text-left">Data</th>
                                    <th className="px-6 py-4 text-left">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {vendasPaginadas.reverse().map((row) => (
                                    <tr key={row.id} className="border-t border-gray-700">
                                        <td className="px-6 py-4">{row.id}</td>

                                        <td className="px-6 py-4">{row.nomeCliente}</td>

                                        <td className="px-6 py-4">{row.contatoCliente}</td>

                                        <td className="px-6 py-4">
                                            {row.valorTotal.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                        </td>

                                        <td className="px-6 py-4">{row.data}</td>

                                        <td className="px-6 py-4">
                                            {row.status === true ? (
                                                <span className="font-bold text-green-400">Concluído</span>
                                            ) : (
                                                <span className="font-bold text-yellow-400">Pendente</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={paginaAtual === 1}
                            onClick={() => setPaginaAtual((prev) => prev - 1)}
                            className="rounded-lg bg-gray-700 px-5 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Anterior
                        </button>

                        <span className="text-xl font-bold">
                            Página {paginaAtual} de {totalPaginas}
                        </span>

                        <button
                            disabled={paginaAtual === totalPaginas}
                            onClick={() => setPaginaAtual((prev) => prev + 1)}
                            className="rounded-lg bg-gray-700 px-5 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Próxima
                        </button>
                    </div>

                    <div className="rounded-xl bg-white/10 px-8 py-4 text-4xl font-bold shadow-lg backdrop-blur-md">
                        Total:{' '}
                        {totalPedidos.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </div>
                </>
            )}
        </div>
    );
}
