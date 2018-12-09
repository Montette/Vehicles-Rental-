import {BaseElement} from './ui/base-element';
import {Image} from './ui/image';
import {Button} from './ui/button';
import {application} from './app';
import {Page} from './framework/page';

export class HomePage extends Page{
    constructor(){
        super('Home');
    }

    createElement(){
        super.createElement();

        const image = new Image('drone.jpg', 'drone');
        image.appendToElement(this.element);

        let button = new Button('Self driving cars');
        const styleString = 'width: 300px; height: 80px, font-size: 30px';
        button.setStyleString(styleString);
        button.appendToElement(this.element);
        button.element.click(() => application.activateRoute('Cars'));

        button = new Button('Drones');
        button.setStyleString(styleString);
        button.appendToElement(this.element);
        button.element.click(() => application.activateRoute('Drones'));

    }

    getElementString(){
        return `<div style="text-align: center;"></div>`
    }
}