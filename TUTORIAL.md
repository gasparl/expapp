# Creating Web Applications for Online Psychological Experiments: A Hands-On Technical Guide Including a Boilerplate

## Table of Contents

[Introduction](#introduction)

[File Structure and Web Hosting](#file-structure-and-web-hosting)

[Basic Layout (HTML/CSS) Structure](#basic-layout-htmlcss-structure)

  * [Size, Color, and Font](#size-color-and-font)

    * [Size](#size)

    * [Color](#color)

    * [Font](#font)

[Basic Operational (JS) Structure](#basic-operational-js-structure)

  * [On Document Load](#on-document-load)

    * [Browser Compatibility](#browser-compatibility)

    * [Query String](#query-string)

    * [Multilingual Experiments](#multilingual-experiments)

  * [Precautionary Measures](#precautionary-measures)

    * [Unloading the Web Page](#unloading-the-web-page)

    * [Fullscreen](#fullscreen)

    * [Scaling](#scaling)

[Data Storage](#data-storage)

  * [Partial Data](#partial-data)

  * [Complete Data](#complete-data)

  * [Data Format](#data-format)

[Collecting Survey Data](#collecting-survey-data)

[Collecting Behavioral Data](#collecting-behavioral-data)

[Pretesting](#pretesting)

---

## Introduction

This tutorial is connected to an open-source boilerplate project at
<https://github.com/gasparl/expapp>, which includes typical survey
measures (multiple choice questions, scales, etc.) as well as,
centrally, a stop-signal task (SST) as a common example for a
psychological response time test. The code sections relevant to given
topics are marked in the scripts with bracketed numbers as \[n1\],
\[n2\], and so forth, and are cited via these numbers in the present
tutorial. All modern text editors for programming (e.g., [Visual Studio
Code](https://code.visualstudio.com/), [Sublime
Text](https://www.sublimetext.com/)) allow searching an entire directory
with all script files included (as downloaded from the [GitHub
repository](https://github.com/gasparl/expapp)). Hence one has to simply
search for, for example, “n2” or “\[n2\]” (without quotes) to find the
relevant functions or lines of code in the given script files. The
GitHub repository can be searched directly too (e.g., as
<https://github.com/gasparl/expapp/search?q=n2>).

Due to its technical nature and despite not going into great detail (and
not dwelling on advanced methods such as eye-tracking or 3D
simulations), this tutorial necessarily describes a relatively specific
approach. Even more so, the boilerplate implements one very specific
approach. Tasks can be designed and scripts can be written in many
different ways, and everyone may have their own preferred
implementation. In the end, however, browser-based experimentation is
restricted (or enabled) by the functions that the browsers make
available. The ways to call these functions so that you make use of them
most effectively is even more restricted. In any case, regardless of
personal preferences regarding the details, at the very least the
present tutorial demonstrates the general workflow of how one may
effectively create web apps for online experiments.

## File Structure and Web Hosting

For an interactive webpage (or: “web app”), there is usually at least
one file of each of the following types: (a) HTML (Hypertext Markup
Language), the standard language for creating the text content,
including very basic formatting, of webpages; (b) CSS (Cascading Style
Sheets): a style sheet language for more comprehensive formatting of
HTML, and (c) JS (JavaScript): a high-level (“easy”) programming
language for making HTML webpages interactive (i.e., allows modifying
HTML elements, usually via user interaction). Simply put, one writes a
text in HTML, gives it a design with CSS, and then brings it “alive”
with JS. Building web apps using such scripts is very intuitive, and
there are various excellent free tutorial websites (e.g.,
[W3Schools](https://www.w3schools.com/) or the [Mozilla Developer
Network start
guide](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web))
and online courses (e.g., [edX](https://www.edx.org/)) for learning all
the basics. For authoritative and up-to-date information on any specific
JS method, a most recommended source is the official website of the
Mozilla Developer Network (https://developer.mozilla.org/; maintained
jointly by Mozilla, Google, Microsoft, and Samsung, among others). The
rest of this tutorial assumes a basic understanding of these three
languages.

Often, there is a single “*index.html*” HTML file. A convenience of this
conventional naming is that by entering into a web browser the web
address (uniform resource locator; URL) of the directory of the files,
without the filename, the web server by default usually returns the
“*index.html*” file, which is subsequently loaded into the browser.
Hence, for example, instead of writing
https://gasparl.github.io/expapp/index.html, one can just write
https://gasparl.github.io/expapp. Often, there is just one CSS file,
often named “*style.css*” or similar, that contains all styles for the
web page. However, in the boilerplate, there is an additional
“*rt\_task.css*” file, related to the styling of the behavioral part of
the experiment, which is somewhat distinct from the rest of the webpage,
and therefore may be more conveniently stored and managed in a separate
file. Finally, since the boilerplate includes a lot of JS code for a
variety of different purposes, there are several files to contain these
scripts. The most important ones are the following: (a) “*main.js*” –
the main workflow of the experiment; (b) “*utils.js*” (within the
“*utils*” folder) – various general utility functions; and (c)
“*rt\_task.js*” (within the “*rt\_task*” folder) – JS code related to
the behavioral (response time) experiment.

Using such files, one can create a working web app for a psychological
experiment (from here on: ExpApp) that can be opened and run locally
(i.e., on one’s computer) in any modern browser (by opening the
“*index.html*” file). However, to conduct an online experiment, there
are two crucial further requirements. First, the app should be
accessible at the “client side” by users. Here, users mean participants
accessing the app via the “World Wide Web” (the Web), that is, online,
by entering a given URL in a web browser on any computer with an
internet connection. Second, the collected data should be stored at the
“server side” for the researchers. This altogether necessitates a
webserver with the capability of storing data via a server-side language
such as [PHP](https://en.wikipedia.org/wiki/PHP) (PHP: Hypertext
Preprocessor; originally: Personal Home Page).

Using web servers and server-side languages may seem daunting at first,
but for ExpApps, this is actually very easy. Here, we describe the
proper procedure, and, in the boilerplate, we provide the necessary code
(which can remain almost exactly the same for all experiments; for
related details, see the section Data Storage below). Most universities
have their own web servers and provide web space for employees and often
even for students, either automatically allocated or upon request.
ExpApps typically require very little disk storage space, a tiny
fraction of typically provided free web spaces, less than a megabyte.
Such small and relatively infrequently accessed web spaces are also
available as free plans of various commercial hosting services (which
may be easily found googling “free php web hosting” or similar).

Whichever server may be used, they should have a detailed guide on how
to upload files to the server (normally via a file transfer protocol
\[FTP\] client, such as [FileZilla](https://filezilla-project.org/),
[WinSCP](https://winscp.net/), or [Krusader](https://krusader.org/)).
This procedure may differ slightly from server to server, but it is
generally no more complicated than logging into an account via a
straightforward graphical user interface (of an FTP client) and copying
the ExpApp files to the desired directory under the web space (similarly
to how one copies files from one directory to another on a computer’s
usual local storage space). As soon as the proper files are copied to
the server, the ExpApp is accessible at a given URL, and the collected
data will be stored at the server. The URL is always provided and
described by the web hosting facility. For instance, the root URL of the
default personal web space at the University of Vienna is
“https://homepage.univie.ac.at/firstname.lastname”. If the “index.html”
is placed in the root (top) directory, it will be available via this
URL. However, for easier management of multiple projects, each ExpApp’s
files may be placed in a separate subdirectory (i.e., folder). For
instance, the files for the SST ExpApp could be placed in a subdirectory
named “sst\_exp.” In that case, the ExpApp (via the “index.html”) will
be accessible at
“https://homepage.univie.ac.at/firstname.lastname/sst\_exp”. As a
precaution (for permanent availability, compatibility, etc.), all
resources such as third-party plugins and JS libraries (or any media,
etc.) should ideally be downloaded by the researcher and also placed
under this directory (to be sourced via the “index.html” file).

## Basic Layout (HTML/CSS) Structure

Having just one HTML file essentially gives a single-page application
(SPA). This means that the entire ExpApp will remain, throughout the
experimental procedure, at the same URL (e.g.,
https://homepage.univie.ac.at/gaspar.lukacs/sst\_exp). This (a) prevents
users arbitrarily navigating back and forth between pages (or even
skipping ones, by manually changing the URL); (b) requires only a
single-time loading (hence subsequent pages will not require any loading
time or even any internet connection at all); (c) provides an arguably
easier-to-maintain, compact code structure; and (d) makes the script
straightforward to integrate with JS-based frameworks for creating
native (and/or cross-platform) apps. For one, the HTML `head` (\[n1\])
needs only be defined and modified in one file. This `head` section may
follow the content of what is generally prescribed for websites in any
regular tutorial. Still, for ExpApps specifically, it is good to keep in
mind the option to disable auto-translation via Google Translate using
the `<meta name="google" content="notranslate">` meta-tag (\[n2\]). For
further assurance in this respect (as well as other potential
auto-translators), the HTML `body` may also be given the class
“`notranslate`” as well as “`no`” for the “`translate`” property, altogether
as `<body class="notranslate" translate="no">` (\[n3\]). If one might
wish to prevent indexing by search engines (i.e., not to be listed in
the search results of Google and the like; e.g., due to sensitive
material), one may also add a meta-tag with the “`noindex`” rule; and, to
prevent the indexing of links within the ExpApp, “`nofollow`” may also be
added to the same meta tag (\[n4\]).

To create a single-page application (i.e., having one HTML file), one
may use `<div>` (division) tags to create virtual pages (i.e., the
different views during the experiment, such as informed consent, then
demographic data input, then response time experiment, etc.). Each
division tag (i.e., tag pair; `<div>` `</div>`) contains all content of
the given page. Switching among such divisions may be aided by a
dedicated JS function (\[n5\]) that makes one division disappear (via
CSS, `display: none`), and the other appear (e.g., `display: block`), and at
the same time may execute some additional operations, such as saving the
time of the division switch (together with the upcoming page’s name;
\[n6\]).

Commonly used ad blocking browser extension automatically hide HTML
elements based on their `id` and `class` names. Therefore, to keep all
elements visible as intended, one should avoid using `id` and `class` names
such as “`ad`,” “`ads`,” “`adv`,” “`advert`,” “`advertisement`,” “`banner`,”
“`banners`,” or variants that include these as identifiable segments, such
as “`-ad-button-`” or “`##.header-ad`.”

### Size, Color, and Font

#### *Size*

For relatively consistent visual angle (i.e., perceived size) across
devices, HTML element sizes should be defined in CSS pixels (`px`).[^1]
This is, importantly, not equivalent to physical display device pixels
(whose size varies unpredictably depending on the hardware), but is an
abstract unit that explicitly serves to provide a [standardized
comparable viewing
experience](https://hacks.mozilla.org/2013/09/css-length-explained/.)
across different devices, taking into account typical viewing distances
(e.g., smartphones are typically viewed at a closer distance than
desktop computers). For desktop computers (that assume reading at an
arm’s length), one CSS pixel should be about 0.26 mm (1/96 inch), but it
should be smaller for a laptop computer (ca. 0.20 mm) and smallest for
smartphones (ca. 0.16 mm). There may be slight discrepancies between
different devices, but uniform appearance and behavior are essential for
web pages, and therefore manufacturers can be expected to closely adhere
to web standard specifications and conventions.

It may happen that, for some specific reason, a researcher would like
physically identical element sizes (e.g., a stimulus height to be always
exactly 5 cm on all devices). There is currently no programmatic way to
ensure this. Nonetheless, one possible (but not necessarily reliable)
[approach](https://doi.org/10.3758/s13428-020-01515-z) is to ask
participants to adjust sizes themselves based on a comparison of an
element size on the screen with a common object whose physical size is
known (e.g., a credit card or a specific bank note).

#### *Color*

Setting up a desired balance of hue, saturation, and brightness is
difficult enough when calibrating the display of colors in a dedicated
laboratory. In online research, however, the large variety of physical
devices used to display images together with unpredictable idiosyncratic
monitor settings and lighting conditions makes it practically impossible
to very accurately render colors, let alone to have identical colors
perceived by different participants. There have been
[proposals](https://doi.org/10.1016/j.visres.2013.04.011) for colors to
be self-calibrated by online participants, but such procedures would
still require thorough verification (e.g., to assess online
participants’ actual diligence, if any, in performing such
self-calibration). Currently, online research is a less than ideal
approach to investigate minor differences between perceived colors.
Nonetheless, it is reasonable to expect broad color definitions, such as
“green” or “red,” and large brightness differences within a screen
(i.e., relatively much darker vs. relatively much lighter colors), to
hold true for all participants. In other words, it is highly unlikely
that, for instance, an element colored fully “green” (in CSS:
“`#00ff00`”) will not be seen by all participants (with full color
vision) as some sort of green color, even though the specific type of
greenness will differ.

#### *Font*

If strictly identical font across tests is crucial (or for some reason
an unusual font type is needed), one may add font files, that contain
the desired font type outlines, to the app to be loaded (via CSS) and
used for all displayed texts. There are countless free font files (WOFF,
TTF, etc.), for various font types, available online, and easy to
integrate with CSS. However, in most cases this is probably unnecessary.
Practically all operating systems support either Arial (or the
near-identical Helvetica) or another sans-serif font type (e.g., on
Android, Roboto) that is for the human eye generally hardly
distinguishable from Arial. Hence, one may simply specify font family
for the entire ExpApp as body `{ font-family: Arial, Helvetica,
sans-serif; }` (\[n7\]), so that the app will always display all fonts in
Arial or, if that is unavailable, a very similar sans serif font type.
(In the boilerplate, user input text has a different, serif font type
\[n8\], so that it would be more distinct from the rest of the text in
the ExpApp – but this is of course just a personal preference.)

## Basic Operational (JS) Structure

### On Document Load
JS functions can be set up via “listeners” to be executed when certain
[events](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events)
(e.g., user input) are detected by the web app. One may use the
`DOMContentLoaded` event listener (\[n9\]) to execute certain JS functions
as soon as the web app is entirely loaded (i.e., when the HTML content
of the app is downloaded along with all JS code).

#### *Browser Compatibility*

“ECMAScript” is a JS standard intended to ensure the interoperability of
web apps across different browsers. In 2015, ECMAScript 6 (ES6) was
introduced as a major revision, and was soon adapted by all major modern
browsers. Nonetheless, web developers often continued to try using JS
without ES6 features in order to stay compatible with older browsers.
However, given the rapid development of browsers, it should be assumed
that nearly all, if not all, users have a browser supporting ES6.[^2]
Even so, it does not hurt to implement an easy safety check. Namely, the
initial HTML file may contain a simple warning that the browser is
outdated (or JS is disabled, though this is unlikely nowadays; \[n10\]).
Then, the JS code may start with some ES6 features (especially those
used in the given ExpApp \[n11\]). On the off chance that any of these
are not supported, the JS script exists at that point and the page
remains with the warning; otherwise, the JS script continues and
executes the first division switch from the warning to the start page of
the experiment, normally the information text for informed consent. (In
case of ES6 support in place, this switch happens so fast that the
warning text is never visible.)

#### *Query String*

Often, there are different versions of the same experiment that differ
only in some small but important aspect. For example, the same
experiment may be done in different languages. In this case, the
language may be indicated via a “query string”: a text attached to the
URL, separated by a question mark. For example, to indicate that the
given ExpApp should be in English, one may write
https://gasparl.github.io/expapp?lg=en, while, for a German version, one
may write https://gasparl.github.io/expapp?lg=de. The information for
the “lg” parameter can then be accessed in JS (\[n12\]). There can be
multiple parameters. For instance,
https://gasparl.github.io/expapp?lg=de&device=mobile may indicate an
ExpApp in German and intended for mobile devices. The mere presence or
absence of a parameter may also be used, for simplicity. For instance,
https://gasparl.github.io/expapp?lg=de&device=mobile&demo could indicate
(apart from German language and mobile version) that the given ExpApp is
to be run in demonstration (demo) mode (see under Pretesting).

The boilerplate actually checks for three parameters. The language and
the demo version is indicated just as in the examples above, but the
device type, which is restricted to either mobile or desktop (and
excludes, e.g., tablets), is indicated via an “m” parameter’s presence
(for mobiles) or absence (for desktops), for example,
https://gasparl.github.io/expapp?lg=de&m&demo. While the layout may be
dynamically adjusted based on the
“[viewport](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries)”
(currently viewed area) width measured in CSS pixels (\[n13\]), this is
not ideal for ensuring device type for the whole experiment. For
instance, with this approach, if the participant starts the ExpApp in a
small window (hence small viewport), the device would be incorrectly
categorized as mobile. Instead, one may try detection via the operating
system information accessible in JS (\[n14\]). Nonetheless, there is no
standardized or well-established approach for this, and hence no
guarantee for correct classifications in all cases. One solution, as
implemented in the boilerplate, is to warn participants in case of wrong
device detected, but offer them the option to override this and proceed
with the experiment, in case they are sure that their device type is in
fact correct and was incorrectly categorized (\[n15\]).

#### *Multilingual Experiments*

In case of multiple language versions of the same experiment, an elegant
way to store the text content is to have different JS files for each
language (in the boilerplate, two such files serve as examples,
“*lg\_en.js*” for English, “*lg\_de.js*” for German), where each
contains a JS “dictionary” object with all the various texts of the
given ExpApp. On page load, the desired language is detected from the
query string (or otherwise defaults to English \[n16\]), the
corresponding language file (with the given language’s dictionary) is
loaded, and, based on a match between element IDs and the dictionary
keys, all texts of the given language are inserted into the HTML
(\[n17\]).

### Precautionary Measures

There are some precautionary measures that may be implemented at any
point during the experiment. One good time for it might be right after
the participant consented to participation via a button click.

#### *Unloading the Web Page*

It is easy to leave (technically: “unload”) a web page by closing the
browser tab (or window) or by navigating back to a previous page (via
the browser’s “Go back one page” or similar button or keyboard
shortcut). Either way, the data gathered during the experiment would be
lost. It is possible to save all progress (i.e., data gathered) up to
the time of leaving the page using the `localStorage` JS method, so that,
on reopening the same URL, the last state of the ExpApp could be
restored. However, interrupting experiments for any substantial time is
questionable in the first place, since it could affect the results in
unpredictable ways. For instance, in a within-subject experiment, one
condition may differ from another due to some unmonitored and unknowable
activity undertaken during the break. In case of ongoing trials in a
behavioral test, returning participants may even forget the instructions
(and reminding them may create a different confound in that, unlike
other participants, in this case the test is restarted anew at this
arbitrary point). Therefore, it seems better to just disable back
navigation and to show a warning and ask for confirmation when a
participant tries to leave the page. Both can be easily implemented in
JS (\[n18\]).

#### *Fullscreen*

Conducting online experiments throughout using the browser’s fullscreen
mode is often recommended and used by experiment creator frameworks,
even though it may be debatable whether its impact is substantial.
Regardless, the technical implementation is not difficult, although
making the browser enter fullscreen mode via JS requires an active user
input, such as a keypress or a click on an element.[^3] A reasonable
approach may be to enter fullscreen when the participant consents on the
first page with a button click, and, in case the participant manually
exits the fullscreen, to reenter fullscreen on each division switch
(\[n19\]). In case of behavioral experiments, when keeping fullscreen
mode is relatively more important, user responses (e.g. keypresses) may
also be used for reentering fullscreen (\[n20\]), and one may even show
a warning text in case of leaving fullscreen, with a button option to
reenter it (\[n21\]). Lastly, an extreme solution may be to monitor all
possible user input events on the entire page, and have all of them
trigger fullscreen mode. However, unless crucial, one could also just
respect the participant’s decision not to use fullscreen and allow them
to proceed in such a way – likely contributing to a more positive
experience.

#### *Scaling*

Preventing page scaling (“zooming” in or out, typically using Ctrl and
the mouse wheel) is strongly discouraged by browser vendors and have
specific programmatic measures implemented against it, since they wish
all users to indeed be able to scale pages for accessibility (i.e.,
readability). It should also be considered that, while elaborate
[methods](https://doi.org/10.1038/s41598-019-57204-1) do exist to
measure it, viewing distance is impossible to ensure throughout an
online experiments, and therefore different participants may have very
different visual angles for the given stimuli anyway, hence it may just
be better to let them scale the page if they wish to – especially if
they otherwise might have difficulty seeing the page content. There is
in any case no established method for scaling prevention.[^4]

## Data Storage

There are several increasingly popular new server-side languages and
solutions, but, to date, owing also to the simplicity of its setup, PHP
is still by far most popular, alone accounting for the great majority of
the [market
share](https://w3techs.com/technologies/history_overview/programming_language/ms/y).
Universities typically provide servers with a PHP interpreter that
allows to use PHP code without any necessity for an in-depth
understanding of the server’s (or the PHP interpreter’s) workings. Using
PHP, data is often saved in some type of SQL (Structured Query Language)
database. However, for ExpApps, a simpler solution is to just save each
participant’s data as a separate text file. In the boilerplate, files
are saved with “.txt” extension, but, depending on the researcher’s
preference, this can simply be just changed to, e.g., “.csv,” so that it
would be automatically associated and opened with a spreadsheet
application such as Microsoft Excel or WPS Spreadsheets. Unique file
names may be ensured by, for instance, using the current date up to
seconds in addition to some randomly chosen characters.[^5] Apart from
circumventing the complications of an SQL implementation, it is also
much easier, during an ongoing experiment, to access and inspect
incoming individual data as single text files.

The PHP files provided in the boilerplate (“store\_main.php” and
“store\_partial.php”) can be used for almost any ExpApp, since
essentially all they do is just write any text content data sent from JS
(\[n22\]) to a new file created on the server. One detail to highlight
however is regarding data accessibility. Within a top directory of the
server user (i.e., here, the researcher), web spaces are provided under
a subdirectory typically named “html,” which is the web root, and under
which directory most file types (including HTML, CSS, JS, and any other
common file with text content) are publicly accessible (i.e., can be
freely loaded via the internet, using a given URL in any browser).[^6]
This is also where the entire ExpApp should be stored. If the collected
data were saved here, it would also be accessible publicly. Therefore,
such data should be saved in a different, private directory under the
web root: For example, one may create a new folder named “data” or
similar. The web root’s path can be given, in PHP, as
`$_SERVER['DOCUMENT_ROOT']`. To move up one level, to the top
directory that contains the web root (“html” folder), one uses `"/../"`.
Hence, the full path to the folder named “data” at the top directory
(next to the web root folder) may be given, in PHP, as

`$path = $_SERVER['DOCUMENT_ROOT'] . "/../data/"`

(where the dot in-between concatenates the two path parts; \[n23\]).
Files saved to this path will be accessible by the server user (via an
FTP client), but not to the public.

To more easily pretest an ExpApp, one may install a PHP server locally
on one’s personal computer (there is a variety of freely available
easy-to-use applications for this purpose, e.g.,
[XAMPP](https://www.apachefriends.org/) or
[WampServer](https://www.wampserver.com/)). However, given the
straightforward nature of the given PHP script, this may be unnecessary.
One may pretest the HTML/CSS/JS framework (the largest part of the work)
locally, and, when this far the ExpApp is working, in the end the PHP
files may be added and uploaded to the server to pretest the full ExpApp
with all files together.

### Partial Data

To assess [dropout rates](https://doi.org/10.1037/pspa0000056), partial
data may be collected. For instance, when the page is first loaded, and
afterwards on each division switch, all data up to that point may be
stored on the server. Dropouts are typically discussed in the context of
their biasing effects on surveys, but they may in fact impact behavioral
data collection as well. Hence, partial data may also be intermittently
stored on the server during behavioral data collection at a certain
desired interval (e.g., in the boilerplate, having about hundred trials
altogether, at every tenth trial \[n24\]), saving all data up to that
point. In the boilerplate, partial data file names start with each given
participant’s IP address, so that one may easily sort files based on
that, for an easier overview of potential multiple initiations of the
ExpApp from the same IP during an ongoing experiment.[^7] Storing each
new partial file separately is generally superfluous (although one may
choose to append new partial data to the same file); the PHP code in the
boilerplate simply overwrites the partial file on each new saving
(\[n25\]).

### Complete Data

At the end of the experiment, the full complete data may be stored in a
file that is separate from the partial files. Here, to absolutely ensure
that none of the already stored complete data files may be in any way
erased or damaged, in case of an existing file with the same name, the
PHP code in the boilerplate appends the new content to the end of the
previous content, leaving the latter intact (\[n26\]). The JS function
on the client side awaits the server response and provides corresponding
feedback to the participant (\[n27\]). In case of any sort of issue
(e.g., temporary loss of internet connection), the participant is
offered two options: (a) a retry button via which saving the file at the
server is reattempted, and (b) a download button via which the results
files may be manually downloaded (\[n28\]) and sent via email to the
researcher. In case of successful storage (on the first or any
subsequent attempts), a success message is shown[^8] (and the warning
regarding leaving the page is disabled; \[n29\]).

### Data Format

Data format may particularly be up to preference, but one convenient way
is to keep behavioral data in single lines per trial (\[n30\]), while
keeping all other, miscellaneous (e.g., demographic) data in
[JSON](https://en.wikipedia.org/wiki/JSON) (JavaScript Object Notation)
format in the very last line of the file (\[n31\]). Web (and other) apps
for experimental data collection often include all miscellaneous data in
each line of each trial (as constants, i.e., the same value in each line
under the given column). However, in case of a great amount of such data
(e.g., survey responses), this makes the resulting text difficult to
read for humans, as well as unnecessarily increasing file sizes. If
desired, for subsequent analysis, the JSON format can be easily
restructured into newly designated columns per each row. (The R script
for analysis, included in the boilerplate, also contains such a
conversion just to provide an example, using just a couple of lines of
code.)

## Collecting Survey Data

Collecting survey data (via checkboxes, multiple choice questions,
scales, text input) is a basic and extremely widely used feature of web
apps, and therefore there is very little to add to this topic that is
not already widely known and available via various online tutorials.
General precautionary methods for survey data are also extensively
discussed in various previous [review
papers](https://doi.org/10.1016/j.jesp.2015.07.006). Nonetheless, since
this is also an essential feature of many online psychological
experiments, it seems worthwhile to dedicate some remarks to this matter
regarding technical aspects and opportunities.

Compatibility with smartphones should be considered, in particular in
case of Likert scales. Today still, Likert scales presented on computers
often resemble traditional paper-based versions, using ticks with labels
underneath, even though there is the arguably more elegant possibility
of creating clickable (button-like)
[labels](https://jamesalvarez.co.uk/blog/how-to-make-responsive-likert-scales-in-css-(like-qualtrics)/),
which also allows easy adjustment for smartphones (by vertical
alignment, as in the boilerplate \[n32\]).

Analog scales can be easily implemented via the input type “range,”
which provides a certain default slider. For custom design however,
which also ensures uniform look across browsers, these sliders may be
modified via CSS (\[n33\]).

Another option worth considering is that, unlike in case of a
paper-based scale, one may easily measure the precise time of responses,
as well as any changes in the answers (i.e., an initial selection
followed by a different selection). This not only applies to tick boxes
and scales, but also to text input, where key-down and key-up times may
be recorded to obtain [typing
pattern](https://doi.org/10.1109/ACII.2017.8273592) data.

For text input in general, some of the following events might be useful
to detect: “drop,” “paste,” “copy,” “cut,” “selectstart,” “drag,” and
“input.” Whether detecting and reacting to any of these events is
actually necessary or sensible for any given text field is up to the
researcher. Still, for example, it seems prudent to prevent (or at least
monitor and record) any manner of copy-pasting when participants are
asked to write long repetitive texts, or in fact, considering the
nowadays widely available artificial text and essay generators, any sort
of long text (\[n34\][^9]). In case of text input with a given
requirement (e.g., manually typing in sentences to be copied) it may be
useful to allow a certain percentage of typos. This can be done via a
text-similarity calculator function (\[n35\]).

Regarding all questions, giving a “prefer not to answer” or similar
option is widely recommended, partly out of ethical reasons (not to
force participants into answering questions they do not wish to answer),
and partly because otherwise, participants not wishing to answer may
provide dishonest or random responses. However, even so, it may happen
that, to any given question, participants prefer not to give even
“prefer not to answer” answers, or perhaps they simply forget to make an
answer. In that case, a warning may be given when they attempt to submit
the answers (or continue to the next page). However, one may opt to only
show the warning once, and allow passing on any subsequent attempt
regardless of any completely unanswered questions (\[n36\]).

Best practices of [attention
checks](https://doi.org/10.1016/j.jom.2017.06.001) are a whole separate
topic, but here one brief related suggestion is just that it is helpful
to think beyond conventional paper-based checks and to make use of
technical possibilities for this purpose. For instance, instead of
asking participants to select a specific answer on a Likert scale (which
could however also happen by accident), they may rather be asked to
click three times on any of the Likert scale items (\[n37\]). Of course,
it is better to use multiple attention checks throughout the experiment,
each according to the specific task.

Some further easy-to-do yet perhaps neglected possibilities in ExpApps
are dragging and dropping items (\[n38\]) and geolocation (\[n39\]).
Presenting video or audio, one may ensure that the given media is
watched or listened to from the beginning to the end, and only once
(\[n40\]). (In a real experiment, an initial sample audio or video clip
could precede the main ones – this is omitted from the boilerplate for
brevity.)

In the context of online experiments, it is advisable (and costs
practically nothing), to include a brief question on the calmness and
quietness of the environment during testing, and an open-ended question
regarding any potential feedback, in particular – and hence the present
point’s relevance to this tutorial – if the participant may have
experienced any sort of technical issues (especially useful in case of
initial piloting).

## Collecting Behavioral Data

Unlike collecting survey data, collecting behavioral data is not at all
a basic feature of web apps, nor is it widely used. Rather, it is
largely restricted to those conducting behavioral experiments online,
primarily for academic research. The present section focuses on keypress
and tap response times, but the general approach would similarly apply
to other experiments involving sequential stimulus presentation and
precise timing.

All details of the relevant code, in the “*rt\_task.js*” file, are
throughout commented within the script. Here, only a general outline is
given. Namely, a typical and convenient method is to generate, preceding
the start of each block, a list of objects where each object contains,
as properties, the information for a single trial in the experiment
(e.g., the text to be displayed, the color in which it is to be
displayed, etc.; \[n41\]). Following this, the entire block can be run
sequentially taking one object after another from the pre-generated list
(until none is left), and, from each objects, the desired properties are
accessed in order to correctly prepare and execute each given trial
(\[n42\]).

Given the lack of supervision, in online experiments it is most
recommended to include practice trials with trial-by-trial feedback
regarding the correctness of responses (\[n43\]). In case of too few
valid responses (including too slow responses, as well as suspiciously
fast ones, such as below 150 ms, indicating random responding), the
entire practice phase may be asked to be repeated (\[n44\]). In the
boilerplate, there is maximum one repetition only, and at the second
completion the participant is allowed to continue regardless of the
ratio of valid responses. Trial-by-trial feedback, especially regarding
incorrect and too slow responses, may continue during the main phase of
the task, depending on the scenario and the researcher’s preferences. In
the boilerplate, just for the sake of providing a technical example for
both cases, there is no feedback during the main phase. Furthermore,
response time limit is only given during the practice phase, and not
during the main phase.

Given the lack of control, one should ideally record all available
relevant information. While in regular experimental creators, pressing
an invalid key is not usually recorded, it may be good practice to
record this in online experiments (\[n45\]) and exclude such trials in
the subsequent analysis (i.e., when an invalid keypress precedes an
otherwise valid keypress, this latter should not be considered valid
either, since, evidently, the wrong keypress likely influenced its
time). Apart from recording, the boilerplate also warns users in case of
an incorrect keypress (\[n46\]; particularly useful when no
trial-by-trial feedback is given otherwise). Finally, one may even
record, for each user input (such as keypresses), whether it was
simulated via JS or not (via the event’s
[`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted)
property \[n47\]).[^10]

The potential problems in case of lengthy interruption in case of
closing the ExpApp were discussed above (section: Unloading the Web
Page). However, it may also happen that a participant does not close the
ExpApp but leaves it unattended. For this reason, inactivity may also be
monitored and related warning may be given (\[n48\]). In the
boilerplate, for example, a warning message is displayed in case of not
pressing either possible response key for over ten seconds. The trials
are also halted. (Otherwise, if there is a response time limit that
automatically ends trials, trials would continue even if unattended.)
The warning also contains a ten-minute countdown. On reaching zero, the
participant may still continue, but the participation may be deemed
invalid. (If so, participants should be correspondingly warned in
advance at the start, before they consent to participate.)

For best precision for the timing of the display changes (such as the
appearance of a stimulus), it is
[recommended](https://doi.org/10.3758/s13428-022-01835-2) to implement a
continual recursive call of the
[`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
JS function, and to execute each display change within a new
`requestAnimationFrame` call. In the boilerplate, a dedicated set of
functions are provided in a separate “*disptime.js*” file. Using these
functions, the recursive call may be easily started (\[n49\]) and
stopped (\[n50\]), and the display change may be easily executed within
a new `requestAnimationFrame` call (\[n51\]; including an optional second
display change at a given time interval). Also for precise timing, image
files to be displayed should be loaded in advance, should
[preferably](https://doi.org/10.3758/s13428-021-01694-3) be small
images, and displayed via either visibility or opacity change.

## Pretesting

For most ExpApps, it probably makes little sense to implement
programmatic automatized unit-testing (i.e., checking whether certain
parts of the app keep their intended behavior following each
modification of the code). Rather, one should thoroughly manually
pretest the app for each new experiment via several browsers. For
semi-manual testing however, user actions such as keypresses can be
simulated via dedicated JS functions. This is particularly relevant to
behavioral data collection, where a lengthy and strenuous examination,
such as hundreds of trials measuring key responses, can be run with
automatized simulations of keypresses. For the SST in the boilerplate,
the simulation functions for testing are all in the “*sim\_test.js*”
file. The function executing keypress simulation can be made available
or unavailable via dedicated functions (`test_on()` and `test_off()`).
When the function is available, it is always called from the function
that initiates each upcoming trial (\[n52\]). Thereby, in each block,
the entire response time task will run automatically.

For any ExpApp, a simplified, demo version may be created, which can be
more easily run than the full version. For instance, in the boilerplate,
the changes compared to the full version are: (a) there are less trials
per block (just one per each unique type); (b) none of the questions are
obligatory in order to proceed to the next page (and there is no alert
if questions are not answered); (c) no fullscreen is initiated
automatically; (d) no data is saved on the server. This is, on the one
hand, to serve as a demonstration for collaborators, reviewers, and the
eventual readers of a published study. On the other hand, it may also
serve to more easily pretest the main features of an ExpApp. As
explained above, the demo version of the ExpApp can be indicated in the
URL’s query string that is subsequently detected in JS (\[n53\]).

Again, uniform behavior (based on the specifications by the World Wide
Web Consortium) is essential for web apps, and very unlikely to be
ignored by vendors of software and hardware. Even so, it has been
repeatedly [shown](https://doi.org/10.7717/peerj.9414) that different
combinations of operating systems and browsers may give slightly
different results, and browsers in particular differ in their
implementation and support of JS methods. To prioritize pretesting, one
may first off rely on [market share
statistics](https://doi.org/10.3758/s13428-020-01501-5) that also
indicate the likely distribution of the types of the given software and
hardware of eventual participants. For one, the current [browser market
share](https://gs.statcounter.com/browser-market-share) is almost
entirely (\>96%) covered by Google Chrome, Safari, Microsoft Edge,
Mozilla Firefox, Samsung Internet, and Opera, with the first (Google
Chrome) covering the majority (\>60%), and first four covering the vast
majority (\>90%). However, it is also good to keep in mind that, with
the exception of Safari and Mozilla Firefox, all these browsers are
based in a large part on the (itself alone infrequently used) Chromium
browser. Furthermore, Chromium itself is partly based on Safari’s
(WebKit) code. The implication is that, at least for desktop computers
and laptops, the first browser to pretest is Google Chrome, since, not
only does this cover the majority, but it is also a likely indication of
how other Chromium-based browsers (and, to a lesser degree, Safari)
work. The next would be Mozilla Firefox, due to its standalone codebase;
then, Safari, due to its relatively large coverage and relatively
independent codebase. Doing pretests on the rest of the major browsers
as well may still be useful. For prioritizing browser tests in real
experiments, location and device type (e.g.,
[smartphone](https://www.similarweb.com/browsers/worldwide/mobile-phone/)
instead of desktop) should also be taken into account.

Finally, if uniform appearance and behavior is crucial, one may disallow
participation using any browser except the desired one(s). Participants
may be warned and prevented to continue in case of the detection of any
undesired browser (\[n54\]).

---

### Footnotes

[^1]: The notable exception is when an element’s size is specified
    relative to its parent element’s size. For instance, a smaller
    square within a larger square may be specified to have height and
    width as 50%, so that it would always be half the size of the larger
    square (whose width and height is specified in pixels). In that
    case, both can be modified by modifying the latter’s pixel sizes.

[^2]: Features introduced in ES7 (in 2016) and later are probably best
    to avoid. Although by now ES7 too has wide support, it does not
    provide major improvement over ES6 in view of ExpApps, and hence it
    seems unnecessary.

[^3]: This is implemented by browser vendors to prevent web apps
    enforcing fullscreen without any consent by the user. For the same
    reason, if fullscreen is important, the implementation of its
    enforcement should ideally be tested in the most recent versions of
    all common browsers.

[^4]: Just for those who may for some reason absolutely insist on
    disabling scaling, one potential workaround may be noted here, as it
    seems to work at the moment of writing this, although it is not
    implemented in the boilerplate and not at all recommended. It
    probably cannot be found anywhere online, because it is contingent
    on having continually identical physical window size on the screen,
    which is a specific case of ExpApps that enforce fullscreen mode
    throughout. The idea is to listen to CSS window size changes (which
    happens in case of scaling; measured in CSS pixels) and, on each
    such event, resize the stimuli based on the ratio of the current
    window size and the screen size. Note however that this may still
    cause distortions in case of participants using multiple monitors
    and moving the browser to a different monitor during the experiment.

[^5]: However, even in the extremely unlikely case of an accidental
    repetition of such a random file name, the second data would simply
    be appended to the first one, and this would be noticed during data
    analysis due to the unexpected length and format, and may be easily
    separated manually.

[^6]: As one exception, on PHP servers, PHP files’ contents are
    automatically made inaccessible to the public. Therefore, if needed,
    one may include certain sensitive data (e.g., login information for
    SQL connections) in PHP files themselves.

[^7]: This is for a very informal and indirect information only. IP
    addresses are very unreliable indicators of unique participations
    and no serious conclusions can be based on them. At the very least,
    it is in principle possible that two persons legitimately share the
    same computer.

[^8]: The boilerplate provides an example (Prolific) completion link. If
    one would like to recruit participants without dedicated platforms,
    an easy solution is to show the dedicated (and random) subject ID to
    participants at the end as a completion code, so that the saved data
    can be verified as associated with the given participant who
    requests a reward (e.g., by forwarding this completion code via
    email).

[^9]: This involves preventing “paste” as well as “drop” events. Online
    forms that wish to disable copy-pasting seem, from personal
    experience, more often than not hackable by dragging and dropping
    content into text fields, since they do not prevent “drop” events
    (which are technically different from pasting, but essentially
    accomplish the same).

[^10]: Speaking from abundant personal experience, some participants are
    really capable of all sorts of trickery to get done with the task
    faster or easier. However, this has been observed far less often on
    [Prolific](https://www.prolific.co/) than on more general
    crowdsourcing websites for microtasks
    ([MTurk](https://www.mturk.com/), [Appen](https://appen.com/)) –
    also corresponding to the conclusions of formal assessments of data
    quality per platform (see, e.g., [Peer et al.,
    2021](https://doi.org/10.3758/s13428-021-01694-3); [Uittenhove et
    al., 2022](https://doi.org/10.31234/osf.io/uy4kb)). There is however
    no perfect assurance against cheating. For instance, participants
    may use an external robotic lever for responses, or they may just
    generate artificial data to be submitted – though such great efforts
    to substitute valid participation in a brief task is unlikely.
