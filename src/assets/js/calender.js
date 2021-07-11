var Calendar = /** @class */ (function () {
    function Calendar(divId) {
        this.firstDayOfWeek = 0;
        this.lastDayOfWeek = 6;
        // Days of week for the column headers
        this.DaysOfWeekSunStart = [
            'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ];
        this.DaysOfWeekMonStart = [
            'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
        ];
        // Month names
        this.Months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
        ];
        // Cache div id
        this.divId = divId;
        // Set the current date
        var d = new Date();
        this.currMonth = d.getMonth();
        this.currYear = d.getFullYear();
        this.currDay = d.getDate();
        this.currDayName = d.toLocaleString('en-us', { weekday: 'long' });
    }
    Calendar.prototype.nextMonth = function () {
        if (this.currMonth === 11) {
            this.currMonth = 0;
            this.currYear = this.currYear + 1;
        }
        else {
            this.currMonth = this.currMonth + 1;
        }
        this.displayCurrentMonth();
    };
    Calendar.prototype.previousMonth = function () {
        if (this.currMonth === 0) {
            this.currMonth = 11;
            this.currYear = this.currYear - 1;
        }
        else {
            this.currMonth = this.currMonth - 1;
        }
        this.displayCurrentMonth();
    };
    Calendar.prototype.displayCurrentMonth = function () {
        this.showMonth(this.currMonth, this.currYear);
    };
    /**
     * Change the starting week day based on the chosen radio button input.
     */
    Calendar.prototype.changeStarterWeekDay = function (weekStartDay) {
        if (weekStartDay === 'Mon') {
            this.firstDayOfWeek = 1;
            this.lastDayOfWeek = 0;
        }
        else {
            this.firstDayOfWeek = 0;
            this.lastDayOfWeek = 6;
        }
        this.showMonth(this.currMonth, this.currYear);
    };
    Calendar.prototype.showMonth = function (m, y) {
        // First day of the month week position, in the current displayed month
        var firstDayOfMonthWeekPosition = this.getFirstDayOfMonthWeekPosition(m, y);
        // Last day number of the current displayed month
        var lastDateOfMonth = new Date(y, m + 1, 0).getDate();
        // Last day number of the previous month, referred to the current displayed month
        var lastDayOfLastMonth = m === 0 ? 31 : new Date(y, m, 0).getDate();
        // HTML string that will be appended to the DOM
        var html = '';
        // Print the calendar header with month and year
        html += '<header class="current-date">';
        html += '<span class="current-month">' + this.Months[m] + ' ' + y + '</span>';
        html += '</header>';
        // Print the column head with the short names of the week days
        html += '<div class="week-days">';
        if (this.firstDayOfWeek === 1) {
            for (var _i = 0, _a = this.DaysOfWeekMonStart; _i < _a.length; _i++) {
                var dayName = _a[_i];
                html += '<div class="week-day">' + dayName + '</div>';
            }
        }
        else {
            for (var _b = 0, _c = this.DaysOfWeekSunStart; _b < _c.length; _b++) {
                var dayName = _c[_b];
                html += '<div class="week-day">' + dayName + '</div>';
            }
        }
        html += '</div>';
        // Open the weeks container
        html += '<div class="weeks">';
        // Print the day numbers
        for (var i = 1; i <= lastDateOfMonth; i++) {
            // Day of the week
            var dow = new Date(y, m, i).getDay();
            // If first day of the week, start new row
            if (dow === this.firstDayOfWeek) {
                html += '<div class="week">';
            }
            // If not first day of the week but first day of the month
            // it prints the last days from the previous month
            else if (i === 1) {
                html += '<div class="week">';
                var k = lastDayOfLastMonth - firstDayOfMonthWeekPosition + 1;
                for (var j = 0; j < firstDayOfMonthWeekPosition; j++) {
                    html += '<span class="day not-current-month">' + k + '</span>';
                    k++;
                }
            }
            var chk = new Date();
            var chkY = chk.getFullYear();
            var chkM = chk.getMonth();
            // Check and print the current day
            if (chkY === this.currYear && chkM === this.currMonth && i === this.currDay) {
                html += '<span class="day today">' + i + '</span>';
            }
            else {
                html += '<span class="day">' + i + '</span>';
            }
            // If last day of the week, close the row
            if (dow === this.lastDayOfWeek) {
                html += '</div>';
            }
            // If not last day of the week, but last day of the month
            // it prints the next few days from the next month
            else if (i === lastDateOfMonth) {
                var lastDayOfMonthPosition = this.firstDayOfWeek === 1 ? 7 : 6;
                var k = 1;
                for (dow; dow < lastDayOfMonthPosition; dow++) {
                    html += '<span class="day not-current-month">' + k + '</span>';
                    k++;
                }
            }
        }
        // Close the weeks container
        html += '</div>';
        // Write HTML into the cached div
        document.getElementById(this.divId).innerHTML = html;
    };
    /**
     * Calculate the first day of the month week position, in the current displayed month.
     * Day position changes between different chosen week starting day (Sunday or Monday).
     */
    Calendar.prototype.getFirstDayOfMonthWeekPosition = function (m, y) {
        // Case 1: "Monday" week starting day
        if (this.firstDayOfWeek === 1) {
            var weekPosition = new Date(y, m, 1).getDay() - 1;
            // If position is negative, reset week position to last week day position
            if (weekPosition === -1) {
                weekPosition = 6;
            }
            return weekPosition;
        }
        // Case 2: "Sunday" week starting day
        else {
            return new Date(y, m, 1).getDay();
        }
    };
    return Calendar;
}());
// On Window Load
window.onload = function () {
    // Start calendar
    var cal = new Calendar('calendar');
    cal.displayCurrentMonth();
    // Bind next and previous buttons
    document.getElementById('next').onclick = function () {
        cal.nextMonth();
    };
    document.getElementById('prev').onclick = function () {
        cal.previousMonth();
    };
    // Attach event listner to the Change Week start day radio buttons
    var radios = document.getElementsByName('changeWeekStart');
    radios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            cal.changeStarterWeekDay(radio.value);
        });
    });
};
