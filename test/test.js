import Sidepanel from 'facade/sidepanel';

const mapjs = M.map({
    container: 'mapjs',
    //Controles que no ajustan bien 'rotate','getfeatureinfo'
    controls: ["overviewmap", "scale", 'scaleline', 'panzoom', 'mouse', 'location'],
    wmcfile: 'https://www.ideandalucia.es/visor/wmc/mapa_base.xml'
});

var configGroups = [];

/** Se añade grupo Datos de referencia **/
configGroups.push({
    title: "Datos de referencia",
    description: "Conjunto de capas que permiten la generación de un mapa de Andalucía básico",
    overlays: [

        new M.layer.WMS({
            url: 'https://www.callejerodeandalucia.es/servicios/cdau/wms?',
            name: 'CDAU_wms',
            legend: 'Vias y Portales CDAU',
            version: '1.1.1',
            transparent: true,
            tiled: true
        }),
        new M.layer.WMS({
            url: 'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
            name: 'Catastro',
            legend: 'Catastro publicada por la dirección general de Catastro',
            version: '1.1.1',
            transparent: true,
            tiled: true
        }),
        new M.layer.WMTS({
            url: 'https://www.ign.es/wmts/pnoa-ma',
            name: "OI.OrthoimageCoverage",
            legend: 'PNOA máxima actualidad publicada por el Instituto Geográfico Nacional',
            version: '1.3.0',
            transparent: true,
            tiled: true
        }, {
            params: {
                layers: 'OI.OrthoimageCoverage',
                styles: 'default'
            }
        })
    ]
});

/** Se añade grupo Mapas topográficos **/
configGroups.push({
    title: "Mapas topográficos",
    description: "Mapas topográficos de Andalucía",
    overlays: [
        new M.layer.WMS({
            url: 'https://www.ideandalucia.es/wms/mta10r_2001-2013?',
            name: 'mta10r_2001-2013',
            legend: 'Topográfico 1:10000 (raster)',
            transparent: true,
            tiled: true
        }),
        new M.layer.WMS({
            url: 'https://www.ideandalucia.es/wms/mta10v_2007?',
            name: 'mta10v_2007',
            legend: 'Topográfico 1:10000 (vectorial)',
            transparent: true,
            tiled: true
        })
    ]
});

/** Se añade grupo Mapas temáticos **/
configGroups.push({
    title: "Mapas temáticos",
    description: "Mapas temáticos de Andalucía",
    overlays: [
        new M.layer.WMS({
            url: 'https://www.ideandalucia.es/services/mta400v_2016/wms',
            name: 'mta400v_2016',
            legend: 'Topográfico 400.000 (vectorial)',
            transparent: true,
            tiled: true
        }),
        new M.layer.WMS({
            url: 'https://www.ideandalucia.es/wms/mta100v_2005',
            name: 'Mapa Topográfico de Andalucía 1:100000 Vectorial',
            legend: 'Topográfico 100.000 (vectorial)',
            transparent: true,
            tiled: true
        }),
        new M.layer.WMS({
            url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_siose_2013_explot?',
            name: 'REDIAM',
            legend: 'Explotación de la información del Proyecto SIOSE-Andalucia 2013',
            transparent: true,
            tiled: true
        }),
        new M.layer.WMS({
            url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Biodiversidad_Andalucia?',
            name: 'REDIAM',
            legend: 'Mapa de Biodiversidad de Andalucía',
            transparent: true,
            tiled: true
        })
    ]
});

