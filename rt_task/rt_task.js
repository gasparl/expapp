/* Gaspar Lukacs 2023 */
/*jshint esversion: 6 */

// set and seal keys to be used in the task
const keys = {
    left: 'd',
    right: 'k'
};
Object.freeze(keys);

// set minimum and maximum inter-trial interval
const iti = {
    min: 350,
    max: 500
};
Object.freeze(iti);

// response time limit (here in practice phase only)
const rt_limit = 1000;


// define global variables
let trial_number = 0,
    block_number = 0,
    phase = 'practice',
    inactivity = null,
    practice_rts, block_items, item_x, set_next, current_cond, resp_left, resp_right, response_window, iti_current;

// initiate the upcoming response time task block (or end response time task)
const init_block = function() {
    countdown_off();
    if (misc.device === 'mobile') {
        document.body.style.backgroundColor = "#808080";
    } else {
        document.body.style.backgroundColor = "#3f3f3f";
    }
    if (block_number > 2) {
        // ending response time task
        setTimeout(function() {
            // stop warning about fullscreen
            window.onresize = null;

            // move on
            switch_div('rt_task', 'followup');
            document.body.style.backgroundColor = "#fdfdfd";
        }, 1000);
    } else {
        // hide task screen (if displayed)
        document.getElementById('rt_task').style.display = 'none';

        if (block_number !== 1 || practice_valid()) {
            // start with block instructions
            document.getElementById('rt_instructions').innerHTML = tt.block_text[block_number];
            block_number++;
        } else {
            document.getElementById('practice_repeat_id').innerHTML = tt.practice_repeat;
        }


        document.getElementById('rt_instructions').style.display = 'block';

        trial_number = 0;
        item_x = {}; // reset current item information

        if (block_number === 1) { // if first block: practice
            phase = 'practice';
            practice_rts = {}; // for collecting RTs during practice, for evaluation [n44]
        } else {
            phase = 'main';
            // if third block (second main block), switch conditions
            if (block_number === 3) {
                current_cond = current_cond === 'long' ? 'short' : 'long';
            }
        }
        block_items = generate_items();
    }
};


// evaluate validity of practice responses [n44]
const practice_valid = (() => {
    // "repeated" to keep track of whether there was already a practice repetition
    // (this self-executing function serves to keep this variable local)
    let repeated_once = false;
    return function() {
        if (!repeated_once) {
            repeated_once = true;
            for (let key in practice_rts) {
                const valid_vs_not = practice_rts[key].map(rt => rt > 150 && rt < rt_limit ? true : false);
                const valid_ratio = valid_vs_not.filter((value) => value).length / valid_vs_not.length;
                // users should make at least 60% valid responses for either direction (left and right)
                if (valid_ratio < 0.6) {
                    return false;
                }
            }
        }
        return true;
    };
})();


// generate trial items for any given block in the response time task [n41]
const generate_items = function() {
    const new_items = [];
    // demo: 1 repetition per item and SSD type; otherwise, practice: 1, main block: 5
    const num_reps = misc.demo ? 1 : (phase === 'practice' ? 1 : 5);
    const left_stims = ['<-', '←'];
    const right_stims = ['->', '→'];

    // set SSDs to be used
    let current_ssds;
    if (current_cond === 'low') {
        current_ssds = [0, 150, 250];
    } else {
        current_ssds = [0, 300, 400];
    }

    // generate the list of objects (trial items)
    for (let ix = 0; ix < num_reps; ix++) {
        current_ssds.forEach(ssd => {
            left_stims.concat(right_stims).forEach(stim => {
                new_items.push({
                    content: stim, // text content to be displayed
                    direction: right_stims.indexOf(stim) === -1 ? 'left' : 'right', // direction of the arrow
                    ssd: ssd // the stop signal delay in the given trial
                });
            });
        });
    }
    return (shuffle(new_items)); // return all generated items in random order
};

// this function is called from the rt_instructions div button (via block_text)
const init_trials = function() {
    switch_div('rt_instructions', 'rt_task');
    document.body.style.backgroundColor = "#000000";
    document.getElementById('info').style.display = 'none';
    if (misc.device === 'mobile') {
        document.getElementById('info').textContent = tt.tap_start;
    } else {
        document.getElementById('info').textContent = tt.key_start;
    }
    document.getElementById('info').style.display = 'block';
    start_listener();
    DT.loopOn(); // start recursive RAF calls [n49]
};

