// c’est un moule où on lui dit ce qu’on attend de lui, la base sera toujours la meme
export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: {
        rate: number;
        count: number;
    };
};