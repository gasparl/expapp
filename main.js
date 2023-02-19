/* Gaspar Lukacs 2023 */
/*jshint esversion: 6 */

// this variable serves here to easily set the starting div for testing
const start_div = 'intro';
// Here, the first div (ID) is 'intro'. To quickly test other pages (e.g. layout), switch the ID.
// (notable other divisions: 'prelim', 'rt_instructions', 'rt_task', 'followup', 'ending')

// miscellaneous subject data [#31]
const misc = {
    subject_id: rchoice("CDFGHJKLMNPQRSTVWXZ") +
        rchoice("AEIOUY") +
        rchoice("CDFGHJKLMNPQRSTVWXZ") +
        rchoice("AEIOUYCDFGHJKLMNPQRSTVWXZ") + '_' + neat_date(), // randomly assigned arbitrary user ID (including date)
    lg: 'en', // instruction language
    device: null, // "desktop" or "mobile"; the default means either is fine
    demo: false, // whether this is a demonstration
    timeout: 30, // maximum time of inactivity allowed
    timed_out: false, // whether the participant timed out (inactivity time exceeded timeout)
    attention: 0 // tracks attention check responses (should have 2 for passing)
};
// file name for storing
const file_name =
    'sst_' +
    misc.subject_id +
    ".txt";

// code to execute when the web app is entirely loaded [#9]
document.addEventListener("DOMContentLoaded", function() {

    // check browser compatibility with relevant JavaScript methods [#11]
    try {
        const sum = function(x, y, z) {
            return x + y + z;
        };
        const numbers = [1, 2, 3];
        if (typeof fetch !== 'function' || sum(...numbers) !== 6) {
            return;
        }
    } catch (e) {
        if (e.name == "ReferenceError") {
            return;
        }
    }

    // store hardware and software information
    misc.user_agent = navigator.userAgent;
    misc.screen_h = screen.height;
    misc.screen_w = screen.width;
    misc.browser_name = jscd.browser;
    // misc.browser_name may be used to restrict browser types [#54]
    // for example, to allow only Google Chrome:
    // if (misc.browser_name != "Chrome") {
    //     // here: code to show warning and/or prevent continuation
    // }
    misc.browser_version = jscd.browserVersion;
    misc.os_name = jscd.os;
    misc.os_version = jscd.osVersion;

    // set starting (first main block) experimental condition (here: ssd magnitudes) randomly
    current_cond = (Math.random() < 0.5) ? 'short' : 'long';
    misc.condition = current_cond + '_first'; // save first condition info

    // random media choice
    misc.media = rchoice(['audio_piano_1.wav', 'audio_piano_2.wav', 'vid_cat_1.mp4', 'vid_cat_2.mp4']);

    // check URL query parameters, proceed depending on that
    check_params();
});

// get URL query parameters: language, device, etc. [#12]
const check_params = function() {
    const params = new URLSearchParams(location.search);

    // check device types
    if (params.get('m') !== null) {
        misc.device = 'mobile';
        // show touch buttons
        document.getElementById('btn_left').style.display = 'block';
        document.getElementById('btn_right').style.display = 'block';
    } else {
        misc.device = 'desktop';
    }

    // check whether it's demonstration version [#53]
    if (params.get('demo') !== null) {
        misc.demo = true;
        // (this variable is then used everywhere else to decide whether the app 
        // should act as in case of a demo version)
    }

    // get user ID, here from Prolific
    misc.user_id = params.get('PROLIFIC_PID');
    // get language [#12]
    misc.lg = params.get('lg');
    // load language and then show displays
    load_language();
};

// load language based on query
const load_language = function() {
    // load texts in the given language [#17]
    const lg_script = document.createElement('script');
    lg_script.onload = function() {
        // when the language file is loaded, modify as needed and add to HTML
        if (misc.device === 'mobile') {
            tt.pausing = tt.pausing.replace('{{RESTART}}', tt.tap_restart);
        } else {
            tt.pausing = tt.pausing.replace('{{RESTART}}', tt.key_restart);
        }
        // insert texts of the chosen language into HTML [#17]
        Object.keys(tt).forEach((id) => {
            if (id.startsWith('class_')) {
                [...document.getElementsByClassName(id)].forEach((elem) => {
                    elem.innerHTML = tt[id];
                });
            } else {
                const elem = document.getElementById(id);
                if (elem) {
                    elem.innerHTML = tt[id];
                }
            }
        });
        // adjust and display texts
        ready_texts();

        // load and add images
        set_images();
        // load and add audio/video
        set_media();
    };
    // if the specified language file not found, default to English [#16]
    lg_script.onerror = function() {
        misc.lg = 'en';
        console.log('Language defaults to English.');
        load_language();
    };
    lg_script.src = './langs/lg_' + misc.lg + '.js';
    document.head.appendChild(lg_script);
};

