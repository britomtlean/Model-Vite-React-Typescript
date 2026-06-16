import { useEffect, useState, useContext } from 'react';
import { Context } from '../context/ContextProvider';
import { Dummy } from '../data/Dummy';
import type { CartResponse } from '../types/CartResponse';

const DadosAPI = () => {
    const [dados, setDados] = useState<CartResponse | null>();
    const { setMessage } = useContext(Context)!;

    setMessage('Dados API')

    useEffect(() => {
        Dummy.getDummy()
            .then((data) => {
                (console.log(data), setDados(data));
            })
            .catch((error) => console.error(error));
    }, []);
    return (
        <>
            <div className="bg-gray-400/10 rounded-2xl flex flex-col justify-start items-center w-[90vw] max-h-[70vh] overflow-scroll px-4">
                {dados?.carts.map((cart) => (
                    <div
                        className="bg-gray-300/80 border-b rounded-xl flex flex-col justify-start items-center w-[50vw] gap-4"
                        key={cart.id}
                    >
                        <div className="font-bold text-3xl border-b w-full text-center py-4 bg-gray-200 rounded-t-xl">
                            <h2>Card ID: {cart.id}</h2>
                        </div>
                        <div className='border p-2 rounded-2xl bg-gray-300'>
                            <h2 className="font-bold text-2xl">
                                 Valor do Carrinho:{' '}
                                {cart.total.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })}
                            </h2>
                        </div>
                        <div className="w-full text-center">
                            <h2 className="font-bold text-2xl text-center mb-4">Produtos:</h2>
                            <div className="flex border-b">
                                <h2 className="w-full bg-gray-100 py-4 font-extrabold">Title</h2>
                                <h2 className="w-full bg-gray-200 py-4 font-extrabold">Price</h2>
                                <h2 className="w-full bg-gray-300 py-4 font-extrabold">Quantity</h2>
                            </div>
                            {cart.products.map((product) => (
                                <>
                                    <div key={product.id} className="border-b flex">
                                        <h2 className="w-full bg-gray-100 py-4 font-medium">{product.title}</h2>
                                        <h2 className="w-full bg-gray-200 py-4 font-medium">
                                            {product.price.toLocaleString('pt-BR', {
                                                style: 'currency',
                                                currency: 'BRL',
                                            })}
                                        </h2>
                                        <h2 className="w-full bg-gray-300 py-4 font-medium">{product.quantity}</h2>
                                    </div>
                                </>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default DadosAPI;
