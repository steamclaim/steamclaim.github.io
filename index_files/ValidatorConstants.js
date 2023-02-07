/**
 * Constant object that contains various methods that are frequently used within form validation.
 */
const ValidationHelpers = {
    ValidateGeneral: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;

                if (node.value) {
                    let valid = (node.value != null && node.value != '');

                    if (valid) input.Status = InputStatuses.Valid;
                    else input.Status = InputStatuses.Invalid;

                    ValidationHelpers.ShowValidation(input, valid);
                    return valid;

                } else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }
            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null Input.');
            return false;
        }
    },
    ValidateName: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;
                let mode = input.ValidationMode;

                if (node.value && node.value != '') {
                    let name = node.value.trim();
                    var regex = /[-a-zA-Z\-\'\ ]/g;
                    // Set node value as trimmed value
                    node.value = name;

                    let isMatch = regex.test(name);

                    if (isMatch) input.Status = InputStatuses.Valid;
                    else input.Status = InputStatuses.Invalid;

                    ValidationHelpers.ShowValidation(input, isMatch);

                    if (!isMatch) {
                        input.Message = `${input.DisplayName} must only contain Alphabetical characters, hyphens, or apostrophes.`;
                    }

                    return isMatch;
                } else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }

            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as a Name.');
            return false;
        }
    },
    ValidateClaimNumber: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;

                if (node.value && node.value != '') {
                    let claimNum = node.value.toUpperCase();
                    let regex = /^([A-Z]{3}-\d{1,8})$/gim;
                    let isMatch = regex.test(claimNum);
                    node.value = claimNum.trim();

                    if (isMatch) input.Status = InputStatuses.Valid;
                    else input.Status = InputStatuses.Invalid;

                    ValidationHelpers.ShowValidation(input, isMatch);
                    return isMatch;
                } else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }
            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as a Claim Number.');
            return false;
        }
    },
    ValidateConfirmationNumber: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;

                if (node.value && node.value != '') {
                    let confirmationNum = node.value.toUpperCase();
                    let regex = /^(\d){1,12}$/gim;
                    const isMatch = regex.test(confirmationNum);
                    node.value = confirmationNum.trim();

                    if (isMatch) input.Status = InputStatuses.Valid;
                    else input.Status = InputStatuses.Invalid;

                    ValidationHelpers.ShowValidation(input, isMatch);
                    return isMatch;
                } else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }
            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as a Claim Number.');
            return false;
        }
    },
    ValidateDate: function (input) {
        if (input) {//c1
            if (input.InputNode) {//b1
                let node = input.InputNode;
                let mode = input.ValidationMode;

                if (node.value && node.value != '') { //a1

                    let dateString = node.value.trim().replaceAll("-", "/");


                    if (!(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString) || /^\d{1,4}\/\d{1,2}\/\d{2}$/.test(dateString))) {
                        ValidationHelpers.ShowValidation(input, false);
                        return false;
                    }

                    // Parse the date parts to integers
                    var parts = dateString.split("/");
                    if (parts[0].length == 2) {
                        var month = parseInt(parts[0], 10);
                        var year = parseInt(parts[2], 10);
                        var day = parseInt(parts[1], 10);
                    }
                    else if (parts[0].length == 4) {
                        var year = parseInt(parts[0], 10);
                        var month = parseInt(parts[1], 10);
                        var day = parseInt(parts[2], 10);
                    }
                    else {
                        ValidationHelpers.ShowValidation(input, false);
                        return false;
                    }

                    // Check the ranges of month and year
                    if (year < 1000 || year > 3000 || month == 0 || month > 12) {
                        ValidationHelpers.ShowValidation(input, false);
                        return false;
                    }

                    var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                    // Adjust for leap years
                    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
                        monthLength[1] = 29;

                    // Check the range of the day
                    if (!(day > 0 && day <= monthLength[month - 1])) {
                        ValidationHelpers.ShowValidation(input, false);
                        return false;
                    }

                    const entered = new Date(month + '-' + day + '-' + year);

                    var currentTime = new Date();

                    if (entered >= currentTime) {
                        ValidationHelpers.ShowValidation(input, false);
                        return false;
                    }

                    ValidationHelpers.ShowValidation(input, true);
                    return true;

                }//a2
                else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }
            }//b2
            else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } //c2
        else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as a Date.');
            return false;
        }
    },
    ValidateEmail: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;

                if (node.value && node.value != '') {
                    let email = node.value.trim();
                    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/gim;
                    const isMatch = regex.test(email);
                    node.value = email;

                    if (isMatch) input.Status = InputStatuses.Valid;
                    else input.Status = InputStatuses.Invalid;

                    ValidationHelpers.ShowValidation(input, isMatch);
                    return isMatch;
                } else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }
            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as an Email Address.');
            return false;
        }
    },
    ValidatePhone: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;

                if (node.value && node.value != '') {
                    let phone = node.value;
                    let regex = /(?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})/g;
                    const isMatch = regex.test(phone);

                    if (isMatch) input.Status = InputStatuses.Valid;
                    else input.Status = InputStatuses.Invalid;

                    ValidationHelpers.ShowValidation(input, isMatch);
                    return isMatch;
                } else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }
            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as a Phone Number.');
            return false;
        }
    },
    ValidateAddress: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;
                let mode = input.ValidationMode;

                if (node.value && node.value != '') {
                    let address = node.value.trim();
                    node.value = address;
                    var regex;
                    if (mode == ValidationModes.Alphanumeric) {
                        regex = /^[-#a-zA-Z\s0-9.]+$/g;
                    } else {
                        regex = /^(?!\s*$).+/gim;
                    }
                    const isMatch = regex.test(address);

                    if (isMatch) input.Status = InputStatuses.Valid;
                    else input.Status = InputStatuses.Invalid;

                    ValidationHelpers.ShowValidation(input, isMatch);
                    return isMatch;
                } else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }
            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as an Address.');
            return false;
        }
    },
    ValidateZip: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;
                let mode = input.ValidationMode;

                if (node.value && node.value != '') {
                    let zip = node.value.trim();
                    var regex;
                    if (mode == ValidationModes.Numeric) {
                        regex = /^(\d{5}){1}(?:((-|\.|\s){1}(\d{1,4}))?|(\[\d{1,4}\])?)$/g; //new regex
                        /*regex = /([0-9]{5}){1}(?:(-|\.?|\s]?))([0-9]{4})?/g;*/ //old regex
                    } else {
                        regex = /([a-zA-Z0-9]{5}){1}(?:(-|.?|\s]?))([a-zA-Z0-9]{4})?/g;
                    }
                    const isMatch = regex.test(zip);
                    node.value = zip;

                    if (isMatch) input.Status = InputStatuses.Valid;
                    else input.Status = InputStatuses.Invalid;

                    ValidationHelpers.ShowValidation(input, isMatch);
                    return isMatch;
                } else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }
            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as a Zip Code.');
            return false;
        }
    },
    ValidateCity: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;
                let mode = input.ValidationMode;

                if (node.value && node.value != '') {
                    let city = node.value.trim();
                    var regex;
                    if (mode == ValidationModes.Alphabetical) {
                        regex = /((^[-a-zA-Z ]*$))+/g;
                    } else {
                        regex = /(([a-zA-Z0-9]+)\{1\}\s)?([a-zA-Z0-9]+)+/g;
                    }
                    const isMatch = regex.test(city);
                    node.value = city;

                    if (isMatch) input.Status = InputStatuses.Valid;
                    else input.Status = InputStatuses.Invalid;

                    ValidationHelpers.ShowValidation(input, isMatch);
                    return isMatch;
                } else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }
            }
            else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as a City.');
            return false;
        }
    },
    ValidateState: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;

                if (node.value && node.value != '') {
                    input.Status = InputStatuses.Valid;

                    ValidationHelpers.ShowValidation(input, true);
                    return true;
                } else {
                    input.Status = InputStatuses.Blank;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                }
            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as a US State.');
            return false;
        }
    },
    ValidateSignature: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;
                valid = node.value != '';
                return valid;


            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as a Signature.');
            return false;
        }
    },
    ValidateCheckbox: function (input) {
        if (input) {
            if (input.InputNode) {
                let node = input.InputNode;
                if (!node.checked) {
                    input.Status = InputStatuses.Invalid;

                    ValidationHelpers.ShowValidation(input, false);
                    return false;
                } else {
                    input.Status = InputStatuses.Valid;

                    return true;
                }

            } else {
                input.Status = InputStatuses.Invalid;

                console.error('Cannot validate an Input without an InputNode configured.');
                return false;
            }
        } else {
            input.Status = InputStatuses.Invalid;

            console.error('Cannot validate a null input as a Checkbox.');
            return false;
        }
    },
    ShowValidation: function (input, valid) {
        if (input) {
            if (input.ErrorNode) {
                if (valid) {
                    // Show valid input
                    if (input.ErrorNode.classList.contains('is-invalid'))
                        input.ErrorNode.classList.remove('is-invalid');
                    input.ErrorNode.classList.add('is-valid');
                } else {
                    // Show invalid input
                    if (input.ErrorNode.classList.contains('is-valid'))
                        input.ErrorNode.classList.remove('is-valid');
                    input.ErrorNode.classList.add('is-invalid');
                }
            }
            else {
                if (valid) {
                    // Show valid input
                    if (input.InputNode.classList.contains('is-invalid'))
                        input.InputNode.classList.remove('is-invalid');
                    input.InputNode.classList.add('is-valid');
                } else {
                    // Show invalid input
                    if (input.InputNode.classList.contains('is-valid'))
                        input.InputNode.classList.remove('is-valid');
                    input.InputNode.classList.add('is-invalid');
                }
            }
        }
    },
    ClearValidation: function (input) {
        if (input) {
            if (input.ErrorNode) {
                if (input.ErrorNode.classList.contains('is-valid'))
                    input.ErrorNode.classList.remove('is-valid');
                if (input.ErrorNode.classList.contains('is-invalid'))
                    input.ErrorNode.classList.remove('is-invalid');
            } else {
                if (input.InputNode.classList.contains('is-valid'))
                    input.InputNode.classList.remove('is-valid');
                if (input.InputNode.classList.contains('is-invalid'))
                    input.InputNode.classList.remove('is-invalid');
            }
        }
    }
};

