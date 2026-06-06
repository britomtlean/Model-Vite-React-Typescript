import { useState, useEffect } from 'react'

type Produto = {
    produtoId: string;
    nome: string;
    descricao: string;
    quantidade: number;
    valor: number;
    subtotal: number;
    categoria: string;
    imagem: string;
};

type Pedido = {
    produtos: Produto[];
    valorTotal: number;
    nomeCliente: string;
    contatoCliente: string;
    enderecoCliente: string;
};

const Carrosel = () => {


    // PRODUCTS
    const [produtos, setProdutos] = useState<Array<Produto> | null>(null);
    const [firstProduct, setFirstProduct] = useState<Produto | null>(null);


    useEffect(() => {

      const getProducts = async () =>
        {
          const res = await fetch('http://localhost:5157/api/Produtos');
          const data = await res.json();
          setProdutos(() =>{console.log(data); return data})
        }

      getProducts();
    },[])

    useEffect(() => {
      if (!produtos) return;

      setFirstProduct(produtos.find((arr, index) => index == 0 )!)
    }, [produtos]);

    const nextProduct = () => {
      if(!produtos) return

      const first: Produto = produtos[0];
      const fila: Array<Produto> = produtos.filter((array, index) => index != 0);
      const newArray: Array<Produto> = [...fila, first];

      setProdutos(newArray);
    };

    const returnProduct = () => {
      if (!produtos) return;

      const last: Produto = produtos[produtos?.length! - 1];
      const fila: Array<Produto> = produtos?.filter((array, index) => index != produtos?.length! - 1);
      const newArray: Array<Produto> = [last, ...fila];

      setProdutos(newArray);
    };


  return (
      <div className="w-3/4 h-[400px] flex justify-center items-center ">
          <button className="flex-1! h-full border-l-0! rounded-r-[0]! bg-cyan-300/50!" onClick={returnProduct}></button>

          <div className="flex-8 flex flex-col justify-center items-center h-full bg-gray-200/10 p-4">
              {firstProduct == null ? (
                  'Carregando...'
              ) : (
                  <>
                      <img
                          className="flex-5 min-w-3/4 h-[80px] rounded-3xl"
                          src={`http://localhost:5157/images/${firstProduct.imagem}`}
                          alt=""
                      />
                      <h2 className="flex-1 text-black! text-[1.8rem]! font-extrabold">{firstProduct.nome}</h2>
                      <h2 className="flex-1 text-black! text-[1.2rem]! font-medium">{firstProduct.descricao}</h2>
                      <h2 className="flex-1 text-black! text-[1.5rem]! font-medium">{firstProduct.valor}</h2>
                      <a className="text-[1.2rem]" href="">
                          Detalhes
                      </a>
                  </>
              )}
          </div>

          <button
              className="flex-1 h-full bg-cyan-300/50! border-r-0! rounded-l-[0]!"
              onClick={nextProduct}
          ></button>
      </div>
  );
}

export default Carrosel
