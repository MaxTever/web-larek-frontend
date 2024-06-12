// import IEvents from 'events';
import { IEvents } from "./events";

export abstract class Component<T> {
    protected readonly container: HTMLElement;
    protected constructor(container: HTMLElement) {
        this.container = container;
    }

// protected constructor(protected readonly container: HTMLElement){};



toggleClass(element: HTMLElement, className: string, force?: boolean) {
    element.classList.toggle(className, force);   
}


protected setText(element: HTMLElement, value: string)  {
    if(element) {
        element.textContent = value;
    }
}


setDisabled(element: HTMLElement, state: boolean){
    if(element){
        if(state) element.setAttribute("disabled", "disabled");
        else element.removeAttribute("disabled");
    }
}

protected setImage(element: HTMLImageElement, src: string, alt?: string)  {
    if (element){
        element.src = src;
        if (alt) 
            element.alt  = alt;
    }
}


render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
}

}



export class View<T> extends Component<T> {
    constructor(protected readonly events: IEvents, container: HTMLElement)  {
        super(container);
        this.events.on("render", this.render);
    
    }
}