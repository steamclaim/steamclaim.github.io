/**
 * @classdesc A configurable group to be validated by a FormHandler. Can contain a variety of Inputs.
 */
class InputGroup {
    //Getter methods for respective inputs
    GetRequired() { return this.RequiredInputs; }
    GetConditional() { return this.ConditionalInputs; }
    GetOptional() { return this.OptionalInputs; }

    AddValidationMessage(msg) {
        if (this.InvalidMessage == '')
            this.InvalidMessage += msg;
        else
            this.InvalidMessage += '</br>' + msg;
    }

    ClearValidationMessage() {
        this.InvalidMessage = '';
    }

    /**
     * Method that is called in FormHandler when validating configured InputGroups.
     * If an InputGroup has a CustomValidation function property in it's configuration when instantiated, then that function is called here.
     */
    ValidateGroup() {
        this.IsGroupValid = true; //reset validity
        this.HasBlankInputs = false; //reset blank field indicator
        if (this.HasCustomValidation) {
            return this.CustomValidation(this); //this is referring to the CustomValidation: function(group) { } provided in the group's configuration
        } else {
            return this.DefaultValidation();
        }
    }

    /**
     * Method that is called in the ValidateGroup() function. This method contains the default behaviors for Inputs configured within an InputGroup.
     * If an InputGroup does NOT have a CustomValidation function property in it's configuration when instantiated, then this function is used as a default when validating the InputGroup.
     */
    DefaultValidation() {
        //If an InputGroup is configured as conditional, first we want to evaluate if that condition is met, and if so, it runs the Validate() method on each Input configured within the InputGroup.
        if (this.ValidationType == ValidationTypes.Conditional) {
            if (this.RequirementConditionMet(this)) {

                //Every InputGroup can contain Required, Conditional, and Optional inputs. We want to validate the required inputs first.
                let reqInputs = this.GetRequired();
                if (reqInputs != null && reqInputs.length > 0) {
                    for (let i = 0; i < reqInputs.length; i++) {
                        let input = reqInputs[i];

                        //Clear any previous validation indicators before running validation
                        ValidationHelpers.ClearValidation(input);

                        if (!input.Validate(input)) {
                            this.IsGroupValid = false;

                            if (input.Status == InputStatuses.Blank) {
                                this.HasBlankInputs = true;
                            } else if (input.Status == InputStatuses.Invalid) {
                                if (input.Message) {
                                    this.AddValidationMessage(input.Message);
                                }
                            }
                        }
                        continue;
                    }
                }

                //When validating conditional inputs, we first evaluate whether or not the input's condition for requirement is met. If it is met, then we validate it.
                //Alternatively, if the input has a value that is not the empty string or null, then we validate it. Non-required inputs still need to be in a valid format.
                let conditionalInputs = this.GetConditional();
                if (conditionalInputs != null && conditionalInputs.length > 0) {
                    for (let j = 0; j < conditionalInputs.length; j++) {
                        let input = conditionalInputs[j];

                        ValidationHelpers.ClearValidation(input);

                        if (input.RequiredCondition()) {
                            if (!input.Validate(input)) {
                                this.IsGroupValid = false;

                                if (input.Status == InputStatuses.Blank) {
                                    this.HasBlankInputs = true;
                                } else if (input.Status == InputStatuses.Invalid) {
                                    if (input.Message) {
                                        this.AddValidationMessage(input.Message);
                                    }
                                }
                            }
                            continue;
                        }
                        else {
                            if (input.InputNode.value != null && input.InputNode.value != '') {
                                if (!input.Validate(input)) {
                                    this.IsGroupValid = false;

                                    if (input.Status == InputStatuses.Invalid) {
                                        if (input.Message) {
                                            this.AddValidationMessage(input.Message);
                                        }
                                    }
                                }
                                continue;
                            }
                        }
                    }
                }

                //When considering validation for optional inputs, we don't want them to affect form validity unless the input has a value that is not null or the empty string.
                let optionalInputs = this.GetOptional();
                if (optionalInputs != null && optionalInputs.length > 0) {
                    for (let k = 0; k < optionalInputs.length; k++) {
                        let input = optionalInputs[k];

                        ValidationHelpers.ClearValidation(input);

                        if (input.InputNode.value != null && input.InputNode.value != '') {
                            if (input.Validate) {
                                if (!input.Validate(input)) {
                                    this.IsGroupValid = false;

                                    if (input.Status == InputStatuses.Invalid) {
                                        if (input.Message) {
                                            this.AddValidationMessage(input.Message);
                                        }
                                    }
                                }
                                continue;
                            }
                        }
                    }
                }
            }
        }
        //If an InputGroup is configured as Required, then we run the same validation methodology as if it's a Conditional InputGroup when it's condition for requirement is met.
        //Except the condition for requirement of a Required InputGroup is Always.
        else if (this.ValidationType == ValidationTypes.Required) {
            let reqInputs = this.GetRequired();
            if (reqInputs != null && reqInputs.length > 0) {
                for (let i = 0; i < reqInputs.length; i++) {
                    let input = reqInputs[i];

                    ValidationHelpers.ClearValidation(input);

                    if (!input.Validate(input)) {
                        this.IsGroupValid = false;

                        if (input.Status == InputStatuses.Blank) {
                            this.HasBlankInputs = true;
                        } else if (input.Status == InputStatuses.Invalid) {
                            if (input.Message) {
                                this.AddValidationMessage(input.Message);
                            }
                        }
                    }
                    continue;
                }
            }

            let conditionalInputs = this.GetConditional();
            if (conditionalInputs != null && conditionalInputs.length > 0) {
                for (let j = 0; j < conditionalInputs.length; j++) {
                    let input = conditionalInputs[j];

                    ValidationHelpers.ClearValidation(input);

                    if (input.RequiredCondition()) {
                        if (!input.Validate(input)) {
                            this.IsGroupValid = false;

                            if (input.Status == InputStatuses.Blank) {
                                this.HasBlankInputs = true;
                            } else if (input.Status == InputStatuses.Invalid) {
                                if (input.Message) {
                                    this.AddValidationMessage(input.Message);
                                }
                            }
                        }
                        continue;
                    }
                    else {
                        if (input.InputNode.value != null && input.InputNode.value != '') {
                            if (!input.Validate(input)) {
                                this.IsGroupValid = false;

                                if (input.Status == InputStatuses.Invalid) {
                                    if (input.Message) {
                                        this.AddValidationMessage(input.Message);
                                    }
                                }
                            }
                            continue;
                        }
                    }
                }
            }

            let optionalInputs = this.GetOptional();
            if (optionalInputs != null && optionalInputs.length > 0) {
                for (let k = 0; k < optionalInputs.length; k++) {
                    let input = optionalInputs[k];

                    ValidationHelpers.ClearValidation(input);

                    if (input.InputNode.value != null && input.InputNode.value != '') {
                        if (input.Validate) {
                            if (!input.Validate(input)) {
                                this.IsGroupValid = false;

                                if (input.Status == InputStatuses.Invalid) {
                                    if (input.Message) {
                                        this.AddValidationMessage(input.Message);
                                    }
                                }
                            }
                            continue;
                        }
                    }
                }
            }
        }

        return this.IsGroupValid;
    }