/** Se añade grupo Mapas estadísticos **/
configGroups.push({
    title: "Mapas estadísticos",
    description: "Mapas con información estadística de Andalucía",
    overlays: [
        new M.layer.WMS({
            url: 'https://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/gridpob/wms?',
            name: 'gridpob_250',
            legend: 'Población en Andalucía',
            transparent: true,
            tiled: true
        }),
        new M.layer.WMS({
            url: 'https://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/gridafil/wms?',
            name: 'gridafil_250',
            legend: 'Afiliados a la Seguridad Social en Andalucía',
            transparent: true,
            tiled: true
        }),
        new M.layer.WMS({
            url: 'https://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/gridpenc/wms?',
            name: 'gridpenc_250',
            legend: 'Pensiones contributivas de la Seguridad Social en Andalucía',
            transparent: true,
            tiled: true
        }),
        new M.layer.WMS({
            url: 'https://www.juntadeandalucia.es/institutodeestadisticaycartografia/geoserver-ieca/degurbagrid/wms?',
            name: 'degurba250',
            legend: 'Grado de Urbanización de Andalucía',
            transparent: true,
            tiled: true
        })
    ]
});

/** Se añade grupo Cartografía histórica **/
configGroups.push({
    title: "Cartografía histórica",
    description: "Cartografía Histórica de Andalucía",
    overlays: [
        new M.layer.WMS({
            url: 'https://www.ign.es/wms/primera-edicion-mtn?',
            name: 'MTN25',
            legend: 'Mapa Topográfico Nacional (Primera Edición)',
            transparent: true,
            tiled: true
        }),
        new M.layer.WMS({
            url: 'https://www.ideandalucia.es/wms/mta50r_aleman_1944?',
            name: 'MTA50a_1940',
            legend: 'Mapa Topográfico de Andalucia.Estado Mayor del Ejercito de Alemania (1944)',
            transparent: true,
            tiled: true
        })
    ]
});

/** Se añade grupo Ortofotografías histórica **/
configGroups.push({
    title: "Ortofotografías histórica",
    description: "Ortofotografías Históricas de Andalucía",
    overlays: [
        new M.layer.WMS({
            url: 'https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_Ortofoto_Andalucia_1956?',
            name: 'ortofoto_1956',
            legend: 'Ortofotografía 1956-57 (Vuelo Americano)',
            transparent: true,
            tiled: true
        })
    ]
});

var configBaseMaps = [{
    img: 'build/managelayers/img/osm.png',
    layer: new M.layer.OSM({
        legend: 'OpenStreet Maps'
    })
},
{
    img: 'build/managelayers/img/pnoa.png',
    layer: new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/pnoa-ma',
        name: "OI.OrthoimageCoverage",
        legend: 'PNOA máxima actualidad publicada por el Instituto Geográfico Nacional',
        version: '1.3.0',
        transparent: false,
        tiled: true
    }, {
        params: {
            layers: 'OI.OrthoimageCoverage',
            styles: 'default'
        }
    })
},
{
    img: 'build/managelayers/img/ign.png',
    layer: new M.layer.WMS({
        url: 'https://www.ign.es/wms-inspire/ign-base',
        name: "IGNBaseTodo",
        legend: 'Mapa base del Instituto Geográfico Nacional',
        version: '1.3.0',
        transparent: false,
        tiled: true
    })
},
{
    img: 'build/managelayers/img/catastro.png',
    layer: new M.layer.WMS({
        url: 'https://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
        name: 'Catastro',
        legend: 'Catastro publicada por la dirección general de Catastro',
        version: '1.1.1',
        transparent: false,
        tiled: true
    })
}
];

//Plugin managelayers
var paramsPlugin = {
    options: {
        panel: {
            className: 'clasePrivada',
            collapsedClass: 'g-cartografia-capas2',
            tooltip: 'Gestión de capas'
        }
    },
    config: {
        thematicLayers: {
            params: {
                groups: configGroups
            },
            options: {
                iconClass: 'g-cartografia-mundo2',
                tooltip: 'Favoritas'
            }
        },
        baseLayers: {
            params: {
                baseMaps: [], //configBaseMaps,
                activatedBlankMap: false
            },
            options: {
                tooltip: 'Capas de fondo'
            }
        }
    }
}

