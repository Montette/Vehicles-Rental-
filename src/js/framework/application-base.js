import {NavBar} from '../UI/navBar.js';

export class ApplicationBase {
    constructor(title) {
        this.title = title;
        this.navBar = new NavBar(this.title);
        this.routeMap = {};
        this.defaultRoute = null;
    }

    show(element) {
        this.navBar.appendToElement(element);

        document.querySelectorAll('.mdl-navigation__link').forEach(link => {
            link.addEventListener('click', (event)=> {
                let route = event.target.innerHTML;
                this.activateRoute(route);
            })
        })
        if(this.defaultRoute) {
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

        if(defaultRoute) {
            this.defaultRoute = id;
        }
    }
}