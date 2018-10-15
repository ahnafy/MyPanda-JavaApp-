import {AfterViewInit, Component, OnInit} from '@angular/core';
import {SummaryListService} from './summary-list.service';
import {Summary} from './summary';
import {Observable} from 'rxjs/Observable';
import {MatDialog} from '@angular/material';
import * as Chart from 'chart.js';
import {AppService} from "../app.service";
import {Router} from "@angular/router";
import {HttpClient} from '@angular/common/http';
import {ShowSummaryListComponent} from "./show/show-summary-list.component";

@Component({
    selector: 'app-summary-list-component',
    templateUrl: 'summary-list.component.html',
    styleUrls: ['./summary-list.component.scss'],
    providers: [AppService, HttpClient]
})

export class SummaryListComponent implements AfterViewInit, OnInit {

    public displayedColumns = ["emotion", "intensity", "date", "description"];

    public summariesPerPage = 10;
    public currentPage = 1;
    public lastPage = 0;
    public firstPage = 1;

    startDate;
    endDate;
    getDate;

    ctx: any;
    Canvas: any;
    Chart: any;

    limitedPast: boolean = true;
    colorblindMode: boolean = false;
    graphMode = 'bar';
    happyColor: string;
    sadColor: string;
    mehColor: string;
    madColor: string;
    anxiousColor: string;

    nowStamp = new Date(Date.now());
    nowUnix = this.nowStamp.getTime();
    nowDay = this.nowStamp.getDay();
    nowHour = this.nowStamp.getUTCHours();
    nowDate = this.nowStamp.getDate();
    nowMonth = this.nowStamp.getMonth();


    lastWeekUnix = this.nowUnix - 604800000;
    lastWeekStamp = new Date(this.lastWeekUnix);
    lastDayUnix = this.nowUnix - 86400000;
    lastDayStamp = new Date(this.lastDayUnix);
    lastMonthUnix = this.nowUnix - 2628000000;
    lastMonthStamp = new Date(this.lastMonthUnix);
    lastMonth = this.lastMonthStamp.getMonth();
    lastYearUnix = this.nowUnix - 31540000000;
    lastYearStamp = new Date(this.lastYearUnix);


    /** --------------------------------------- **/
    timeZone: number = -5;
    // timeZone offsets the hour from UTC.
    // Everything is passed around as UTC.
    // This changes it to CDT for display.
    // Can be decided by selector, if desired.
    /** --------------------------------------- **/


    /** Initializing these results in them being over-written before first build,
     ** giving an empty graph on page load. **/
    public summaries: Summary[];
    public filteredSummaries: Summary[];
    public dateFilteredSummaries: Summary[];
    public pastWeekSummaries: Summary[];
    public pastDaySummaries: Summary[];
    public pastMonthSummaries: Summary[];
    public pastYearSummaries: Summary[];


    public summaryEmotion: string;
    public summaryIntensity: string;
    public inputType = "week";


    private highlightedID: { '$oid': string } = {'$oid': ''};

    // Inject the SummaryListService into this component.
    constructor(public summaryListService: SummaryListService,
                public dialog: MatDialog,
                public appService: AppService,
                private router: Router) {

    }

    isHighlighted(summary: Summary): boolean {
        return summary._id['$oid'] === this.highlightedID['$oid'];
    }

    public clearDateFilter() {
        this.startDate = null;
        this.endDate = null;
    }

    public toggleCB() {
        if (this.colorblindMode) {
            this.colorblindMode = false;
        }
        else {
            this.colorblindMode = true;
        }
    }

