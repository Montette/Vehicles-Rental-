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
let car = new Car();
let drone = new Drone();

console.log('dupa');


let dataService = new FleetDataService();
// getData().then(data => dataService.loadData(data));
// dataService.loadData("data")
// console.log(dataService.cars); //empty array
// console.log(dataService.getCarByLicense())

// Options: --async-functions 
// async function vehiclesData() {
//     getData().then(data => dataService.loadData(data));
//     const request = getData();
//     const data = await request;
//     console.log(data);


//     const myCar = dataService.getCarByProp('license', "AT2000");
//     console.log(myCar);
//     console.log(dataService.getCarByProp('make', 'Uber'));

//     const list = document.createElement('ul');
//     document.querySelector('.container').appendChild(list);

//     function insertCars(cars) {
        
//         list.innerHTML = '';
//         cars.forEach(car => {
//             const li = document.createElement('li');
//             li.textContent = `Make: ${car.make}, model: ${car.model}, license: ${car.license}`;
//             list.appendChild(li);
//         })
        
//     };

//     insertCars(dataService.cars);

//     const input = document.querySelector('input');

//     input.addEventListener('keyup', (event) => {
//         let value = event.currentTarget.value;
//         console.log(value);
//         let res = dataService.filterVehicles(value);
//         // console.log(res);
//         // insertCars(res);
//         const items = document.querySelectorAll('li');
//         items.forEach(item => {
//             if(item.textContent.toLowerCase().includes(value)) {
//                 item.style.display = ""
//             } else {
//                 item.style.display = 'none';
//             }
//         })

//     })



// };

// vehiclesData();

async function vehiclesData() {
    getData().then(data => dataService.loadData(data));
    const request = getData();
    const data = await request;
    console.log(data);


    const myCar = dataService.getCarByProp('license', "AT2000");
    console.log(myCar);
    console.log(dataService.getCarByProp('make', 'Uber'));

    const list = document.createElement('ul');
    document.querySelector('.container').appendChild(list);

    function insertCars(cars) {
        
        list.innerHTML = '';
        cars.forEach(car => {
            const li = document.createElement('li');
            li.textContent = `Make: ${car.make}, model: ${car.model}, license: ${car.license}`;
            list.appendChild(li);
        })
        
    };

    insertCars(dataService.cars);

    const input = document.querySelector('input');

    input.addEventListener('keyup', (event) => {
        let value = event.currentTarget.value;
        console.log(value);
        let res = dataService.filterVehicles(value);
        // console.log(res);
        // insertCars(res);
        const items = document.querySelectorAll('li');
        items.forEach(item => {
            if(item.textContent.toLowerCase().includes(value)) {
                item.style.display = ""
            } else {
                item.style.display = 'none';
            }
        })

    })



};

vehiclesData();