import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaAngleRight } from 'react-icons/fa';
import { FaAngleLeft } from 'react-icons/fa';

type Produto = {
    produtoId: string;
    nome: string;
    descricao: string;
    quantidade: number;
    valor: number;
    subtotal: number;
    categoria: string;
    imagem: string;
    id?: string;
};

const Carrosel = () => {
    // PRODUCTS
    const [produtos, setProdutos] = useState<Array<Produto> | null>(null);
    const [firstProduct, setFirstProduct] = useState<Produto | null>(null);

    //REF
    const oneRef = useRef<HTMLInputElement>(null);

    useEffect(() => {

        const getProducts = async () => {
            const res = await fetch('http://localhost:5157/api/Produtos');
            const data = await res.json();
            setProdutos(() => {
                console.log(data);
                return data;
            });
        };

        getProducts();
    }, []);

    useEffect(() => {
        if (!produtos) return;

        setFirstProduct(produtos.find((arr, index) => index == 0)!);

    }, [produtos]);

    const nextProduct = () => {
        if (!produtos) return;

        if (oneRef.current) {
            // Sai pela esquerda
            oneRef.current.style.transition = 'transform 0.5s ease'; //animação
            oneRef.current.style.transform = 'translateX(-100vw)';

            setTimeout(() => {

                if (!oneRef.current) return;

                // Vai para a direita sem animação
                oneRef.current.style.transition = 'none';
                oneRef.current.style.transform = 'translateX(100vw)';

                // Força reflow
                void oneRef.current.offsetWidth;

                // Retorna para o centro animando
                oneRef.current.style.transition = 'transform 0.5s ease';
                oneRef.current.style.transform = 'translateX(0)';

                const first: Produto = produtos[0];
                const fila: Array<Produto> = produtos.filter((array, index) => index != 0);
                const newArray: Array<Produto> = [...fila, first];

                setProdutos(newArray);

            }, 500);
        }
    };

    const returnProduct = () => {

        if (!produtos || !oneRef.current) return;

        oneRef.current.style.transition = 'transform 0.5s ease'; //animação
        oneRef.current.style.transform = 'translateX(100vw)';

        setTimeout(() => {
            if (!oneRef.current) return;

            // Vai para a direita sem animação
            oneRef.current.style.transition = 'none';
            oneRef.current.style.transform = 'translateX(-100vw)';

            // Força reflow
            void oneRef.current.offsetWidth;

            // Retorna para o centro animando
            oneRef.current.style.transition = 'transform 0.5s ease';
            oneRef.current.style.transform = 'translateX(0)';

        const last: Produto = produtos[produtos?.length! - 1];
        const fila: Array<Produto> = produtos?.filter((array, index) => index != produtos?.length! - 1);
        const newArray: Array<Produto> = [last, ...fila];

        setProdutos(newArray);
        }, 500);
    };

    return (
        <div className="flex justify-center items-center w-full h-full px-50 py-5 border-t-2 border-white gap-y-5 gap-x-1">
            <div
                ref={oneRef}
                className="w-2/5 h-1/2 flex justify-center items-center col-span-5 row-span-2 gap-4
          shadow-xl/30 border-cyan-400 shadow-[0_0_80px_2px_rgba(100,197,223,0.5)] inset-shadow-sm border"
            >
                <button className="flex-1! h-full border-l-0! rounded-r-[0]! bg-black-300/50!" onClick={nextProduct}>
                    <FaAngleLeft className="text-3xl" />
                </button>

                <div className="flex-5 flex flex-col justify-center items-center h-full bg-gray-200/10 p-4">
                    {firstProduct == null ? (
                        'Carregando...'
                    ) : (
                        <>
                            <img
                                className="flex-5 min-w-3/4 max-h-[180px] rounded-3xl"
                                src={`http://localhost:5157/images/${firstProduct.imagem}`}
                                alt=""
                            />
                            <h2 className="flex-1 text-black! text-[1.8rem]! font-extrabold">{firstProduct.nome}</h2>
                            <h2 className="flex-1 text-black! text-[1.2rem]! font-medium">{firstProduct.descricao}</h2>
                            <h2 className="flex-1 text-black! text-[1.5rem]! font-medium">{firstProduct.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}</h2>
                            <a className="text-[1.2rem]" href="">
                                Detalhes
                            </a>
                        </>
                    )}
                </div>

                <button className="flex-1 h-full bg-black-300/50! border-r-0! rounded-l-[0]!" onClick={returnProduct}>
                    <FaAngleRight className="text-3xl" />
                </button>
            </div>

            {/*
          <div
              className="p-10 w-full h-full
              col-span-3 row-span-3 flex flex-col justify-start items-center
              font-bold text-center
              rounded bg-radial from-blue-400/30 to-blue-500/30
              shadow-xl/30 border-cyan-400 shadow-[0_0_80px_2px_rgba(100,197,223,0.5)] inset-shadow-sm border"
          >
              <input
                  type="text"
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="my-4 px-4 py-2 rounded w-full text-[16px] font-normal shadow bg-sky-200"
              />
              <ul className="w-full grid grid-cols-3 py-2 bg-slate-300">
                  <li>Nome</li>
                  <li>Valor</li>
                  <li>Dados</li>
              </ul>
              <div className="w-full overflow-y-scroll">
                  {dadosFiltrados?.map((item) => (
                      <ul
                          className="grid grid-rows-2 grid-cols-3
                          w-full py-3 bg-blue-300 border-b border-white
                          font-light hover:bg-white "
                          key={item.id}
                      >
                          <>
                              <li>{item.nome}</li>
                              <li>R$ {item.valor}</li>
                              <Link to={`/painel/${''}`} className="hover:cursor-pointer">
                                  Detalhes
                              </Link>
                          </>
                      </ul>
                  ))}
              </div>
          </div>
*/}
        </div>
    );
};

export default Carrosel;