// setup start (keypress or screen button) listener
const start_listener = function() {
    document.getElementById('stimulus').textContent = '+';
    document.getElementById('stop').textContent = '';
    // wait and listen for starting key or button
    if (misc.device === 'mobile') {
        resp_left = document.getElementById('btn_left');
        resp_right = document.getElementById('btn_right');
        [resp_left, resp_right].forEach(elem => {
            elem.textContent = tt.tap_here;
            elem.style.backgroundColor = "#cc0000";
            elem.ontouchstart = function(evt) {
                evt.preventDefault();
                // reset default color and empty content for both
                resp_left.style.backgroundColor = "#aaaaaa";
                resp_right.style.backgroundColor = "#aaaaaa";
                resp_left.textContent = '';
                resp_right.textContent = '';

                touch_wrapup(elem);
                // restart inactivity checker [n48]
                countdown_off();
                countdown();
                setTimeout(() => {
                    next_trial(); // starting the trial iteration                    
                }, iti.min);
            };
        });
    } else {
        document.onkeydown = function(e) {

            if (e.key === " " ||
                e.code === "Space") {
                document.onkeydown = null; // stop listening for the keypress
                // restart inactivity checker [n48]
                countdown_off();
                countdown();

                // enter fullscreen, just in case it has been escaped [n20]
                fullscreen_on();

                setTimeout(() => {
                    next_trial(); // starting the trial iteration                    
                }, iti.min);
            }
        };
    }
};

// prepare the next trial, ready display
const next_trial = function() {
    document.getElementById('info').style.display = 'none';
    iti_current = rdigit(iti.min, iti.max);
    if (block_items.length > 0) {
        setTimeout(function() {
            // setting the timer for inactivity (10 sec) [n48]
            countdown();

            // execute simulated keypresses if activated [n52]
            if (typeof sim_user === "function") {
                sim_user();
            }

            trial_number++;
            // get trial information from the pre-generated object [n42]
            item_x = block_items.shift();

            // add some additional information regarding current trial
            item_x.fullscreen = !!(document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement ||
                document.msFullscreenElement);
            item_x.w_width = window.innerWidth;
            item_x.w_height = window.innerHeight;

            // execute code (including stimulus display command) in the next RAF call [n51]
            DT.display(function(timestamp) {
                // display stimulus in the upcoming frame (using the trial info content [n42])
                document.getElementById('stimulus').textContent = item_x.content;
                item_x.display_arrow = timestamp; // paint time of main stimulus
                trial_listener();
            },
                function(ssd_tstamp) {
                    // execute code (including command to show stop signal) after the time interval given by item_x.ssd
                    if (item_x.ssd !== 0 && phase !== 'practice') {
                        document.getElementById('stop').textContent = tt.stop_signal;
                        item_x.display_stop = ssd_tstamp; // paint time of stop signal
                    }
                },
                item_x.ssd);

        }, iti_current - iti.min);
    } else {
        // finish block if all trials are done
        DT.loopOff(); // stop recursive RAF calls [n50]
        init_block();
    }
};

// setup response (keypress or screen button) listener
const trial_listener = function() {
    if (misc.device === 'mobile') {
        resp_left = document.getElementById('btn_left');
        resp_right = document.getElementById('btn_right');
        resp_left.ontouchstart = function(evt) {
            evt.preventDefault();
            touch_wrapup(resp_left);
            process_response(evt, 'left');
        };
        resp_right.ontouchstart = function(evt) {
            evt.preventDefault();
            touch_wrapup(resp_right);
            process_response(evt, 'right');
        };
    } else {
        document.onkeydown = function(e) {
            if (e.key === keys.left || e.key === keys.right) {
                document.onkeydown = null; // stop listening for the keypress
                if (e.key === keys.left) {
                    process_response(e, 'left');
                } else {
                    process_response(e, 'right');
                }
                document.onkeyup = function(ev2) {
                    if (ev2.key === e.key) {
                        item_x.response_end = ev2.timeStamp;
                        document.onkeyup = null;
                    }
                };
            } else {
                // feedback about wrong key pressed [n46]
                document.getElementById('info').style.display = 'block';
                document.getElementById('info').innerHTML = tt.key_astray;
                // store info about wrong key pressed, also indicated by preceding exclamation mark [n45]
                if (!item_x.correct) {
                    item_x.correct = '!';
                }
                item_x.correct += e.key;
            }
        };
    }

    // in case of practice trials or stop signals, set up response time (window) limit
    if (phase === 'practice' || item_x.ssd !== 0) {
        response_window = setTimeout(() => {
            document.onkeydown = null;
            document.onkeyup = null;
            if (misc.device === 'mobile') {
                resp_left.ontouchstart = null;
                resp_right.ontouchstart = null;
            }
            if (phase === 'practice') {
                // exceeded time limit during practice [n43]
                trial_feed(tt.too_slow);
            } else {
                store_response();
            }
        }, rt_limit);
    }
};

// process post-touch details
const touch_wrapup = function(button_elem) {
    // stop listening to touchstarts
    resp_left.ontouchstart = null;
    resp_right.ontouchstart = null;
    // indicate button press by slight color change (darker grey)
    button_elem.style.backgroundColor = "#666666";
    // check for touchend (including touch/cursor moving out of the area)
    ['ontouchend', 'ontouchcancel', 'onmouseleave'].forEach(function(onevtype) {
        button_elem[onevtype] = function(evt) {
            button_elem.style.backgroundColor = "#aaaaaa";
            if (item_x.response_start && !item_x.response_end) {
                item_x.response_end = evt.timeStamp;
            }
        };
    });
};


