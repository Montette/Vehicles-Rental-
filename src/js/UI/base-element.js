export class BaseElement {
    contructor() {
        this.element = null;
    }

    appendToElement(el) {
        this.createElement();
        // $(el).append(this.element);
        const parent = document.querySelector(`${el}`);
        parent.insertAdjacentHTML('beforeend', this.element);
    }
    createElement() {
        let str = this.getElementString();
        // this.element = $(str);
        this.element = str;
    }
    getElementString() {
        throw 'Please override getElementString() in BaseElement'
    }

    // enableJS() {
    //     componentHandler.upgradeElement(this.element[0]);
    // }
}