var sp = new Sidepanel();
sp.on(M.evt.ADDED_TO_MAP, () => {
    sp.addPlugin(new M.plugin.ManageLayers(paramsPlugin), 1);
    sp.addGroup({
        icon: "g-cartografia-mas2",
        title: "Añadir Capas",
        order: 2,
        plugins: [
            { plugin: new M.plugin.AddServices(), order: 1 },
            { plugin: new M.plugin.AddLayers(), order: 2 }
        ]
    });
    sp.addGroup({
        icon: "g-cartografia-zoom",
        title: "Búsquedas",
        order: 3,
        plugins: [
            { plugin: new M.plugin.Toponomysearch(), order: 1 },
            { plugin: new M.plugin.CatalogSearch({ geoNetworkUrl: 'http://www.ideandalucia.es/catalogo/inspire/srv/spa' }), order: 2 },
            { plugin: new M.plugin.CatastroSearch(), order: 3 },
            { plugin: new M.plugin.XYLocator(), order: 4 },
            { plugin: new M.plugin.SearchstreetGeosearch(), order: 5 },
            // { plugin: new M.plugin.Geosearch(), order: 6 }
            { plugin: new M.plugin.Geocoderpelias({ options: { position: 'TL' }, config: { url: 'http://10.240.51.30/v1/' } }), order: 7 }
        ]
    });

    sp.addGroup({
        icon: "g-cartografia-herramienta",
        title: "Herramientas",
        order: 4,
        plugins: [
            { plugin: new M.plugin.Drawing(), order: 1 },
            { plugin: new M.plugin.Measurebar(), order: 2 },
            {
                plugin: new M.plugin.Printer({
                    "params": {
                        "pages": {
                            "creditos": "Impresión generada a través de Mapea"
                        },
                        "layout": {
                            "outputFilename": "mapea_${yyyy-MM-dd_hhmmss}"
                        }
                    },
                    // Pueden establecerse los valores de los desplegables
                    'options': {
                        'layout': 'imagen apaisada',
                        'format': 'png',
                        'dpi': '127'
                    }
                }),
                order: 3
            }
        ]
    });

    sp.addGroup({
        icon: "g-cartografia-guardar",
        title: "Gestionar Sesión",
        order: 5,
        plugins: [

            { plugin: new M.plugin.Wmc(), order: 1 }
        ]
    });

    
    sp.addPlugin(new M.plugin.MaxExtZoom({ position: 'TR', }))
    sp.addPlugin(new M.plugin.Featureinfo())
    //sp.addPlugin(new M.plugin.Attributions(paramsAttributions))
});



//plugin Attributions

var paramsAttributions = {
    params: {
        includeRequired: true,
        attributions: [
            "TXT*Infraestructura de Datos Espaciales de Andalucía", [
                'HTML*<p>IDEAndalucia Participa en:</p><p><a href="https://www.opengeospatial.org/" target="_blank"><img src="http://www.ideandalucia.es/visor/logos/logo_ogc.gif" alt="Open Geospatial Consortium" title="Open Geospatial Consortium" height="100%"></a>&nbsp;&nbsp;&nbsp;<a href="https://www.idee.es/" target="_blank"><img src="http://www.ideandalucia.es/visor/logos/logo_idee.gif" alt="Infraestructura de Datos Espaciales de España" title="Infraestructura de Datos Espaciales de España" height="100%"></a>&nbsp;&nbsp;&nbsp;<a href="https://inspire-geoportal.ec.europa.eu/" target="_blank"><img src="http://www.ideandalucia.es/visor/logos/logo_inspire.gif" alt="Infrastructure for Spatial Information in the European Community" title="Infrastructure for Spatial Information in the European Community" height="100%"></a></p>'
            ]
        ]
    },
    options: {
        panel: {
            className: 'clasePrivada',
            collapsedClass: 'g-cartografia-ayuda',
            tooltip: 'Panel Attributions'
        }
    }
};

mapjs.addPlugin(new M.plugin.Attributions(paramsAttributions));
mapjs.addPlugin(sp);

