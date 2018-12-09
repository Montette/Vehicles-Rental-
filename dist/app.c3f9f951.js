// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/fleet-data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = void 0;

const getData = () => fetch('https://vehicles-989f1.firebaseio.com/vehicles.json').then(response => {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error();
  }
}).catch(err => {
  console.log(err);
});

exports.getData = getData;
},{}],"js/classes/vehicle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vehicle = void 0;

class Vehicle {
  constructor(license, model, latLong) {
    if (this.constructor === Vehicle) {
      throw new TypeError("Abstract Vehicle class cannot be instantiated directly.");
    }

    ;
    this.license = license;
    this.model = model;
    this.latLong = latLong;
  }

}

exports.Vehicle = Vehicle;
},{}],"js/classes/car.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Car = void 0;

var _vehicle = require("./vehicle.js");

class Car extends _vehicle.Vehicle {
  constructor(license, model, latLong) {
    super(license, model, latLong);
    this.make = null;
    this.miles = null;
  }

}

exports.Car = Car;
},{"./vehicle.js":"js/classes/vehicle.js"}],"js/classes/drone.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Drone = void 0;

var _vehicle = require("./vehicle.js");

class Drone extends _vehicle.Vehicle {
  constructor(license, model, latLong) {
    super(license, model, latLong);
    this.base = null;
    this.airTimeHours = null;
  }

}

exports.Drone = Drone;
},{"./vehicle.js":"js/classes/vehicle.js"}],"js/services/data-error.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataError = void 0;

class DataError {
  constructor(message, data) {
    this.message = message;
    this.data = data;
  }

}

exports.DataError = DataError;
},{}],"js/services/fleet-data-service.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetDataService = void 0;

var _car = require("../classes/car.js");

var _drone = require("../classes/drone.js");

var _dataError = require("./data-error.js");

// import {getData} from '../fleet-data';
class FleetDataService {
  constructor() {
    this.cars = [];
    this.drones = [];
    this.errors = [];
    this.desc = false;
  }

  loadVehiclesData(data) {
    data.forEach(item => {
      switch (item.type) {
        case 'drone':
          if (this.validateDroneData(item)) {
            const drone = this.loadDrone(item);
            if (drone) this.drones.push(drone);
          } else {
            let e = new _dataError.DataError('invalid drone data', item);
            this.errors.push(e);
          }

          break;

        case 'car':
          if (this.validateCarData(item)) {
            const car = this.loadCar(item);
            if (car) this.cars.push(car);
          } else {
            let e = new _dataError.DataError('invalid car data', item);
            this.errors.push(e);
          }

          break;

        default:
          console.log('wrong type of vehicle');
          let e = new _dataError.DataError('wrong type of vehicle', item);
          this.errors.push(e);
          break;
      }
    });

    for (let err of this.errors) {
      console.log(err.message);
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
      const car = new _car.Car(license, model, latLong);
      car.make = make;
      car.miles = miles;
      return car;
    } catch (e) {
      this.errors.push(new _dataError.DataError('error', data));
    }

    return null;
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
      const drone = new _drone.Drone(license, model, latLong);
      drone.airTimeHours = airTimeHours;
      drone.base = base;
      return drone;
    } catch (e) {
      this.errors.push(new _dataError.DataError('error', data));
    }

