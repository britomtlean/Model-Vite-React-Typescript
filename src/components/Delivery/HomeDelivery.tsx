import {useState, type ReactNode} from 'react'

import Pendentes from './Pendentes';
import Concluido from './Concluido';
import Carrosel from './Carrosel';
import Delivery from './Delivery';

const HomeDelivery = () => {
    //NAVEGAÇÃO
    const [section, setSection] = useState<string>('live');

    const renderComponente = () => {
        switch (section) {
            case 'live':
                return <Delivery />;
            case 'pendentes':
                return <Pendentes />;
            case 'confirmados':
                return <Concluido />;
            case 'produtos':
                return <Carrosel />;
            default:
                return <Delivery />;
        }
    };

    return (
        <>
            <header className="w-full min-h-[10vh] py-4 px-[20%] flex justify-between items-center mb-4 bg-[rgb(48,62,83)]">
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

            <div className='h-full w-full flex justify-center items-start pt-4'>{renderComponente()}</div>
        </>
    );
};

export default HomeDelivery
