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


let dataService = new FleetDataService();


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





getData().then(data => dataService.loadData(data)).then(() => vehiclesData());


function vehiclesData() {

    const myCar = dataService.getVehicleByProp('cars','license', "AT2000");
    console.log(myCar);
    console.log(dataService.getVehicleByProp('drones','base', 'New York'));
 
    insertCars(dataService.cars);

    const input = document.querySelector('input');
    input.addEventListener('keyup', (event) => {
       filterItems(event);
    });

    const sortButton = document.querySelector('.sort');
    sortButton.addEventListener('click', sortVehicles)


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