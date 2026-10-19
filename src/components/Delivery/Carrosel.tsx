import { useState, useEffect, useRef } from 'react';
import { FaAngleRight } from 'react-icons/fa';
import { FaAngleLeft } from 'react-icons/fa';

const Carrosel = () => {
    // PRODUCTS
    const [produtos, setProdutos] = useState<Array<Record<string, any>> | null>([]);
    const [firstProduct, setFirstProduct] = useState<Record<string, any> | null>(null);

    //REF
    const oneRef = useRef<HTMLInputElement>(null);

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

                const first: Record<string, any> = produtos[0];
                const fila: Array<Record<string, any>> = produtos.filter((array, index) => index != 0);
                const newArray: Array<Record<string, any>> = [...fila, first];

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

            const last: Record<string, any> = produtos[produtos?.length! - 1];
            const fila: Array<Record<string, any>> = produtos?.filter((array, index) => index != produtos?.length! - 1);
            const newArray: Array<Record<string, any>> = [last, ...fila];

            setProdutos(newArray);
        }, 500);
    };

    return (
        <div
            ref={oneRef}
            className="w-full h-full
                 flex flex-col justify-center items-center col-span-5 row-span-2 gap-4 relative rounded-lg
                shadow-xl/30 shadow-[0_0_80px_2px_rgba(0,7,223,0.1)] inset-shadow-sm
    bg-center [mask-image:linear-gradient(to_top,transparent_0%,black_0%,black_100%,transparent_100%)]
                after:content-[''] after:absolute after:inset-0 after:bg-radial after:from-gray-900/30 after:to-[#0d171fdc]
                after:[mask-image:linear-gradient(to_top,transparent_0%,black_0%,black_90%,transparent_100%)]
"
            style={{
                //Imagem aqui
                backgroundImage: `url(${'https://img.magnific.com/fotos-premium/globo-da-terra-a-noite-elementos-desta-imagem-fornecidos-pela-nasa-renderizacao-3d_924688-4494.jpg?semt=ais_hybrid&w=740&q=80'})`,
            }}
        >
            <button
                className="z-50 md:w-14 h-14 bg-black/80 rounded-[100%] flex justify-center items-center absolute left-[2%]"
                onClick={nextProduct}
            >
                <FaAngleLeft className="text-white text-4xl w-full" />
            </button>
            <div
                className="w-full h-full  bg-radial from-gray-500/80 to-black
                flex flex-col justify-start items-center
                "
            >
                <div
                    className="w-full h-full p-5
                flex flex-col justify-center items-center gap-5"
                >
                    {
                        //Conteudo aqui
                        <>
                            <h1 className="z-100 font-bold text-4xl!">Seu conteudo aqui</h1>

                            <form
                                action=""
                                className="2xl:w-[30%] 2xl:h-[70%] bg-radial from-gray-300/50 to-gray-400/80 rounded-2xl
                                shadow-xl/30 shadow-[0_0_80px_2px_rgba(0,7,223,0.3)] inset-shadow-sm"
                            ></form>
                        </>
                    }
                </div>
            </div>

            <button
                className="z-50 md:w-14 h-14 bg-black/80 rounded-[100%] flex justify-center items-center absolute right-[2%]"
                onClick={returnProduct}
            >
                <FaAngleRight className="text-white text-4xl w-full" />
            </button>
        </div>
    );
};

export default Carrosel;
