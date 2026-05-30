import type { ReactNode } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../context/ContextProvider';
import { FaBeer } from 'react-icons/fa';

type Props = {
    nome: string;
    id: number;
    children?: ReactNode;
};

const Home = ({ nome, id, children }: Props) => {

    //const context = useContext(Context);
    //if (!context) return null;

    const { theme } = useContext(Context)!;


    //setTheme('dark')

    return (
        <>
            <header className="flex flex-row justify-between items-center px-40 py-5 bg-gray-600 absolute top-0 left-0 w-full">
                <h1>
                    {' '}
                    <FaBeer className="text-5xl text-white" />
                </h1>
                <nav className="flex justify-between gap-6">
                    <Link className="bg-slate-300 p-2 rounded-2xl w-25 text-center" to={'/api/dadosapi'}>
                        Dados API
                    </Link>
                    <Link className="bg-slate-300 p-2 rounded-2xl w-25 text-center" to={`/socket/?user=${nome}`}>
                        Socket
                    </Link>
                    <Link className="bg-slate-300 p-2 rounded-2xl w-25 text-center" to={`/signalr`}>
                        SignalR
                    </Link>
                    <Link className="bg-slate-300 p-2 rounded-2xl w-25 text-center" to={`/delivery`}>
                        Delivery
                    </Link>
                </nav>
                <ul className="flex flex-row gap-4 items-center justify-center text-white font-black">
                    <li>{nome}</li>
                    <li>ID: {id}</li>
                </ul>
            </header>

            <div
                className={`flex flex-col justify-center items-center w-full min-h-screen ${
                    theme === 'Default' ? 'bg-gray-500' : 'bg-gray-900'
                }`}
            >
                {children}
            </div>

            <footer className="flex flex-row justify-center items-center px-40 py-8 bg-gray-600 absolute bottom-0 left-0 w-full text-[0.3rem]">
                <h1>Todos os direitos reservados.</h1>
            </footer>
        </>
    );
};

export default Home;
