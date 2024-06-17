import {Component } from '../base/Component';
import {IProduct } from '../../types/index';
import { ensureElement } from '../../utils/utils';
import { categories } from '../../utils/constants';

export interface IcardActions {
  onClick:(event: MouseEvent) => void;
}

export class Card extends Component<IProduct> {

    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _price: HTMLElement;
    protected _category?: HTMLElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement; 


    constructor(container: HTMLElement, actions?: IcardActions){
            super(container);

            this._title = ensureElement<HTMLElement>(`.card__title`, container);
            this._price = ensureElement<HTMLElement>(`.card__price`, container);

            this._image = container.querySelector(`.card__image`)
            this._category = container.querySelector(`.card__category`)
            this._button = container.querySelector(`.card__button`);
            this._description = container.querySelector(`.card__text`);

            if (actions?.onClick){
                if (this._button){
                    this._button.addEventListener(`click`, actions.onClick);
                } else {
                    container.addEventListener(`click`, actions.onClick);
                }
            }
        }


      set id(value: string) {
        this.container.dataset.id = value;
      }
    
      get id(): string {
        return this.container.dataset.id || '';
      }

      set title(value: string){
        this.setText(this._title,value);
      }

      get title(): string {
        return this._title.textContent || ``;
      }
      
      set price(value: string){
        this.setText(this._price, value ? `${value} синапсов` : 'Бесеценно' );

        if (this._button){
          this._button.disabled = !value;
        }
      }

      get price(): string {
        return this._price.textContent || ``;
      }



      set category(value: string){
        this.setText(this._category, value);
        if (this._category){
          this._category.classList.remove(`card__category_other`);
          this._category.classList.add(`card__category_${categories.get(value) ? categories.get(value) : 'other'}`);
        }
        
      }

      get category(): string {
        return this._category.textContent || ``;
      }


      set image(value: string){
        this.setImage(this._image, value, this.title);
      }


      set description (value: string){
        this.setText(this._description, value);
      }

      set button(value: string){
        this.setText(this._button, value);
      }


}