    return null;
  }

  validateDroneData(drone) {
    const requiredProps = 'license model latLong base airTimeHours'.split(' ');
    let isValid = true;
    requiredProps.forEach(prop => {
      if (!drone[prop]) {
        this.errors.push(new _dataError.DataError(`invalid field ${prop}`, drone));
        isValid = false;
      }
    });

    if (Number.isNaN(Number.parseFloat(drone.airTimeHours))) {
      this.errors.push(new _dataError.DataError(`invalid field ${drone.airTimeHours}`, drone));
      console.log(this.errors[0].message);
      isValid = false;
    }

    return isValid;
  }

  validateCarData(car) {
    const requiredProps = 'license model latLong make miles'.split(' ');
    let isValid = true;
    requiredProps.forEach(prop => {
      if (!car[prop]) {
        this.errors.push(new _dataError.DataError(`invalid field ${prop}`, car));
        isValid = false;
      }
    });

    if (Number.isNaN(Number.parseFloat(car.miles))) {
      this.errors.push(new _dataError.DataError(`invalid field ${car.miles}`, car));
      console.log(this.errors[0].message);
      isValid = false;
    }

    return isValid;
  }

  getVehicleByProp(type, prop, value) {
    return this[type].filter(item => item[prop] === value);
  } // getCarByProp(prop, value) {
  //     return this.cars.filter(car => car[prop] === value);
  // }
  // getDroneByProp(prop, value) {
  //     return this.drones.filter(drone => drone[prop] === value);
  // }


  filterVehicles(key, value) {
    let vehicles = key === 'cars' ? 'filteredCars' : 'filteredDrones';
    this[vehicles] = this[key].filter(el => {
      return Object.keys(el).some(k => el[k].toLowerCase().includes(value.toLowerCase()));
    });
    return this[vehicles];
  }

  sortVehicles(key, value) {
    // let vehiclesToSort = this.filterVehicles(key, value);
    var mod = this.desc ? -1 : 1;
    let vehicles = key === 'cars' ? 'filteredCars' : 'filteredDrones';
    let vehiclesToSort = this[vehicles] ? this[vehicles] : this[key];
    return vehiclesToSort.sort((x, y) => {
      this.desc = !this.desc;
      if (x[value] < y[value]) return -1 * mod;
      if (x[value] > y[value]) return 1 * mod;
      return 0;
    });
  }

}

exports.FleetDataService = FleetDataService;
},{"../classes/car.js":"js/classes/car.js","../classes/drone.js":"js/classes/drone.js","./data-error.js":"js/services/data-error.js"}],"js/UI/base-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseElement = void 0;

class BaseElement {
  contructor() {
    this.element = null;
  }

  appendToElement(el) {
    this.createElement();
    $(el).append(this.element);
  }

  createElement() {
    let str = this.getElementString();
    this.element = $(str);
  }

  getElementString() {
    throw 'Please override getElementString() in BaseElement';
  }

}

exports.BaseElement = BaseElement;
},{}],"js/UI/navBar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavBar = void 0;

var _baseElement = require("./base-element");

class NavBar extends _baseElement.BaseElement {
  constructor(title) {
    super();
    this.title = title;
    this.links = [];
  }

  addLinks(title, href) {
    this.links.push({
      title,
      href
    });
  }

  getElementString() {
    const links = this.links.map(link => {
      return `<a class="mdl-navigation__link">${link.title}</a>`;
    });
    console.log([...links]);
    return `
            <div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header class="mdl-layout__header">
                    <div class="mdl-layout__header-row">
                    <!-- Title -->
                    <span class="mdl-layout-title">${this.title}</span>
                    <!-- Add spacer, to align navigation to the right -->
                    <div class="mdl-layout-spacer"></div>
                    <!-- Navigation. We hide it in small screens. -->
                    <nav class="mdl-navigation mdl-layout--large-screen-only">
                        ${links.join(' ')}
                    </nav>
                    </div>
                </header>
                <div class="mdl-layout__drawer">
                    <span class="mdl-layout-title">${this.title}</span>
                    <nav class="mdl-navigation">
                    ${[...links]}
                    </nav>
                </div>
                <main class="mdl-layout__content">
                    <div class="page-content"><!-- Your content goes here --></div>
                </main>
            </div>
      `;
  }

}

exports.NavBar = NavBar;
},{"./base-element":"js/UI/base-element.js"}],"js/framework/application-base.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ApplicationBase = void 0;

var _navBar = require("../UI/navBar.js");

class ApplicationBase {
  constructor(title) {
    this.title = title;
    this.navBar = new _navBar.NavBar(this.title);
    this.routeMap = {};
    this.defaultRoute = null;
  }

  show(element) {
    this.navBar.appendToElement(element);
    document.querySelectorAll('.mdl-navigation__link').forEach(link => {
      link.addEventListener('click', event => {
        let route = event.target.innerHTML;
        this.activateRoute(route);
      });
    });

    if (this.defaultRoute) {
      this.activateRoute(this.defaultRoute);
    }
  }

  activateRoute(route) {
    let content = document.querySelector('.page-content');
    content.innerHTML = '';
    this.routeMap[route].appendToElement(content);
  }

  addRoute(id, pageObject, defaultRoute = false) {
    this.navBar.addLinks(id, '');
    this.routeMap[id] = pageObject;

    if (defaultRoute) {
      this.defaultRoute = id;
    }
  }

}

exports.ApplicationBase = ApplicationBase;
},{"../UI/navBar.js":"js/UI/navBar.js"}],"js/ui/base-element.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseElement = void 0;

