import { LightningElement, api } from "lwc";

/**
 * Show an item
 */
export default class Child extends LightningElement {
    @api iconName;
    @api iconSrc;
    @api iconText;
    @api alternativeText;
    @api iconSize;
    @api iconVariant;
    @api text;
    @api metaText;
    @api uniqueId;
    @api checked;

    handleSelect(ev) {
        console.log(this.template.querySelector('lightning-input'));
        // this.template.querySelector('lightning-input').checked = !this.template.querySelector('lightning-input').checked;
        this.checked = !this.template.querySelector('lightning-input').checked;
        this.dispatchEvent(new CustomEvent('select', {detail: this.uniqueId}));
    }

    handleCbChange(ev) {
        console.log(this.template.querySelector('lightning-input').checked);
        this.checked = this.template.querySelector('lightning-input').checked;
        this.dispatchEvent(new CustomEvent('select', {detail: this.uniqueId}));
    }
}
