import { LightningElement, track, api } from 'lwc';

export default class App extends LightningElement {


    @api variant; // 'label-hidden', 'label-inline'
    @api placeholder;
    @api options = [{ Name: 'Apple', AKAM_Account_ID__c: 'AKAM-ID-1', Id: 'CaseID1' },
    { Name: 'Microsoft Corp', AKAM_Account_ID__c: 'AKAM-ID-2', Id: 'CaseID2' },
    { Name: 'AT&T', AKAM_Account_ID__c: 'AKAM-ID-3', Id: 'CaseID3' },
    { Name: 'Test Account1', AKAM_Account_ID__c: 'AKAM-ID-4', Id: 'CaseID4' },
    { Name: 'Test Account2', AKAM_Account_ID__c: 'AKAM-ID-5', Id: 'CaseID5' },
    { Name: 'Test Very Long Account Name', AKAM_Account_ID__c: 'AKAM-ID-6', Id: 'CaseID6' },
    { Name: 'Apple India', AKAM_Account_ID__c: 'AKAM-ID-7', Id: 'CaseID7' },
    { Name: 'Spotify', AKAM_Account_ID__c: 'AKAM-ID-8', Id: 'CaseID8' },
    { Name: 'Hotstar India', AKAM_Account_ID__c: 'AKAM-ID-9', Id: 'CaseID9' }];

    @api required;

    @track mode = 'read';

    get isReadMode() {
        return this.mode === 'read';
    }

    @api
    get value() {
        return this.selItem;
    }
    set value(value) {
        if (value) {
            if (this.processedListData) {
                this.selItem = this.processedListData.find(el => el.key === value);
            }
        }
    }
    @api label;
    @api listData;
    @api textField;
    @api metaTextField;
    @api keyField;
    @api iconPropsField;
    @api props = {
        textField: 'Name', metaTextField: 'AKAM_Account_ID__c', keyField: 'Id',
        iconProps: { name: 'standard:account', variant: '', size: 'small' }
    };
    @api noResultsMsg;
    @api disabled;

    get selItemCss() {
        return 'slds-combobox__form-element slds-input-has-icon slds-input-has-icon_left-right';//: 'slds-input-has-icon_right' );
    }
    // local varible, converts user input into format consumable by this component
    get processedListData() {
        let props = this.props || {};
        let procData = [];
        let iconProps = props.iconProps || {};
        let iPropFields = props.iconFields;

        if (Array.isArray(this.options)) {
            this.options.forEach(el => {
                // if(!this.searchStr || el[props.textField].toLowerCase().includes(this.searchStr.toLowerCase()) || el[props.metaTextField].toLowerCase().includes(this.searchStr.toLowerCase())) {
                const isSearchMatch = !this.searchStr || el[props.textField].toLowerCase().includes(this.searchStr.toLowerCase()) || el[props.metaTextField].toLowerCase().includes(this.searchStr.toLowerCase());
                procData.push({
                    key: el[props.keyField],
                    iconName: iPropFields ? el[iPropFields.name] : iconProps.name,
                    iconText: iPropFields ? el[iPropFields.text] : iconProps.text,
                    iconSize: iPropFields ? el[iPropFields.size] : iconProps.size,
                    iconVariant: iPropFields ? el[iPropFields.variant] : iconProps.size,
                    text: el[props.textField],
                    metaText: el[props.metaTextField],
                    isVisible: isSearchMatch,
                    cssClass: isSearchMatch ? 'slds-listbox__item' : 'slds-listbox__item slds-hide'
                });
                //}
            });
        }
        console.log('procData', procData);
        return procData;
    }


    @track comboCss = 'slds-dropdown slds-dropdown_length-with-icon-10 slds-dropdown_fluid inactive';

    handleInpFocus(ev) {
        this.comboCss = 'slds-dropdown slds-dropdown_length-with-icon-10 slds-dropdown_fluid active';
        this.mode = 'edit';
    }

