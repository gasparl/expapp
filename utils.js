/* Gaspar Lukacs 2023 */
/*jshint esversion: 6 */

// store the time(s) of any unload (page leave) attempt(s)
const unload_attemps = [];
// store the times and names of division ("page") switches [#5]
const div_switches = {};

// formatted current date
const neat_date = function() {
    const m = new Date();
    return m.getFullYear().toString().slice(-2) + "" +
        ("0" + (m.getMonth() + 1)).slice(-2) + "" +
        ("0" + m.getDate()).slice(-2) + "" +
        ("0" + m.getHours()).slice(-2) + "" +
        ("0" + m.getMinutes()).slice(-2) + "" +
        ("0" + m.getSeconds()).slice(-2);
};

// random choice from array
const rchoice = function(array) {
    return array[Math.floor(array.length * Math.random())];
};

// random whole number choice
const rdigit = function(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const mean = function(array) {
    return array.reduce((a, b) => a + b) / array.length;
};

// shuffle array function
const shuffle = function(arr) {
    const array = JSON.parse(JSON.stringify(arr));
    const newarr = [];
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        newarr[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return newarr;
};

const capitalize = function(s) {
    return s && s[0].toUpperCase() + s.slice(1);
};

// alert to confirm or cancel unload (i.e., leaving the page by navigating away or closing the tab) [#17]
const keep_state = function() {
    window.onbeforeunload = (event) => {
        unload_attemps.push(performance.now());
        misc.unloads = unload_attemps.join('_');
        upload_interim();
        const warn = tt.unload_warn;
        if (!misc.demo) {
            event.preventDefault();
            event.returnValue = warn;
            return warn;
        }
    };
    // try prevent navigating back
    history.pushState(null, null, location.href);
    history.back();
    history.forward();
    window.onpopstate = function() {
        history.go(1);
    };
};

const ro = function(num) {
    return ((Math.round(num * 100) / 100).toFixed(2));
};

const to_sec = function(num) {
    return (Math.round(num / 1000));
};

// enter fullscreen mode [#18]
const fullscreen_on = function(doit = false) {
    document.getElementById('screen_feed').style.display = 'none';
    if (doit != true && (misc.demo || typeof sim_user === "function")) {
        return;
    }
    const element = document.documentElement;
    if (element.requestFullscreen) { //W3C standard
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) { //FireFox
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) { //IE/Edge
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) { //Chrome and Safari
        element.webkitRequestFullscreen();
    } else if (element.webkitSupportsFullscreen) { //Chrome and Safari
        element.webkitEnterFullscreen();
    }
};

// exit full screen
const fullscreen_off = function() {
    if (misc.demo) {
        return;
    }
    if (document.exitFullscreen) { //W3C standard
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { //Chrome and Safari
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) { //FireFox
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { //IE/Edge
        document.msExitFullscreen();
    } else if (element.webkitSupportsFullscreen) { //Chrome and Safari
        element.webkitExitFullscreen();
    }
};

// function for assigning what happens depending on whether fullscreen is on
const fullscreen_state = function(on = () => { }, off = () => { }) {
    if (document.fullscreenElement || document.mozFullScreenElement ||
        document.webkitFullscreenElement || document.msFullscreenElement) {
        on();
    } else {
        off();
    }
};

// listen for change in fullscreen mode [#20]
const fullscreen_change = function(on, off) {
    window.onresize = function() {
        fullscreen_state(on, off);
    };
};
// (to stop listening for change in fullscreen mode, set window.onresize = null;)

const char_count = function(event, feed_elem) {
    document.getElementById(feed_elem).value = event.maxLength - event.value.length;
};


// check if the user's device is mobile [#13]
const is_mobile = function() {
    let check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

// get selected radio button value
const get_radio = function(rad_name) {
    const rad_val = document.querySelector('input[name=' + rad_name + ']:checked');
    return (rad_val ? rad_val.value : "");
};

// spinner HTML
const spinner_content = /*html*/ `
        <div class="g_spinner">
            <svg class="g_circular" viewBox="25 25 50 50">
                <circle class="g_path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
            </svg>
        </div>`;

// function to switch divisions (virtual pages) [#4]
const switch_div = function(current, next, wait = 0, fulls = true) {
    document.getElementById(current).style.display = 'none';
    window.scrollTo(0, 0);
    if (fulls) {
        // enter fullscreen mode [#18]
        fullscreen_on();
    }
    if (wait === 0) {
        document.getElementById(next).style.display = 'block';
    } else {
        setTimeout(function() {
            document.getElementById(next).style.display = 'block';
        }, wait);
    }
    // record the (upcoming) division name and the current time [#5]
    div_switches['p' + Object.keys(div_switches).length + '_' + next] = Math.round(performance.now() / 600) / 100 + wait;
    upload_interim();
};


/* Drag and Drop mechanism functions [#drag] */
// allow dropping items (when appropriate)
const let_drop = function(ev) {
    let t = ev.target;
    if (t && t.children.length === 0 &&
        (t.classList.contains("img_targ") || dragged_id.slice(0, 9) === t.id.slice(0, 9))) {
        ev.preventDefault();
    }
    return false;
};
let dragged_id; // to hold the ID info of the dragged item

// add element ID as data to the item being dragged
const drag = function(ev) {
    dragged_id = ev.target.id;
    ev.dataTransfer.setData("text", ev.target.id);
};
// when the item is dropped, append the element based on the ID data
const drop = function(ev) {
    ev.preventDefault();
    const t = ev.target;
    const data = ev.dataTransfer.getData("text");
    t.appendChild(document.getElementById(data));
};


// calculates the similarity between any two given texts
// results are by default in percentage (0-100)
const similar_text = function(first, second, percent = true) {
    //  discuss at: https://locutus.io/php/similar_text/
    // original by: Rafał Kukawski (https://blog.kukawski.pl)
    // bugfixed by: Chris McMacken
    // bugfixed by: Jarkko Rantavuori original by findings in stackoverflow (https://stackoverflow.com/questions/14136349/how-does-similar-text-work)
    // improved by: Markus Padourek (taken from https://www.kevinhq.com/2012/06/php-similartext-function-in-javascript_16.html)
    // minor adjustments by GL 2023
    // PHP reference: Programming Classics: Implementing the World's Best Algorithms by Oliver (ISBN 0-131-00413-1)
    // https://www.php.net/manual/en/function.similar-text.php
    //   example 1: similar_text('Hello World!', 'Hello locutus!')
    //   returns 1: 61.53846153846154
    //   example 2: similar_text('Hello World!', null)
    //   returns 2: 0
    if (first === null ||
        second === null ||
        typeof first === 'undefined' ||
        typeof second === 'undefined') {
        return 0;
    }
    first += '';
    second += '';
    let pos1 = 0;
    let pos2 = 0;
    let max = 0;
    const firstLength = first.length;
    const secondLength = second.length;
    let p;
    let q;
    let l;
    let sum;
    for (p = 0; p < firstLength; p++) {
        for (q = 0; q < secondLength; q++) {
            for (l = 0; (p + l < firstLength) && (q + l < secondLength) && (first.charAt(p + l) === second.charAt(q + l)); l++) { // eslint-disable-line max-len
                // @td: ^-- break up this crazy for loop and put the logic in its body
            }
            if (l > max) {
                max = l;
                pos1 = p;
                pos2 = q;
            }
        }
    }
    sum = max;
    if (sum) {
        if (pos1 && pos2) {
            sum += similar_text(first.substr(0, pos1), second.substr(0, pos2), false);
        }
        if ((pos1 + max < firstLength) && (pos2 + max < secondLength)) {
            sum += similar_text(
                first.substr(pos1 + max, firstLength - pos1 - max),
                second.substr(pos2 + max,
                    secondLength - pos2 - max), false);
        }
    }
    if (!percent) {
        return sum;
    }
    return (sum * 200) / (firstLength + secondLength);
};