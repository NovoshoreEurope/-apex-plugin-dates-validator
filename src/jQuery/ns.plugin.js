// Global variables to store error messages
let MESSAGES = {
    NS_MUST_SELECT_DATE_FROM: '',
    NS_MUST_SELECT_DATE_TO: '',
    NS_GREATHER_THAN_DATE: '',
    NS_EARLIER_THAN_DATE: ''
};

// Array to manage date input fields that have been used
let usedEndDateInputs = [];

// Object that contains the date validation logic
var datesValidator = {
    // Initializes the validator, sets event handlers for the date inputs
    initialize: function (startDateInputId, endDateInputId, attr_must_select_date_from, attr_must_select_date_to, attr_greather_than_date, attr_earlier_than_date) {
        "use strict";

        // Assign error messages from received attributes
        MESSAGES.NS_MUST_SELECT_DATE_FROM = attr_must_select_date_from;
        MESSAGES.NS_MUST_SELECT_DATE_TO = attr_must_select_date_to;
        MESSAGES.NS_GREATHER_THAN_DATE = attr_greather_than_date;
        MESSAGES.NS_EARLIER_THAN_DATE = attr_earlier_than_date;

        // Add 'change' event handlers to the date input fields
        $(`#${startDateInputId}`).on("change", function (e) {
            validateDates(this, e, startDateInputId, endDateInputId);
        });

        $(`#${endDateInputId}`).on("change", function (e) {
            validateDates(this, e, startDateInputId, endDateInputId);
        });
    }
};

// Function to validate the dates
function validateDates(item, event, startDateInput, endDateInput) {
    // Function to get the date from a given input element
    const getDate = (elementId) => {
        const dateValue = $v(elementId);
        const dateFormat = $x(elementId).getAttribute("format");
        return dateValue ? apex.date.parse(dateValue, dateFormat) : null;
    };

    // Función para limpiar los mensajes de error
    const clearError = (dateInput) => {
        $(`#${dateInput}_error_placeholder`).addClass('u-visible').html('');
    };

    // Function to clear error messages
    const addError = (dateInput, errorMessage) => {
        const errorTemplate = `<span class="t-Form-error"><div id="${dateInput}_error">${errorMessage}</div></span>`;
        $(`#${dateInput}_error_placeholder`).removeClass('u-visible').html(errorTemplate);
    };

    // Get the dates from the input fields
    const startDate = getDate(startDateInput);
    const endDate = getDate(endDateInput);

    // If any of the dates is invalid, handle the errors
    if (!startDate || !endDate) {
        // Clear previous errors
        clearError(startDateInput);
        clearError(endDateInput);

        // If both dates are not selected and both inputs have been used, clear the errors
        if (!startDate && !endDate && usedEndDateInputs.includes(endDateInput) && usedEndDateInputs.includes(startDateInput)) {
            clearError(startDateInput);
            clearError(endDateInput);
        } else {
            // Validate the start date
            if (!startDate) {
                addError(startDateInput, MESSAGES.NS_MUST_SELECT_DATE_FROM);
            } else {
                // If the start date is valid, mark it as used
                usedEndDateInputs.push(startDateInput);
            }

            // Validate the end date
            if (!endDate) {
                // If the end date is not selected and the start date is available, copy the start date to the end date
                if (startDate && !usedEndDateInputs.includes(endDateInput)) {
                    // Get the value and format of the start date input
                    const startDateInputValue = $v(startDateInput);
                    const startDateInputFormat = $x(startDateInput).getAttribute("format");

                    // Parse the start date value into a valid date object using the specified format
                    let $startDateInputValue = apex.date.parse(startDateInputValue, startDateInputFormat);

                    // Add 1 day to the start date to set the default end date (e.g., next day)
                    $startDateInputValue = apex.date.add($startDateInputValue, 1, apex.date.UNIT.DAY);

                    // Get the format of the end date input
                    const endDateInputFormat = $x(endDateInput).getAttribute("format");

                    // Format the updated end date (start date + 1 day) according to the end date input's format
                    const endDateInputValue = apex.date.format($startDateInputValue, endDateInputFormat);

                    // Set the calculated end date value in the end date input field
                    $s(endDateInput, endDateInputValue);

                    // Mark the end date input as used to avoid overwriting it later
                    usedEndDateInputs.push(endDateInput);

                } else {
                    // If no start date is available or the end date has already been used, show an error
                    addError(endDateInput, MESSAGES.NS_MUST_SELECT_DATE_TO);
                }
            }
        }
        return;
    }

    // Verify that the end date is after the start date
    const isDateAfter = apex.date.isAfter(endDate, startDate);
    if (!isDateAfter) {
        // Clear errors if the dates are valid, but the end date is not after the start date
        clearError(startDateInput);
        clearError(endDateInput);

        // Depending on which field triggered the validation, display the appropriate message
        if (item.id === startDateInput) {
            addError(startDateInput, MESSAGES.NS_GREATHER_THAN_DATE);
        }
        if (item.id === endDateInput) {
            addError(endDateInput, MESSAGES.NS_EARLIER_THAN_DATE);
        }
        return;
    }

    // If the dates are valid, clear any error messages
    clearError(startDateInput);
    clearError(endDateInput);
}