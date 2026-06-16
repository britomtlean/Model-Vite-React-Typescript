//import Home from './components/Home';
import Home from './components/Home';
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from './context/ContextProvider';

function App() {

    const context = useContext(Context);

    if (!context) return null;

    const { message, user } = context;

    return (
        <>
            <Home nome={user} id={67}>
                {/**? <h1 className='animate-bounce m-4'>{message}</h1> */}
                <Outlet />
            </Home>
        </>
    );
}

export default App;