// save response information and provide feedback if applicable
const process_response = function(resp_event, resp_side) {
    // cancel response window (if any)
    clearTimeout(response_window);

    // disable inactivity checker [n48]
    countdown_off();
    clearTimeout(inactivity);
    inactivity = null;
    document.getElementById('info').style.display = 'none';

    // enter fullscreen, just in case it has been escaped [n20]
    fullscreen_on();

    item_x.response_start = resp_event.timeStamp;
    item_x.trust = resp_event.isTrusted; // whether the keypress was simulated [n47]
    item_x.response_key = resp_side;

    const correct_key = item_x.response_key === item_x.direction;
    if (!item_x.correct) {
        item_x.correct = correct_key;
    }
    if (phase === 'practice' && (!correct_key)) {
        // wrong response during practice [n43]
        trial_feed(tt.key_wrong);
    } else {
        store_response();
    }
};

// warning about wrong key or too slow (i.e., no timely) response [n43]
// (here, the warning is displayed in the same HTML element as the stimulis, 
// but it could also be done in another element)
const trial_feed = function(msg) {
    document.getElementById('stimulus').textContent = msg;
    document.getElementById('stimulus').style.color = '#ff0000';
    setTimeout(function() {
        document.getElementById('stimulus').style.color = '#ffffff';
        store_response();
    }, 500);
};

// assign headers for the eventual results table [n30]
let subject_results = [
    'subject_id', 'phase', 'block', 'trial', 'condition', 'ssd', 'stimulus', 'direction', 'display_arrow', 'display_stop', 'response_key', 'correct', 'response_start', 'response_end', 'iti', 'trusted', 'w_width', 'w_height', 'fulls'
].join("\t") + "\n";

// process and store responses
const store_response = function() {
    document.getElementById('stimulus').textContent = '';
    document.getElementById('stop').textContent = '';
    document.onkeydown = null;
    document.onkeyup = null;

    // if practice, collect responses for evaluation per each direction [n44]
    if (phase === 'practice') {
        if (practice_rts[item_x.direction] === null) {
            practice_rts[item_x.direction] = [];
        }
        practice_rts[item_x.direction].push(item_x.correct === true ? ro(item_x.response_start - item_x.display_arrow) : 0);
    }

    setTimeout(() => {
        if (misc.demo) {
            console.log(item_x); // print info
        }
        // store response details to the in the results table [n30]
        subject_results += [
            misc.subject_id, phase, block_number, trial_number, current_cond, item_x.ssd, item_x.content, item_x.direction, ro(item_x.display_arrow), ro(item_x.display_stop), item_x.response_key, item_x.correct, ro(item_x.response_start), ro(item_x.response_end), iti_current, item_x.trust, item_x.w_width, item_x.w_height, item_x.fullscreen
        ].map(el => el === undefined ? 'NA' : el).join("\t") + "\n";
        // upload partial data after each 10 trials (for dropout analysis) [n24]
        if (trial_number % 10 === 1) {
            upload_interim();
        }
        if (!down_counter) {
            next_trial(); // start next trial
        } else {
            // wait for user restart
            start_listener();
        }
    }, iti.min);
};

// counter for inactivity and potential timing out [n48]
let down_counter = false;
const countdown = function() {
    if (inactivity === null) {
        inactivity = setTimeout(function() {
            pause_elem = document.getElementById('pausing');
            pause_elem.innerHTML = tt.pausing;
            pause_elem.style.display = 'block';
            const count_elem = document.getElementById('countdown');
            const start = Date.now();
            const duration = 10 * 60; // 10 minutes until times out
            let minutes, seconds; // hours;
            down_counter = true;
            const timer = function() {
                const diff = Math.ceil(duration - ((Date.now() - start) / 1000));
                // hours = (diff / (60 * 60)) | 0;
                minutes = ((diff % (60 * 60)) / 60) | 0;
                seconds = (diff % 60) | 0;
                // hours = "0" + hours;
                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                count_elem.textContent = minutes + ":" + seconds;
                if (diff > 0) {
                    setTimeout(() => {
                        if (down_counter) {
                            timer();
                        } else {
                            pause_elem.style.display = 'none';
                        }
                    }, 100);
                } else if (down_counter === true) {
                    misc.timedout = true;
                    pause_elem.innerHTML = tt.timed_out;
                }
            };
            timer();
        }, (10 * 1000)); // after 10 sec inactivity
    }
};
// stop countdown
const countdown_off = function() {
    down_counter = false;
    document.getElementById('pausing').style.display = 'none';
    document.getElementById('stimulus').textContent = '';
};