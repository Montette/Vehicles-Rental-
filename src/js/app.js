import {
    Car
} from './classes/car.js';
import {
    Drone
} from './classes/drone.js';
import {
    getData
} from './fleet-data.js';
import {
    FleetDataService
} from './services/fleet-data-service.js';

import { Button } from './UI/button.js';

import { Image } from './UI/image.js';

import { NavBar } from './UI/navBar.js';

import { Table } from './UI/table.js';

import { Map } from './UI/map.js';


let car = new Car();
let drone = new Drone();

let dataService = new FleetDataService();
getData().then(data => dataService.loadData(data)).then(() => vehiclesData());



const bar = new NavBar('Cars & Drones');
bar.addLinks('www.google.com', 'google');
bar.addLinks('www.wp.pl', 'wp site');
bar.appendToElement('body');


const button = new Button('click me');
button.appendToElement('.page-content');

const image = new Image('drone.jpg','');
image.appendToElement('.page-content');



function createTable(data, title) {
    const table = new Table(title, data);
    // table.insertData(data);
    table.appendToElement('.page-content');
    
}

function initMap() {

}


function vehiclesData() {

    const myCar = dataService.getVehicleByProp('cars','license', "AT2000");
    console.log(myCar);
    console.log(dataService.getVehicleByProp('drones','base', 'New York'));
 
    // insertCars(dataService.cars);

    // const input = document.querySelector('input');
    // input.addEventListener('keyup', (event) => {
    //    filterItems(event);
    // });

    // const sortButton = document.querySelector('.sort');
    // sortButton.addEventListener('click', sortVehicles)

   createTable(dataService.cars, 'Cars table');
   createTable(dataService.drones, 'Drones table');

   const map = new Map({lat: -34.397, lng: 150.644}, dataService.cars);
 
};



function sortVehicles() {
    let sortedVehicles = dataService.sortVehicles('cars', 'model');
    insertCars(sortedVehicles)
}


function filterItems(event) {
    let value = event.currentTarget.value;
    console.log(value);
    let res = dataService.filterVehicles('cars', value);
    console.log(res);
    insertCars(res);
    // const items = document.querySelectorAll('li');
    // items.forEach(item => {
    //     if (item.textContent.toLowerCase().includes(value)) {
    //         item.style.display = ""
    //     } else {
    //         item.style.display = 'none';
    //     }
    // })

}
function insertCars(cars) {
    let list;
    if(!document.querySelector('ul.car-list')) {
    list = document.createElement('ul');
    list.classList.add('car-list');
    document.querySelector('.container').appendChild(list);
    } else {
        list = document.querySelector('ul.car-list');
    }
    list.innerHTML = '';
    cars.forEach(car => {
        const li = document.createElement('li');
        li.textContent = `Make: ${car.make}, model: ${car.model}, license: ${car.license}`;
        list.appendChild(li);
    })

};