class BaseElement {
  contructor() {
    this.element = null;
  }

  appendToElement(el) {
    this.createElement();
    $(el).append(this.element);
  }

  createElement() {
    let str = this.getElementString();
    this.element = $(str);
  }

  getElementString() {
    throw 'Please override getElementString() in BaseElement';
  }

}

exports.BaseElement = BaseElement;
},{}],"assets/drone.jpg":[function(require,module,exports) {
module.exports = "/drone.bf01fc61.jpg";
},{}],"assets/car.png":[function(require,module,exports) {
module.exports = "/car.63095aa0.png";
},{}],"assets/car2.jpeg":[function(require,module,exports) {
module.exports = "/car2.e1be9beb.jpeg";
},{}],"js/ui/images.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _drone = _interopRequireDefault(require("../../assets/drone.jpg"));

var _car = _interopRequireDefault(require("../../assets/car.png"));

var _car2 = _interopRequireDefault(require("../../assets/car2.jpeg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [_drone.default, _car.default, _car2.default];
exports.default = _default;
},{"../../assets/drone.jpg":"assets/drone.jpg","../../assets/car.png":"assets/car.png","../../assets/car2.jpeg":"assets/car2.jpeg"}],"js/ui/image.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Image = void 0;

var _baseElement = require("./base-element");

var _images = _interopRequireDefault(require("./images"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import images from '../../assets/drone.jpg';
class Image extends _baseElement.BaseElement {
  constructor(fileName, alt) {
    super();
    this.fileName = fileName;
    this.alt = alt;
  }

  getElementString() {
    console.log(this.fileName);
    console.log(_images.default); // const src = images.find(el => el.includes(`${this.fileName}.`));

    const src = _images.default.find(el => el.includes(`${this.fileName.split('.')[0]}.`));

    return `
        <img src="${src}" alt="${this.alt}" class="img-drone">
      `;
  }

}

exports.Image = Image;
},{"./base-element":"js/ui/base-element.js","./images":"js/ui/images.js"}],"js/ui/button.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = void 0;

var _baseElement = require("./base-element");

class Button extends _baseElement.BaseElement {
  constructor(title) {
    super();
    this.title = title;
    this.styleString = '';
  }

  getElementString() {
    return `
        <button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" style="${this.styleString}">
        ${this.title}
      </button>`;
  }

  setStyleString(style) {
    this.styleString = style;
  }

}

exports.Button = Button;
},{"./base-element":"js/ui/base-element.js"}],"js/framework/page.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = void 0;

var _baseElement = require("../ui/base-element.js");

class Page extends _baseElement.BaseElement {
  constructor(pageTitle) {
    super();
    this.pageTitle = pageTitle;
  }

}

exports.Page = Page;
},{"../ui/base-element.js":"js/ui/base-element.js"}],"js/home-page.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HomePage = void 0;

var _baseElement = require("./ui/base-element");

var _image = require("./ui/image");

var _button = require("./ui/button");

var _app = require("./app");

var _page = require("./framework/page");

class HomePage extends _page.Page {
  constructor() {
    super('Home');
  }

  createElement() {
    super.createElement();
    const image = new _image.Image('drone.jpg', 'drone');
    image.appendToElement(this.element);
    let button = new _button.Button('Self driving cars');
    const styleString = 'width: 300px; height: 80px, font-size: 30px';
    button.setStyleString(styleString);
    button.appendToElement(this.element);
    button.element.click(() => _app.application.activateRoute('Cars'));
    button = new _button.Button('Drones');
    button.setStyleString(styleString);
    button.appendToElement(this.element);
    button.element.click(() => _app.application.activateRoute('Drones'));
  }

  getElementString() {
    return `<div style="text-align: center;"></div>`;
  }

}

exports.HomePage = HomePage;
},{"./ui/base-element":"js/ui/base-element.js","./ui/image":"js/ui/image.js","./ui/button":"js/ui/button.js","./app":"js/app.js","./framework/page":"js/framework/page.js"}],"js/ui/table.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Table = void 0;

var _baseElement = require("./base-element");

class Table extends _baseElement.BaseElement {
  constructor(title, data) {
    super();
    this.title = title; // this.vehicles = [];

    this.vehicles = [...data];
  }

