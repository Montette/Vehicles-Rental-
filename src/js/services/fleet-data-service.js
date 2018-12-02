import {
    Car
} from '../classes/car.js';
import {
    Drone
} from '../classes/drone.js';
// import {getData} from '../fleet-data';
import {
    DataError
} from './data-error.js';

export class FleetDataService {
    constructor() {
        this.cars = [];
        this.drones = [];
        this.errors = [];
    }

    loadData(data) {
        data.forEach(item => {
            switch (item.type) {
                case 'drone':
                if(this.validateDroneData(item)){
                    const drone = this.loadDrone(item);
                    if (drone) this.drones.push(drone);
                } else {
                    let e = new DataError('invalid drone data', item);
                    this.errors.push(e);
                }
                  
                    break;
                case 'car':
                if(this.validateCarData(item)) {
                    const car = this.loadCar(item);
                    if (car) this.cars.push(car);
                } else {
                    let e = new DataError('invalid car data', item);
                    this.errors.push(e);
                }
                    break;
                default:
                    console.log('wrong type of vehicle');
                    let e = new DataError('wrong type of vehicle', item);
                    this.errors.push(e);
                    break;
            }

       
        });
        for(let err of this.errors){
            console.log(err.message)
        }
        console.log(this.cars);
        console.log(this.drones);
    }

    loadCar(data) {
        try {
            const {
                license,
                model,
                latLong,
                make,
                miles
            } = data;
            const car = new Car(license, model, latLong);
            car.make = make;
            car.miles = miles;
            return car;
        } catch (e) {
            this.errors.push(new DataError('error', data));
        }
        return null
    }

    loadDrone(data) {
        try {
            const {
                license,
                model,
                latLong,
                airTimeHours,
                base
            } = data;
            const drone = new Drone(license, model, latLong);
            drone.airTimeHours = airTimeHours;
            drone.base = base;
            return drone;
        } catch (e) {
            this.errors.push(new DataError('error', data));
        }
        return null;
    }

    validateDroneData(drone) {
        const requiredProps = 'license model latLong base airTimeHours'.split(' ');
        let isValid = true;
        requiredProps.forEach(prop => {
            if(!drone[prop]) {
                this.errors.push(new DataError(`invalid field ${prop}`, drone));
                 isValid = false;
            }
        });

        if(Number.isNaN(Number.parseFloat(drone.airTimeHours))) {
            this.errors.push(new DataError(`invalid field ${drone.airTimeHours}`, drone));
            console.log(this.errors[0].message);
            isValid = false;
        }
        return isValid;
    }

    validateCarData(car) {
        const requiredProps = 'license model latLong make miles'.split(' ');
        let isValid = true;
        requiredProps.forEach(prop => {
            if(!car[prop]) {
                this.errors.push(new DataError(`invalid field ${prop}`, car));
                 isValid = false;
            }
        });

        if(Number.isNaN(Number.parseFloat(car.miles))) {
            this.errors.push(new DataError(`invalid field ${car.miles}`, car));
            console.log(this.errors[0].message);
            isValid = false;
        }
        return isValid;
    }

    getCarByProp(prop, value) {
        return this.cars.filter(car => car[prop] === value);
    }

    getDroneByProp(prop, value) {
        return this.drones.filter(drone => drone[prop] === value);
    }

    filterVehicles(value){
        let searching = [];
        this.cars.forEach(item => {
            Object.values(item).forEach(ob => {
                console.log(ob);
                console.log(value);
                if(ob.toLowerCase().includes(value.toLowerCase())) searching.push(item);
            })
        });
        return searching;

        // return this.cars.map(car => {
        //     Object.values(car).filter(val => {
        //         console.log(val);
        //         console.log(value);
        //         if( val.includes(value)) return car
        //     })
        // })

    }
}