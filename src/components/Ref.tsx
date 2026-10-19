//Tipagem usando useRef com elementos HTML

import { useRef, useContext, useEffect, useState } from 'react';
import { Context } from '../context/ContextProvider';

const Ref = () => {

    const { setMessage } = useContext(Context)!;
    const inputRef = useRef<HTMLInputElement>(null);
    const [mensagem, setMensagem] = useState('Sua mensagem aqui');

    useEffect(() => {setMessage('Seu Mensagem aqui');},[])

    const focarInput = () => {
        if (inputRef.current) setMessage(inputRef.current.value);
    };

    return (
        <>
            <h1 className='text-2xl!'>{mensagem}</h1>
            <input
                type="text"
                name="text"
                className="bg-slate-300/35 my-8 rounded-lg border p-2 w-1/4"
                ref={inputRef}
            />
            <button onClick={() => {setMensagem(inputRef.current!.value); inputRef.current!.value = ""}}>Alterar Menssagem</button>
        </>
    );
};

export default Ref;
