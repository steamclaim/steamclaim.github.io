const now = new Date();
const latestDate = new Date(`${now.getUTCFullYear() - 18}-${('0' + (now.getUTCMonth() + 1)).slice(-2)}-${('0' + now.getUTCDate()).slice(-2)}`);

let formHandler = new FormHandler({
    InputGroups: [
        new InputGroup({
            ValidationType: ValidationTypes.Required,
            InvalidMessage: "Street Address field may only contain letters, numbers, hyphens, and apostrophes.",
            OptionalInputs: [
                new BaseInput({
                    InputType: InputTypes.Address,
                    InputNode: query('input[name="StreetAddress"]'),
                }),
            ]
        }),
        new InputGroup({
            ValidationType: ValidationTypes.Required,
            RequiredInputs: [
                new BaseInput({
                    InputType: InputTypes.Name,
                    InputNode: query('input[name="FirstName"]'),
                    Events: {
                        OnInput: function (e) { InputEventConstants.NameFields(e); }
                    },
                }),
                new BaseInput({
                    InputType: InputTypes.Name,
                    InputNode: query('input[name="LastName"]'),
                    Events: {
                        OnInput: function (e) { InputEventConstants.NameFields(e); }
                    },
                }),
                new BaseInput({
                    InputType: InputTypes.Address,
                    InputNode: query('input[name="StreetAddress"]'),
                }),
                new BaseInput({
                    InputType: InputTypes.City,
                    InputNode: query('input[name="City"]'),
                    Events: {
                        OnInput: function (e) { InputEventConstants.LettersOnly(e); }
                    },
                }),
                new BaseInput({
                    InputType: InputTypes.EmailAddress,
                    InputNode: query('input[name="EmailAddress"]'),
                }),
                new BaseInput({
                    InputType: InputTypes.General,
                    InputNode: query('input[name="SteamAccountName"]'),
                }),
                
                new BaseInput({
                    InputType: InputTypes.State,
                    InputNode: query('select[name="State"]'),
                }),
                new BaseInput({
                    InputType: InputTypes.Zip,
                    InputNode: query('input[name="Zip"]'),
                    Events: {
                        OnInput: function (e) { InputEventConstants.NumbersOnly(e); }
                    },
                }),
                new BaseInput({
                    InputType: InputTypes.PhoneNumber,
                    InputNode: query('input[name="PhoneNumber"]'),
                    Events: {
                        OnInput: function (e) { InputEventConstants.FormatPhoneNumber(e); }
                    },
                }),
                new BaseInput({
                    InputType: InputTypes.Date,
                    InputNode: query('input[name="DateofBirth"]'),
                    Events: {
                        OnInput: function (e) {
                            const dateElement = query('input[name="DateofBirth"]')
                            const errorElement = query('#dob-error');
                            errorElement.classList.add('d-none');
                            dateElement.classList.remove('is-invalid');
                        },
                        OnBlur: function (e) {
                            if (e.target.valueAsDate > latestDate) {
                                const dateElement = query('input[name="DateofBirth"]')
                                const errorElement = query('#dob-error');
                                errorElement.classList.remove('d-none');
                                dateElement.classList.add('is-invalid');
                            }
                        }
                    }
                }),
                new BaseInput({
                    InputType: InputTypes.Checkbox,
                    InputNode: query('input[name="AgreeToReceiveCaseUpdates"]'),
                    Events: {
                        OnChange: e => {
                            const resident = query('input[name="ResidentofUS"]');
                            const isEighteen = query('input[name="C18orOlder"]');
                            resident.checked = e.target.checked;
                            isEighteen.checked = e.target.checked;
                        }
                    }
                }),
            ],
        }),
        new InputGroup({
            ValidationType: ValidationTypes.Conditional,
            Condition: function () {
                return true;
            },
            InvalidMessage: "You must be 18 or older to continue.",
            CustomValidation: function (group) {
                const dob = query('input[name="DateofBirth"]');
                const dateElement = query('input[name="DateofBirth"]');

                if (dob.value === '' || dob.valueAsDate > latestDate) {
                    group.IsGroupValid = false;
                    dateElement.classList.add('is-invalid');
                } else {
                    dateElement.classList.remove('is-invalid');
                }

                return group.IsGroupValid;
            }
        })
    ],
    Form: document.forms[0],
    SubmitBtn: query('#form-btn'),
    ErrorDiv: query('#error-panel'),
}); 