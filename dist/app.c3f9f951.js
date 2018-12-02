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
})({"js/classes/vehicle.js":[function(require,module,exports) {
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
},{"./vehicle.js":"js/classes/vehicle.js"}],"js/fleet-data.js":[function(require,module,exports) {
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
},{}],"js/services/data-error.js":[function(require,module,exports) {
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
  }

  loadData(data) {
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

  getCarByProp(prop, value) {
    return this.cars.filter(car => car[prop] === value);
  }

  getDroneByProp(prop, value) {
    return this.drones.filter(drone => drone[prop] === value);
  }

  filterVehicles(value) {
    let searching = [];
    this.cars.forEach(item => {
      Object.values(item).forEach(ob => {
        console.log(ob);
        console.log(value);
        if (ob.toLowerCase().includes(value.toLowerCase())) searching.push(item);
      });
    });
    return searching; // return this.cars.map(car => {
    //     Object.values(car).filter(val => {
    //         console.log(val);
    //         console.log(value);
    //         if( val.includes(value)) return car
    //     })
    // })
  }

}

exports.FleetDataService = FleetDataService;
},{"../classes/car.js":"js/classes/car.js","../classes/drone.js":"js/classes/drone.js","./data-error.js":"js/services/data-error.js"}],"js/app.js":[function(require,module,exports) {
"use strict";

var _car = require("./classes/car.js");

var _drone = require("./classes/drone.js");

var _fleetData = require("./fleet-data.js");

var _fleetDataService = require("./services/fleet-data-service.js");

let car = new _car.Car();
let drone = new _drone.Drone();
console.log('dupa');
let dataService = new _fleetDataService.FleetDataService(); // getData().then(data => dataService.loadData(data));
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
  (0, _fleetData.getData)().then(data => dataService.loadData(data));
  const request = (0, _fleetData.getData)();
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
    });
  }

  ;
  insertCars(dataService.cars);
  const input = document.querySelector('input');
  input.addEventListener('keyup', event => {
    let value = event.currentTarget.value;
    console.log(value);
    let res = dataService.filterVehicles(value); // console.log(res);
    // insertCars(res);

    const items = document.querySelectorAll('li');
    items.forEach(item => {
      if (item.textContent.toLowerCase().includes(value)) {
        item.style.display = "";
      } else {
        item.style.display = 'none';
      }
    });
  });
}

;
vehiclesData();
},{"./classes/car.js":"js/classes/car.js","./classes/drone.js":"js/classes/drone.js","./fleet-data.js":"js/fleet-data.js","./services/fleet-data-service.js":"js/services/fleet-data-service.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60544" + '/');

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