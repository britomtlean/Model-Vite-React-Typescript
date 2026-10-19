import type { ReactNode } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../context/ContextProvider';
import { FaBeer } from 'react-icons/fa';
import { BiUser } from 'react-icons/bi';

type Props = {
    nome: string;
    id: number;
    children?: ReactNode;
};

const Home = ({ nome, id, children }: Props) => {

    const { theme, setTheme } = useContext(Context)!;

    return (
        <>
            <header
                className={`w-full h-[10vh] py-5 lg:px-20 2xl:px-40  fixed top-0 z-100
                flex justify-around items-center
                ${theme === false ? 'bg-gray-600 text-gray-800' : 'bg-gray-950 text-black'}`}
            >
                <h1>
                    {' '}
                    <FaBeer className="text-5xl text-white" />
                </h1>

                <nav className="flex justify-center gap-6">
                    <Link className="bg-slate-300 p-2 rounded-2xl w-25 text-center" to={'/api/dadosapi'}>
                        Dados API
                    </Link>
                    <Link className="bg-slate-300 p-2 rounded-2xl w-25 text-center" to={`/carrosel`}>
                        Carrosel
                    </Link>
                    <Link className="bg-slate-300 p-2 rounded-2xl w-25 text-center" to={`/ref`}>
                        UseRef
                    </Link>
                    <Link className="bg-slate-300 p-2 rounded-2xl w-25 text-center" to={`/socket/?user=${nome}`}>
                        Socket
                    </Link>
                    <Link className="bg-slate-300 p-2 rounded-2xl w-25 text-center" to={`/signalr`}>
                        SignalR
                    </Link>
                </nav>

                <ul className={`flex flex-row gap-4 items-center justify-center font-black text-white`}>
                    <li>{nome}</li>
                    <li>ID: {id}</li>
                    <BiUser className="size-8" />
                    <button
                        onClick={() => {
                            setTheme(!theme);
                        }}
                    >
                        {theme === false ? 'Anoitecer' : 'Amanhecer'}
                    </button>
                </ul>
            </header>

            <div
                className={`w-full min-h-screen pt-[10vh]
                    flex flex-col justify-center items-center
                    ${theme === false ? 'bg-gray-500' : 'bg-gray-900'}`}
            >
                {children}
            </div>
        </>
    );
};

export default Home;
