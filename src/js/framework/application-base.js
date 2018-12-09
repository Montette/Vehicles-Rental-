import {NavBar} from '../UI/navBar.js';

export class ApplicationBase {
    constructor(title) {
        this.title = title;
        this.navBar = new NavBar(this.title);
    }
}