// modify (based on query) and set texts
const ready_texts = function() {
    // check for Prolific ID, modify text based on whether it's found
    if (misc.user_id === null || misc.user_id.length < 2) {
        misc.user_id = "noid";
        document.getElementById('pay_info').innerHTML = tt.no_id;
    }
    if (misc.demo) {
        // if demonstration version, show the related information
        document.getElementById('demo_info').style.display = 'block';
    }
    // adjust texts based on required device type
    if (misc.device === 'mobile') {
        tt.block_text[0] = tt.block_text[0].replace('{{DEVICE}}', tt.mobile_instructions);
        document.getElementById("device_type").innerHTML = tt.device_mobile;
    } else {
        tt.block_text[0] = tt.block_text[0].replace('{{DEVICE}}', tt.desktop_instructions);
        document.getElementById("device_type").innerHTML = tt.device_desktop;
    }

    // provide Subject ID at the end, for potential verification
    document.getElementById("subj_id").innerText = misc.subject_id;


    // disabling pasting or dropping text to the feedback text area element [#34]
    // (not necessarily a good idea here, but serves as an example)
    ['onpaste', 'ondrop'].forEach(onevent => {
        document.getElementById('feedback')[onevent] = function(e) {
            alert(tt.no_paste);
            e.preventDefault();
            return false;
        };
    });
    // other potential events to note: 'oncopy', 'oncut', 'ondrag', 'onchange', 'oninput', 'selectionchange'

    // If the browser supports the JavaScript included (essentially: ES6), switch to first division.
    switch_div('init_fail', start_div, 0, false);
};

// actions following consent
const consent_submit = function() {
    // if user ID is manually given, store it
    if (misc.user_id === "noid" && document.getElementById("prolific_id").value.length > 0) {
        misc.user_id = document.getElementById("prolific_id").value;
    }

    // go to the preliminaries division unless wrong device is detected [#15]
    if (misc.device === 'mobile') {
        if (!is_mobile()) {
            switch_div('intro', 'notmobile');
            return;
        }
    } else if (is_mobile()) {
        switch_div('intro', 'notdesktop');
        return;
    }
    move_to_prelim('intro');
};

const move_to_prelim = function(current) {
    switch_div(current, 'prelim');
    set_screen();
};


// image file names
const img_names = ['sapling_1.png', 'sapling_2.png', 'sapling_3.png'];

// load and set up all image files
const set_images = function() {
    // preload images at the start
    DT.preload(img_names.map(img => './media/' + img))
        .then(function(images) {

            // when loaded, append each image to the corresponding div
            for (const ikey in DT.images) {
                // add img class for custom image formatting
                DT.images[ikey].classList.add("img");

                // add ID based on the file name but without the extension
                const base_name = ikey.replace('./media/', '').replace(/\.jpeg|\.png/g, '');
                DT.images[ikey].id = base_name;

                // make images draggable and add the drag function
                DT.images[ikey].draggable = true;
                DT.images[ikey].ondragstart = drag;

                // appending to the corresponding div
                document.getElementById(base_name + '_div').appendChild(DT.images[ikey]);
            }
            console.log('Preloaded images.');
        })
        .catch(function(err) {
            console.error('Failed', err);
            alert('Failed to load images! Try reloading the page or contact lkcsgaspar@gmail.com');
        });

    // set up drag and drop mechanism [#drag]
    // for divs containing the images at start
    // and the target divs where the images are to be moved to
    img_names.forEach(img_nam => {
        img_nam = img_nam.replace('.png', '');
        ['_div', '_targ'].forEach(suffx => {
            document.getElementById(img_nam + suffx).addEventListener("drop", drop);
            document.getElementById(img_nam + suffx).addEventListener("dragover", let_drop);
        });
    });
};