    /**
     * Used internally within the instantiation of an InputGroup to assign events to inputs specified in the configuration.
     */
    AssignEventsToInputs() {
        //first assign events to required inputs
        let reqInputs = this.GetRequired();
        if (reqInputs != null && reqInputs.length > 0) {
            for (let i = 0; i < reqInputs.length; i++) {
                let input = reqInputs[i];
                if (input.Events) {
                    if (input.Events.OnClick) {
                        input.InputNode.addEventListener('click', function (e) {
                            input.Events.OnClick(e);
                        });
                    }

                    if (input.Events.OnInput) {
                        input.InputNode.addEventListener('input', function (e) {
                            input.Events.OnInput(e);
                        });
                    }

                    if (input.Events.OnBlur) {
                        input.InputNode.addEventListener('blur', function (e) {
                            input.Events.OnBlur(e);
                        });
                    }

                    if (input.Events.OnChange) {
                        input.InputNode.addEventListener('change', function (e) {
                            input.Events.OnChange(e);
                        });
                    }
                }
            }
        }

        //then assign events to conditional inputs
        let conditionalInputs = this.GetConditional();
        if (conditionalInputs != null && conditionalInputs.length > 0) {
            for (let i = 0; i < conditionalInputs.length; i++) {
                let input = conditionalInputs[i];
                if (input.Events) {
                    if (input.Events.OnClick) {
                        input.InputNode.addEventListener('click',
                            function (e) {
                                input.Events.OnClick(e);
                            });
                    }

                    if (input.Events.OnInput) {
                        input.InputNode.addEventListener('input',
                            function (e) {
                                input.Events.OnInput(e);
                            });
                    }
                }
            }
        }

        //now assign events to optional inputs
        let optionalInputs = this.GetOptional();
        if (optionalInputs != null && optionalInputs.length > 0) {
            for (let i = 0; i < optionalInputs.length; i++) {
                let input = optionalInputs[i];
                if (input.Events) {
                    if (input.Events.OnClick) {
                        input.InputNode.addEventListener('click',
                            function (e) {
                                input.Events.OnClick(e);
                            });
                    }

                    if (input.Events.OnInput) {
                        input.InputNode.addEventListener('input',
                            function (e) {
                                input.Events.OnInput(e);
                            });
                    }
                }
            }
        }
    }

