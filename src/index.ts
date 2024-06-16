
import { AppData } from './components/common/AppData';
import { Card } from './components/common/Cards';
import { Page } from './components/common/Page';
import { WebLarekApi } from './components/common/WebLarekApi';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import './scss/styles.scss';
import { IOrderResult, IProduct, OrderForm, TContactsForm } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket } from  './components/common/Basket';
import { Order } from   './components/common/Order';
import { ContactsForm } from   './components/common/ContactsForm';
import { Success } from './components/common/Success';
import { orderBy } from 'lodash';



const api = new WebLarekApi(CDN_URL, API_URL);


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate  = ensureElement<HTMLTemplateElement>('#card-basket');
const modalCardTemplate = ensureElement<HTMLTemplateElement>('#modal-container');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter(); 

const appData = new AppData(events); 

const modal  = new Modal(events, modalCardTemplate);
const page  = new Page(events, document.body);
const basket = new Basket(events);
const orderForm = new Order(events, cloneTemplate(orderTemplate));
const contactsForm = new ContactsForm(events, cloneTemplate(contactsFormTemplate));
const successForm = new Success(events, cloneTemplate(successTemplate), {onClick: () => modal.close()});

events.on('modal:open', () => {
    page.locked;
});

events.on('modal:close', () => {
    page.locked = false;
});


events.on('card:select', (item: IProduct) => {
    appData.setPreview(item);
})

events.on('items:change', (items: IProduct[]) => {
    page.catalog = items.map((item) => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item),
        });
        return card.render(item);
    });
});


events.on('preview:change', (item: IProduct) => {
    const card  = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (appData.inBasket(item)){
                appData.removeFromBasket(item);
                card.button = 'В корзину';
            } else {
                appData.addToBasket(item);
                card.button = 'Удалить из корзины';
            }
        },
    });

    card.button = appData.inBasket(item)? 'Удалить из корзины' : 'В корзину';
    modal.render({content: card.render(item)});
})


events.on('basket:change', ()  =>  {
    page.counter = appData.basket.items.length;

    basket.items = appData.basket.items.map((id) => {
        const item = appData.items.find((item) => item.id === id);
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: ()  => appData.removeFromBasket(item),
            });
            return card.render(item);
        });
        basket.total = appData.basket.total;
    });


events.on('basket:open', ()  =>  {
    modal.render({
       content: basket.render(),
    });
})


events.on('order:open', ()  =>  {
    modal.render({
        content: orderForm.render({
            payment: 'card',
            address: '',
            valid: false,
            errors: [],
        })
    });
});


events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render(
            {
                email: '',
                phone: '',
                valid: false,
                errors: [],
            }
        ),
    });
});




events.on('contacts:submit', () => {
	api
		.createOrderProducts({ ...appData.order, ...appData.basket })
		.then((data) => {
			modal.render({
				content: successForm.render(),
			});
			successForm.total = data.total;
			appData.clearBasket();
			appData.clearOrder();
		})
		.catch(console.error)
});



events.on(/^(order|contacts)\..*change$/, (data: {field: keyof OrderForm, value: string}) =>{
    appData.setOrderField(data.field, data.value);
});



events.on('formErrors:change', (error: Partial<OrderForm>) => {
    const {payment, address, email, phone }  = error;
    orderForm.valid = !payment && !address;
    contactsForm.valid =!email  &&!phone;
});





api.getProductsList()
.then(appData.setItems.bind(appData))
.catch((err) => console.error(err));



