import {BaseElement} from './ui/base-element';
import {Map} from './ui/map';
import {Page} from './framework/page';
import {application} from './app';

export class MapPage extends Page {
    constructor(){
        super('map');
        
        
    }

    createElement(){
        super.createElement();
        console.log('create map');
        // google.maps.event.addDomListener(window, 'load', () => {
        //     console.log('maaaaap')
        // });
        const center = {lat: 40.779999, lng: -73.965883};
        const map = new Map(center, application.dataService.cars);
        console.log(map);
        map.appendToElement(this.element);  
    }

    getElementString(){
        return `<div style="margin: 20px;"><h3>Map</h3></div>`
    }
}