    /**
     * Constructor for instantiating an InputGroup with a given configuration object.
     * @see TODO: Add documentation link for InputGroup configuration when available.
     * @param {any} config
     */
    constructor(config) {
        if (!config)
            console.error('Input Group initialized without configuration.');

        this.ValidationType = config.ValidationType;
        if (config.ValidationType == ValidationTypes.Conditional)
            if (config.Condition)
                this.RequirementConditionMet = config.Condition;
            else
                console.error('Conditional Input Group initialized without Requirement Condition.');

        if (config.CustomValidation) {
            this.HasCustomValidation = true;
            this.CustomValidation = config.CustomValidation;
        } else {
            this.HasCustomValidation = false;
        }

        //These are inputs that are required regardless of conditions.
        this.RequiredInputs = config.RequiredInputs;

        //These are inputs that are only required once a condition has been met.
        this.ConditionalInputs = config.ConditionalInputs;

        //These are inputs that are completely optional, form submission should not take these into account unless an input has a value and is invalid
        this.OptionalInputs = config.OptionalInputs;

        //Override for generic form invalid message of 'Please complete the required fields in order to submit your claim.'
        //Can be used on complex pages that have multiple distinct input groups to provide a general, full-form validation summary.
        //In the future, I want to add a feature where each input has it's own validation 'message' banner so we can more effectively let users know how to resolve the validation issues with the information they provide
        if (!config.InvalidMessage)
            this.InvalidMessage = '';
        else
            this.InvalidMessage = config.InvalidMessage;

        //Valid unless proven otherwise
        this.IsGroupValid = true;

        //Used to determine whether or not to show the default "please complete required fields" validation message
        this.HasBlankInputs = false;

        this.OverrideDefaultHandlerMessage = config.OverrideDefaultHandlerMessage ?? false;

        //Initialize the InputGroup and all Inputs within it.
        this.AssignEventsToInputs();
    }
}

/**
 * @classdesc A configurable input to be contained within an InputGroup. 
 */
class BaseInput {
    /**
     * Constructor for instantiating an Input with a given configuration object.
     * @see TODO: Add documentation link for Input configuration when available.
     * @param {any} config
     */
    constructor(config) {
        if (!config)
            console.error('Input initialized without configuration.');

        this.DisplayName = config.DisplayName;
        this.InputType = config.InputType;
        this.InputNode = config.InputNode;
        this.ErrorNode = config.ErrorNode;
        this.Events = config.Events;
        this.Message = config.Message;

        if (!config.ValidationMode) {
            switch (this.InputType) {
                case InputTypes.Name:
                    this.ValidationMode = ValidationModes.Alphanumeric;
                    break;
                case InputTypes.Address:
                    this.ValidationMode = ValidationModes.Alphanumeric;
                    break;
                case InputTypes.City:
                    this.ValidationMode = ValidationModes.Alphabetical;
                    break;
                case InputTypes.Zip:
                    this.ValidationMode = ValidationModes.Numeric;
                    break;
                default:
                    this.ValidationMode = ValidationModes.Alphanumeric;
                    break;
            }
        } else
            this.ValidationMode = config.ValidationMode;

        //Set the validation logic for the input based on InputType or if the Input configuration contains a Validation function property.
        if (config.Validation)
            this.Validate = config.Validation;
        else {
            this.Validate = function (input) {
                ValidationHelpers.ClearValidation(input);
                switch (this.InputType) {
                    case InputTypes.Name:
                        return ValidationHelpers.ValidateName(input);
                        break;
                    case InputTypes.Address:
                        return ValidationHelpers.ValidateAddress(input);
                        break;
                    case InputTypes.City:
                        return ValidationHelpers.ValidateCity(input);
                        break;
                    case InputTypes.ClaimNumber:
                        return ValidationHelpers.ValidateClaimNumber(input);
                        break;
                    case InputTypes.EmailAddress:
                        return ValidationHelpers.ValidateEmail(input);
                        break;
                    case InputTypes.PhoneNumber:
                        return ValidationHelpers.ValidatePhone(input);
                        break;
                    case InputTypes.State:
                        return ValidationHelpers.ValidateState(input);
                        break;
                    case InputTypes.Zip:
                        return ValidationHelpers.ValidateZip(input);
                        break;
                    case InputTypes.General:
                        return ValidationHelpers.ValidateGeneral(input);
                        break;
                    case InputTypes.Checkbox:
                        return ValidationHelpers.ValidateCheckbox(input);
                        break;
                    case InputTypes.ConfirmationNumber:
                        return ValidationHelpers.ValidateConfirmationNumber(input);
                        break;
                    case InputTypes.Date:
                        return ValidationHelpers.ValidateDate(input);
                        break;
                    case InputTypes.Signature:
                        return ValidationHelpers.ValidateSignature(input);
                        break;
                    //case InputTypes.RadioButton:
                    //    ValidationHelpers.ValidateRadio
                }
            }
        }

        //Set to true initially because:
        //1. All required inputs will be validated regardless.
        //2. If a conditional input doesn't meet it's condition to be required, then it is considered to be inherently valid
        //3. If an optional input has a value, it will be validated. If validation fails, this will be set to false.
        // a. If an optional input doesn't have a value, then it is not validated and is inherently valid. 
        this.Valid = true;
        this.Status = InputStatuses.Valid;
    }
}

class ConditionalInput extends BaseInput {
    constructor(config) {
        super(config);
        this.RequiredCondition = config.Condition;
    }
}