  createRows() {
    const cells = this.vehicles.map(vehicle => {
      return Object.keys(vehicle).map(key => {
        return `  
                            <td class="mdl-data-table__cell--non-numeric">${vehicle[key]}</td>
                         `;
      }).join(' ');
    });
    this.rows = cells.map(el => {
      return `
                <tr>
                    ${el}
                </tr>
            `;
    }).join(' ');
  }

  createLabels() {
    this.labels = Object.keys(this.vehicles[0]).map(key => {
      return `  
                        <th class="mdl-data-table__cell--non-numeric">${key}</th>
                     `;
    }).join(' ');
  }

  getElementString() {
    this.createRows();
    this.createLabels();
    return `
            <table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
            <thead>
            <tr>
              ${this.labels}
            </tr>
            </thead>
            <tbody>
                ${this.rows}
            </tbody>
        </table>
      `;
  }

}

exports.Table = Table;
},{"./base-element":"js/ui/base-element.js"}],"js/cars-page.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CarsPage = void 0;

var _baseElement = require("./ui/base-element");

var _table = require("./ui/table");

var _page = require("./framework/page");

var _app = require("./app");

class CarsPage extends _page.Page {
  constructor(data) {
    super('cars');
    this.cars = data;
    console.log(this.cars);
  }

  createElement() {
    super.createElement();
    const table = new _table.Table('Cars table', this.cars);
    table.appendToElement(this.element);
  }

  getElementString() {
    return `<div style="margin: 20px;"><h3>Cars</h3></div>`;
  }

}

exports.CarsPage = CarsPage;
},{"./ui/base-element":"js/ui/base-element.js","./ui/table":"js/ui/table.js","./framework/page":"js/framework/page.js","./app":"js/app.js"}],"js/drone-page.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DronePage = void 0;

var _table = require("./ui/table");

var _page = require("./framework/page");

var _app = require("./app");

class DronePage extends _page.Page {
  constructor(data) {
    super('drones');
    this.drones = data;
  }

  createElement() {
    super.createElement();
    const table = new _table.Table('Drones table', this.drones);
    table.appendToElement(this.element);
  }

  getElementString() {
    return `<div style="margin: 20px;"><h3>Drones</h3></div>`;
  }

}

exports.DronePage = DronePage;
},{"./ui/table":"js/ui/table.js","./framework/page":"js/framework/page.js","./app":"js/app.js"}],"js/ui/map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Map = void 0;

var _baseElement = require("./base-element");

class Map extends _baseElement.BaseElement {
  constructor(centerOfMap, data) {
    super();
    this.centerOfMap = centerOfMap;
    this.data = data;
  }

  appendToElement(el) {
    super.appendToElement(el);
    this.createMap();
  }

  createMap() {
    console.log('create map in map');
    const map = new google.maps.Map(document.getElementById('map'), {
      center: this.centerOfMap,
      zoom: 15
    });

    for (let vehicle of this.data) {
      let [lat, long] = vehicle.latLong.split(' ');
      let title = `${vehicle.make}, ${vehicle.model}`;
      let latLong = new google.maps.LatLng(lat, long);
      const marker = new google.maps.Marker({
        position: latLong,
        map: map,
        title: title
      });
      marker.setMap(map);
    }
  }

  getElementString() {
    return `<div style="width:800px; height: 400px;" id="map"></div>`;
  }

}

exports.Map = Map;
},{"./base-element":"js/ui/base-element.js"}],"js/map-page.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapPage = void 0;

var _baseElement = require("./ui/base-element");

var _map = require("./ui/map");

var _page = require("./framework/page");

var _app = require("./app");

class MapPage extends _page.Page {
  constructor() {
    super('map');
  }

  createElement() {
    super.createElement();
    console.log('create map'); // google.maps.event.addDomListener(window, 'load', () => {
    //     console.log('maaaaap')
    // });

    const center = {
      lat: 40.779999,
      lng: -73.965883
    };
    const map = new _map.Map(center, _app.application.dataService.cars);
    console.log(map);
    map.appendToElement(this.element);
  }

  getElementString() {
    return `<div style="margin: 20px;"><h3>Map</h3></div>`;
  }

}

exports.MapPage = MapPage;
},{"./ui/base-element":"js/ui/base-element.js","./ui/map":"js/ui/map.js","./framework/page":"js/framework/page.js","./app":"js/app.js"}],"js/app.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.application = exports.App = void 0;

var _fleetData = require("./fleet-data.js");

