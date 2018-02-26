var ion = (function () {

    //var _global;
    //工具函数
    //配置合并
    function extend(def, opt, override) {
        for (var k in opt) {
            if (opt.hasOwnProperty(k) && (!def.hasOwnProperty(k) || override)) {
                def[k] = opt[k];
            }
        }
        return def;
    }

    //日期格式化
    function formartDate(y, m, d, symbol) {
        symbol = symbol || '-';
        m = (m.toString())[1] ? m : '0' + m;
        d = (d.toString())[1] ? d : '0' + d;
        return y + symbol + m + symbol + d;
    }

    function Schedule(opt) {
        var def = {};
        var opt = extend(def, opt, true);

        var curDate = opt.date ? new Date(opt.date) : new Date();
        var year = curDate.getFullYear();
        var month = curDate.getMonth();
        var day = curDate.getDate();
        var currentYear = curDate.getFullYear();
        var currentMonth = curDate.getMonth();
        var currentDay = curDate.getDate();

        var selectedDate = '';
        var el = document.querySelector(opt.el) || document.querySelector('body');
        var _this = this;

        var bindEvent = function () {
            el.addEventListener('click', function (e) {
                switch (e.target.id) {
                    case 'nextMonth':
                        _this.nextMonthFun();
                        break;
                    case 'nextYear':
                        _this.nextYearFun();
                        break;
                    case 'prevMonth':
                        _this.prevMonthFun();
                        break;
                    case 'prevYear':
                        _this.prevYearFun();
                        break;
                    default:
                        break;
                }
                if (e.target.className.indexOf('ion-currdate') > -1) {
                    opt.clickCb && opt.clickCb(year, month + 1, e.target.innerHTML);
                    selectedDate = e.target.title;
                    day = e.target.innerHTML;
                    render();
                }
            }, false);
        };
        var init = function () {
            var scheduleHd = '<div class="ion-picker">' +
                '<div>' +
                '<span class="ion-arrow icon iconfont icon-116leftarrowheads" id="prevYear" ></span>' +
                '<span class="ion-arrow icon iconfont icon-112leftarrowhead" id="prevMonth"></span>' +
                '</div>' +
                '<div class="today">' + formartDate(year, month + 1, day, '-') + '</div>' +
                '<div>' +
                '<span class="ion-arrow icon iconfont icon-111arrowheadright" id="nextMonth"></span>' +
                '<span class="ion-arrow icon iconfont icon-115rightarrowheads" id="nextYear"></span>' +
                '</div>' +
                '</div>';
            var scheduleWeek = '<ul class="ion-week">' +
                '<li>日</li>' +
                '<li>一</li>' +
                '<li>二</li>' +
                '<li>三</li>' +
                '<li>四</li>' +
                '<li>五</li>' +
                '<li>六</li>' +
                '</ul>';
            var scheduleBd = '<ul class="ion-day ion-week" ></ul>';
            el.innerHTML = scheduleHd + scheduleWeek + scheduleBd;
            bindEvent();
            render();
        };
        var render = function () {
            var fullDay = new Date(year, month + 1, 0).getDate(); //当月总天数
            var startWeek = new Date(year, month, 1).getDay(); //当月第一天是周几
            var total = (fullDay + startWeek) % 7 == 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7);//元素总个数
            var lastMonthDay = new Date(year, month, 0).getDate(); //上月最后一天
            var eleTemp = [];
            for (var i = 0; i < total; i++) {
                if (i < startWeek) {
                    eleTemp.push('<li class="ion-elmon"><span class="ion-styday">' + (lastMonthDay - startWeek + 1 + i) + '</span></li>');
                } else if (i < (startWeek + fullDay)) {
                    var nowDate = formartDate(year, month + 1, (i + 1 - startWeek), '-');
                    var addClass = '';
                    selectedDate == nowDate && (addClass = 'ion-selected');
                    formartDate(currentYear, currentMonth + 1, currentDay, '-') == nowDate && (addClass = 'ion-flag');
                    eleTemp.push('<li class="ion-currmon" ><span title=' + nowDate + ' class="ion-currdate ion-styday ' + addClass + '">' + (i + 1 - startWeek) + '</span></li>');
                } else {
                    eleTemp.push('<li class="ion-elmon"><span class="ion-styday">' + (i + 1 - (startWeek + fullDay)) + '</span></li>')
                }
            }
            el.querySelector('.ion-day').innerHTML = eleTemp.join('');
            el.querySelector('.today').innerHTML = formartDate(year, month + 1, day, '-');
        };
        this.nextMonthFun = function () {
            if (month + 1 > 11) {
                year += 1;
                month = 0;
            } else {
                month += 1;
            }
            render();
            opt.nextMonthCb && opt.nextMonthCb(year, month + 1, day);
        },
		this.nextYearFun = function () {
			year += 1;
			render();
			opt.nextYeayCb && opt.nextYeayCb(year, month + 1, day);
		},
		this.prevMonthFun = function () {
			if (month - 1 < 0) {
				year -= 1;
				month = 11;
			} else {
				month -= 1;
			}
			render();
			opt.prevMonthCb && opt.prevMonthCb(year, month + 1, day);
		},
		this.prevYearFun = function () {
			year -= 1;
			render();
			opt.prevYearCb && opt.prevYearCb(year, month + 1, day);
		}
        init();
    }

    //将插件暴露给全局对象
    // _global = (function () {
    //     return this || (0, eval)('this')
    // }());
    // if (typeof module !== 'undefined' && module.exports) {
    //     module.exports = Schedule;
    // } else if (typeof define === "function" && define.amd) {
    //     define(function () {
    //         return Schedule;
    //     })
    // } else {
    //     !('Schedule' in _global) && (_global.Schedule = Schedule);
	// }
	
	return {
		datePicker: Schedule
	};

})();