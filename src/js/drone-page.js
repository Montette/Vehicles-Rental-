import {Table} from './ui/table';
import {Page} from './framework/page';
import {App} from './app';

export class DronePage extends Page {
    constructor(data){
        super('drones');
        this.drones = data;
    }

    createElement(){
        super.createElement();
        const table = new Table('Drones table', this.drones);
        table.appendToElement(this.element);
    }

    getElementString(){
        return `<div style="margin: 20px;"><h3>Drones</h3></div>`
    }
}