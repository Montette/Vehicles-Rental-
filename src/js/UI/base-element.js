export class BaseElement {
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
        throw 'Please override getElementString() in BaseElement'
    }

}