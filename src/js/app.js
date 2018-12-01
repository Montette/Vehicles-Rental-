import {Car} from './classes/car.js';
import {Drone} from './classes/drone.js';
import {getData} from './fleet-data.js';
import {FleetDataService} from './services/fleet-data-service.js';
let car = new Car();
let drone = new Drone();

console.log('dupa');


let dataService = new FleetDataService();
// getData().then(data => dataService.loadData(data));
// dataService.loadData("data")
// console.log(dataService.cars); //empty array
// console.log(dataService.getCarByLicense())

// Options: --async-functions 
async function vehiclesData() {
    getData().then(data => dataService.loadData(data));
    const request = getData();
    const data = await request;
    console.log(data);

    console.log(dataService.cars);
    const myCar = dataService.getCarByLicense("AT2000");
    console.log(myCar);


   
   
};

vehiclesData();
