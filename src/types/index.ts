


export interface IProduct{
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}


export interface IBasket{
    items: string[];
    total: number;
}


export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}


export type PaymentMethod = "cash" | "card";

export interface IOrder{
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    items: string[];
    total: number;
}


export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}



export type OrderForm = Omit<IOrder, "total" | "items">;

export type TContactsForm = Pick<IOrder, 'email' | 'phone'>;

export interface IOrderResult{
    id: string;
    total: number;
}

