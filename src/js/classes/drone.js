import {Vehicle} from './vehicle.js';


export class Drone extends Vehicle {
    constructor(license, model, latLong){
        super(license, model, latLong);
        this.base = null;
        this.airTimeHours = null;
    }
}