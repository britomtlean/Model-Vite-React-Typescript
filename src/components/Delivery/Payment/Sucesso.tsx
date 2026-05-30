import { useContext } from 'react';
import { Context } from '../../../context/ContextProvider';


function Sucesso() {

    const { setMessage } = useContext(Context)!;
    setMessage('Pedido Confirmado!');

    return (
        <div>
        </div>
    );
}

export default Sucesso;
