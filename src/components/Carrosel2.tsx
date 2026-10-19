
import React, { useEffect, useRef, useState } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Carrosel2 = () => {
//{ produtos }: { produtos: ProdutoDB[] | null }
    const oneRef = useRef<HTMLInputElement>(null);
    const [item, setItem] = useState<Record<string,any>[] | null>([]);

    const nextProduct = () => {

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

                setItem((prev: any) => {
                    const first = prev[0];

                    return [...prev.slice(1), first];
                });

            }, 500);
        }
    };

    const returnProduct = () => {

        if (oneRef.current) {

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

                setItem((prev: any) => {
                    const last = prev[prev.length - 1];

                    return [last, ...prev.slice(0, -1)];
                });

            }, 500);
        }
    };

    if(!item) return <>Nenhum produto encontrado</>

    return (
        <div
            className="h-[300px] w-full relative
                flex justify-center items-center
                overflow-hidden rounded-lg
            "
        >
            <button
                className="z-50 md:w-14 h-14 bg-black/80 rounded-[100%] flex justify-center items-center absolute left-[2%]"
                onClick={nextProduct}
            >
                <FaAngleLeft className="text-white text-4xl w-full" />
            </button>

            <div className="flex w-full h-full overflow-hidden items-center justify-around" ref={oneRef}>
                <AnimatePresence mode="popLayout">
                    <div className="w-[25%] rounded-3xl border-2 bg-gray-200 flex justify-center items-center opacity-80 relative">
                        <img src={item[0].imagem} className="w-[200px] h-[300px] object-contain " />

                        {/* Overlay escuro */}
                        <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
                    </div>

                    <div className="w-[30%] rounded-3xl border-2 bg-gray-200 flex justify-center items-center relative">
                        <img src={item[1].imagem} className="w-[200px] h-[300px] object-contain" />
                        <button
                            className="z-50 w-3/4 px-20 py-3 bg-[#1e293b] rounded-lg absolute bottom-[8%] left-[50%] translate-x-[-50%]"
                            onClick={returnProduct}
                        >
                            <h1 className="text-white font-bold">Detalhes</h1>
                        </button>
                    </div>

                    <div className="w-[25%] rounded-3xl border-2 bg-gray-200 flex justify-center items-center opacity-80 relative">
                        <img src={item[2].imagem} className="w-[200px] h-[300px] object-contain" />

                        {/* Overlay escuro */}
                        <div className="absolute inset-0 bg-black/50 rounded-3xl"></div>
                    </div>
                </AnimatePresence>
            </div>

            <button
                className="z-50 md:w-14 h-14 bg-black/80 rounded-[100%] flex justify-center items-center absolute right-[2%]"
                onClick={returnProduct}
            >
                <FaAngleRight className="text-white text-4xl w-full" />
            </button>
        </div>
    );
}

export default Carrosel2;