    handleDone(ev) {
        if (this.selectedItems.length === 0) {
            alert('Select at least one account');
            return;
        }
        this.comboCss = 'slds-dropdown slds-dropdown_length-with-icon-10 slds-dropdown_fluid inactive';
        this.mode = 'read';
    }
    handleCancel(ev) {
        this.selectedItems = this.selectedItemsOld;
        this.comboCss = 'slds-dropdown slds-dropdown_length-with-icon-10 slds-dropdown_fluid inactive';
        this.mode = 'read';
        this.allAccountsSelected = this.options.length === this.selectedItems.length;
        this.updateSelectedItemsInUI();
    }

    selectedItemsOld;
    handleEdit(ev) {
        this.comboCss = 'slds-dropdown slds-dropdown_length-with-icon-10 slds-dropdown_fluid active';
        this.mode = 'edit';
        this.searchStr = '';
        this.selectedItemsOld = [...this.selectedItems];
    }

    allAccountsSelected = false;

    connectedCallback(ev) {
        this.updateSelectedItemsInUI();
    }

    @track inpErrorMsg;

    @api checkValidity() {
        return this.selItem || !this.required;
    }

    @api reportValidity() {

        if (this.checkValidity()) {
            this.inpErrorMsg = '';
            this.inpCss = 'slds-combobox_container slds-has-selection';
            return true;
        }
        this.inpCss = 'slds-combobox_container slds-has-selection slds-has-error';
        this.inpErrorMsg = 'Complete this field.'
        return false;
    }
    @track inpCss = 'slds-combobox_container slds-has-selection';


    get noresults() {
        return this.noResultsMsg && (!this.processedListData || this.processedListData.length === 0);
    }

    @track searchStr;
    handleInpChange(ev) {
        let inp = this.template.querySelector('input');
        let x = this.dispatchEvent(new CustomEvent('change', { detail: inp.value, cancelable: true }));

        if (x) {
            this.searchStr = inp.value;
        }
    }

    @track
    selectedItems = [{ label: 'Microsoft Corp', value: 'CaseID2' }];

    handleRemove(ev) {
        console.log(ev.detail.name);
        const toRemovePill = ev.detail.name;
        this.selectedItems = this.selectedItems.filter(el => el.value !== toRemovePill);
        this.updateSelectedItemsInUI();
    }

    get displayText() {
        let label;

        if (this.selectedItems.length === 1) {
            label = this.selectedItems[0].label;
        } else if (this.selectedItems.length === this.options.length) {
            label = `All Accounts(${this.selectedItems.length})`;
        } else {
            label = `${this.selectedItems.length} Accounts Selected`;
        }

        return label;
    }


    handleSelectAllCbClick(ev) {
        this.allAccountsSelected = ev.target.checked;
        this.template.querySelectorAll('[data-group="accoptions"]').forEach(el => {
            el.checked = this.allAccountsSelected;
        });
        this.updateSelectedItemsList();
    }

    handleSelectAllLabelClick(ev) {
        this.allAccountsSelected = !this.allAccountsSelected;
        this.template.querySelectorAll('[data-group="accoptions"]').forEach(el => {
            el.checked = this.allAccountsSelected;
        });
        this.updateSelectedItemsList();
    }

    handleAccountOptCbClick(ev) {
        this.updateSelectedItemsList();
    }

    handleAccountOptLabelClick(ev) {
        const accId = ev.currentTarget.dataset.key;
        const rowElement = this.template.querySelector(`[data-group="accoptions"][data-key="${accId}"]`);
        rowElement.checked = !rowElement.checked;
        this.updateSelectedItemsList();
    }

    updateSelectedItemsList() {
        this.selectedItems = [];
        this.template.querySelectorAll('[data-group="accoptions"]').forEach(aop => {
            if (aop.checked) {
                this.selectedItems.push({ label: aop.label, value: aop.value });
            }
        });
        this.allAccountsSelected = this.selectedItems.length === this.options.length;
    }

    updateSelectedItemsInUI() {
        this.template.querySelectorAll('c-child').forEach(ch => {
            ch.checked = this.selectedItems.find(sl => sl.value === ch.uniqueId);
        });

        this.template.querySelectorAll('[data-group="accoptions"]').forEach(aop => {
            aop.checked = this.selectedItems.find(sl => sl.value === aop.value);
        });

    }

}
