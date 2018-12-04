import {BaseElement} from './base-element';

export class Table extends BaseElement {
    constructor(title, data) {
        super();
        this.title = title;
        // this.vehicles = [];
        this.vehicles = [...data];
       
        
    }

    createRows() {
        const cells = this.vehicles.map(vehicle => {
            return Object.keys(vehicle).map(key => {
                return  `  
                            <td class="mdl-data-table__cell--non-numeric">${vehicle[key]}</td>
                         `
            }).join(' ');
        });

        this.rows = cells.map(el => {
            return `
                <tr>
                    ${el}
                </tr>
            `
        }).join(' ');
    }

    createLabels() {
        this.labels = Object.keys(this.vehicles[0]).map(key => {
            return  `  
                        <th class="mdl-data-table__cell--non-numeric">${key}</th>
                     `
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
      `
    }
}