/** @classdesc A highly-configurable class that handles almost all functions for the screens of a claim form. */
class FormHandler {
    /**
     * Method to add any string of text to the overall error summary of a form. 
     * @param {string} str The appended text to add to the error summary of a form.
     */
    AddErrorMessage(str) {
        if (this.ErrorMsg == '')
            this.ErrorMsg += str;
        else
            this.ErrorMsg += '</br>' + str;
    }

    /**
     * Method to be called when a form's error summary needs to be displayed to the user.
     */
    ShowErrorMessage() {
        if (this.ErrorDiv) {
            this.ErrorDiv.innerHTML = this.ErrorMsg;
            if (this.ErrorDiv.classList.contains('d-none'))
                this.ErrorDiv.classList.remove('d-none');
            this.ErrorMsg = '';
        }
    }

    ClearErrorMessage() {
        if (this.ErrorDiv) {
            this.ErrorDiv.innerHTML = '';
            if (!this.ErrorDiv.classList.contains('d-none'))
                this.ErrorDiv.classList.add('d-none');
            this.ErrorMsg = '';
        }
    }

    /**
     * Internally used to validate all the input groups configured in a FormHandler's instantiation.
     */
    AreGroupsValid() {
        let isValid = true;
        let showDefaultErrorMsg = false;
        let defaultMsgOverride = false;

        //TODO Incorporate validity variable(s) for each section
        if (this.HasDigitalDisbursements) {
            let dd = this.DigitalDisbursements;
            if (dd != null && dd.ValidationType == ValidationTypes.Required && dd.WidgetDiv.getAttribute('key') != 'temp') {
                let pid = dd.PaymentIdInput;
                let paymentMethod = dd.PaymentMethodInput;

                if ((pid != null && pid.value == "") || (paymentMethod != null && paymentMethod.value == "")) {
                    isValid = false;
                    this.AddErrorMessage(dd.ErrorMsg);
                }
            }
        }

        //validate the input groups
        let inputGroups = this.InputGroups;
        if (inputGroups.length > 0) {
            for (let i = 0; i < inputGroups.length; i++) {
                let group = inputGroups[i];
                if (group.ValidationType == ValidationTypes.Required) {
                    if (!group.ValidateGroup()) {
                        isValid = false;

                        if (group.HasBlankInputs)
                            showDefaultErrorMsg = true;

                        if (group.OverrideDefaultHandlerMessage)
                            defaultMsgOverride = true;

                        if (group.InvalidMessage) {
                            this.AddErrorMessage(group.InvalidMessage);
                            group.ClearValidationMessage();
                        }
                    } else
                        continue;
                } else if (group.ValidationType == ValidationTypes.Conditional) {
                    if (group.RequirementConditionMet()) {
                        if (!group.ValidateGroup()) {
                            isValid = false;

                            if (group.HasBlankInputs)
                                showDefaultErrorMsg = true;

                            if (group.OverrideDefaultHandlerMessage)
                                defaultMsgOverride = true;

                            if (group.InvalidMessage) {
                                this.AddErrorMessage(group.InvalidMessage);
                                group.ClearValidationMessage();

                            }
                        } else
                            continue;
                    } else
                        continue;
                }
            }

            if (!isValid && showDefaultErrorMsg && !defaultMsgOverride) {
                this.AddErrorMessage(this.DefaultMessage);
            }
        }

        return isValid;
    }

    /**
     * Internally used to assign events to certain inputs specified in the configuration of a FormHandler's instantiation.
     */
    AssignEventsToInputs() {
        let handler = this; //because the value of 'this' changes in the scope of the addEventListener function

        if (handler.HasDigitalDisbursements && handler.DigitalDisbursements != null) {
            let dd = handler.DigitalDisbursements;
            let ddKey = handler.DigitalDisbursements.WidgetDiv.getAttribute('key');
            if (ddKey != null && (ddKey != 'temp' && ddKey != '')) {
                dstPaymentForm(dd.WidgetDiv,
                    {
                        verify: false,
                        onSubmitted: function (info) {
                            if (dd.PaymentIdInput) {
                                dd.PaymentIdInput.value = info.token;
                            } else console.error('Payment Id input needs to be configured in the FormHandler instantiation. Please see documentation.');

                            if (dd.PaymentMethodInput) {
                                dd.PaymentMethodInput.value = info.method;
                            } else console.error('Payment Method input needs to be configured in the FormHandler instantiation. Please see documentation.');
                        }
                    });
            }
        }

        //finally, assign submission event to SubmitBtn
        if (this.SubmitBtn) {
            this.SubmitBtn.addEventListener('click',
                function (e) {
                    e.target.disabled = true;
                    handler.ClearErrorMessage();
                    if (handler.AreGroupsValid()) {
                        if (handler.Form)
                            handler.Form.submit();
                    } else {
                        e.target.disabled = false;
                        handler.ShowErrorMessage();
                    }
                });
        }
    }

    /**
     * Constructor for instantiating a FormHandler within the script for any given page.
     * @see TODO: Add documentation link for configuring the FormHandler.
     * @param {any} config
     */
    constructor(config) {
        //If instantiated with a null config parameter, send an error to the console to indicate the issue.
        if (!config)
            console.error('Form configuration not set.');

        //initialize configuration flags
        this.RequiresCaptcha = config.RequiresCaptcha ?? false;
        this.HasDigitalDisbursements = config.HasDigitalDisbursements ?? false;
        this.DigitalDisbursements = config.DigitalDisbursementsSettings ?? null;

        //initialize configured InputGroups
        this.InputGroups = config.InputGroups;

        //initialize form, submit button, and error div
        this.Form = config.Form;
        this.SubmitBtn = config.SubmitBtn;
        this.ErrorDiv = config.ErrorDiv;

        this.DefaultMessage = config.DefaultMessage ?? 'Please complete the required fields in order to continue.';

        //set this to empty string to give the constructed class/object this public property
        this.ErrorMsg = '';

        //Initialize configured input groups
        this.AssignEventsToInputs();
    }

    //Initialize() { this.AssignEventsToInputs(this); }


}