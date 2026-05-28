import { useState } from 'react'

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

const Carrosel = () => {

    const [ item, setItem ] = useState<Array<string>>(["1","2","3"])
    const [exibir, setExibir] = useState<string>(item[0]);

    const next = () =>
    {
      setExibir((): any =>
      {
        const first: string = item[0];
        const fila = item.filter((array, index) => index != 0);
        const newArray: Array<string> = [...fila, first];

        setItem(newArray);
        return newArray.find((array, index) => index == 0);
      })
    }

    const last = () =>
    {
      setExibir((): any =>
      {
        const last: string = item[item.length - 1];
        const fila = item.filter((array, index) => index != item.length - 1);
        const newArray: Array<string> = [last, ...fila];

        setItem(newArray);
        return newArray.find((array, index) => index == 0);
      })
    };




  return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-600 gap-10">
          <button className="p-10! rounded-[100%]! bg-blue-400!" onClick={last}>
              Return
          </button>
          <div className="p-40  px-150 border bg-white">
              {exibir}
          </div>
          <button className="p-10! rounded-[100%]! bg-blue-400!" onClick={next}>
              Next
          </button>
      </div>
  );
}

export default Carrosel
