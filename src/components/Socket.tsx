import { useEffect, useState , useContext} from 'react';
import { useSearchParams } from 'react-router-dom';
import { Context } from '../context/ContextProvider';
import WebSocket from '../services/Socket';


type User = {
    user: string,
    send: string
}

const Socket = () => {

    //CONTEXT
    const { setMessage } = useContext(Context)!;

    //SEARCHPARAMS
    const [searchParams] = useSearchParams();
    const user = searchParams.get('user');

    //INPUT
    const [sendUser, setSendUser] = useState<string>('');
    const [SendMessage, setSendMessage] = useState<string>('');

    ////////////////////////////// STORAGE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

    const storage = localStorage.getItem(`prive_${user}`);

    // VERIFICA SE POSSUI MENSAGENS NO STORAGE
    if (!storage)
    {
        localStorage.setItem(`prive_${user}`, '[]');
        console.log('store null', storage);
    }

    // EXIBE MENSAGENS
    const storageArray: Array<object> = JSON.parse(storage!);
    //console.log('Mensagens: ', storageArray);

    const [privChat, setPrivChat] = useState<Array<object>>([{}]);

    ////////////////////////////////////////////////////////////////////////

    useEffect(() => {

        setMessage('Socket.IO');
        setPrivChat(storageArray);

        //REALIZA CONEXÃO
        WebSocket.connection(user!);

        // RECEBE MENSAGENS
        WebSocket.getSocket((msg) => {
            console.log('Mensagem recebida: ', msg);

            //FRONT RECEBE UM OBJETO COMO MENSAGEM

            setPrivChat((prev) => {
                let updated = [...prev, msg];

                localStorage.setItem(`prive_${user}`, JSON.stringify(updated));

                const storage = localStorage.getItem(`prive_${user}`);
                console.log('storage: ', JSON.parse(storage!));
                updated = JSON.parse(storage!);

                return updated;
            });

            // console.log('privChat: ',privChat)

            /*FRONT RECEBE MSG COMO ARRAY DE OBJETO
                const users: Array<User> = msg.map((array: any) => ({
                    user: array.user,
                    send: array.send,
                }));


                const isPrivate = users[0]?.send === user || users[0]?.user === user;

                // =====================
                // 🌎 GLOBAL
                // =====================
                if (!users.some((item) => item.send)) {
                    if (!privChat) {
                        setPrivChat((prev) => [...prev!, msg]);
                        console.log('Mensagem global');
                        console.log(privChat);
                    } else {
                        setPrivChat((prev) => [...prev!, msg]);
                        console.log('Mensagem global');
                        console.log(privChat);
                    }
                }

                // =====================
                // 🔒 PRIVATE
                // =====================
                if (isPrivate) {
                    if (!privChat) {
                        setPrivChat(msg);
                        console.log('privChat null');
                    } else {
                        setPrivChat((prev) => [...prev!, msg]);
                        console.log('privChat Ok');
                    }
                }
            */
        });

    }, []);



    return (
        <>
            <form
                className="flex flex-col gap-4 justify-center items-center w-[30vw]"
                onSubmit={(e) => {
                    e.preventDefault();
                    WebSocket.sendMessage(user!, SendMessage, sendUser);
                    setSendMessage('');
                }}
            >
                <label className="mb-2">
                    <h1 className="font-semibold text-black!">Chat</h1>
                </label>

                <select onChange={(e) => {
                        const value = e.target.value;
                        setSendUser(value);
                        console.log(value);
                    }} className="bg-white mb-4 p-1.5">
                    <option value="Matheus">Matheus</option>
                    <option value="Rodrigo">Rodrigo</option>
                    <option value="Leandro">Leandro</option>
                </select>

                <input
                    type="text"
                    value={SendMessage}
                    placeholder="Digite sua mensagem"
                    className="bg-gray-300 border rounded-[10px] p-2 w-full"
                    required
                    onChange={(e) => setSendMessage(e.target.value)}
                />

                <button className="bg-slate-500 w-[200px] p-2">Enviar</button>
            </form>

            <h1 className="text-[2rem]! text-black! my-3">Mensagens</h1>

            <div className="flex flex-col-reverse items-center w-[40vw] max-h-[300px] overflow-y-scroll">
                {!privChat || privChat.length === 0
                    ? 'Não há mensagens disponíveis'
                    : privChat?.map((msg: any, index: number) => (
                          <ul
                              className="w-[80%] flex flex-col justify-center items-center bg-slate-200/60 border-b p-4 rounded-[12px]"
                              key={index}
                          >
                              <li className="font-semibold">{msg.user}</li>
                              <li>{msg.message}</li>
                          </ul>
                      ))}
            </div>
        </>
    );
};

export default Socket;
