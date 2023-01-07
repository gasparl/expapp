/* Gaspar Lukacs 2023 */
/*jshint esversion: 6 */

const DT = (() => {
    const isNum = val => !isNaN(val) && val < Infinity;
    var tasks = [], loop = false;
    const onFrame = time => {
        tasks = tasks.filter(task => {
            if (task.init instanceof Function) {
                task.init(time);
                task.init = time;
                return task.dur === undefined ? false : true;
            }
            if (time - task.init > task.dur) {
                task.cb(time, task.init); // return finish and start times
                return false;
            }
            return true;
        });
        if (loop) requestAnimationFrame(onFrame);
    };
    return Object.freeze({
        display(start, end, duration) {
            if (loop && start instanceof Function &&
                ((end === undefined && duration == undefined) ||
                    (end instanceof Function && isNum(duration)))) {
                tasks.push({
                    init: start,
                    cb: end,
                    dur: duration
                });
            } else {
                if (!loop) console.warn('There is no ongoing RAF loop.');
                if (!(start instanceof Function)) console.warn('The given "start" is not a function.');
                if (!(end === undefined && duration === undefined)) {
                    if (!(end instanceof Function)) console.warn('The given "end" is not a function.');
                    if (!isNum(duration)) console.warn('The given "duration" is not numeric.');
                }
            }
        },
        loopOn(warn = true) {
            if (!loop) {
                loop = true;
                onFrame();
                if (warn) {
                    console.warn('loopOn()');
                }
            } else {
                console.warn('The RAF loop is already ongoing.');
            }
        },
        loopOff(warn = true) {
            if (loop) {
                loop = false;
                if (warn) {
                    console.warn('loopOff()');
                }
            } else {
                console.warn('There is no ongoing RAF loop.');
            }
        },
        // loaded images
        images: {},
        // preload images
        preload(sources) {
            Promise.all(
                sources.map(
                    src => new Promise(function(resolve, reject) {
                        const img = new Image();
                        DT.images[src] = img;
                        img.onload = function() {
                            resolve(img);
                        };
                        img.onerror = reject;
                        img.src = src;
                    })));
        },
        // RAF timestamp samples
        samples: [],
        // refresh interval(s) based on RAF timestamp samples
        interval: undefined,
        // collect RAF timestamp samples, 10 by prevent
        // (also calculates approx. refresh interval, based on median RAF stamp distance)
        getSamples(fun = undefined, n = 10) {
            requestAnimationFrame((stamp) => {
                this.samples.push(stamp);
                if (n > 1) {
                    this.getSamples(fun, --n);
                } else {
                    const samps = this.samples.slice(0);
                    if (samps.length > 1 && this.interval === undefined) {
                        samps.shift();
                        this.interval = parseFloat(this.median(samps.slice(1).map((num, i) => {
                            return num - samps[i];
                        }))).toFixed(1);
                    }
                    if (typeof fun === 'function') {
                        fun();
                    }
                }
            });
        },
        // median calculation
        median(values) {
            if (values.length === 0) {
                return undefined;
            }
            values.sort(function(a, b) {
                return a - b;
            });
            const half = Math.floor(values.length / 2);
            if (values.length % 2) {
                return values[half];
            }
            return (values[half - 1] + values[half]) / 2.0;
        }
    });
})();
