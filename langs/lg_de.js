/* Gaspar Lukacs 2023 */
/*jshint esversion: 6 */

// all texts in the website (except for initial compatibility warning) in German
// (for illustration only: has not been proofread by a native speaker)
const tt = {
    notdesktop:
        /*html*/`Sie scheinen ein Smartphone oder Tablet zu benutzen. Um das vorliegende Experiment durchzuführen, müssen Sie leider einen Desktop-Computer verwenden. Sie können das Experiment von einem Desktop-Computer aus neu starten (die Website öffnen).
        <br /><br />
        Wenn Sie sicher sind, dass dies ein Fehler ist, klicken Sie <b><u><a onclick="move_to_prelim('notdesktop');">hier</a></u></b>, um fortzufahren.`
    ,
    notmobile:
        /*html*/`Sie scheinen einen Desktop zu benutzen. Um das vorliegende Experiment durchzuführen, müssen Sie leider ein Smartphone verwenden. Sie können das Experiment von einem Smartphone aus neu starten (die Website öffnen).
        <br /><br />
        Wenn Sie sicher sind, dass dies ein Fehler ist, tippen Sie <b><u><a onclick="move_to_prelim('notmobile');">hier</a></u></b>, um fortzufahren.`
    ,

    intro_text:
        /*html*/ `
            <p class='title'>
                Informationen zur Studie
            </p>

            <div id="demo_info">
                <b>Dies ist eine Demoversion des Experiments mit folgendem Inhalt
                    Unterschiede:
                </b>
                <br>
                <ul>
                    <li>Es gibt weniger Versuche (12 pro Block anstelle von 60).</li>
                    <li>Keine der Fragen ist obligatorisch, um auf die nächste Seite zu gelangen (und
                        es gibt keine Meldung, wenn Fragen nicht beantwortet werden).</li>
                    <li>Ein Vollbild wird nicht automatisch initiiert.</li>
                    <li>Es werden keine Daten auf dem Server gespeichert.</li>
                </ul>

            </div>

            <p><b>Ziel:</b>
                <br>In dem vorliegenden Experiment untersuchen wir bestimmte Einflussfaktoren auf die Reaktionshemmung. Während der
                Test werden die Teilnehmer aufgefordert, bei jedem Versuch mit einer von zwei Antworttasten zu antworten, je nach
                die
                Item auf dem Bildschirm präsentiert. Bei einer Teilmenge der Versuche folgt auf das Item ein zweites Item (ein Stop
                Signal),
                In diesem Fall sollten die Teilnehmer die bereits eingeleitete Antwort abbrechen und keine Tasten drücken.
            </p>

            <p><b>Zahlung:</b>
                <br>
                Diese Aufgabe dauert etwa 10 Minuten. Sie sollte in einer Sitzung durchgeführt werden, ohne lange (mehr als ein paar Minuten) Pausen.
                <span id="pay_info">
                    Ihre gültig abgeschlossene Teilnahme wird mit 2 GBP belohnt.
                </span>
            </p>

            <p><b>Rechte:</b>
                <br>Sie können die Teilnahme an der Studie jederzeit ohne Angabe von Gründen beenden (durch Schließen oder
                erfrischend
                diese Website).
            </p>

            <p><b>Technische Anforderungen:</b>
            <br>
                <span id='device_type'></span> Wir empfehlen dringend, den Browser Google Chrome oder Mozilla Firefox für
                diesen Test. Bevor Sie beginnen, schalten Sie bitte den Browser in den Vollbildmodus (drücken Sie <kbd>F11</kbd> oder, auf dem Mac, <kbd>Strg</kbd>+<kbd>Befehl</kbd>+<kbd>F</kbd> oder <kbd>Fn</kbd>+<kbd>F</kbd>), andernfalls wird er nach Ihrer Zustimmung automatisch umgeschaltet. Der Vollbildmodus sollte während des gesamten Experiments zur Reaktionszeit beibehalten werden (andernfalls erhalten Sie eine Warnung und können erst nach dem Zurückschalten in den Vollbildmodus fortfahren).
                <br>Diese Anwendung wurde sorgfältig getestet, aber wir können keine Verantwortung für mögliche technische Probleme übernehmen.
                Ausgaben
                im Zusammenhang mit Ihrer
                spezifische Software und Hardware. Bitte kontaktieren Sie <a target="_blank" href="https://gasparl.github.io/">Gáspár Lukács</a> unter <a href="mailto:lkcsgaspar@gmail.com">lkcsgaspar@gmail.com</a>, wenn Sie Probleme haben.
            </p>

            <p><b>Anonymität und Datenschutz:</b>
                <br>Die Ergebnisse der Studie sollen für Forschungszwecke genutzt und veröffentlicht werden. Die Daten werden
                keine Informationen über Sie persönlich geben. Ihre Identität wird streng vertraulich behandelt.
            </p>

            <p><b>Zustimmung:</b>
                <br>Mit dem Drücken der Schaltfläche "Einverständnis & Weiter" erklären Sie, dass Sie die Nutzungsbedingungen gelesen und verstanden haben.
                obige Informationen. Sie bestätigen, dass Sie sich auf die Aufgabe konzentrieren und sie nach bestem Wissen und Gewissen erledigen werden.
                Ihre Fähigkeiten.
            </p>
            <br>

             <button class="main_button" type="button"
                onclick="consent_submit();">
                Einverstanden & Weiter
            </button>
            <br>
            <br>`,

    no_id:
        /*html*/ `<b><i>Wir konnten Ihre Prolific-ID nicht erkennen!</i></b> Daher gehen wir davon aus, dass es sich um einen freiwilligen Test handelt und Sie keine Bezahlung erhalten. Wenn Sie versuchen, diesen Test als Job über Prolific zu machen und eine Vergütung erhalten möchten, sollten Sie den entsprechenden Link öffnen. Alternativ können Sie Ihre Prolific-ID auch hier manuell eingeben:
                                    <input id="prolific_id" style="width: 230px;"
                                    maxlength="30" onkeypress="return /[0-9a-zA-Z]/i.test(event.key)">.
                                    `,
    device_mobile: 'Dieses Experiment sollte mit einem normalen Smartphone durchgeführt werden.',
    device_desktop: 'Dieses Experiment sollte auf einem normalen Desktop-Computer durchgeführt werden.',
    prelim: /*html*/`
    Bitte geben Sie uns die folgenden demografischen Informationen über sich selbst.
    <br><br>
    <br> Alter:    
    <input type="number" onkeypress='return /[0-9]/i.test(event.key)'
    oninput="this.value=this.value.slice(0,2)" min='1' max='99' id="age_id" size="4">
    | <input type="checkbox" id="age_na" onchange="age_check(event);" />
    <label for="age_na" style="font-size: 90%;">Möchte ich nicht sagen</label>

    <br><br>
    Geschlecht:<br>
    <div class="options">
        <input type="radio" id="male" name="sex" value="male">
        <label for="male">männlich</label><br>
        <input type="radio" id="female" name="sex" value="female">
        <label for="female">weiblich</label><br>
        <input type="radio" id="sex_na" name="sex" value="na">
        <label for="sex_na">Andere/keine Angaben</label>
    </div>

    <br>
    Höchste Ausbildung:
    <select id="education">
        <option value="">- wählen Sie eine -</option>
        <option value="1">Elementarschule</option>
        <option value="2">High School</option>
        <option value="3">Berufsausbildung / Berufsausbildung</option>
        <option value="4">Einige Hochschule</option>
        <option value="5">Bachelor-Abschluss</option>
        <option value="6">Master-Abschluss (oder höher)</option>
        <option value="na">Ziehe es vor, nichts zu sagen</option>
    </select>

    <br><br>
    Muttersprache:<br>

    <div class="options">
        <input type="checkbox" id="lg_en" />
        <label for="lg_en">Englisch</label><br>

        <input type="checkbox" id="lg_de" />
        <label for="lg_de">Deutsch</label><br>

        <input type="checkbox" id="lg_fr" />
        <label for="lg_fr">Französisch</label><br>

        <input type="checkbox" id="lg_na" onchange="lang_check(event);" />
        <label for="lg_na">Sonstiges</label>
        <span id="lg_note" style='display:none;'>(bitte angeben)
            <input id="lg_other" style="width: 170px;margin:0;" maxlength="20">
        </span>
    </div>

    <br>
    <br>
     <button class="main_button class_next" type="button" onclick="prelim_submit();">
    </button>
    <br>
    `,

    // story sequence
    story_instruction: 'Unten siehst du einige Bilder. Bitte bringe sie in eine sinnvolle horizontale Reihenfolge (mit dem Mauszeiger ziehen und ablegen).',

    // media instruction
    attend_audio: 'Bitte hören Sie sich die gesamte Tonspur aufmerksam an.',
    attend_video: 'Bitte sehen Sie sich das gesamte Video aufmerksam an.',

    // main task instructions
    mobile_instructions:  /*html*/`
        <p>
            Während des Vorgangs sehen Sie unten auf dem Bildschirm zwei Schaltflächen, die wie die unten abgebildete aussehen.
        </p>

        <div class="btn_class" style="position: relative;transform:none;">
        </div>

        <p>
            Für eine "linke Antwort" tippen Sie auf die linke Schaltfläche, für eine "rechte Antwort" tippen Sie auf die rechte Schaltfläche.
        </p>`,
    desktop_instructions: `
        <p>
          Während der Aufgabe verwenden Sie bitte die linken <kbd>`+ keys.left.toUpperCase() + `</kbd> Tasten für eine "linke Antwort" und die rechten <kbd>` + keys.right.toUpperCase() + `</kbd> Tasten für eine "rechte Antwort".
        </p > `,
    block_text: [
        // Block 1
        /*html*/`
        <p class='title'>
            Anweisungen zur Aufgabe
        </p>
        <b><span id='practice_repeat_id'></span></b>

            {{DEVICE}}

        <p>
            Bei jedem Versuch wird alle ein bis zwei Sekunden ein linkes Pfeilsymbol (← oder <-) oder ein rechtes Pfeilsymbol (→ oder ->) auf dem Display angezeigt.
            Bildschirm. Wann immer ein Pfeil erscheint, führen Sie bitte die richtige Antwort aus: links für den nach links zeigenden Pfeil, rechts für den nach links zeigenden Pfeil.
            für rechtsweisend
            Pfeil.
        </p>

        <p>
            Sie werden mit einer Übungsphase beginnen.
        </p>
        <br>
         <button class="main_button" type="button" onclick='init_trials();'>Start</button>
        <br>
        <br>

        `,
        // Block 2
        /*html*/ `
            <p>
                Für den Rest der Aufgabe erscheint bei einigen Versuchen sehr kurz nach dem Erscheinen des Pfeils die Meldung "STOP!
                auch über dem Pfeil erscheinen. Wenn dies geschieht, versuchen Sie bitte Ihr Bestes, um Ihre Antwort zu stoppen und <i>nicht
                    antworten</i> darauf
                Versuch.
            </p>
        
            <p>
                Es ist normal und zu erwarten, dass Sie nicht immer in der Lage sind, erfolgreich anzuhalten, wenn eine "STOP!
                erscheint. Wenn Sie jedoch weiterhin versuchen, mit aller Kraft anzuhalten, wenn die Meldung "STOP!" erscheint, werden Sie
                sollte manchmal aufhören können.
            </p>
        
            <p>
                <b>
                    Bitte balancieren Sie die Anforderung aus, schnell und präzise auf die Pfeile zu reagieren, während Sie sich gleichzeitig bemühen, die
                    bis zur Meldung "STOP!" anhalten.
                </b>
            </p>
            <br>
             <button class="main_button" type="button" onclick='init_trials();'>Start</button>
            <br>
            <br>
        
                `,
            // Block 3
            /*html*/ `
        <p>
            Sie können jetzt eine kurze Pause einlegen. Der Rest der Aufgabe läuft ähnlich ab, nur dass die Zeitdauer zwischen dem Pfeil und dem Stoppsignal etwas anders ist.
        </p>
    
        <p>
            <b>
                Bitte balancieren Sie die Anforderung aus, schnell und präzise auf die Pfeile zu reagieren, während Sie sich gleichzeitig bemühen, die
                bis zur Meldung "STOP!" anhalten.
            </b>
        </p>
        <br>
         <button class="main_button" type="button" onclick='init_trials();'>Start</button>
        <br>
        <br>
        `
    ],
    practice_repeat: /*html*/ `Du hattest zu wenige richtige Antworten, also musst du diese Übungsrunde wiederholen.`,

    // main task response time details
    stop_signal: 'STOP!',
    tap_start: 'Tippen Sie auf eine der beiden Tasten, um zu starten!',
    key_start: 'Zum Starten die Leertaste drücken!',
    tap_here: 'Tap here!', // written on screen buttons
    key_astray: 'Ungültige Taste gedrückt! Die gültigen Tasten sind: <kbd>' + keys.left.toUpperCase() + '</kbd> (links) und <kbd>' + keys.right.toUpperCase() + '</kbd> (rechts)',
    key_correct: 'Richtig!', // wenn die richtige Antwort gewählt wurde
    key_wrong: 'Falsch!', // wenn die falsche Antwort gewählt wird
    too_slow: 'Zu langsam!', // wenn innerhalb der Antwortzeit keine Antwort gegeben wird
    pausing:  /*html*/ `<b style='border:1px red;'>Sie machen gerade eine Pause. {{RESTART}} Bitte fahren Sie innerhalb von 10 Minuten fort! (Verbleibende Zeit: <span id = "countdown"></span>)</b>`,
    tap_restart: 'Tippen Sie auf eine der beiden Tasten, um fortzufahren!',
    key_restart: 'Drücken Sie die Leertaste, um fortzufahren!',
    screen_feed: /*html*/ `Bitte verwenden Sie <button type="button" style="font-size:35px;" onclick="fullscreen_on();">diesen Button</button>, um wieder in den Vollbildmodus zu wechseln.`,
    timed_out: 'Sie haben die Seite zu lange inaktiv gelassen, über 10 Minuten. Sie können trotzdem weitermachen, wenn Sie wollen, aber Ihre Teilnahme kann ungültig sein.',
    // follow-up division
    followup:/*html*/ `
        Bitte geben Sie an, ob Sie mit der folgenden Aussage einverstanden sind:
        Meine Umgebung war während des Tests ruhig und gelassen.
        <!-- [#32] -->
        <div class="likert">
            <label><input name="likert_example" type="radio" value="1" /><span>
                    Stimmt überhaupt nicht zu
                </span></label>
            <label><input name="likert_example" type="radio" value="2" /><span>
                    Nicht einverstanden
                </span></label>
            <label><input name="likert_example" type="radio" value="3" /><span>
                    Weder zustimmen noch nicht zustimmen
                </span></label>
            <label><input name="likert_example" type="radio" value="4" /><span>
                    Zustimmen
                </span></label>
            <label><input name="likert_example" type="radio" value="5" /><span>
                    Stimme voll und ganz zu
                </span></label>
        </div>

        <hr>
        Um zu zeigen, dass Sie aufmerksam sind, klicken/tippen Sie bitte dreimal auf eines der folgenden Symbole
        Optionen.
        <!-- [#37] -->
        <div id="attention_check_container">
            <div class="likert" onclick="attention_monitor(event);">
                <label><input name="attention_example" type="radio" value="1" /><span>
                        Stimmt überhaupt nicht zu
                    </span></label>
                <label><input name="attention_example" type="radio" value="2" /><span>
                        Nicht einverstanden
                    </span></label>
                <label><input name="attention_example" type="radio" value="3" /><span>
                        Weder zustimmen noch nicht zustimmen
                    </span></label>
                <label><input name="attention_example" type="radio" value="4" /><span>
                        Zustimmen
                    </span></label>
                <label><input name="attention_example" type="radio" value="5" /><span>
                        Stimme voll und ganz zu
                    </span></label>
            </div>
        </div>

        <hr>
        Wie sehr hat Ihnen dieses Experiment gefallen? <br>
        <i>(Klicken Sie irgendwo auf den Schieberegler, um das Ausmaß Ihres Vergnügens zu markieren.)</i>
        <!-- [#33] -->
        <div class="scale_a_container">
            <div class="scale_a_left">
                Überhaupt nicht
            </div>
            <div class="scale_inside">
                <input type="range" min="0" max="100" value="-1" class="slider slider_hide_thumb" id="analog_example"
                    onclick="this.classList.remove('slider_hide_thumb');">
            </div>
            <div class="scale_a_right">
                Extrem
            </div>
        </div>

        <hr>
        In dem Textfeld unten können Sie Kommentare, Feedback oder Vorschläge hinterlassen. Insbesondere, wenn Sie
        Wenn Sie während des Tests auf technische oder andere Schwierigkeiten gestoßen sind, teilen Sie uns dies bitte mit.
        <div style="display: flex;margin-top: 10px;">
            <textarea id="feedback" oninput="char_count(this,'counter');" maxlength="800"></textarea>
            <input disabled maxlength="3" value="800" id="counter">
        </div>

        <hr>
        <button class="main_button" type="button" onclick="followup_submit();">
            Einreichen
        </button>
    `,
    attention_passed: 'Danke, dass Sie aufgepasst haben. Sie können fortfahren.',
    please_answer_all: 'Bitte beantworten Sie alle Fragen auf dieser Seite.',
    please_answer_required: 'Bitte beantworten Sie die erforderlichen Fragen.',
    please_place_items: 'Bitte platzieren Sie alle Bilder in den Zielboxen.',
    no_paste: 'Bitte fügen Sie nichts in dieses Feld ein.',

    // last division
    ending:
        /*html*/ `
                <b>Das ist das Ende des Experiments, danke für die Teilnahme!</b>
                
                <span id="pass_container">
                <br><br>
                    Bitte öffnen Sie den folgenden Link, um Ihre vollständige Teilnahme zu registrieren:
                    <br>
                    <span id="pass_id">[Bitte warten, der Link ist noch nicht verfügbar.]</span>
                </span>
                <br>
                <br>
                Sie können auch den folgenden Code verwenden, um Ihre Teilnahme zu bestätigen: <b><span id="subj_id"></span></b>
                <br>
                <br>
                <p id="save_success" style="display:none;">
                </p>
                <p id="save_fail">
                </p>
                Wenn Sie Fragen zu diesem Experiment haben, wenden Sie sich bitte an <a target="_blank" href="https://gasparl.github.io/">Gáspár Lukács</a> unter <a href="mailto:lkcsgaspar@gmail.com">lkcsgaspar@gmail.com</a>.
                `,
    save_success:
        /*html*/ `Ihre Daten wurden sicher gespeichert. Sie können diese Webseite schließen.
                <br>
                <br>`
    ,
    save_fail:
        /*html*/ `Daten können nicht auf dem Server gespeichert werden. Vielleicht gibt es ein Problem mit der Internetverbindung? <b>Drücken Sie diese <button onclick="upload_final();" id="retry_button">RETRY<span id="retry_spin"></span></button> Taste, um das Speichern auf dem Server erneut zu versuchen. (Diese Meldung verschwindet nach erfolgreichem Speichern.) Alternativ können Sie auch diese <button onclick="dl_as_file();">DOWNLOAD</button>-Schaltfläche drücken, um Ihre Daten zu speichern
                manuell (Hinweis: Sie müssen Pop-ups zulassen), und senden Sie es dann an lkcsgaspar@gmail.com.</b>
                <br>
                <br>
            `,
    unload_warn: 'Wenn Sie diese Seite verlassen, geht Ihr gesamter Fortschritt verloren. Sind Sie sicher, dass Sie fortfahren wollen?',
    class_next: 'Weiter'
};