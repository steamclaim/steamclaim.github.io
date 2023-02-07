function Validator() {
    const ShowValidation = function (elem, isValid) {
        if (isValid) {
            // Show valid element
            if (elem.classList.contains('is-invalid'))
                elem.classList.remove('is-invalid');
            elem.classList.add('is-valid');
        }
        else {
            // Show invalid element
            if (elem.classList.contains('is-valid'))
                elem.classList.remove('is-valid');
            elem.classList.add('is-invalid');
        }
    };

    const RemoveValidation = function (elem) {
        if (elem.classList.contains('is-valid'))
            elem.classList.remove('is-valid');
        if (elem.classList.contains('is-invalid'))
            elem.classList.remove('is-invalid');
    };

    const validator = {
        // isValid is set to true to start. If a validation function is run and fails, isValid is set to false.
        // isValid is set back to true with Reset().
        isValid: true,
        ClaimNumber: function (claimNumNode) {
            let claimNum = claimNumNode.value.toUpperCase();
            let regex = /^([A-Z]{3}-\d{1,7})$/gim;
            let isMatch = regex.test(claimNum);
            claimNumNode.value = claimNum.trim();
            ShowValidation(claimNumNode, isMatch);
            if (!isMatch)
                this.isValid = false;
        },
        Name: function (nameNode) {
            if (nameNode) {
                if (nameNode.value) {
                    let name = nameNode.value.trim();
                    let regex = /^([a-zA-Z]+\s*)+$/gim; // Will match any string that contains at least one non-space character.
                    let isMatch = regex.test(name);
                    // Set node value as trimmed value
                    nameNode.value = name;
                    ShowValidation(nameNode, isMatch);
                    if (!isMatch)
                        this.isValid = false;
                }
                else {
                    ShowValidation(nameNode, false);
                    this.isValid = false;
                }
            }
        },
        Email: function (emailNode) {
            if (emailNode && emailNode.value) {
                let email = emailNode.value.trim();
                let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/gim;
                const isMatch = regex.test(email);
                emailNode.value = email;
                ShowValidation(emailNode, isMatch);
                if (!isMatch)
                    this.isValid = false;
            }
            else {
                ShowValidation(emailNode, false);
                this.isValid = false;
            }
        },
        Phone: function (phoneNode) {
            if (phoneNode && phoneNode.value) {
                let phone = phoneNode.value;
                let regex = /(?:\d{1}\s)?\(?(\d{3})\)?-?\s?(\d{3})-?\s?(\d{4})/g;
                const isMatch = regex.test(phone);
                ShowValidation(phoneNode, isMatch);
                if (!isMatch)
                    this.isValid = false;
            }
            else {
                ShowValidation(phoneNode, false);
                this.isValid = false;
            }
        },
        Address: function (addressNode) {
            if (addressNode && addressNode.value) {
                let address = addressNode.value.trim();
                let isValid = address != "";
                // Set node value as trimmed value
                addressNode.value = address;
                ShowValidation(addressNode, isValid);
                if (!isValid)
                    this.isValid = false;
            }
            else {
                ShowValidation(addressNode, false);
                this.isValid = false;
            }
        },
        City: function (cityNode) {
            if (cityNode && cityNode.value) {
                let city = cityNode.value.trim();
                let regex = /(([a-zA-Z]+)\{1\}\s)?([a-zA-Z]+)+/g;
                const isMatch = regex.test(city);
                cityNode.value = city;
                ShowValidation(cityNode, isMatch);
                if (!isMatch)
                    this.isValid = false;
            }
            else {
                ShowValidation(cityNode, false);
                this.isValid = false;
            }
        },
        State: function (stateNode) {
            if (stateNode) {
                if (stateNode.value) {
                    const isValid = (stateNode.value == "" ? false : true);
                    ShowValidation(stateNode, isValid);
                    if (!isValid)
                        this.isValid = false;
                }
                else {
                    ShowValidation(stateNode, false);
                    this.isValid = false;
                }
            }
        },
        Zip: function (zipNode) {
            if (zipNode && zipNode.value) {
                let zip = zipNode.value.trim();
                let regex = /([0-9]{5}){1}(?:(-|.?|\s]?))([0-9]{4})?/g;
                const isMatch = regex.test(zip);
                zipNode.value = zip;
                ShowValidation(zipNode, isMatch);
                if (!isMatch)
                    this.isValid = false;
            }
            else {
                ShowValidation(zipNode, false);
                this.isValid = false;
            }
        },
        CheckBox: function (checkNode) {
            if (checkNode) {
                ShowValidation(checkNode, checkNode.checked)
                if (!checkNode.checked) {
                    checkNode.addEventListener('click', function (e) {
                        RemoveValidation(e.target);
                    });
                    this.isValid = false;
                }
            }
            else {
                this.isValid = false;
            }
        },
        RadioList: function (radioNode, radioGroup) {
            if (!radioNode) {
                this.isValid = false;
                if (radioGroup) {
                    if (!radioGroup.classList.contains('text-danger'))
                        radioGroup.classList.add('text-danger')
                    ShowValidation(radioGroup, false);
                }
            }
        },
        ShowValidation: ShowValidation, // default ShowValidation function
        RemoveValidation: RemoveValidation, // default RemoveValidation function
        Reset: function () {
            this.isValid = true;
        }
    }

    return validator;
}