import {BaseElement} from './base-element';
// import images from '../../assets/drone.jpg';
import images from './images';

export class Image extends BaseElement {
    constructor(fileName, alt) {
        super();
        this.fileName = fileName;
        this.alt = alt;
    }

    getElementString() {
        console.log(this.fileName);
        console.log(images);
        // const src = images.find(el => el.includes(`${this.fileName}.`));
        const src = images.find(el => el.includes(`${this.fileName.split('.')[0]}.`));
        return `
        <img src="${src}" alt="${this.alt}" class="img-drone">
      `
    }
}