// prepare audio or video stimuli
const set_media = function() {
    let med_elem;
    if (misc.media.endsWith('.wav')) {
        med_elem = document.getElementById('aud_id');
        document.getElementById('media_info').textContent = tt.attend_audio;
    } else {
        med_elem = document.getElementById('vid_id');
        document.getElementById('media_info').textContent = tt.attend_video;
    }
    med_elem.preload = 'auto';
    med_elem.src = './media/' + misc.media;
    med_elem.style.display = 'block';
    restrict_media(med_elem, () => {
        // on media finishing: enable the button to move on
        document.getElementById('media_submitter').disabled = false;
    });
    if (misc.demo) {
        // if demo, enable button in the first place, to move on anytime
        document.getElementById('media_submitter').disabled = false;
    }
    console.log(med_elem);
};



const set_screen = function() {
    // restrict leaving the page, set up alert
    keep_state();

    // warn if user exits fullscreen [#21]
    fullscreen_change(() => {
        // on user entering full screen mode, the warning message is hidden
        document.getElementById('screen_feed').style.display = 'none';
    }, () => {
        // on user leaving full screen mode, the warning message is shown
        document.getElementById('screen_feed').style.display = 'block';
    });
};

// switch age input depending on "prefer not to say" checkbox
const age_check = function(e) {
    const age = document.getElementById("age_id");
    if (e.target.checked == true) {
        age.value = "";
        age.disabled = true;
    } else {
        age.disabled = false;
    }
};

// switch "other" language option depending on the corresponding checkbox
const lang_check = function(e) {
    if (e.target.checked == true) {
        document.getElementById("lg_note").style.display = 'inline';
    } else {
        document.getElementById("lg_other").value = "";
        document.getElementById("lg_note").style.display = 'none';
    }
};

// submit preliminary information (such as demographics)
const prelim_submit = (() => {
    // "clicked_once" to keep track of whether the user tried to proceed already [#36]
    // (this self-executing function serves to keep this variable local)
    let clicked_once = false;
    return function() {
        misc.sex = get_radio('sex');
        misc.age = document.getElementById("age_id").value;
        misc.age_na = document.getElementById("age_na").checked;
        misc.education = document.getElementById("education").value;
        let is_lang = false;
        ['lg_en',
            'lg_de',
            'lg_fr',
            'lg_na'
        ].forEach((lg_id) => {
            misc[lg_id] = document.getElementById(lg_id).checked;
            if (misc[lg_id]) {
                is_lang = true;
            }
        });
        misc.lg_note = document.getElementById("lg_note").value;

        if (misc.demo || clicked_once || (misc.sex && (misc.age ||
            misc.age_na) && misc.education && is_lang)) {
            switch_div('prelim', 'story_sequence');
        } else {
            clicked_once = true;
            alert(tt.please_answer_all);
        };
    };
})();

// submit story sequence results
const sequence_submit = (() => {
    // "clicked_once" to keep track of whether the user tried to proceed already [#36]
    // (this self-executing function serves to keep this variable local)
    let clicked_once = false;
    return function() {
        const sequence = [];
        img_names.map(name => name.replace('.png', '_targ')).forEach(targ_div => {
            const o_child = document.getElementById(targ_div).children[0];
            if (o_child) {
                sequence.push(o_child.id);
            }
        });
        if (misc.demo || clicked_once || sequence.length === 3) {
            misc.sequence = sequence.join('|');
            switch_div('story_sequence', 'media');
        } else {
            clicked_once = true;
            alert(tt.please_place_items);
        }
    };
})();

// media "submit" (i.e., confirm having watched)
const media_submit = function() {
    switch_div('media', 'rt_instructions');
    init_block(); // initiate first block of the response time task
};

// monitor clicks on attention checker item and remove on three clicks completed [#37]
const attention_monitor = (() => {
    // "attention_clicks" to keep track of clicks to indicate attention
    // (this self-executing function serves to keep this variable local)
    let attention_clicks = 0;
    return function(e) {
        // escape duplicate due to propagation
        if (e.target.nodeName == 'INPUT') return;
        // count the added click
        attention_clicks++;
        misc.attention = attention_clicks;
        if (attention_clicks > 2) {
            document.getElementById('attention_check_container').innerHTML = '<br><b>' + tt.attention_passed + '</b><br><br>';
        }
    };
})();

