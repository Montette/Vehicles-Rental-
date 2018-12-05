import {BaseElement} from './base-element';

export class Map extends BaseElement {
    constructor(centerOfMap, data) {
        super();
        this.centerOfMap = centerOfMap;
        this.data = data;
    }
    createElement() {
        super.createElement();
        this.createMap();
    }

    createMap() {
        const map = new google.maps.Map(document.getElementById('map'), {
        center: this.centerOfMap,
        zoom: 8
        });

        for (let vehicle of this.data) {
            let [lat, long] = vehicle.latLong.split(' ');
            let latLong = new google.maps.LatLng(lat, long);

            const marker = new google.maps.Marker({
                position: latLong,
                map: map
            });

            marker.setMap(map);
        }
    }

    getElementString() {
        return `<div style="width:800px; height: 400px;" id="map"></div>`

    }
}