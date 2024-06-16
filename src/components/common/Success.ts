import { Component, View } from "../base/Component";
import { ensureElement } from '../../utils/utils';
import { EventEmitter, IEvents } from '../base/events';

export interface ISuccess {
    total: number;
}

export interface ISuccessAction {
    onClick: () => void;
}


export class Success extends View<ISuccess> {

    protected _total: HTMLElement;
    protected _close: HTMLButtonElement;


    constructor(protected events: EventEmitter, protected container: HTMLElement, actions: ISuccessAction) {
        super(events, container);

        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);
        this._close  = ensureElement<HTMLButtonElement>('.order-success__close', this.container);


        if (actions?.onClick){
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(total: number)  {
        this.setText(this._total, `${total} синапсов`);
    }
}