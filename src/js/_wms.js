/**
 * WMS function handlers
 */

function addLayerToMap(wmsUrl, layers) {
    wmsLayers = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: wmsUrl,
            serverType: 'mapserver',
            params: {
                LAYERS: layers,
                TRANSPARENT: true
            }
        })
    });
    // wmsLayer.push(layer);
}

function getWMSCapabilities(url, server) {
    loadingStart();
    var capabilitiesRequestUrl = url + '&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            app.info.detail = this.responseText;
            loadingEnd();
            return this.response;
        } else {
            // loadingEnd();
            app.info.detail = "Not Found";
        }
    }
    xhr.open('GET', capabilitiesRequestUrl);
    xhr.send();
}

function getLayerList(server) {
    loadingStart();
    log(server);
    var url = server.url;
    var capabilitiesRequestUrl = url + '&SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities';
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var result = (new DOMParser()).parseFromString(this.responseText, "application/xml");
            var layers = result.querySelectorAll('Layer[queryable]');
            var layerList = [];
            layers.forEach(function(item, index){
                layerList.push({
                    name: item.querySelector('Name').innerHTML,
                    title: item.querySelector('Title').innerHTML,
                    legendUrl: item.querySelector('Style LegendURL OnlineResource').getAttribute('xlink:href')
                });
            });
            server.layers = layerList;
            app.info.detail = this.responseText;
            getSummaryInfo(result);
            loadingEnd();
            setTimeout(function(){
                // Prism.highlightAll();
            }, 10);
            return this.response;
        } else {
            loadingEnd();
            app.info.detail = "Not Found";
        }
    }
    xhr.open('GET', capabilitiesRequestUrl);
    xhr.send();
}

function getSummaryInfo(xml) {
    var summary = {};
    var elService = xml.querySelector('Service');
    var elCapabilities = xml.querySelector('Capability');
    summary = {
        service: {
            name: elService.querySelector('Name').innerHTML,
            title: elService.querySelector('Title').innerHTML,
            onlineResouce: elService.querySelector('OnlineResource').getAttribute('xlink:href')
        },
        capabilities: {
            requests: {
                getCapabilities: {
                    format: parseFormat(elCapabilities.querySelectorAll('GetCapabilities Format'))
                },
                getMap: {
                    format: parseFormat(elCapabilities.querySelectorAll('GetMap Format'))
                },
                getFeatureInfo: {
                    format: parseFormat(elCapabilities.querySelectorAll('GetFeatureInfo Format'))
                }
            }
        }
    };
    app.info.summary = summary;
    return summary;
}

function parseFormat(element) {
    var result = [];
    element.forEach(function(item, index) {
        result.push(item.innerHTML);
    });
    return result;
}

function showOnMap(server) {
    getLayerList(server);
    log(JSON.stringify(server));
    var layers = updateLayerList();
    var layer = new ol.source.TileWMS({
        url: server.url,
        serverType: 'mapserver',
        params: {
            LAYERS: layers,
            TRANSPARENT: true
        }
    });
    wmsLayer.setSource(layer);
}

function updateLayerList() {
    log('click');
    var paramsLayer = document.querySelectorAll('input:checked');
    var layers = [];
    paramsLayer.forEach(function(item, index){
        layers.push(item.value);
    });
    log(layers);
    return layers;
}

function updateLayer(){
    layers = updateLayerList();
    wmsLayer.getSource().updateParams({LAYERS: layers});
}
