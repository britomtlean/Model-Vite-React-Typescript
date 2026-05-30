import { useState, createContext } from 'react';
import type { PropsWithChildren } from 'react'; //TIPAGEM DE PROP

export type ContextType = {
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
    status: boolean;
    setStatus: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    user: string;
    setUser: React.Dispatch<React.SetStateAction<string>>;
    contato: string;
    setContato: React.Dispatch<React.SetStateAction<string>>;
};

//function createContext<T>(defaultValue: T): React.Context<T>

//createContext() Deve receber um tipo e ser atribuido pelo mesmo tipo
export const Context: React.Context<ContextType | null> = createContext<ContextType | null>(null);

/************************************************************************************** */

export const ContextProvider = ({ children }: PropsWithChildren) => {

    const [theme, setTheme] = useState<string>('Default');
    const [status, setStatus] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('Hello Context');
    const [user, setUser] = useState<string>('Default');
    const [contato, setContato] = useState<string>('');

    return (
        <Context.Provider value={{ theme, setTheme, status, setStatus, message, setMessage, user, setUser, contato, setContato }}>
            {children}
        </Context.Provider>
    );
};

export default ContextProvider;
