import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

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

type PedidoFormProps = {
    sendMessage: (pedido: Pedido) => void;
};

function PedidoForm({ sendMessage }: PedidoFormProps) {

    const [pedido, setPedido] = useState<Pedido>({
        produtos: [
            {
                produtoId: '',
                nome: '',
                quantidade: 1,
                valorUnitario: 0,
                subtotal: 0,
            },
        ],
        valorTotal: 0,
        nomeCliente: '',
        contatoCliente: '',
        enderecoCliente: '',
    });

    function handleClienteChange(e: ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;

        setPedido((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleProdutoChange(index: number, field: keyof Produto, value: string | number) {
        const novosProdutos = [...pedido.produtos];

        (novosProdutos[index] as Record<keyof Produto, string | number>)[field] =
            field === 'quantidade' || field === 'valorUnitario' || field === 'subtotal' ? Number(value) : String(value);

        novosProdutos[index].subtotal = novosProdutos[index].quantidade * novosProdutos[index].valorUnitario;

        const valorTotal = novosProdutos.reduce((total, produto) => total + produto.subtotal, 0);

        setPedido((prev) => ({
            ...prev,
            produtos: novosProdutos,
            valorTotal,
        }));
    }

    function adicionarProduto() {
        setPedido((prev) => ({
            ...prev,
            produtos: [
                ...prev.produtos,
                {
                    produtoId: '',
                    nome: '',
                    quantidade: 1,
                    valorUnitario: 0,
                    subtotal: 0,
                },
            ],
        }));
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        sendMessage(pedido);
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
            <h1 className="text-2xl font-bold mb-6">Novo Pedido</h1>

            <div className="mb-4">
                <label className="block mb-1">Nome Cliente</label>

                <input
                    type="text"
                    name="nomeCliente"
                    value={pedido.nomeCliente}
                    onChange={handleClienteChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div className="mb-4">
                <label className="block mb-1">Contato</label>

                <input
                    type="text"
                    name="contatoCliente"
                    value={pedido.contatoCliente}
                    onChange={handleClienteChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            <div className="mb-6">
                <label className="block mb-1">Endereço</label>

                <input
                    type="text"
                    name="enderecoCliente"
                    value={pedido.enderecoCliente}
                    onChange={handleClienteChange}
                    className="w-full border p-2 rounded"
                />
            </div>

            <h2 className="text-xl font-semibold mb-4">Produtos</h2>

            {pedido.produtos.map((produto, index) => (
                <div key={index} className="border p-4 rounded mb-4">
                    <div className="mb-3">
                        <label className="block mb-1">Produto ID</label>

                        <input
                            type="text"
                            value={produto.produtoId}
                            onChange={(e) => handleProdutoChange(index, 'produtoId', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block mb-1">Nome Produto</label>

                        <input
                            type="text"
                            value={produto.nome}
                            onChange={(e) => handleProdutoChange(index, 'nome', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block mb-1">Quantidade</label>

                        <input
                            type="number"
                            value={produto.quantidade}
                            onChange={(e) => handleProdutoChange(index, 'quantidade', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block mb-1">Valor Unitário</label>

                        <input
                            type="number"
                            step="0.01"
                            value={produto.valorUnitario}
                            onChange={(e) => handleProdutoChange(index, 'valorUnitario', e.target.value)}
                            className="w-full border p-2 rounded"
                        />
                    </div>

                    <p className="font-bold">Subtotal: R$ {produto.subtotal.toFixed(2)}</p>
                </div>
            ))}

            <button type="button" onClick={adicionarProduto} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
                Adicionar Produto
            </button>

            <div className="text-xl font-bold mb-4">Valor Total: R$ {pedido.valorTotal.toFixed(2)}</div>

            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
                Enviar Pedido
            </button>
        </form>
    );
}

export default PedidoForm
