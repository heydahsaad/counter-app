/**
 * Copyright 2025 hedahsaad
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `counter-app`
 * 
 * @demo index.html
 * @element counter-app
 */
export class CounterApp extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/counter-app.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
    this.counter = 0;
    this.min = -3;
    this.max = 30;
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      min: {type: Number},
      max: {type: Number},
      counter: {type: Number, reflect: true}
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        font-family: var(--ddd-font-navigation);
      }

      :host([counter="18"]) button,
      :host([counter="21"]) button,
      :host([colorMin]) button,
      :host([colorMax]) button{
        background-color: var(--ddd-theme-default-athertonViolet);
      }

      :host([counter="18"]) .counter,
      :host([counter="21"]) .counter,
      :host([colorMin]) .counter,
      :host([colorMax]) .counter{
        display: block;
        color: var(--ddd-theme-default-roarMaxlight);
        background-color: var(--ddd-theme-default-athertonViolet);
      }

      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--counter-app-label-font-size, var(--ddd-font-size-s));
      }
      .counter{
        color: var(--ddd-theme-default-creekTeal);
        background-color: var(--ddd-theme-default-roarMaxlight);
        border-radius: 10px;
        border: dashed 7px;
        text-align: center;
        font-size: 7em;
        padding: 6px;
        margin: auto;
      }
      .button {
        display: flex;
        justify-content: center; 
        align-items: center; 
        gap: 10px;
        padding:10px;
      }

      button{
        cursor: pointer;
        font: 1.2rem bold;
        padding: 5px;
        gap: 10px;
        width: 5em;
        background-color: var(--ddd-theme-default-creekTeal);
      }

      button:disabled{
        cursor: not-allowed;
        background-color: var(--ddd-theme-default-limestoneGray);
      }
    `];
  }

  increase(){
    if ((this.counter+1) <= this.max){
      this.counter = this.counter + 1
    }
  }

  decrease(){
    if ((this.counter-1) >= this.min){
      this.counter = this.counter - 1;
    }
  }

  updated(changedProperties){
    super.updated(changedProperties);
    if (changedProperties.has("counter")){
      // console.log("count changed to: ", this.counter)
      if(this.counter === 21){
        this.makeItRain();
      }
    }
    if(this.counter === this.min){
      this.setAttribute("colorMin", ""); 
      } else {
        this.removeAttribute("colorMin"); 
    }
    if(this.counter === this.max){
      this.setAttribute("colorMax", ""); 
      } else {
        this.removeAttribute("colorMax"); 
    }
  }

  makeItRain() {
    // this is called a dynamic import. It means it won't import the code for confetti until this method is called
    // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
    // will only run AFTER the code is imported and available to us
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        // This is a minor timing 'hack'. We know the code library above will import prior to this running
        // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
        // this "hack" ensures the element has had time to process in the DOM so that when we set popped
        // it's listening for changes so it can react
        setTimeout(() => {
          // forcibly set the poppped attribute on something with id confetti
          // while I've said in general NOT to do this, the confetti container element will reset this
          // after the animation runs so it's a simple way to generate the effect over and over again
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }
  
  // Lit render the HTML
  render() {
    return html`
      <confetti-container id="confetti">
        <div class="wrapper">
        <div class="counter">${this.counter}</div>
        <div class="button">
          <button @click=${this.decrease} ?disabled="${this.min === this.counter}">-</button>
          <button @click=${this.increase} ?disabled="${this.max === this.counter}">+</button>
      </confetti-container>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(CounterApp.tag, CounterApp);