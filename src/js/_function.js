/**
 * Functions declaration
 */

function addWMSHost() {
    if (!app.input.url || !app.input.name) {
        return;
    }
    var inputhost = {
        url: app.input.url,
        name: app.input.name,
        layers: []
    };
    app.server.push(inputhost);
    app.input.url = '';
    app.input.name = '';
    localStorage.Server = JSON.stringify(app.server);
    getLayerList(inputhost);
    log("host added");
}

/**
 * Check if localStorage has Server list inside
 * @return {void}
 */
function checkExistingHost() {
    if (typeof localStorage.Server === 'undefined') {
        localStorage.setItem('Server', '[]');
    }
    var hosts = JSON.parse(localStorage.Server);
    app.server = hosts;
    if (hosts.length > 0) {
        getLayerList(hosts[0]);
        log('localStorage found.');
    }
}

/*!
 * Clean saved localStorage object.
 * @return {void}
 */
function clearLocalStorage() {
    localStorage.clear();
    checkExistingHost();
    log("localStorage cleared.");
}

function deleteServerItem(x) {
    log(x);
    return log('deleted server list');
}

function editItem(index) {
    log(app.server[index].name);
    app.input.name = app.server[index].name;
    app.input.url = app.server[index].url;
}

/**
 * Console log
 * @param  {any} x any object, string, array, number
 * @return {void}
 */
function log(x) {
    if (!DEBUG) {
        return;
    }
    console.log(x);
}

function removeItem(index) {
    app.server.splice(index, 1);
    updateServerList();
}

function updateServerList() {
    localStorage.Server = JSON.stringify(app.server);
}

function loadingEnd() {
    document.querySelector('.loading').style.display = '';
}

function loadingStart() {
    document.querySelector('.loading').style.display = 'block';
}

function hideOSM() {
    osm.setVisible(false);
}

function showOSM() {
    osm.setVisible(true);
}