    // Filters summaries by date, keeping ones between start and end date.
    // Used by filterSummaries() and pastXEmotions()
    public filterDates(givenlist, searchStartDate: any, searchEndDate: any): Summary[] {
        this.dateFilteredSummaries = givenlist;

        // Filter by startDate
        if (searchStartDate != null) {

            this.dateFilteredSummaries = this.dateFilteredSummaries.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate >= searchStartDate;
            });
        }

        // Filter by endDate
        if (searchEndDate != null) {

            this.dateFilteredSummaries = this.dateFilteredSummaries.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate <= searchEndDate;
            });
        }
        return this.dateFilteredSummaries;
    }

    // Each pastXEmotions uses filterDates() to grab summaries dated within the past X.
    public pastWeekEmotions(givenSummaries): Summary[] {
        this.pastWeekSummaries = this.filterDates(givenSummaries, this.lastWeekStamp, this.nowStamp);
        return this.pastWeekSummaries;
    }

    public pastDayEmotions(givenSummaries): Summary[] {
        this.pastDaySummaries = this.filterDates(givenSummaries, this.lastDayStamp, this.nowStamp);
        return this.pastDaySummaries;
    }

    public pastYearEmotions(givenSummaries): Summary[] {
        this.pastYearSummaries = this.filterDates(givenSummaries, this.lastYearStamp, this.nowStamp);
        return this.pastYearSummaries;
    }

    public pastMonthEmotions(givenSummaries): Summary[] {
        this.pastMonthSummaries = this.filterDates(givenSummaries, this.lastMonthStamp, this.nowStamp);
        return this.pastMonthSummaries;
    }

    // Filters Summaries, keeping ones that match the given emotion, intensity, and time period.
    // Uses filterDates() to get summaries dated between start and end date.
    public filterSummaries(searchEmotion: string, searchIntensity: string, searchStartDate: any, searchEndDate: any): Summary[] {

        this.filteredSummaries = this.summaries;

        // Filter by Emotion
        if (searchEmotion != null && searchEmotion !== "All") {
            searchEmotion = searchEmotion.toLocaleLowerCase();
            this.filteredSummaries = this.filteredSummaries.filter(summary => {
                return !searchEmotion || summary.emotion.toLowerCase().indexOf(searchEmotion) !== -1;
            });
        }


        // Filter by Intensity
        if (searchIntensity != null && searchIntensity !== "All") {
            this.filteredSummaries = this.filteredSummaries.filter(summary => {
                return !searchIntensity || searchIntensity == summary.intensity.toString();
            });

        }

        this.filteredSummaries = this.filterDates(this.filteredSummaries, searchStartDate, searchEndDate);

        this.showSummaries();
        return this.filteredSummaries;
    }

    // Filters summaries by where they should appear on the chart.
    // Uses var filteredSummaries from filterSummaries() to allow prefiltering using options at top of HTML
    // xValue can represent hour, weekday, date, or month.
    filterGraph(xValue, Searchemotion): number {
        Searchemotion = Searchemotion.toLocaleLowerCase();
        let filterData = this.summaries.filter(summary => {
            return !Searchemotion || summary.emotion.toLowerCase().indexOf(Searchemotion) !== -1;
        });

        if (this.inputType == "week") {
            if (this.limitedPast) {
                filterData = this.pastWeekEmotions(filterData);
            }
            filterData = filterData.filter(summary => {
                this.getDate = new Date(summary.date);
                return this.getDate.getDay() == xValue;
            });
        }
        else {
            if (this.inputType == "day") {
                if (this.limitedPast) {
                    filterData = this.pastDayEmotions(filterData);
                }
                filterData = filterData.filter(summary => {
                    this.getDate = new Date(summary.date);
                    return this.getDate.getUTCHours() == xValue;
                });
            }
            else {
                if (this.inputType == "year") {
                    if (this.limitedPast) {
                        filterData = this.pastYearEmotions(filterData);
                    }
                    filterData = filterData.filter(summary => {
                        this.getDate = new Date(summary.date);
                        return this.getDate.getMonth() == xValue;
                    });
                }
                else {
                    if (this.inputType == "month") {
                        if (this.limitedPast) {
                            filterData = this.pastMonthEmotions(filterData);
                        }
                        filterData = filterData.filter(summary => {
                            this.getDate = new Date(summary.date);
                            return this.getDate.getDate() == xValue;
                        });
                    }
                }
            }
        }

        return filterData.length;
    }

    // modX takes an X and returns an integer describing where it should
    // be placed on the graph based on the current X, nowX.
    public modDay(day: number): Number {
        if (this.limitedPast) {
            return (this.nowDay + 1 + day) % 7;
        }
        else {
            return day;
        }
    }

    public modHour(hour: number): Number {
        if (this.limitedPast) {
            return (this.nowHour + 1 + hour) % 24;
        }
        else {
            return (hour - this.timeZone) % 24;
        }
    }

    public modDate(date: number): Number {
        if (this.limitedPast) {
            return (this.nowDate + date - 1) % 31 + 1;
        }
        else {
            return date;
        }
    }

    public modMonth(month: number): Number {
        if (this.limitedPast) {
            return (this.nowMonth + 1 + month) % 12;
        }
        else {
            return month;
        }
    }

    // getPastXs gets labels for bottom axis of chart based on current X.
    public getPastDays(xValue: number): String {

        let thisDay = (this.nowDay + 1 + xValue) % 7;

        let strDay = '';

        if (thisDay == 0) {
            strDay = 'Sun';
        }
        if (thisDay == 1) {
            strDay = 'Mon';
        }
        if (thisDay == 2) {
            strDay = 'Tues';
        }
        if (thisDay == 3) {
            strDay = 'Wed';
        }
        if (thisDay == 4) {
            strDay = 'Thurs';
        }
        if (thisDay == 5) {
            strDay = 'Fri';
        }
        if (thisDay == 6) {
            strDay = 'Sat';
        }
        return strDay;
    }

    public getPastHours(xValue: number): String {

        let thisHour = (this.nowHour + 1 + xValue + this.timeZone) % 24;

        let strHour = '';
        let timeSuffix = '';

        if (thisHour < 12) {
            strHour = thisHour.toString();
            timeSuffix = ' AM';
        } else {
            strHour = (thisHour % 12).toString();
            timeSuffix = ' PM';
        }
        if (strHour == '0') {
            strHour = '12';
        }

        return strHour + timeSuffix;
    }

    public getPastMonths(xValue: number): String {
        let thisMonth = (this.nowMonth + 1 + xValue) % 12;

        let strMonth = '';

        if (thisMonth == 0) {
            strMonth = 'Jan';
        }
        if (thisMonth == 1) {
            strMonth = 'Feb';
        }
        if (thisMonth == 2) {
            strMonth = 'Mar';
        }
        if (thisMonth == 3) {
            strMonth = 'Apr';
        }
        if (thisMonth == 4) {
            strMonth = 'May';
        }
        if (thisMonth == 5) {
            strMonth = 'June';
        }
        if (thisMonth == 6) {
            strMonth = 'July';
        }
        if (thisMonth == 7) {
            strMonth = 'Aug';
        }
        if (thisMonth == 8) {
            strMonth = 'Sep';
        }
        if (thisMonth == 9) {
            strMonth = 'Oct';
        }
        if (thisMonth == 10) {
            strMonth = 'Nov';
        }
        if (thisMonth == 11) {
            strMonth = 'Dec';
        }
        return strMonth;
    }


    public getPastDates(xValue: number): String {
        let thisDate = (this.nowDate + xValue) % 31;
        let numDate;
        let thisYear = this.nowStamp.getFullYear();

        //last month had 31 days or today is 31st
        if (this.lastMonth == 0 ||
            this.lastMonth == 2 ||
            this.lastMonth == 4 ||
            this.lastMonth == 6 ||
            this.lastMonth == 7 ||
            this.lastMonth == 9 ||
            this.lastMonth == 11 ||
            this.nowDate == 30) {
            numDate = thisDate + 1;
        }
        else {
            //last month had 30 days
            if (this.lastMonth == 3 ||
                this.lastMonth == 5 ||
                this.lastMonth == 8 ||
                this.lastMonth == 10) {
                numDate = thisDate;
            }
            else {
                //last month has 29 days, leap year
                if (((thisYear % 4 == 0) && (thisYear % 100) !== 0) || (thisYear % 400) == 0) {
                    numDate = thisDate - 1;
                }
                else {
                    //last month has 28 days
                    numDate = thisDate - 2;
                }
            }
        }
        if (numDate <= 0) {
            numDate = numDate + 31;
        }
        return numDate.toString();
    }

    // Returns data required by updateChart().
    public getTypeData(type, emotion) {
        if (type == "week") {
            return [
                this.filterGraph(this.modDay(0), emotion),
                this.filterGraph(this.modDay(1), emotion),
                this.filterGraph(this.modDay(2), emotion),
                this.filterGraph(this.modDay(3), emotion),
                this.filterGraph(this.modDay(4), emotion),
                this.filterGraph(this.modDay(5), emotion),
                this.filterGraph(this.modDay(6), emotion)
            ]
        }
        else {
            if (type == "day") {
                return [
                    this.filterGraph(this.modHour(0), emotion),
                    this.filterGraph(this.modHour(1), emotion),
                    this.filterGraph(this.modHour(2), emotion),
                    this.filterGraph(this.modHour(3), emotion),
                    this.filterGraph(this.modHour(4), emotion),
                    this.filterGraph(this.modHour(5), emotion),
                    this.filterGraph(this.modHour(6), emotion),
                    this.filterGraph(this.modHour(7), emotion),
                    this.filterGraph(this.modHour(8), emotion),
                    this.filterGraph(this.modHour(9), emotion),
                    this.filterGraph(this.modHour(10), emotion),
                    this.filterGraph(this.modHour(11), emotion),
                    this.filterGraph(this.modHour(12), emotion),
                    this.filterGraph(this.modHour(13), emotion),
                    this.filterGraph(this.modHour(14), emotion),
                    this.filterGraph(this.modHour(15), emotion),
                    this.filterGraph(this.modHour(16), emotion),
                    this.filterGraph(this.modHour(17), emotion),
                    this.filterGraph(this.modHour(18), emotion),
                    this.filterGraph(this.modHour(19), emotion),
                    this.filterGraph(this.modHour(20), emotion),
                    this.filterGraph(this.modHour(21), emotion),
                    this.filterGraph(this.modHour(22), emotion),
                    this.filterGraph(this.modHour(23), emotion)
                ]
            }
            else {
                if (type == "year") {
                    return [
                        this.filterGraph(this.modMonth(0), emotion),
                        this.filterGraph(this.modMonth(1), emotion),
                        this.filterGraph(this.modMonth(2), emotion),
                        this.filterGraph(this.modMonth(3), emotion),
                        this.filterGraph(this.modMonth(4), emotion),
                        this.filterGraph(this.modMonth(5), emotion),
                        this.filterGraph(this.modMonth(6), emotion),
                        this.filterGraph(this.modMonth(7), emotion),
                        this.filterGraph(this.modMonth(8), emotion),
                        this.filterGraph(this.modMonth(9), emotion),
                        this.filterGraph(this.modMonth(10), emotion),
                        this.filterGraph(this.modMonth(11), emotion),
                    ]
                }
                else {
                    return [
                        this.filterGraph(this.modDate(1), emotion),
                        this.filterGraph(this.modDate(2), emotion),
                        this.filterGraph(this.modDate(3), emotion),
                        this.filterGraph(this.modDate(4), emotion),
                        this.filterGraph(this.modDate(5), emotion),
                        this.filterGraph(this.modDate(6), emotion),
                        this.filterGraph(this.modDate(7), emotion),
                        this.filterGraph(this.modDate(8), emotion),
                        this.filterGraph(this.modDate(9), emotion),
                        this.filterGraph(this.modDate(10), emotion),
                        this.filterGraph(this.modDate(11), emotion),
                        this.filterGraph(this.modDate(12), emotion),
                        this.filterGraph(this.modDate(13), emotion),
                        this.filterGraph(this.modDate(14), emotion),
                        this.filterGraph(this.modDate(15), emotion),
                        this.filterGraph(this.modDate(16), emotion),
                        this.filterGraph(this.modDate(17), emotion),
                        this.filterGraph(this.modDate(18), emotion),
                        this.filterGraph(this.modDate(19), emotion),
                        this.filterGraph(this.modDate(20), emotion),
                        this.filterGraph(this.modDate(21), emotion),
                        this.filterGraph(this.modDate(22), emotion),
                        this.filterGraph(this.modDate(23), emotion),
                        this.filterGraph(this.modDate(24), emotion),
                        this.filterGraph(this.modDate(25), emotion),
                        this.filterGraph(this.modDate(26), emotion),
                        this.filterGraph(this.modDate(27), emotion),
                        this.filterGraph(this.modDate(28), emotion),
                        this.filterGraph(this.modDate(29), emotion),
                        this.filterGraph(this.modDate(30), emotion),
                        this.filterGraph(this.modDate(31), emotion)
                    ]
                }
            }
        }
    }


    // vars pastX use getPastXs to assign correct labels to bottom axis of graph
    public pastDays = [
        this.getPastDays(0),
        this.getPastDays(1),
        this.getPastDays(2),
        this.getPastDays(3),
        this.getPastDays(4),
        this.getPastDays(5),
        this.getPastDays(6)
    ];

    public pastHours = [
        this.getPastHours(0),
        this.getPastHours(1),
        this.getPastHours(2),
        this.getPastHours(3),
        this.getPastHours(4),
        this.getPastHours(5),
        this.getPastHours(6),
        this.getPastHours(7),
        this.getPastHours(8),
        this.getPastHours(9),
        this.getPastHours(10),
        this.getPastHours(11),
        this.getPastHours(12),
        this.getPastHours(13),
        this.getPastHours(14),
        this.getPastHours(15),
        this.getPastHours(16),
        this.getPastHours(17),
        this.getPastHours(18),
        this.getPastHours(19),
        this.getPastHours(20),
        this.getPastHours(21),
        this.getPastHours(22),
        this.getPastHours(23)
    ];

    public pastMonths = [
        this.getPastMonths(0),
        this.getPastMonths(1),
        this.getPastMonths(2),
        this.getPastMonths(3),
        this.getPastMonths(4),
        this.getPastMonths(5),
        this.getPastMonths(6),
        this.getPastMonths(7),
        this.getPastMonths(8),
        this.getPastMonths(9),
        this.getPastMonths(10),
        this.getPastMonths(11)
    ];

    public pastDates = [
        this.getPastDates(0),
        this.getPastDates(1),
        this.getPastDates(2),
        this.getPastDates(3),
        this.getPastDates(4),
        this.getPastDates(5),
        this.getPastDates(6),
        this.getPastDates(7),
        this.getPastDates(8),
        this.getPastDates(9),
        this.getPastDates(10),
        this.getPastDates(11),
        this.getPastDates(12),
        this.getPastDates(13),
        this.getPastDates(14),
        this.getPastDates(15),
        this.getPastDates(16),
        this.getPastDates(17),
        this.getPastDates(18),
        this.getPastDates(19),
        this.getPastDates(20),
        this.getPastDates(21),
        this.getPastDates(22),
        this.getPastDates(23),
        this.getPastDates(24),
        this.getPastDates(25),
        this.getPastDates(26),
        this.getPastDates(27),
        this.getPastDates(28),
        this.getPastDates(29),
        this.getPastDates(30)
    ];

    // destroys previous chart if it exists and replaces it with an updated version
    updateChart(): void {

        if (this.Chart != null) {
            this.Chart.destroy();
        }

        let stackBool = false;

        if (this.graphMode == 'bar') {
            stackBool = true;
        }


        this.Canvas = document.getElementById("Chart");
        this.ctx = this.Canvas;

        if (this.colorblindMode) {
            this.happyColor = "rgb(178,24,43)";
            this.sadColor = "rgb(239,138,98)";
            this.mehColor = "rgb(254,224,144)";
            //this.mehColor = "rgb(253,219,199)";
            this.madColor = "rgb(103,169,207)";
            this.anxiousColor = "rgb(33,102,172)";
            this.ctx.style.backgroundColor = "rgb(224,243,248)";
        } else {
            this.happyColor = "rgb(64,255,0)";
            this.sadColor = "rgb(0,128,255)";
            this.mehColor = "rgb(100,100,100)";
            this.madColor = "rgb(255,0,0)";
            this.anxiousColor = "rgb(255,128,0)";
            this.ctx.style.backgroundColor = "rgb(250,250,250)";
        }

        let xLabel;
        let days;
        let hours;
        let months;
        let dates;

        if (this.limitedPast) {
            days = this.pastDays;
            hours = this.pastHours;
            months = this.pastMonths;
            dates = this.pastDates;
        }
        else {
            days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
            hours = [
                '12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM',
                '6 AM', '7 AM', '8AM', '9 AM', '10 AM', '11 AM',
                '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
                '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM'];
            months = [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
                'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            dates = [
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
                '12', '13', '14', '15', '16', '17', '18', '19', '20', '21',
                '22', '23', '24', '25', '26', '27', '28', '29', '30', '31',];
        }

        console.log(this.inputType);
        if (this.inputType == "day") {
            xLabel = hours;
        }
        else {
            if (this.inputType == "week") {
                xLabel = days;
            }
            else {
                if (this.inputType == "year") {
                    xLabel = months;
                }
                else {
                    xLabel = dates
                }
            }
        }

        this.Chart = new Chart(this.ctx, {
            type: this.graphMode,
            data: {
                labels: xLabel,
                datasets: [
                    {
                        "label": "Happy",
                        "data": this.getTypeData(this.inputType, 'happy'),
                        hidden: false,
                        "fill": false,
                        "borderColor": this.happyColor,
                        "lineTension": 0.2,
                        "backgroundColor": this.happyColor,
                    },
                    {
                        "label": "Sad",
                        "data": this.getTypeData(this.inputType, 'sad'),
                        hidden: false,
                        "fill": false,
                        "borderColor": this.sadColor,
                        "lineTension": 0.2,
                        "backgroundColor": this.sadColor,
                    },
                    {
                        "label": "Meh",
                        "data": this.getTypeData(this.inputType, 'meh'),
                        hidden: false,
                        "fill": false,
                        "borderColor": this.mehColor,
                        "lineTension": 0.2,
                        "backgroundColor": this.mehColor,
                    },
                    {
                        "label": "Mad",
                        "data": this.getTypeData(this.inputType, 'mad'),
                        hidden: false,
                        "fill": false,
                        "borderColor": this.madColor,
                        "lineTension": 0.2,
                        "backgroundColor": this.madColor,
                    },
                    {
                        "label": "Anxious",
                        "data": this.getTypeData(this.inputType, 'anxious'),
                        hidden: false,
                        "fill": false,
                        "borderColor": this.anxiousColor,
                        "lineTension": 0.2,
                        "backgroundColor": this.anxiousColor,
                    }
                ]
            },
            options: {
                scales: {
                    xAxes: [{stacked: stackBool}],
                    yAxes: [{
                        stacked: stackBool,
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    // Used by list view in HTML
    stringToDate(date: string): any {
        return new Date(date);
    }

    // Used to show total number of summaries shown by chart in HTML
    numberEmotions(): number {
        if (this.limitedPast) {
            if (this.inputType == 'day') {
                return this.pastDayEmotions(this.summaries).length
            } else {
                if (this.inputType == 'week') {
                    return this.pastWeekEmotions(this.summaries).length
                } else {
                    if (this.inputType == 'month') {
                        return this.pastMonthEmotions(this.summaries).length
                    } else {
                        return this.pastYearEmotions(this.summaries).length
                    }
                }
            }
        }
        else {
            return this.summaries.length;
        }
    }

    totalNumberEmotions(): number {
        return this.filteredSummaries.length
    }

    pastXButtonDisplay(): string {
        return 'Past ' + this.inputType.substring(0, 1).toUpperCase() + this.inputType.substring(1);
    }

    ngAfterViewInit(): void {
        this.updateChart();
    }

    /*
     * Starts an asynchronous operation to update the users list
     *
     */
    refreshSummaries(): Observable<Summary[]> {
        // Get Users returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)
        const summaryListObservable: Observable<Summary[]> = this.summaryListService.getSummaries(localStorage.getItem("userID"));
        summaryListObservable.subscribe(
            summaries => {
                this.summaries = summaries;
                this.filterSummaries(this.summaryEmotion, this.summaryIntensity, this.startDate, this.endDate);
            },
            err => {
                console.log(err);
            });
        return summaryListObservable;
    }


    loadService(): void {
        this.summaryListService.getSummaries(localStorage.getItem("userID"), this.summaryEmotion).subscribe(
            summaries => {
                this.summaries = summaries;
                this.filteredSummaries = this.summaries;
            },
            err => {
                console.log(err);
            }
        );
    }

    ngOnInit(): void {
        //For testing
        //toggle the value in app service to toggle testing
        this.appService.testingToggle();

        // Route consumer to home page if isSignedIn status is false
        if (!this.appService.isSignedIn()) {
            this.router.navigate(['']);
        }
        this.loadService();
        this.refreshSummaries();
    }

    showAllDescription(description: string): void {
        const showSummary: Summary = {
            _id: null,
            userID: null,
            emotion: null,
            intensity: null,
            date: null,
            description: description
        };
        const dialogRef = this.dialog.open(ShowSummaryListComponent, {
            width: '500px',
            data: {summary: showSummary}
        });
        console.log("Showing summary description.");
    }

    showSummaries() {
        let count = this.currentPage * this.summariesPerPage;
        this.filteredSummaries = this.filteredSummaries.filter(summary => {
            if (count > this.summariesPerPage) {
                count--;
                return false;
            }
            if (count <= this.summariesPerPage && count != 0) {
                count--;
                return true;
            }
        });
    }

    maxNumPages(): boolean {
        if (this.filteredSummaries !== undefined) {
            return (this.summariesPerPage * this.currentPage) < this.summaries.length;
        }
        return false;
    }

    goLastPage() {
        let test = this.summaries.length / this.summariesPerPage;
        this.lastPage = Math.ceil(test);
        this.currentPage = this.lastPage;
    }

    goFirstPage() {
        this.currentPage = this.firstPage;
    }

    totalEntries() {
        return this.summaries.length;
    }
}
