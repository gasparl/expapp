/* Gaspar Lukacs 2023 */
/*jshint esversion: 6 */

// simulate user's keypresses
let sim_user_x = function() {
    const rt_sim = rdigit(400, 600);
    simTimeout = setTimeout(function() {
        // e.g. 50% chance for left key
        const sim_key = Math.random() < 0.5 ? keys.left : keys.right;

        document.dispatchEvent(new KeyboardEvent('keydown', {
            'key': sim_key
        }));

        console.log("-- trials left: " + block_items.length +
            ", #" + trial_number + "\n" + sim_key + " RT: " +
            rt_sim);
    }, rt_sim);
};

let sim_user, simTimeout;

// start automatic responding
const test_on = function() {
    sim_user = sim_user_x;
};

// cease automatic responding
const test_off = function() {
    clearTimeout(simTimeout);
    sim_user = null;
};
