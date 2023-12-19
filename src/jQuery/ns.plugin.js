//
let usedEndDateInputs = [];

// Error messages
let MESSAGES = {
    NS_MUST_SELECT_DATE_FROM: '',
    NS_MUST_SELECT_DATE_TO: '',
    NS_GREATHER_THAN_DATE: '',
    NS_EARLIER_THAN_DATE: ''
};

// Object containing date validation logic
var datesValidator = {
    // Initializes the object, setting change event handlers on date inputs
    initialize: function (startDateInputId, endDateInputId, attr_must_select_date_from, attr_must_select_date_to, attr_greather_than_date, attr_earlier_than_date) {
        "use strict";

        MESSAGES.NS_MUST_SELECT_DATE_FROM = attr_must_select_date_from;
        MESSAGES.NS_MUST_SELECT_DATE_TO = attr_must_select_date_to;
        MESSAGES.NS_GREATHER_THAN_DATE = attr_greather_than_date;
        MESSAGES.NS_EARLIER_THAN_DATE = attr_earlier_than_date;

        $(`#${startDateInputId}`).on("change", function (e) {
            validateDates(this, e, startDateInputId, endDateInputId);
        });

        $(`#${endDateInputId}`).on("change", function (e) {
            validateDates(this, e, startDateInputId, endDateInputId);
        });
    }
};

// Function to validate dates
function validateDates(item, event, startDateInput, endDateInput) {
    // Function to obtain the date from a given input element
    const getDate = (elementId) => {
        const dateValue = $(`#${elementId}`).val();
        return dateValue ? new Date(dateValue) : null;
    };

    // Function to clear error messages
    const clearError = (dateInput) => {
        $(`#${dateInput}_error_placeholder`).addClass('u-visible').html('');
    };

    // Function to add error messages
    const addError = (dateInput, errorMessage) => {
        const errorTemplate = `<span class="t-Form-error"><div id="${dateInput}_error">${errorMessage}</div></span>`;
        $(`#${dateInput}_error_placeholder`).removeClass('u-visible').html(errorTemplate);
    };

    // Get dates from input elements
    const startDate = getDate(startDateInput);
    const endDate = getDate(endDateInput);

    // Validate if dates are valid
    if (!startDate || !endDate) {
        clearError(startDateInput);
        clearError(endDateInput);

        // Check if dates are used but not selected
        if (!startDate && !endDate && usedEndDateInputs.includes(endDateInput) && usedEndDateInputs.includes(startDateInput)) {
            clearError(startDateInput);
            clearError(endDateInput);
        } else {
            // Handle errors when a date is missing
            if (!startDate) {
                addError(startDateInput, MESSAGES.NS_MUST_SELECT_DATE_FROM);
            } else {
                usedEndDateInputs.push(startDateInput);
            }

            if (!endDate) {
                // Copy the start date if available and not used previously
                if (startDate && !usedEndDateInputs.includes(endDateInput)) {
                    $(`#${endDateInput}`).val($(`#${startDateInput}`).val());
                    usedEndDateInputs.push(endDateInput);
                } else {
                    addError(endDateInput, MESSAGES.NS_MUST_SELECT_DATE_TO);
                }
            }
        }
        return;
    }

    // Validate if the end date is not earlier than the start date
    if (endDate < startDate) {
        clearError(startDateInput);
        clearError(endDateInput);
        if (item.id === startDateInput) {
            addError(startDateInput, MESSAGES.NS_GREATHER_THAN_DATE);
        }
        if (item.id === endDateInput) {
            addError(endDateInput, MESSAGES.NS_EARLIER_THAN_DATE);
        }
        return;
    }

    // Clear errors if everything is in order
    clearError(startDateInput);
    clearError(endDateInput);
}