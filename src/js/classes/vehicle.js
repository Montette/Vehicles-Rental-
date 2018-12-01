export class Vehicle {
    constructor(license, model, latLong) {
        if(this.constructor === Vehicle) {
            throw new TypeError("Abstract Vehicle class cannot be instantiated directly.")
        };
        this.license = license;
        this.model = model;
        this.latLong = latLong;
    }
}