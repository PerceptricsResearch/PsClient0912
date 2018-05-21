/// <reference path="linq-vsdoc.js" />
/// <reference path="jquery-1.7.2-vsdoc.js" />

(function (prweb, $) {

    $.widget('prweb.realize', {

        options: {
            dashboard: null,
            domains: null,
            components: null,
            isDisposed: false,
            id: 0
        },

        xevent: "click.realize",


        _create: function () {
            var myclass = "realize";
            try {
                if (prweb.IsTouch) {
                    this.xevent = "tap.realize";
                }
                this._axisManager.svg = $("#realizechartsvg")[0];
                this._populaterealizeXeventBindings();
                this._populaterealizeDerivedBindings();
                this._populateRenticleHandlers();
                this._populateAxisHandlers();
            }
            catch (ex) {
                alert("prwebmetrics.realize.create reports " + ex.Message);
            }
            return;
        },

        _axisManager: {
            svg: false,
            toPointXY: function (elemctm, x, y) {
                var rslt = false;
                try {
                    //                    var ctm = e.srcElement.getScreenCTM();
                    //                    var svg = e.srcElement.ownerSVGElement;
                    var pt = this.svg.createSVGPoint();
                    pt.x = x; // e.clientX;
                    pt.y = y; // e.clientY;
                    //                    var b = ctm.inverse();
                    //                    $("#renticleholder").append("<div>got to pt x=" + pt.x + " x" + x + " y=" + pt.y + " y" + y + "</div>");
                    var svgpt = pt.matrixTransform(elemctm.inverse());
                    //                    $("#renticleholder").append("<div>svgpt.x=" + svgpt.x + " svgpt.y=" + svgpt.y + "</div>");
                    rslt = svgpt;

                }
                catch (ex) {
                    alert("prwebmetrics.realize.axisManager.toPointXY reports " + ex.Message);
                }

                return rslt;
            },
            xScale: {
                displayMax: 500,
                displayMin: 0,
                increment: function () {
                    return (this.displayMax - this.displayMin) / 10;
                },
                spacing: 100
            },
            yScale: {
                displayMax: 50000,
                displayMin: 0,

                increment: function () {
                    return (this.displayMax - this.displayMin) / 10000;
                },
                spacing: 100
            },
            displayRange: function () {
                return {
                    max: this.yScale.displayMax * this.xScale.displayMax,
                    min: this.yScale.displayMin * this.xScale.displayMin,
                    other: 0
                };
            },
            scaledcost: function () {
                var rslt = 1000;
                try {
                    //return a value between 1,000 and 501,000...the bezier graphing engine is best fit in that range...
                    var vcost = parseInt(this.cost); //this.cost());//is populated in the custombindinghandlers below....
                    var vfx = ((((vcost / this.displayRange().max) * (500000)) * 2)) + 1000;
                    rslt = Math.max(1000, vfx);
                }
                catch (ex) {
                    alert("prwebmetrics.reallize.scaledcost reports " + ex.Message);
                }
                return rslt;
            },
            cost: 0,
            totdeployable: 0,
            displayedCostatXYvalues: function (x, y) {
                //return x y value pair for displayed cost...needs to be in scaled cost coordinates
                var rslt = {
                    displayedcost: 0,
                    scaledcost: 0,
                    xvalue: 0,
                    yvalue: 0
                };
                try {

                }
                catch (ex) {
                    alert("prwebmetrics.reallize.valuesForDisplayedCost reports " + ex.Message);
                }
                return rslt;
            },
            renticleToValues: function (Xvalue, Yvalue) {
                var xcoord = this.xAxis.toCoord(Xvalue).vwptcoord;
                var xtrans = xcoord - this.xAxis.viewportMinCoord;
                var ycoord = this.yAxis.toCoord(Yvalue).vwptcoord;
                var ytrans = ycoord - this.yAxis.viewportMaxCoord;
                var tstr = "translate(" + xtrans + ", " + ytrans + ")";
                return tstr;
            },
            xaxislabels: [],
            yaxislabels: [],
            createXaxisLabels: function () {
                var rslt = [];
                try {
                    var increment = this.xScale.increment();
                    var spacing = this.xScale.spacing;
                    for (var i = 0; i < 11; i++) {
                        rslt.push({
                            value: i * increment,
                            x: 200 + (i * spacing),
                            y: 1150
                        });
                    };
                    this.xaxislabels = rslt;
                }
                catch (ex) {
                    alert("prwebmetrics.realize.computeXaxislabels reports " + ex.Message);
                }
                return this.xaxislabels;
            },
            createYaxisLabels: function () {
                var rslt = [];
                try {
                    var increment = this.yScale.increment();
                    var spacing = this.yScale.spacing;
                    for (var i = 0; i < 11; i++) {
                        rslt.push({
                            value: (i * increment) + "K",
                            x: 150,
                            y: 1200 - (i * spacing)
                        });
                    };
                    this.yaxislabels = rslt;
                }
                catch (ex) {
                    alert("prwebmetrics.realize.computeYaxislabels reports " + ex.Message);
                }
                return this.yaxislabels;
            },
            bigpsratio: function (num, den) {
                var rslt = 0;
                //                var bignum = Math.round(num * 1000);
                //                var bigden = Math.round(den * 1000);
                rslt = num / den; //bignum / bigden;
                return rslt;
            },
            squareroot: function (x) {
                var rslt = 0;
                //                var bigsqrt = Math.round(Math.sqrt(x) * 1000);
                rslt = Math.sqrt(x); //bigsqrt / 1000;
                return rslt;
            },
            minplotx: 0,
            maxplotx: 0,
            testlines: [],
            testparms: [],
            points: [],
            controlpoints: [],
            paths: [],
            parameters: [],
            Sadj: ko.observable(0),
            projectedX2adj: ko.observable(0),
            fitparm: ko.observable(0.6),
            slope: function (pt, toval) {
                if (toval == undefined) {
                    pt.slope = (pt.y / pt.x).toFixed(2) + "  y:" + pt.y.toFixed(2) + " x:" + pt.x.toFixed(2);
                }
                else {
                    var ptvy = this.yAxis.valueFromCoord(pt.y);
                    var ptvx = this.xAxis.valueFromCoord(pt.x);
                    pt.slope = "Value " + (ptvy / ptvx).toFixed(2) + "  y:" + ptvy.toFixed(2) + " x:" + ptvx.toFixed(2);
                }
                return;
            },
            addTesLine: function (x1, y1, x2, y2) {
                this.testlines.push({
                    points: x1 + ", " + y1 + " " + x2 + ", " + y2
                });
                return;
            },
            addParameter: function (nm, val) {
                this.parameters.push({
                    Name: nm,
                    Value: val
                });
            },
            addTestParm: function (nm, val, projx, projy) {
                if (projx == undefined) {
                    projx = 0;
                }
                if (projy == undefined) {
                    projy = 0;
                }
                this.testparms.push({
                    name: nm + " " + parseInt(val),
                    x: this.xAxis.viewportMaxCoord - (projx),
                    y: this.yAxis.viewportMaxCoord + (projy)
                });
                return;
            },

            fxrangecoeff: function () {
                return 1; // this.xAxis.range() / this.yAxis.range();
            },
            fx: function (x) {

                var rslt = 0;
                try {
                    //                    var bigcost = Math.round(this.cost() * 1000);
                    //                    var bigx = Math.round(x * 1000);
                    //                    var bigrslt = Math.round(bigcost / bigx);
                    rslt = (this.scaledcost() / x) * this.fxrangecoeff(); // * this.fxrangecoeff(); //bigrslt;
                }
                catch (ex) {
                    var xx = 2;
                }

                return rslt || false;
            },
            fy: function (y) {
                var rslt = 0;
                try {
                    //                    var bigcost = Math.round(this.cost() * 1000);
                    //                    var bigx = Math.round(x * 1000);
                    //                    var bigrslt = Math.round(bigcost / bigx);
                    rslt = ((this.scaledcost() * this.fxrangecoeff()) / y); // * this.fxrangecoeff(); //bigrslt;
                }
                catch (ex) {
                    var xx = 2;
                }

                return rslt || false;
            },
            xAxis: {
                range: function () {
                    var rslt = this.maxValue - this.minValue;
                    return rslt;
                },
                maxValue: 1000,
                minValue: 0,
                maxVwpt: 1000,
                minVwpt: 0,
                viewportMaxCoord: 1200,
                viewportMinCoord: 200,
                valueFromCoord: function (coordvalue) {
                    var val = 0;
                    var cval = coordvalue - this.viewportMinCoord;
                    val = (cval / this.maxVwpt) * this.maxValue;
                    return val;
                },
                toCoord: function (val) {
                    var coord = {
                        value: 0,
                        vwptcoord: 0
                    };
                    if (val > this.maxValue) {
                        alert("value: " + val + " exceeds xaxis max: " + this.maxValue + ".");
                    }
                    coord.value = ((val / this.maxValue) * this.maxVwpt);
                    coord.vwptcoord = this.viewportMinCoord + coord.value;
                    return coord;
                },
                currentposition: function (newpos) {
                    var rslt = 0
                    if (newpos !== undefined) {
                        prweb.dashboardsvc.Vmx.realizeobjects.axisxmarker.currentposition(newpos);
                        rslt = newpos;
                    }
                    else {
                        rslt = prweb.dashboardsvc.Vmx.realizeobjects.axisxmarker.currentposition();
                    }
                    return rslt;
                },
                displayvalue: 0,
                currentDisplayValue: function (pos, xscale) {
                    var rslt = 0;
                    if (pos !== undefined) {
                        var cval = pos - this.viewportMinCoord;
                        this.displayvalue = (cval / this.maxVwpt) * (xscale.displayMax - xscale.displayMin);
                        prweb.dashboardsvc.Vmx.realizeobjects.revenueobject.xdisplayvalue(this.displayvalue.toFixed(0));
                        rslt = this.displayvalue;
                    }
                    else {
                        rslt = this.displayvalue; ;
                    }
                    return rslt;
                },
                dispose: function () {
                    return;
                }
            },
            yAxis: {
                range: function () {
                    var rslt = this.maxValue - this.minValue;
                    return rslt;
                },
                maxValue: 1000,
                minValue: 0,
                maxVwpt: 1000,
                minVwpt: 0,
                viewportMaxCoord: 200,
                viewportMinCoord: 1200,
                valueFromCoord: function (coordvalue) {
                    var val = 0;
                    var cval = this.viewportMinCoord - coordvalue;
                    val = (cval / this.maxVwpt) * this.maxValue;
                    return val;
                },
                toCoord: function (val) {
                    var coord = {
                        value: 0,
                        vwptcoord: 0
                    };
                    coord.value = (val / this.maxValue) * this.maxVwpt;
                    coord.vwptcoord = this.viewportMinCoord - coord.value;
                    return coord;
                },
                currentposition: function (newpos) {
                    var rslt = 0
                    if (newpos !== undefined) {
                        prweb.dashboardsvc.Vmx.realizeobjects.axisymarker.currentposition(newpos);
                        rslt = newpos;
                    }
                    else {
                        rslt = prweb.dashboardsvc.Vmx.realizeobjects.axisymarker.currentposition();
                    }
                    return rslt;
                },
                displayvalue: 0,
                currentDisplayValue: function (pos, yscale) {
                    var rslt = 0;
                    if (pos !== undefined) {
                        var cval = this.viewportMinCoord - pos;
                        this.displayvalue = (cval / this.maxVwpt) * (yscale.displayMax - yscale.displayMin);
                        prweb.dashboardsvc.Vmx.realizeobjects.revenueobject.ydisplayvalue((this.displayvalue / 1000).toFixed(2) + "K");
                        rslt = this.displayvalue;
                    }
                    else {
                        rslt = this.displayvalue;
                    }
                    return rslt;
                },
                dispose: function () {
                    return;
                }
            },


            computePoints: function () {
                try {
                    this.minplotx = this.fy(this.yAxis.maxValue); // this.cost / this.yAxis.maxValue;
                    this.maxplotx = this.xAxis.maxValue;
                    var pi0 = {
                        x: this.xAxis.toCoord(this.minplotx).vwptcoord,
                        y: this.yAxis.toCoord(this.fx(this.minplotx)).vwptcoord,
                        slope: 0
                    };
                    var pi3 = {
                        x: this.xAxis.toCoord(this.maxplotx).vwptcoord,
                        y: this.yAxis.toCoord(this.fx(this.maxplotx)).vwptcoord,
                        slope: 0
                    };
                    this.addTesLine(pi0.x, 1150, pi0.x, 1200);
                    this.addTesLine(200, pi3.y, 250, pi3.y);
                    var xcost = this.fxrangecoeff() * this.scaledcost();
                    var valsq = this.squareroot(xcost);
                    //                    var checkvalsq = valsq * valsq == xcost;
                    var Mr = (pi3.x - pi0.x);
                    //adjust valsq for y and x axis max and min value ranges

                    var sq = this.xAxis.toCoord(this.fx(valsq)).vwptcoord - this.xAxis.toCoord(this.minplotx).vwptcoord; //this.xAxis.toCoord(this.minplotx).vwptcoord;
                    var sqpt = {
                        x: this.xAxis.toCoord(this.fx(valsq)).value,
                        y: this.yAxis.toCoord(this.fx(valsq)).value,
                        slope: 0
                    };
                    //                    this.slope(sqpt);
                    this.addTestParm("sq " + sq.toFixed(2) + " " + sqpt.slope, sq, 300, 50);

                    var sqheight = sq * this.fxrangecoeff();
                    var mrminussq = Mr - sqheight; //sq; //Mr - sq; //mr2 + sq;
                    this.addTestParm("Mr - sq length ", mrminussq, 200, 900);

                    var sqmrlength = this.squareroot(Math.pow(mrminussq, 2) + Math.pow(sqheight, 2));
                    this.addTestParm("sqmr2 length ", sqmrlength.toFixed(2), 200, 850);

                    var ps = this.squareroot((Math.pow(sqheight, 2) * 2)); //* 2)); //this is sqrt of sum of squares..
                    this.addTestParm("ps " + ps.toFixed(2), ps.toFixed(2), 300, 150);

                    var pstosqmrratio = this.bigpsratio(ps, sqmrlength); //ps / sqmrlength;
                    this.addTestParm("ps/sqmrlength " + pstosqmrratio.toFixed(2), 0, 200, 800);

                    var fxcostpart = (this.scaledcost());
                    var ratiopart = (1 / pstosqmrratio); // * this.fxrangecoeff();
                    var ratiocostresult = ratiopart * fxcostpart;
                    var magicX2 = this.squareroot(ratiocostresult) * this.fxrangecoeff();
                    this.addTestParm("magicX " + magicX2.toFixed(2), 0, 200, 0);

                    var S = magicX2 + parseInt(this.Sadj()); // Math.sqrt((Math.pow((ps), 2)) / 1)

                    magicX2 = magicX2 + parseInt(this.Sadj());
                    var XadjustedX2 = this.xAxis.viewportMinCoord + magicX2; //this.xAxis.viewportMinCoord + // this.xAxis.viewportMaxCoord - projectedX2;

                    var YadjustedY1 = this.yAxis.viewportMinCoord - magicX2; //this.yAxis.viewportMinCoord - //this.yAxis.viewportMaxCoord + projectedX2;
                    var yval = this.yAxis.valueFromCoord(YadjustedY1);
                    var pi1 = {
                        x: this.xAxis.toCoord(this.fy(yval)).vwptcoord,
                        y: YadjustedY1,
                        slope: 0
                    };
                    //                    this.slope(pi1, true);

                    var xval = this.xAxis.valueFromCoord(XadjustedX2); //is also MagicX
                    var pi2 = {
                        x: XadjustedX2,
                        y: this.yAxis.toCoord(this.fx(xval)).vwptcoord,
                        slope: 0
                    };
                    //                    this.slope(pi2, true);
                    //                    this.parameters.push({
                    //                        Name: "Cost",
                    //                        Value: this.cost
                    //                    });
                    //                    this.parameters.push({
                    //                        Name: "Sadj",
                    //                        Value: this.Sadj
                    //                    });
                    //                    this.addParameter("S", S);
                    //                    this.addParameter("MagicX2", magicX2)
                    //                    this.addParameter("Y1", pi1.y);
                    //                    this.addParameter("Y2", pi2.y);
                    //                    this.addParameter("Mr", Mr);
                    this.points = [];
                    this.points.push(pi0);
                    this.points.push(pi1);
                    this.points.push(pi2);
                    this.points.push(pi3);
                }
                catch (ex) {
                    alert("prwebmetrics.realize reports " + ex.Message);
                }
                return this.points;
            },
            computeControlPoints: function () {
                /*computes control points given knots K, this is the brain of the operation*/
                var createControlPoints = function (K) {
                    var rslt = false;
                    try {
                        if (K !== undefined) {
                            var p1 = [];
                            var p2 = [];
                            var n = K.length - 1;

                            /*rhs vector*/
                            var a = [];
                            var b = [];
                            var c = [];
                            var r = [];

                            /*left most segment*/
                            a[0] = 0;
                            b[0] = 2;
                            c[0] = 1;
                            r[0] = K[0] + 2 * K[1];

                            /*internal segments*/
                            for (var i = 1; i < n - 1; i++) {
                                a[i] = 1;
                                b[i] = 4;
                                c[i] = 1;
                                r[i] = 4 * K[i] + 2 * K[i + 1];
                            }

                            /*right segment*/
                            a[n - 1] = 2;
                            b[n - 1] = 7;
                            c[n - 1] = 0;
                            r[n - 1] = 8 * K[n - 1] + K[n];

                            /*solves Ax=b with the Thomas algorithm (from Wikipedia)*/
                            for (var i = 1; i < n; i++) {
                                var m = a[i] / b[i - 1];
                                b[i] = b[i] - m * c[i - 1];
                                r[i] = r[i] - m * r[i - 1];
                            }
                            p1[n - 1] = r[n - 1] / b[n - 1]; ;
                            for (var i = n - 2; i >= 0; --i) {
                                p1[i] = (r[i] - c[i] * p1[i + 1]) / b[i];
                            };
                            /*we have p1, now compute p2*/
                            for (var i = 0; i < n - 1; i++) {
                                p2[i] = 2 * K[i + 1] - p1[i + 1];
                            };
                            p2[n - 1] = 0.5 * (K[n] + p1[n - 1]);

                            rslt = {
                                cp1: p1,
                                cp2: p2
                            };
                        }
                    }
                    catch (ex) {
                        alert("prweb.realize.axismanager.computeControlpoints.create reports" + ex.Message);
                    }
                    return rslt;
                };
                var rslt = false;
                //                var p1str = "C" + 0 + " " + 0 + ", " + 0 + " " + 0;
                try {
                    //                    p1str = "Q " + this.points[1].x + " " + this.points[1].y;
                    var cp1 = {
                        x: 255,
                        y: 1220
                    }
                    var cp2 = {
                        x: 195,
                        y: 1143
                    }
                    //                    p1str = "C" + cp1.x + " " + cp1.y + ", " + cp2.x + " " + cp2.y;
                    var xks = [];
                    var yks = [];
                    for (var i = 0; i < this.points.length; i++) {
                        xks.push(this.points[i].x);
                        yks.push(this.points[i].y);
                    };
                    var px = createControlPoints(xks);
                    var py = createControlPoints(yks);
                    //                    cp1.x = cpnewxs.cp1[0];
                    //                    cp1.y = cpnewys.cp1[0];
                    //                    cp2.x = cpnewxs.cp2[0];
                    //                    cp2.y = cpnewys.cp2[0];
                    this.controlpoints = [];
                    this.paths = [];
                    for (var i = 0; i < 3; i++) {
                        this.controlpoints.push({
                            x: px.cp1[i],
                            y: py.cp1[i]
                        });
                        this.controlpoints.push({
                            x: px.cp2[i],
                            y: py.cp2[i]
                        });
                        var p0str = "m" + xks[i] + ", " + yks[i];
                        var p1str = "C " + px.cp1[i] + " " + py.cp1[i] + ", " + px.cp2[i] + " " + py.cp2[i];
                        var p2str = ", " + xks[i + 1] + " " + yks[i + 1];
                        this.paths.push({
                            pathd: p0str + p1str + p2str
                        });
                    };
                    rslt = true;
                    //                    this.controlpoints.push(cp1);
                    //                    this.controlpoints.push(cp2);
                    //                    p1str = "C" + cp1.x + " " + cp1.y + ", " + cp2.x + " " + cp2.y;
                }
                catch (ex) {
                    alert("prweb.realize.axismanager.computeControlpoints reports" + ex.Message);
                };
                return rslt;
            },
            computePlotArray: function () {
                var plotarray = [];
                var xvalues = [];
                var slices = 60;
                //                var fx = function (x) {
                //                    return (this.cost / x) || false;
                //                };
                var minplotx = this.fx(this.yAxis.maxValue);
                var maxplotx = this.xAxis.maxValue;
                xvalues.push(minplotx);
                xvalues.push(maxplotx);
                xvalues.push((maxplotx - minplotx) / 2);
                var step = parseInt((maxplotx - minplotx) / slices);
                for (var i = maxplotx; i >= minplotx; i -= step) {
                    xvalues.push(i);
                };
                //                for (var i = 1; i <= slices; i++) {
                //                    xvalues.push((maxplotx - minplotx) / i);
                //                };
                for (var j = 0; j < xvalues.length; j++) {
                    var ithx = xvalues[j];
                    var ithy = this.fx(ithx);
                    if (this.fx(ithx) <= this.yAxis.maxValue) {
                        var pi = {
                            x: this.xAxis.toCoord(ithx).vwptcoord,
                            y: this.yAxis.toCoord(ithy).vwptcoord
                        };
                        plotarray.push(pi);
                    }

                };
                return plotarray;
            },
            clearParms: function () {
                this.parameters = [];
                this.testparms = [];
                this.testlines = [];
            },

            dispose: false
        },

        _populateAxisHandlers: function () {
            var axismgr = this._axisManager;
            $("#realizeaxisx").on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    var $rh = $("#renticleholder");
                    var elemctm = false;
                    if (e.srcElement !== undefined) {
                        elemctm = e.srcElement.getScreenCTM();
                    }
                    else {
                        elemctm = e.currentTarget.getScreenCTM();
                    }
                    var pos = false;
                    var cx = 0;
                    var cy = 0;
                    if (prweb.IsTouch) {
                        cx = e.point.pagex; //created by gesturizer.js.tap
                        cy = e.point.pagey; //created by gesturizer.js.tap
                        //                            $("#renticleholder").append("<div>e.point.pagex=" + e.point.pagex + " e.point.pagey=" + e.point.pagey + "</div>");
                    }
                    else {
                        cx = e.pageX;
                        cy = e.pageY;
                    }
                    var tx = setTimeout(function () {
                        try {
                            if (elemctm) {
                                pos = axismgr.xAxis.currentposition(axismgr.toPointXY(elemctm, cx, cy).x);
                                if (pos) {
                                    var rho = $rh.offset();
                                    var w = $rh.width() / 2;
                                    $rh.offset({
                                        left: cx - w,
                                        top: rho.top
                                    });
                                    var xval = axismgr.xAxis.currentDisplayValue(pos, axismgr.xScale);
                                    //                                    var rev = xval.toFixed(0) * axismgr.yAxis.currentDisplayValue().toFixed(2);
                                    var rev = Math.round((xval.toFixed(0) * axismgr.yAxis.currentDisplayValue().toFixed(2)) / 1000) * 1000;
                                    prweb.dashboardsvc.Vmx.realizeobjects.revenueobject.compute(rev, axismgr.cost);
                                }
                            }
                        }
                        catch (ex) {
                            alert("prwebmetrics.realize.axisx.click reports " + ex.Message);
                        }
                        clearTimeout(tx);
                        tx = null;
                        return;
                    }, 200);
                }
                catch (ex) {
                    alert("prwebmetrics.realize.axisx.clickhandler reports " + ex.Message);
                }
                return false;
            });
            $("#realizeaxisy").on(this.xevent, function (e) {
                try {
                    e.preventDefault();
                    e.stopPropagation();
                    e.cancelBubble = true;
                    var $rh = $("#renticleholder");
                    var elemctm = false;
                    if (e.srcElement !== undefined) {
                        elemctm = e.srcElement.getScreenCTM();
                    }
                    else {
                        elemctm = e.currentTarget.getScreenCTM();
                    }
                    var cx = 0;
                    var cy = 0;
                    var pos = false;
                    if (prweb.IsTouch) {
                        cx = e.point.pagex; //e.point.pagex; //created by gesturizer.js.tap
                        cy = e.point.pagey; //e.point.pagey; //created by gesturizer.js.tap
                    }
                    else {
                        cx = e.pageX;
                        cy = e.pageY;
                    }
                    var tx = setTimeout(function () {
                        try {
                            if (elemctm) {
                                pos = axismgr.yAxis.currentposition(axismgr.toPointXY(elemctm, cx, cy).y);
                                if (pos) {
                                    var rho = $rh.offset();
                                    var h = $rh.height() / 2;
                                    $rh.offset({
                                        left: rho.left,
                                        top: cy - h
                                    });
                                    var yval = axismgr.yAxis.currentDisplayValue(pos, axismgr.yScale);
                                    //                                    var rev = yval.toFixed(2) * axismgr.xAxis.currentDisplayValue().toFixed(0);
                                    var util = ((yval.toFixed(2) / Math.max(1, axismgr.totdeployable)) * 100).toFixed(0);
                                    var rev = Math.round((yval.toFixed(2) * axismgr.xAxis.currentDisplayValue().toFixed(0)) / 1000) * 1000;
                                    prweb.dashboardsvc.Vmx.realizeobjects.revenueobject.compute(rev, axismgr.cost, util);
                                }
                            }
                        }
                        catch (ex) {
                            alert("prwebmetrics.realize.axisy.click reports " + ex.Message);
                        }
                        clearTimeout(tx);
                        tx = null;
                        return;
                    }, 200);
                }
                catch (ex) {
                    alert("prwebmetrics.realize.axisx.clickhandler reports " + ex.Message);
                }
                return false;
            });
            return;
        },

        _populateRenticleHandlers: function () {
            var axismgr = this._axisManager;
            var ctm = false;
            if (prweb.IsTouch) {
                var $this = false;
                var isdragstart = false;
                var cx = 0;
                var cy = 0;
                var offx = 0;
                var offy = 0;
                var sex = 0;
                var sey = 0;
                var curX = 0;
                var curY = 0;
                var mtx = false;
                var cost = axismgr.cost;
                var updateobjects = function (e) {
                    try {
                        var w = $this.width() / 2;
                        var h = $this.height() / 2;
                        var wo = w - offx; //created by gesturizer.js.dragstart....
                        var ho = h - offy;
                        var pt = axismgr.toPointXY(ctm, (cx + wo), (cy + ho));
                        var posx = axismgr.xAxis.currentposition(Math.max(Math.min(pt.x, 1200), 200));
                        var posy = axismgr.yAxis.currentposition(Math.max(Math.min(pt.y, 1200), 200));
                        var xval = axismgr.xAxis.currentDisplayValue(posx, axismgr.xScale);
                        var yval = axismgr.yAxis.currentDisplayValue(posy, axismgr.yScale);
                        var util = ((yval.toFixed(2) / Math.max(1, axismgr.totdeployable)).toFixed(2)) * 100;
                        var rev = Math.round((yval.toFixed(2) * xval.toFixed(0)) / 1000) * 1000;
                        prweb.dashboardsvc.Vmx.realizeobjects.revenueobject.compute(rev, axismgr.cost,util);
                    }
                    catch (ex) {
                        alert("realize.renticle.updateobjects  " + ex.Message);
                    }
                    return;
                };
                var mydragmovehandler = function (e) {
                    e.stopPropagation();
                    try {
                        clearTimeout(mtx);
                        mtx = false;
                        if ($this) {
                            curX = sex + e.position.left;
                            curY = sey + e.position.top;
                            $this.css("top", ((curY * 1) + 0) + "px");
                            $this.css("left", ((curX * 1) + 0) + "px");
                            cx = e.originalEvent.changedTouches[0].pageX;
                            cy = e.originalEvent.changedTouches[0].pageY;
                            mtx = setTimeout(function () {
                                try {
                                    updateobjects();
                                }
                                catch (ex) {
                                    alert("prwebmetrics.realize.Renticle.mydragmovehandler reports " + ex.Message);
                                }

                                clearTimeout(mtx);
                                mtx = false;
                                return;
                            }, 10);
                        }
                    }
                    catch (ex) {
                        alert("realize.renticle.mydragmovehandler reports " + ex.Message);
                    }
                    return;
                };
                var mydragendhandler = function (e) {
                    if ($this) {
                        $this.off("drag.realize", mydragmovehandler);
                        $this.off("dragend.realize", mydragendhandler);
                        cx = e.point.pagex; //e.originalEvent.changedTouches[0].pageX;
                        cy = e.point.pagey; //e.originalEvent.changedTouches[0].pageY;
                        var tx = setTimeout(function () {
                            try {
                                updateobjects();
                            }
                            catch (ex) {
                                alert("prwebmetrics.realize.Renticle.mydragendhandler reports " + ex.Message);
                            }
                            $this = false;
                            clearTimeout(tx);
                            tx = null;
                            return;
                        }, 200);
                    }
                    isdragstart = false;
                    return;
                };
                $("#renticleholder").on("dragstart.realize", function (e) {
                    try {
                        e.cancelBubble = true;
                        if (!isdragstart) {
                            //                            offx = e.offSet.x; //created by gesturizer.js.dragstart....
                            //                            offy = e.offSet.y; //created by gesturizer.js.dragstart....
                            cost = axismgr.cost;
                            $this = $("#renticleholder");
                            //                            $("#renticleholder").append("<div>e.offSet.x=" + e.offSet.x + " e.offSet.y=" + e.offSet.y + "</div>");
                            var pos = $this.position();
                            sex = pos.left;
                            sey = pos.top;
                            var offset = $this.offset();
                            offx = e.point.pagex - offset.left;
                            offy = e.point.pagey - offset.top;
                            //                            $("#renticleholder").append("<div>e.point.pagex=" + e.point.pagex + " e.point.pagey=" + e.point.pagey + "</div>")
                            //                                                .append("<div>offset.left=" + offset.left + " offset.top=" + offset.top + "</div>")
                            //                                                .append("<div>offx=" + offx + " offy=" + offy + "</div>");
                            isdragstart = true;
                            ctm = $("#renticleinnercircle")[0].getScreenCTM();
                            $this.on("dragend.realize", mydragendhandler);
                            $this.on("drag.realize", mydragmovehandler);
                        }
                    }
                    catch (ex) {
                        alert("realize.renticle.dragstart  " + ex.Message);
                    }
                    return;
                });
            }
            else {
                $("#renticleholder").draggable({ containment: "parent",
                    start: function (e) {
                        e.stopPropagation();
                        ctm = $("#renticleinnercircle")[0].getScreenCTM();
                        var rslt = true; //allow the drag unless..
                        if (!rslt) {
                            //                        self.element.css("cursor", "default");
                        }
                        else {
                            //                        self.element.css("cursor", "move");
                        }
                        e = null;
                        return rslt;
                    },
                    drag: function (e, ui) {
                        try {
                            //                        var $this = $(this);
                            ui.helper.css("cursor", "move");
                            var w = ui.helper.width() / 2;
                            var h = ui.helper.height() / 2;
                            var wo = w - e.offsetX;
                            var ho = h - e.offsetY;
                            //                            var ctm = $("#renticleinnercircle")[0].getScreenCTM();
                            var pt = axismgr.toPointXY(ctm, (e.pageX + wo), (e.pageY + ho));
                            var posx = axismgr.xAxis.currentposition(Math.max(Math.min(pt.x, 1200), 200));
                            var posy = axismgr.yAxis.currentposition(Math.max(Math.min(pt.y, 1200), 200));
                            var xval = axismgr.xAxis.currentDisplayValue(posx, axismgr.xScale);
                            var yval = axismgr.yAxis.currentDisplayValue(posy, axismgr.yScale);
                            var util = ((yval.toFixed(2) / Math.max(1, axismgr.totdeployable)) * 100).toFixed(0);
                            var rev = Math.round((yval.toFixed(2) * xval.toFixed(0)) / 1000) * 1000;
                            prweb.dashboardsvc.Vmx.realizeobjects.revenueobject.compute(rev, axismgr.cost, util);
                        }
                        catch (ex) {

                        }

                        return;
                        //                    var tstr = "translate(" + (pos.left * 1.2) + ", " + (pos.top * 1.2) + ")";
                        //                    prweb.dashboardsvc.Vmx.realizeobjects.renticleposition(tstr);
                    },
                    stop: function (e, ui) {
                        e.stopPropagation(); //don't do click behavior...
                        ui.helper.css("cursor", "default");
                        var w = ui.helper.width() / 2;
                        var h = ui.helper.height() / 2;
                        var wo = w - e.offsetX;
                        var ho = h - e.offsetY;
                        //                        ctm = $("#renticleinnercircle")[0].getScreenCTM();
                        var pt = axismgr.toPointXY(ctm, (e.pageX + wo), (e.pageY + ho));
                        var posx = axismgr.xAxis.currentposition(Math.max(Math.min(pt.x, 1200), 200));
                        var posy = axismgr.yAxis.currentposition(Math.max(Math.min(pt.y, 1200), 200));
                        var xval = axismgr.xAxis.currentDisplayValue(posx, axismgr.xScale);
                        var yval = axismgr.yAxis.currentDisplayValue(posy, axismgr.yScale);
                        var util = ((yval.toFixed(2) / Math.max(1, axismgr.totdeployable)) * 100).toFixed(0);
                        var rev = Math.round((yval.toFixed(2) * xval.toFixed(0)) / 1000) * 1000;
                        prweb.dashboardsvc.Vmx.realizeobjects.revenueobject.compute(rev, axismgr.cost, util);
                        e = null;
                        ui = null;
                        return true;
                    }
                });
            }
        },

        _populaterealizeDerivedBindings: function () {
            try {
                var self = this;
                var axismgr = this._axisManager;
                if (ko.bindingHandlers.realizederived == undefined) {
                    ko.bindingHandlers.realizederived = {
                        init: function (element, valueAccessor) {
                            return;
                        },
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                            try {
                                var value = valueAccessor();
                                var valplain = ko.unwrap(value);
                                if (valplain !== undefined) {
                                    axismgr.clearParms();
                                    //                                    prweb.dashboardsvc.Vmx.realizeobjects.plots(axismgr.computePlotArray());
                                    //                                    prweb.dashboardsvc.Vmx.realizeobjects.pathd(axismgr.toPathd());
                                    axismgr.cost = prweb.dashboardsvc.Vmx.realizeobjects.cost();
                                    axismgr.totdeployable = prweb.dashboardsvc.Vmx.realizeobjects.totaldeployable();
                                    axismgr.xScale.displayMax = prweb.dashboardsvc.Vmx.realizeobjects.axisranges.x();
                                    axismgr.yScale.displayMax = prweb.dashboardsvc.Vmx.realizeobjects.axisranges.y();
                                    axismgr.computePoints();
                                    prweb.dashboardsvc.Vmx.realizeobjects.points(axismgr.points);
                                    axismgr.computeControlPoints(); //populates paths also...
                                    //                                    prweb.dashboardsvc.Vmx.realizeobjects.controlpoints(axismgr.controlpoints);
                                    prweb.dashboardsvc.Vmx.realizeobjects.paths(axismgr.paths);
                                    prweb.dashboardsvc.Vmx.realizeobjects.xaxislabels(axismgr.createXaxisLabels());
                                    prweb.dashboardsvc.Vmx.realizeobjects.yaxislabels(axismgr.createYaxisLabels());
                                    prweb.dashboardsvc.Vmx.realizeobjects.testlines(axismgr.testlines);
                                    //                                    prweb.dashboardsvc.Vmx.realizeobjects.testparms(axismgr.testparms);
                                    var csq = Math.sqrt(axismgr.scaledcost());
                                    prweb.dashboardsvc.Vmx.realizeobjects.renticleposition(axismgr.renticleToValues(0, 1000)); //csq, csq));
                                    prweb.dashboardsvc.Vmx.realizeobjects.parameters(axismgr.parameters);

                                }
                            }
                            catch (ex) {
                                alert("prwebmetrics.realize.realizederived.update  reports " + ex.Message);
                            }
                            return;
                        }
                    };
                }
            }
            catch (ex) {
                alert("prwebmetrics.realize.populaterealizeDerivedBindings  reports " + ex.Message);
            }
            return;

        },
        _populaterealizeXeventBindings: function () {
            var myxevent = this.xevent;
            try {
                if (ko.bindingHandlers.realizexevent == undefined) {
                    ko.bindingHandlers.realizexevent = {
                        init: function (element, valueAccessor) {
                            var $eelem = $(element);
                            switch (true) {
                                //                                case ($eelem.hasClass("realizerefresh")):    
                                //                                    $eelem.on(myxevent, function (e) {    
                                //                                        try {    
                                //                                            e.preventDefault();    
                                //                                            e.stopPropagation();    
                                //                                            e.cancelBubble = true;    
                                //                                            prweb.showClick(this);    
                                //                                            var tx = setTimeout(function () {    
                                //                                                try {    
                                //                                                    prweb.dashboardsvc.Vmx.updaterealizechange();    
                                //                                                }    
                                //                                                catch (ex) {    
                                //                                                    alert("prwebmetrics.realize.realizerefresh.click reports " + ex.Message);    
                                //                                                }    
                                //                                                clearTimeout(tx);    
                                //                                                tx = null;    
                                //                                                return;    
                                //                                            }, 200);    
                                //                                            //navigate to selected thing...    
                                //                                        }    
                                //                                        catch (ex) {    
                                //                                            alert("prwebmetrics.realize.metricsselectbtn.clickhandler reports " + ex.Message);    
                                //                                        }    
                                //                                        return false;    
                                //                                    });    
                                //                                    break    
                                case ($eelem.hasClass("realizecollapseable")):
                                    $eelem.on(myxevent, function (e) {
                                        try {
                                            e.preventDefault();
                                            e.cancelBubble = true;
                                            prweb.showClick(this);
                                            var $this = $(this);
                                            var tx = setTimeout(function () {
                                                try {
                                                    $this.children(".realizemetricscolxnregion").toggle();
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.realize.realizecollapseable.click reports " + ex.Message);
                                                }
                                                $this = null;
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                            //navigate to selected thing...
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.realize.metricsselectbtn.clickhandler reports " + ex.Message);
                                        }
                                        return false;
                                    });
                                    break;
                                case ($eelem.hasClass("realizemetricscollapse")):
                                    $eelem.on(myxevent, function (e) {
                                        try {
                                            e.preventDefault();
                                            e.cancelBubble = true;
                                            prweb.showClick(this);
                                            var $this = $(this);
                                            var tx = setTimeout(function () {
                                                try {
                                                    $this.siblings().toggle();
                                                }
                                                catch (ex) {
                                                    alert("prwebmetrics.realize.realizemetricscollapse.click reports " + ex.Message);
                                                }
                                                $this = null;
                                                clearTimeout(tx);
                                                tx = null;
                                                return;
                                            }, 200);
                                        }
                                        catch (ex) {
                                            alert("prwebmetrics.realize.realizemetricscollapse.clickhandler reports " + ex.Message);
                                        }
                                        return false;
                                    });
                                    break;
                            };
                            return;
                        },
                        update: function (element, valueAccessor) {
                            return;
                        }
                    };
                }
            }
            catch (ex) {
                alert("prwebmetrics.realize.PopulaterealizeXeventBindings  reports " + ex.Message);
            }
            return;
        },

        //#region Dispose Destroy
        dispose: function () {
            if (!this.options.isDisposed) {
                try {
                    $(".realizecollapseable").off(this.xevent);
                    $(".realizemetricscollapse").off(this.xevent);
                    $(".realizerefresh").off(this.xevent);
                }
                catch (ex) {
                    alert("prwebmetrics.realize.dispose reports error " + ex.Message);
                    ex = null;
                }
                finally {
                    this.options.isDisposed = true;
                }
            }
            return;
        },

        destroy: function () {
            try {
                this.dispose();
            }
            catch (ex) {
                alert("prwebmetrics.realize.destroy reports error " + ex.Message);
                ex = null;
            }
            finally {
                $.Widget.prototype.destroy.call(this);
            }

        }

        //#endregion
    });
} (this.prweb, jQuery));