var _fleetDataService = require("./services/fleet-data-service.js");

var _applicationBase = require("./framework/application-base.js");

var _homePage = require("./home-page.js");

var _carsPage = require("./cars-page.js");

var _dronePage = require("./drone-page.js");

var _mapPage = require("./map-page.js");

class App extends _applicationBase.ApplicationBase {
  constructor() {
    super('Fleet Manager');
    this.dataService = new _fleetDataService.FleetDataService();
    this.loadData();
    this.addRoute('Home', new _homePage.HomePage(), true);
    this.addRoute('Cars', new _carsPage.CarsPage(this.dataService.cars));
    this.addRoute('Drones', new _dronePage.DronePage(this.dataService.drones));
    this.addRoute('Map', new _mapPage.MapPage());
  }

  loadData() {
    (0, _fleetData.getData)().then(data => {
      this.dataService.loadVehiclesData(data);
    });
  }

}

exports.App = App;
const application = new App();
exports.application = application;
application.show('body'); // let car = new Car();
// let drone = new Drone();
// let dataService = new FleetDataService();
// getData().then(data => dataService.loadData(data)).then(() => vehiclesData());
// const bar = new NavBar('Cars & Drones');
// bar.addLinks('www.google.com', 'google');
// bar.addLinks('www.wp.pl', 'wp site');
// bar.appendToElement('body');
// const button = new Button('click me');
// button.appendToElement('.page-content');
// const image = new Image('drone.jpg','');
// image.appendToElement('.page-content');
// function createTable(data, title) {
//     const table = new Table(title, data);
//     // table.insertData(data);
//     table.appendToElement('.page-content');
// }
// function initMap() {
//     // var uluru = {lat: -25.344, lng: 131.036};
//     // var map = new google.maps.Map(
//     //     document.getElementById('map'), {zoom: 4, center: uluru});
//     // var marker = new google.maps.Marker({position: uluru, map: map});
//     const center = {lat: 40.779999, lng: -73.965883};
//     const map = new Map(center, dataService.cars);
//     map.appendToElement('.page-content');
//   }
// function vehiclesData() {
//     const myCar = dataService.getVehicleByProp('cars','license', "AT2000");
//     console.log(myCar);
//     console.log(dataService.getVehicleByProp('drones','base', 'New York'));
//     // insertCars(dataService.cars);
//     // const input = document.querySelector('input');
//     // input.addEventListener('keyup', (event) => {
//     //    filterItems(event);
//     // });
//     // const sortButton = document.querySelector('.sort');
//     // sortButton.addEventListener('click', sortVehicles)
//    createTable(dataService.cars, 'Cars table');
//    createTable(dataService.drones, 'Drones table');
// //    const map = new Map({lat: -34.397, lng: 150.644}, dataService.cars);
//     google.maps.event.addDomListener(window, 'load', initMap);
// };
// function sortVehicles() {
//     let sortedVehicles = dataService.sortVehicles('cars', 'model');
//     insertCars(sortedVehicles)
// }
// function filterItems(event) {
//     let value = event.currentTarget.value;
//     console.log(value);
//     let res = dataService.filterVehicles('cars', value);
//     console.log(res);
//     insertCars(res);
//     // const items = document.querySelectorAll('li');
//     // items.forEach(item => {
//     //     if (item.textContent.toLowerCase().includes(value)) {
//     //         item.style.display = ""
//     //     } else {
//     //         item.style.display = 'none';
//     //     }
//     // })
// }
// function insertCars(cars) {
//     let list;
//     if(!document.querySelector('ul.car-list')) {
//     list = document.createElement('ul');
//     list.classList.add('car-list');
//     document.querySelector('.container').appendChild(list);
//     } else {
//         list = document.querySelector('ul.car-list');
//     }
//     list.innerHTML = '';
//     cars.forEach(car => {
//         const li = document.createElement('li');
//         li.textContent = `Make: ${car.make}, model: ${car.model}, license: ${car.license}`;
//         list.appendChild(li);
//     })
// };
},{"./fleet-data.js":"js/fleet-data.js","./services/fleet-data-service.js":"js/services/fleet-data-service.js","./framework/application-base.js":"js/framework/application-base.js","./home-page.js":"js/home-page.js","./cars-page.js":"js/cars-page.js","./drone-page.js":"js/drone-page.js","./map-page.js":"js/map-page.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65103" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=/app.c3f9f951.map