(function () {
    'use strict';

    angular.module('app').directive('srsDatepicker', function ($document, $timeout) {
        return {
            restrict: 'EA',
            scope: {
                startDate: '=',
                endDate: '=',
                format: '@',
                locale:'@',
                showPlaceholder: '@',
                showLabels: '@',
                showIcon: '@',
                fromLabel: '@',
                toLabel: '@'
            },
            link: function (scope, element, attrs) {
                var format = scope.format || 'DD-MM-YYYY';
                var locale = scope.locale || 'en';
                scope.tomorrow = moment().add(1, 'day');
                scope._showLabels = scope.showLabels === "true";
                scope._showIcon = scope.showIcon === "true";
                var _showPlaceholder = scope.showPlaceholder === "true";
                if (_showPlaceholder) {
                    scope.fromPlaceholder = scope.fromLabel;
                    scope.toPlaceholder = scope.toLabel;
                }


                var tomorrow = moment().add(1, 'day'),
                    dateFrom = moment(),
                    dateTo = moment().add(1, 'month'),
                    firstWeekDaySunday = false;

                scope.opened = false;
                scope.dayNames = [];

                scope.dateFromValue = null;
                scope.dateToValue = null;

                scope.endFieldActive = false;


                scope.$watch('startDate', function () {
                    scope.bothSelected = !!scope.startDate && !!scope.endDate;
                    if (!!scope.startDate) {
                        scope.startModel = scope.startDate.format(format);
                    }
                    else {
                        scope.startModel = null;
                    }
                });

                scope.$watch('endDate', function () {
                    scope.bothSelected = !!scope.startDate && !!scope.endDate;
                    if (!!scope.endDate)
                        scope.endModel = scope.endDate.format(format);
                    else {
                        scope.endModel = null;
                    }
                });

                moment.locale(locale);


                function _$(classOrId) {
                    return element.find(classOrId);
                }

                _$("input.checkin-field").on("keypress", function (evt) {
                    keyDownAdjuster(evt);
                });
                _$("input.checkout-field").on("keypress", function (evt) {
                    keyDownAdjuster(evt);
                });

                function keyDownAdjuster(evt) {
                    var _target = $(evt.target);
                    var _formatAddition = format.indexOf('-') > -1 ? "-" : "/";
                    if (evt.which < 48 || evt.which > 57 || _target.val().length >= 10) {
                        evt.preventDefault();
                    }
                    else {
                        $timeout(function () {
                            if (_target.val().length == 2) {
                                _target.val(_target.val() + _formatAddition);
                            } else if (_target.val().length == 5) {
                                _target.val(_target.val() + _formatAddition);
                            }
                        })
                    }
                }


                function currentFormatDate(date) {
                    return moment(date.day + ' ' + date.month + ' ' + date.year, format)
                }


                //mark date
                scope.markDate = function (d, to) {

                    var currentHoverDate,
                        currentNDate;

                    if (to) {
                        if (scope.startDate === null) {
                            return;
                        }

                        scope.daysTo.forEach(function (d) {
                            d.active = false;
                        });

                        currentHoverDate = d.date;
                        currentNDate = null;

                        scope.daysTo.forEach(function (d) {
                            currentNDate = d.date;
                            if (currentNDate <= currentHoverDate && currentNDate >= scope.startDate) {
                                d.active = true;
                            }
                        });

                        scope.daysFrom.forEach(function (d) {
                            currentNDate = d.date;
                            d.active = (currentNDate <= currentHoverDate && currentNDate >= scope.startDate);
                        });


                    } else {
                        if (scope.endDate === null) {
                            return;
                        }

                        scope.daysFrom.forEach(function (d) {
                            d.active = false;
                        });

                        currentHoverDate = d.date;
                        currentNDate = null;

                        scope.daysFrom.forEach(function (d) {
                            currentNDate = d.date;
                            if (currentNDate >= currentHoverDate && currentNDate <= scope.endDate) {
                                d.active = true;
                            }
                        });

                        // mark to dates
                        scope.daysTo.forEach(function (d) {
                            currentNDate = d.date;
                            d.active = (currentNDate >= currentHoverDate && currentNDate <= scope.endDate);
                        });

                    }
                };


                var emptyItemCount = function (day) {
                    if (day == 0)
                        return -5;
                    else
                        return 2 - day;
                };


                var generateCalendar = function () {
                    var _currentDate;
                    var lastDayOfMonthFrom = dateFrom.endOf('month').date(),
                        monthFrom = dateFrom.month(),
                        yearFrom = dateFrom.year(),
                        nFrom = emptyItemCount(dateFrom.startOf('month').get('day')),
                        i;

                    var lastDayOfMonthTo = dateTo.endOf('month').date(),
                        monthTo = dateTo.month(),
                        yearTo = dateTo.year(),
                        nTo = emptyItemCount(dateTo.startOf('month').get('day'));

                    scope.daysTo = [];
                    scope.dateToValue = dateTo.format('MMMM YYYY');
                    for (i = nTo; i <= lastDayOfMonthTo; i++) {

                        if (i > 0) {
                            _currentDate = currentFormatDate({ day: i, month: monthTo + 1, year: yearTo });
                            scope.daysTo.push({
                                day: i,
                                date: _currentDate,
                                enabled: _currentDate >= moment().add(-1, 'day')
                            });
                        } else {
                            scope.daysTo.push({
                                day: null,
                                enabled: false
                            });
                        }
                    }

                    scope.daysFrom = [];
                    scope.dateFromValue = dateFrom.format('MMMM YYYY');
                    for (i = nFrom; i <= lastDayOfMonthFrom; i += 1) {
                        if (i > 0) {
                            _currentDate = currentFormatDate({ day: i, month: monthFrom + 1, year: yearFrom });
                            scope.daysFrom.push({
                                day: i,
                                date: _currentDate,
                                enabled: _currentDate >= moment().add(-1, 'day')
                            });
                        } else {
                            scope.daysFrom.push({
                                day: null,
                                enabled: false
                            });
                        }
                    }
                };

                //generate week days name's for calendars
                var generateDayNames = function () {
                    var _date = firstWeekDaySunday === true ? moment('2015-06-07') : moment('2015-06-01');
                    for (var i = 0; i < 7; i += 1) {
                        scope.dayNames.push(_date.format('dd'));
                        _date.add('1', 'd');
                    }
                };

                generateDayNames();
                generateCalendar();


                scope.open = function (ev, isTo) {
                    scope.endFieldActive = isTo;
                    scope.opened = true;
                    ev.preventDefault();
                    if (ev.target.tagName.toLowerCase() == "input") {
                        $(ev.target).addClass('active-field');
                    }
                    else {
                        $(ev.target).parent().siblings('input:text').addClass('active-field');
                    }
                };

                scope.close = function () {
                    scope.opened = false;
                };

                scope.prevMonth = function () {
                    dateFrom.subtract(1, 'M');
                    dateTo.subtract(1, 'M');
                    generateCalendar();
                };

                scope.nextMonth = function () {
                    dateTo.add(1, 'M');
                    dateFrom.add(1, 'M');
                    generateCalendar();
                };


                scope.setCheckIn = function () {
                    if (scope.startModel || scope.startDate) {
                        if (moment(scope.startModel, format, true).isValid()) {
                            scope.startModel = moment(scope.startModel, format) >= tomorrow ? scope.startModel : tomorrow.format(format);
                            scope.startDate = moment(scope.startModel, format);
                            if (scope.startDate >= scope.endDate) {
                                scope.endDate = null;
                                scope.endModel = null;
                            }
                        }
                        else {
                            if (scope.startDate) {
                                if (!scope.startModel) {
                                    scope.startDate = null;
                                }
                                else
                                    scope.startModel = scope.startDate.format(format);
                            }
                            else
                                scope.startModel = null;
                        }
                    }

                };

                scope.setCheckOut = function () {
                    if (scope.endModel || scope.endDate) {
                        if (moment(scope.endModel, format, true).isValid()) {
                            scope.endModel = moment(scope.endModel, format) >= tomorrow ? scope.endModel : tomorrow.format(format);
                            scope.endDate = moment(scope.endModel, format);
                            if (scope.endDate <= scope.startDate) {
                                scope.startDate = null;
                                scope.endFieldActive = false;
                                _$('input.checkin-field').focus();
                            }
                        }
                        else {
                            if (scope.endDate) {
                                if (!scope.endModel) {
                                    scope.endDate = null;
                                }
                                else
                                    scope.endModel = scope.endDate.format(format);
                            }
                            else
                                scope.endModel = null;
                        }
                    }
                };

                scope.isEndDay = function (day) {
                    return !!scope.endDate && !!day.date && day.date.format(format) == scope.endDate.format(format);
                };

                scope.isStartDay = function (day) {
                    return !!scope.startDate && !!day.date && day.date.format(format) == scope.startDate.format(format);
                };


                scope.selectDate = function (event, d) {

                    if (!scope.endFieldActive) {
                        scope.startDate = d.date;
                        scope.endFieldActive = true;

                        if (scope.endDate) {
                            if (scope.endDate <= scope.startDate) {
                                scope.endDate = null;
                                _$('input.checkout-field').focus();
                            }
                        }
                        else {
                            _$('input.checkout-field').focus();
                        }

                    }
                    else {
                        scope.endDate = d.date;
                        if (scope.startDate) {
                            if (scope.endDate <= scope.startDate) {
                                scope.startDate = null;
                                scope.endFieldActive = false;
                                _$('input.checkin-field').focus();
                            }
                        }
                        else {
                            scope.startDate = moment().add(1, 'day');
                            _$('input.checkin-field').focus();
                            scope.endFieldActive = false;
                        }
                    }

                    if (!!scope.startDate && !!scope.endDate) {
                        scope.close();
                    }
                };

                $document.on('click', function (event) {
                    var isClickedElementChildOfElement = element
                            .find(event.target)
                            .length > 0;

                    if (isClickedElementChildOfElement)
                        return;

                    scope.close();
                    scope.$apply();
                });

                $('div.srs-daterangepicker').on('mouseleave', function () {
                    _$('span.day.active').removeClass('active');
                });

            },
            templateUrl: 'srs.datepicker.html'
        };
    });

})();
