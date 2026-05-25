import { useEffect, useState, useContext } from 'react';
import { Context } from '../context/ContextProvider';

const Effect = () => {
    const [count, setCount] = useState<number>(1);
    const { setMessage } = useContext(Context)!;

    setMessage('useEffect')

    useEffect(() => {
        console.log('renderizou')
    }, []);

    useEffect(() => {

        const interval =  setInterval(() => {
            setCount(count + 1);
        }, 1000);

         return () => clearInterval(interval);
    }, [count]);


    return (
        <>
            <h2 className='text-7xl mt-4'>{count}</h2>
        </>
    );
};

export default Effect;
