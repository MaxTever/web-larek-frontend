
import { TContactsForm } from '../../types/index'
import { EventEmitter } from '../base/events';
import { Form } from'./Form'
import { ensureElement } from "../../utils/utils";


export class ContactsForm extends Form<TContactsForm> {

    protected _email: HTMLInputElement;
    protected  _phone: HTMLInputElement;

    constructor(events: EventEmitter, container: HTMLFormElement){
        super(events, container);


        this._email =  ensureElement<HTMLInputElement>('.form__input[name=email]', this.container);
        this._phone  =  ensureElement<HTMLInputElement>('.form__input[name=phone]', this.container);
    }


    set email(value: string){
        this._email.value = value;
    }

    set phone(value: string){
        this._phone.value = value;
    
    }
}