// submit follow-up information division, go to end division, upload final data
const followup_submit = (() => {
    // "clicked_once" to keep track of whether the user tried to proceed already [#36]
    // (this self-executing function serves to keep this variable local)
    let clicked_once = false;
    return function() {
        misc.likert_example = get_radio('likert_example');
        misc.analog_example = document.getElementById("analog_example");
        // if slider clicked, give slider value, otherwise NA
        misc.analog_example = misc.analog_example.classList.contains('slider_hide_thumb') ? 'NA' : misc.analog_example.value;
        misc.feedback = document.getElementById("feedback").value;

        if (misc.demo || clicked_once || (misc.likert_example != '' && misc.analog_example != 'NA')) {
            fullscreen_off();
            switch_div('followup', 'ending');
            // show completion password if ID is found (or if it's for demonstration)
            if (misc.demo !== true && misc.user_id === "noid") {
                document.getElementById('pass_container').style.display = 'none';
            }
            upload_final();
        } else {
            clicked_once = true;
            alert(tt.please_answer_required);
        }
    };
})();

// arrange file for the final format in which it is to be downloaded
const prep_file = function() {
    // join all div switch info [#6]
    misc.page_times = Object.keys(div_switches).map(function(key) {
        return (key + '_' + div_switches[key]);
    }).join('|');
    misc.full_duration = Math.round((performance.now() / 600) / 100 - Object.values(div_switches)[0]);
    return (subject_results + JSON.stringify(misc)); // JSON.stringify for appending miscellaneous data as JSON [#31]
};

// have the file downloaded manually, via pop-up [#28]
const dl_as_file = function() {
    const blobx = new Blob([prep_file()], {
        type: 'text/plain'
    });
    const elemx = window.document.createElement('a');
    elemx.href = window.URL.createObjectURL(blobx);
    elemx.download = file_name;
    elemx.style.display = 'none';
    document.body.appendChild(elemx);
    elemx.click();
    document.body.removeChild(elemx);
    // allow to leave page without alert
    window.onbeforeunload = null;
};


// store partial interim data during the experiment [#22]
const upload_interim = function() {
    if (misc.demo) {
        return;
    }
    fetch('./store_partial.php', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        },
        body: JSON.stringify({
            fname_post: file_name, // name of the file to be saved at the server
            results_post: prep_file() // data (text content) of the file
        })
    });

    // for pretesting alone, one may check the server responses as below
    // (for live testing, server response for interim storage is probably unnecessary)
    // 
    // .then(response => response.text())
    // .then(echoed => {
    //     console.log(echoed);
    // })
    // .catch((error) => {
    //     console.log(error);
    // });
};

// store final full data at the end of the experiment [#22]
const upload_final = function() {
    document.getElementById("retry_button").disabled = true;
    if (misc.demo) {
        window.onbeforeunload = null;
        document.getElementById('pass_id').innerHTML = '<i>(In case of participation via Prolific, the link would be provided here.)</i>';
        return;
    }
    document.getElementById('pass_id').innerHTML += spinner_content;
    document.documentElement.style.cursor = 'wait';
    fetch('./store_main.php', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        },
        body: JSON.stringify({
            fname_post: file_name, // name of the file to be saved at the server
            results_post: prep_file() // data (text content) of the file
        })
    })
        .then(response => response.text())
        .then(echoed => {
            // in case of successful server connection [#27]
            console.log(echoed);
            document.documentElement.style.cursor = 'auto';
            if (echoed.startsWith("http")) {
                // in case of message indicating successful file saving [#29]
                // (here "http" indicates the reception of a completion link)
                document.getElementById('save_fail').style.display = 'none';
                document.getElementById('save_success').style.display = 'block';

                // disable warning in case of page unload
                window.onbeforeunload = null;

                document.getElementById('pass_id').innerHTML = '<a href="' + echoed + '" target="_blank">' + echoed + '</a>';
            } else {
                // in case there was some issue with file saving
                upload_fail();
                document.getElementById('pass_id').innerHTML = echoed;
            }
        })
        .catch((error) => {
            // in case of server error [#28]
            console.log('Request failed: ', error);
            document.documentElement.style.cursor = 'auto';
            upload_fail();
            document.getElementById('pass_id').innerHTML = 'Server connection failed! ' + error;
        });
};

// if the data was not saved successfully [#28]
const upload_fail = function() {
    document.getElementById("retry_button").disabled = false;
    document.getElementById('retry_spin').innerHTML = '';
    document.getElementById('save_fail').style.display = 'block';
    document.getElementById('save_success').style.color = '#008000';
};
