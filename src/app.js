import { LightningElement, track, api } from 'lwc';

export default class App extends LightningElement {
  
  
    @api variant; // 'label-hidden', 'label-inline'
    @api placeholder;
    @api options = [{Name: 'Apple', AKAM_Account_ID__c: 'AKAM-ID-1', Id: 'CaseID1'},
                  {Name: 'Microsoft Corp', AKAM_Account_ID__c: 'AKAM-ID-2', Id: 'CaseID2'},
                  {Name: 'AT&T', AKAM_Account_ID__c: 'AKAM-ID-3', Id: 'CaseID3'},
                  {Name: 'Test Account1', AKAM_Account_ID__c: 'AKAM-ID-4', Id: 'CaseID4'},
                  {Name: 'Test Account2', AKAM_Account_ID__c: 'AKAM-ID-5', Id: 'CaseID5'},
                  {Name: 'Test Account3', AKAM_Account_ID__c: 'AKAM-ID-6', Id: 'CaseID6'},
                  {Name: 'Apple India', AKAM_Account_ID__c: 'AKAM-ID-7', Id: 'CaseID7'},
                  {Name: 'Spotify', AKAM_Account_ID__c: 'AKAM-ID-8', Id: 'CaseID8'},
                  {Name: 'Hotstar India', AKAM_Account_ID__c: 'AKAM-ID-9', Id: 'CaseID9'}];
                  
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
        if(value) {
            if(this.processedListData) {
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
       return  'slds-combobox__form-element slds-input-has-icon slds-input-has-icon_left-right' ;//: 'slds-input-has-icon_right' );
    }
    // local varible, converts user input into format consumable by this component
   get processedListData() {
    let props = this.props || {};
    let procData = [];
    let iconProps = props.iconProps || {};
    let iPropFields = props.iconFields ;

    if(Array.isArray(this.options)) {
        this.options.forEach(el => {
            // if(!this.searchStr || el[props.textField].toLowerCase().includes(this.searchStr.toLowerCase()) || el[props.metaTextField].toLowerCase().includes(this.searchStr.toLowerCase())) {
            const isSearchMatch = !this.searchStr || el[props.textField].toLowerCase().includes(this.searchStr.toLowerCase()) || el[props.metaTextField].toLowerCase().includes(this.searchStr.toLowerCase());
            procData.push({
                key: el[props.keyField],
                iconName: iPropFields? el[iPropFields.name]: iconProps.name,
                iconText: iPropFields? el[iPropFields.text]: iconProps.text,
                iconSize: iPropFields? el[iPropFields.size]: iconProps.size,
                iconVariant: iPropFields? el[iPropFields.variant]: iconProps.size,
                text: el[props.textField],
                metaText: el[props.metaTextField],
                isVisible: isSearchMatch,
                cssClass: isSearchMatch? 'slds-listbox__item': 'slds-listbox__item slds-hide'
            });
        //}
        });
    }
    console.log('procData', procData);
    return procData; 
   }


    get showLabel() {
        return this.variant !== 'label-hidden';
    }

    get formElCss() {

        if(this.variant === 'label-inline') {
            return 'slds-form-element slds-form-element_horizontal';
        }
        else if(this.variant === 'label-stacked') {
            return 'slds-form-element slds-form-element_stacked';
        }
        return 'slds-form-element';
    }
    @track comboCss = 'slds-dropdown slds-dropdown_length-with-icon-10 slds-dropdown_fluid inactive';

    handleInpFocus(ev) {
        this.comboCss = 'slds-dropdown slds-dropdown_length-with-icon-10 slds-dropdown_fluid active';
        this.mode = 'edit';
    }

    handleDone(ev) {
        if(this.selectedItems.length === 0) {
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
    handleSelectAllChange(ev) {
        this.allAccountsSelected = ev.target.checked;
        console.log();
        this.selectedItems = [];
        if(this.allAccountsSelected) {
            this.template.querySelectorAll('c-child').forEach(ch => {
                ch.checked = true;
                this.selectedItems.push({label: ch.text, value: ch.uniqueId });
            });
        } else {
            this.template.querySelectorAll('c-child').forEach(ch => {
                ch.checked = false;
            });
        }
    } 

    connectedCallback(ev) {
       this.updateSelectedItemsInUI();
    }

    updateSelectedItemsInUI() {
        this.template.querySelectorAll('c-child').forEach(ch => {
            ch.checked = this.selectedItems.find(sl => sl.value === ch.uniqueId);
        });
    }


    @track inpErrorMsg;

    handleOnBlur(ev) {
      console.log(ev);
      console.log(ev.currentTarget);
      console.log(ev.currentTarget.classList);
      console.log(ev.target);
      console.log(ev.target.classList);
        this.comboCss = 'slds-dropdown slds-dropdown_length-with-icon-7 slds-dropdown_fluid inactive';
        this.reportValidity();
    }
 


    @api checkValidity() {
        return this.selItem || !this.required;
    }

    @api reportValidity() {

        if(this.checkValidity()) {
            this.inpErrorMsg  = '';
            this.inpCss =  'slds-combobox_container slds-has-selection';
            return true;
        }
        this.inpCss =  'slds-combobox_container slds-has-selection slds-has-error';
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
        let x = this.dispatchEvent(new CustomEvent('change', {detail: inp.value, cancelable: true}));

        if(x) {
            this.searchStr = inp.value;
        }
    }
 
    @track selItem = '';

    @track
    selectedItems=[{label: 'Microsoft Corp', value: 'CaseID2' }];
    handleSelect(ev) {
        console.log('onselect123', ev.detail);
        this.updateSelectedPills();
        this.allAccountsSelected = this.selectedItems.length === this.options.length;
        
        return;
        const selKey = ev.detail;

        this.processedListData.forEach((el) => {
            if( el.key === selKey) {
                this.selItem = el;
            }
        });

        let selOpt;

        this.options.forEach((el) => {
            if( el[this.props.keyField] === selKey) {
                selOpt = el;
            }
        });
        
        this.dispatchEvent(new CustomEvent('select', {detail: selOpt}));

    }

    handleRemove(ev) {
      console.log(ev.detail.name);
      const toRemovePill = ev.detail.name;

      this.template.querySelectorAll('c-child').forEach(ch => {
        if(ch.uniqueId === toRemovePill) {
          ch.checked = false;
        }
      });
      this.updateSelectedPills();
    }

    updateSelectedPills() {

        this.selectedItems = [];

        this.template.querySelectorAll('c-child').forEach(ch => {
          if(ch.checked) {
          this.selectedItems.push({label: ch.text, value: ch.uniqueId });
          }
        });
    }

    inputFocus;


    handleRemoveAcc(ev) {
        this.selItem  = null;
        this.searchStr = null;
        this.dispatchEvent(new CustomEvent('select', {detail: ''}));
        this.inputFocus = true              
    }
    renderedCallback() {
        if(this.inputFocus && this.template.querySelector('[data-id="input"]')) {
            this.template.querySelector('[data-id="input"]').focus();  
            this.inputFocus = false;
        }
    }

    get displayText() {
        let label;

        if(this.selectedItems.length === 1) {
            label = this.selectedItems[0].label;
        } else if(this.selectedItems.length === this.options.length) {
            label = `All Accounts(${this.selectedItems.length})`;
        } else {
            label = `${this.selectedItems.length} Accounts Selected`;
        }

        return label;
    }

    handleSelectAllLabelClick(ev) {
        this.allAccountsSelected = !this.allAccountsSelected;
        this.selectedItems = [];
        if(this.allAccountsSelected) {
            this.template.querySelectorAll('c-child').forEach(ch => {
                ch.checked = true;
                this.selectedItems.push({label: ch.text, value: ch.uniqueId });
            });
        } else {
            this.template.querySelectorAll('c-child').forEach(ch => {
                ch.checked = false;
            });
        }
    }

}
