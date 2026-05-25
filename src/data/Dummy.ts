import type { CartResponse } from '../types/CartResponse';

export class Dummy {

    private static readonly getCartsUrl = 'https://dummyjson.com/carts';

    static getDummy = async (): Promise<CartResponse | never> => {

        const res = await fetch(this.getCartsUrl);

        if (!res.ok) {
            throw new Error('Erro ao buscar dados');
        }

        return res.json();
    };
}
