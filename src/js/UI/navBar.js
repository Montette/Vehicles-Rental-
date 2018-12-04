import {BaseElement} from './base-element';

export class NavBar extends BaseElement {
    constructor(title) {
        super();
        this.title = title;
        this.links = [];
    }

    addLinks(href, title) {
        this.links.push({
            title,
            href
        })
    }

    getElementString() {
        const links = this.links.map(link => {
            return `<a class="mdl-navigation__link" href="${link.href}">${link.title}</a>`
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
      `
    }
}