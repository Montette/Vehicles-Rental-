import {BaseElement} from './ui/base-element';
import {Table} from './ui/table';
import {Page} from './framework/page';
import {App} from './app';

export class CarsPage extends Page {
    constructor(data){
        super('cars');
        this.cars = data;
        console.log(this.cars)
    }

    createElement(){
        super.createElement();
        const table = new Table('Cars table', this.cars);
        table.appendToElement(this.element);
    }

    getElementString(){
        return `<div style="margin: 20px;"><h3>Cars</h3></div>`
    }
}