/**
 *
 */
const ValidationModes = {
    Numeric: 1,
    Alphabetical: 2,
    Alphanumeric: 3,
}

/**
 * Constant object that contains the acceptable validation types for an InputGroup.
 */
const ValidationTypes = {
    Required: 1,
    Conditional: 2,
    //Optional: 3 //Reasoning being that Optional Input Groups shouldn't exist, optional inputs can be added to a required group's configuration
};

/**
 * Constant object that contains the acceptable input types for a given Input within an InputGroup.
 */
const InputTypes = {
    Name: 1,
    Address: 2,
    PhoneNumber: 3,
    EmailAddress: 4,
    City: 5,
    State: 6,
    Zip: 7,
    Checkbox: 8,
    ClaimNumber: 9,
    RadioButton: 10,
    General: 11,
    ConfirmationNumber: 12,
    Date: 13,
    Signature: 14,
};

const InputStatuses = {
    Valid: 1,
    Invalid: 2,
    Blank: 3
}

/**
 * Constant object that contains frequently used event logic for various input types.
 */
const InputEventConstants = {
    FormatPhoneNumber: function (e) {
        let phoneNum = (e.target.value).replace(/\D/g, '');
        const match = phoneNum.match(/^(\d{1,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            phoneNum = '(' + match[1] + (match[2] ? ')' + match[2] : '') + (match[3] ? '-' + match[3] : '');
        }
        e.target.value = phoneNum;
    },
    FormatClaimNumber: function (e) {
        let claimNum = e.target.value;

        // Allow users to backspace the character before the hyphen along with the hyphen
        if (e.inputType === 'deleteContentBackward' && claimNum.length === 3) {
            claimNum = claimNum.slice(0, 2);
        }

        // Match inputs that start with 3 characters, and inputs that end with 1-8 numbers
        const matchThreeLetters = claimNum.match(/(^([a-zA-Z]{3}))/);
        const matchNumbers = claimNum.match(/(\d{1,8})$/);

        if (matchThreeLetters) {
            claimNum = matchThreeLetters[0] + '-';

            // Append numbers if letters have already been matched
            if (matchNumbers) {
                claimNum += matchNumbers[0];
            }
        }

        // Disallow number input unless letters are already matched
        if (!matchThreeLetters && matchNumbers) {
            claimNum = '';
        }
        e.target.value = claimNum.toUpperCase();

    },
    ToggleForeignFields: function (doShow) {
        var local = query('#us-address');
        var foreign = query('#foreign-address');
        if (doShow == true) {
            if (foreign.classList.contains("d-none"))
                foreign.classList.remove("d-none");
            if (!local.classList.contains("d-none"))
                local.classList.add("d-none");
        }
        else {
            if (!foreign.classList.contains("d-none"))
                foreign.classList.add("d-none");
            if (local.classList.contains("d-none"))
                local.classList.remove("d-none");
        }
    },
    NameFields: function (e) {
        let nonumbers = (e.target.value).replace(/[^-a-zA-Z\-\'\ ]/g, '');
        e.target.value = nonumbers;
    },
    LettersOnly: function (e) {
        let nonumbers = (e.target.value).replace(/[^-a-zA-Z\-\'\ ]/g, '');
        e.target.value = nonumbers;
    },
    SSN: function (e) {
        let social = (e.target.value).replace(/[^0-9]/g, '');
        const match = social.match(/^(\d{3})(\d{2})(\d{4})$/);
        if (match) {
            social = match[1] + '-' + match[2] + '-' + match[3];
        }
        e.target.value = social;
    },
    NumbersOnly: function (e) {
        let onlyNumbers = (e.target.value).replace(/[^0-9]/g, '');
        e.target.value = onlyNumbers;
    },
}