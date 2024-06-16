import _ from 'lodash';
import { IBasket, IOrder, IProduct, OrderForm, PaymentMethod } from '../../types';
import { IEvents } from '../base/events';

export class AppData {
    items: IProduct[] = [];
    basket: IBasket = {
        items: [],
        total: 0
    };
    preview: IProduct | null  =  null;
    order: IOrder = {
        email: '',
        phone:  '',
        address: '',
        payment: 'card',
        total: 0,
        items:  [],
    };

    formErrors: Partial<Record<keyof OrderForm, string>> = {};

    constructor(protected events: IEvents){}



    clearBasket(){
        this.basket.items = [];
        this.basket.total = 0;
        this.events. emit('basket:change');
    }


    clearOrder(){
        this.order = {
            email: '',
            phone:  '',
            address: '',
            payment: 'card',
            total: 0,
            items:  [],
        };
    }

    setItems(items: IProduct[]){
       this.items  = items;
        this.events.emit('items:change', this.items);
    }

    setPreview(item: IProduct){
        this.preview  = item;
        this.events.emit('preview:change', this.preview);
    }


    inBasket(item: IProduct){
        return this.basket.items.includes(item.id);
    }

    addToBasket(item: IProduct){
        this.basket.items.push(item.id);
        this.basket.total  +=  item.price;
        this.events.emit('basket:change', this.basket);
    }

    removeFromBasket(item: IProduct){
        this.basket.items = this.basket.items.filter(id => id !== item.id);
        this.basket.total -=  item.price;
        this.events.emit('basket:change', this.basket);
    }


    setPaymentMethod(method: PaymentMethod){
        this.order.payment = method;
    }



    setOrderField(field: keyof OrderForm, value: string){

        if (field === 'payment'){
            this.setPaymentMethod(value as PaymentMethod);
        } else {
            this.order[field] = value; 
        }


        if (this.order.payment && this.validateOrder()){
            this.order.total = this.basket.total;
            this.order.items = this.basket.items;
            this.events.emit('order:ready', this.order);
        }
    
    }

    validateOrder(){
        const errors: typeof this.formErrors ={};
        if (!this.order.email){
            errors.email = 'Необходимо указать email';
        }

        if (!this.order.phone){
            errors.phone = 'Необходимо указать телефон';
        }

        if (!this.order.address){
            errors.address = 'Необходимо указать адресс';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

}