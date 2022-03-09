/**
 * @module M/ui/Sidepanel
 */
import template from 'templates/group_panel';

export default class MapeaSidepanel extends M.ui.Panel {
    /**
     * Creates an instance of MapeaSidepanel.
     * @param {any} name
     * @param {any} options
     * @memberof MapeaSidepanel
     */
    constructor(name, options) {
        //se establecen opciones propias del tipo de panel

        options.collapsible = true;
        options.className = 'm-sidePanel-manager';
        super(name, options);
        this.map_ = null;
        this.sidepanelContainer = null;
        //contenedor de controles que activa y desactivan los plugins
        this.htmlButtonsContainer = null;
        //contenedor del html de los paneles de funcionalidades de los plugins
        this.htmlPanelsContainer = null;
        //indica si el panel ha sido inicializado
        this.initialized = false;
        //Array de plugins incluidos en el panel
        this.plugins = [];
        //plugin activo
        this.activePlugin = null;
        //grupo activo
        this.activePLuginGroup = null;
        this.numberGroups = 0;

        //panzoom
        this.panzoom = null;
        //constantes
        this.ACTIVE_BUTTON_CLASS = "active-plugin";
        this.TEMPLATE = '';

    }

    /**
     * Añade el panel al mapa
     *
     * @param {any} map
     * @param {any} container
     * @memberof MapeaSidepanel
     */
    addTo(map, container) {
        super.addTo(map, container);
        //marcamos el div del area contenedor con la clase  side-panel-area
        container.classList.add("side-panel-area");
        this.map_ = map;
        this.fire(M.evt.ADDED_TO_MAP);
        this.checkPanZoom();
    }

    checkPanZoom() {
        this.on(M.evt.SHOW, () => {
            this.panzoom = document.querySelector('.side-panel-area > .m-panzoom');
            if (!M.utils.isNullOrEmpty(this.panzoom)) {
                this.panzoom.setAttribute('style', 'margin-left:370px !important');
            }
        });
        this.on(M.evt.HIDE, () => {
            if (!M.utils.isNullOrEmpty(this.panzoom)) {
                this.panzoom.setAttribute('style', 'margin-left:60px !important');
            }
        });
    }


    /**
     * Crea un nuevo botón de grupo con su contenedor al que poder añadir los botones de los plugins del grupo
     *
     * @param {*} groupTitle
     * @param {*} groupIcon
     * @param {*} groupOrder
     * @memberof MapeaSidepanel
     */
    addGroup(groupTitle, groupIcon, groupOrder, plugins) {
        if (!M.template.compileSync) { // JGL: retrocompatibilidad Mapea4
            M.template.compileSync = (string, options) => {
                let templateCompiled;
                let templateVars = {};
                let parseToHtml;
                if (!M.utils.isUndefined(options)) {
                    templateVars = M.utils.extends(templateVars, options.vars);
                    parseToHtml = options.parseToHtml;
                }
                const templateFn = Handlebars.compile(string);
                const htmlText = templateFn(templateVars);
                if (parseToHtml !== false) {
                    templateCompiled = M.utils.stringToHtml(htmlText);
                } else {
                    templateCompiled = htmlText;
                }
                return templateCompiled;
            };
        }

        return new Promise((success, fail) => {
            const html = M.template.compileSync(template, {
                'vars': {
                    'group': {
                        title: groupTitle,
                        icon: groupIcon
                    }
                }
            })

            const htmlButton = html.querySelector("button.group-button");
            const htmlPanelButtons = html.querySelector("div.group-buttons-container");
            const htmlPanelContainer = html.querySelector("div.group-panel-container");
            let group = {
                id: ++this.numberGroups,
                htmlButton: htmlButton,
                htmlPanelButtons: htmlPanelButtons,
                htmlPanelContainer: htmlPanelContainer
            };
            htmlButton.style.order = groupOrder;
            htmlButton.addEventListener("click", (ev) => this.openGroup(group));
            if (!this.initialized) {
                this.initializeHtmlPanel();
            }
            this.htmlButtonsContainer.appendChild(htmlButton);
            this.htmlPanelsContainer.appendChild(html);
            for (const pluginConf of plugins) {
                pluginConf.plugin.on(M.evt.ADDED_TO_MAP, (plugin) => {
                    this.panelizePlugin(plugin, pluginConf.order, group);
                });

                this.map_.addPlugin(pluginConf.plugin);
            }

            // Añadir código dependiente del DOM
            success(html);
        });

    }

    /**
     * Realiza las tareas necerias para incluir el plugin en el panel
     *
     * @param {any} plugin
     * @memberof MapeaSidepanel
     */
    panelizePlugin(plugin, order, group) {
        let pluginPanel; //Objeto M.ui.Panel del plugin
        let htmlPluginPanel; //panel completo del plugin
        let htmlControl; //boton de activación del panel del plugin
        // al añadir el primer plugin ya tenemos el panel renderizado, en este momento
        //  hacemos los cambios necesarios al panel y lo marcamos como inicializado
        if (!this.initialized) {
            this.initializeHtmlPanel();
        }
        pluginPanel = this.getPluginPanel(plugin);
        //console.log('Panel de ' + plugin.name, pluginPanel);
        //Si no existe no se puede agregar
        if (pluginPanel) {
            htmlPluginPanel = pluginPanel.getTemplatePanel();
            //let panel = plugin.control_.getPanel().getTemplatePanel();
            // Obtención del botón de activacvion del  plugin
            htmlControl = htmlPluginPanel.querySelector("button.m-panel-btn");

            // Para el caso del plugin searchstreet cambiamos el icono para que sea más intuitivo
            if (plugin.name == 'searchstreetgeosearch') {
                htmlControl.classList.remove('g-cartografia-flecha-derecha');
                htmlControl.classList.add('g-cartografia-posicion4');
            }

            // Establecer atributos al botón para manejarlos en el evento click
            htmlControl.style.order = order;
            htmlControl.setAttribute('data-plugin', plugin.name);
            htmlControl.setAttribute('title', pluginPanel._tooltip);
            htmlControl.setAttribute('data-plugin-index', this.plugins.length);
            htmlControl.setAttribute('data-plugin-class', htmlControl.classList);

            // Si se ha pasado un grupo al que agregar el botón lo agregamos, sino al general
            // mantenemos el panel completo, no nos quedamos con el m-panel-controls para mantener la
            // funcionalidad de mostrar u ocultar el panel de MAPEA
            htmlControl.addEventListener("click", (ev) => this.togglePlugin(ev));

            if (!M.utils.isNullOrEmpty(group)) {
                htmlControl.setAttribute('data-plugin-group', group.id);
                group.htmlPanelContainer.appendChild(htmlPluginPanel);
                group.htmlPanelButtons.appendChild(htmlControl);
                // Si es el primer plugin que se añade, se selecciona por defecto
                if (order == 1) {
                    group.activePlugin = htmlControl;
                }
            } else {
                this.htmlButtonsContainer.appendChild(htmlControl);
                this.htmlPanelsContainer.appendChild(htmlPluginPanel);
            }

            this.plugins.push(plugin);

            // Cuando se ha cargado el plugin managelayers, se abre
            if (plugin.name == "ManageLayers") {
                setTimeout(() => this.open(), 100);
            }
            // Annadimos un titulo al plugin de buscador de calles
            if (plugin.name == 'searchstreetgeosearch') {
                let searchstreet = document.querySelector(".m-searchstreetgeosearch-container");
                if (M.utils.isNullOrEmpty(searchstreet.querySelector("div.title"))) {
                    let div = document.createElement('div');
                    div.innerHTML = 'Buscador de calles y geobúsquedas';
                    div.classList.add('title');
                    searchstreet.insertBefore(div, searchstreet.firstChild);
                }
            } else if (plugin.name == 'geocoderpelias') {
                // Annadimos un titulo al plugin de geocoderpelias
                let geocoderpelias = document.querySelector("#m-geocoderpelias-container");
                if (M.utils.isNullOrEmpty(geocoderpelias.querySelector("div.title"))) {
                    let div = document.createElement('div');
                    div.innerHTML = 'Buscador Pelias';
                    div.classList.add('title');
                    geocoderpelias.insertBefore(div, geocoderpelias.firstChild);
                }
             } else if (plugin.name == 'measurebar') {
                // Annadimos un titulo al plugin de measurebar
                let measurebar = document.getElementsByClassName("m-panel m-measurebar")[0];
                //let measurebar = document.getElementsByClassName("m-panel m-tools")[0];
                let measurebarControl = measurebar.getElementsByClassName("m-panel-controls")[0];
                if (M.utils.isNullOrEmpty(measurebar.querySelector("div.title"))) {
                    let title = document.createElement('div');
                    title.innerHTML = 'Herramientas de medida';
                    title.classList.add('title');
                    let measurebarInfo = document.createElement('div');
                    measurebarInfo.innerHTML = 'Seleccione entre realizar una medida de longitud o de área';
                    measurebarInfo.classList.add('measurebarInfo');
                    measurebar.appendChild(measurebarControl)
                    measurebar.appendChild(measurebarInfo)
                    measurebarControl.insertBefore(measurebarInfo,measurebarControl.firstChild);
                    measurebarControl.insertBefore(title, measurebarControl.firstChild);
                    
                }
            }
            /*else if(plugin.name == 'geosearch') {
                console.log('GEOSEARCH!!');
                let searchstreet = document.querySelector(".m-geosearch-container");
                if (M.utils.isNullOrEmpty(searchstreet.querySelector("div.title"))) {
                    let div = document.createElement('div');
                    div.innerHTML = 'Geobúsquedas2';
                    div.classList.add('title');
                    searchstreet.insertBefore(div, searchstreet.firstChild);
                }
            }*/

        } else {
            console.log("Plugin " + plugin.name + " no tiene panel, no se incorpora.");

        }
    }


    /**
     * Abre el grupo de plugins pasado como parámetro
     *
     * @param {*} group
     * @memberof MapeaSidepanel
     */
    openGroup(group) {
        if (this.activePLuginGroup != group) {
            // Se activa el botón del grupo
            group.htmlButton.classList.add(this.ACTIVE_BUTTON_CLASS);
            // Se abre el panel del grupo
            group.htmlPanelContainer.parentNode.classList.remove('collapsed');
            // Se cierra el anterior grupo de plugins si lo hubiese
            if (this.activePLuginGroup) {
                this.closeGroup(this.activePLuginGroup);
            }
            this.activePLuginGroup = group;
            // Si no tiene  ningún plugin activo, activo el primero
            if (M.utils.isNullOrEmpty(group.activePlugin)) {
                if (!M.utils.isNullOrEmpty(group.htmlPanelButtons.firstChild)) {
                    group.htmlPanelButtons.firstChild.click();
                    group.activePlugin = group.htmlPanelButtons.firstChild;
                }
            } else {
                group.activePlugin.click();
            }
        }
    }


    /**
     * Collapsa el grupo de plugins pasado como parámetro
     *
     * @param {*} group
     * @memberof MapeaSidepanel
     */
    closeGroup(group) {
        // Se desactiva el botón del grupo
        group.htmlButton.classList.remove(this.ACTIVE_BUTTON_CLASS);
        // Se cierra el panel del grupo
        group.htmlPanelContainer.parentNode.classList.add('collapsed');
        // Se elimina el grupo activo
        this.activePLuginGroup = null;
    }


    /**
     * Activa el plugin desactivando el plugin activo previo
     *
     * @param {*} event
     * @param {*} htmlButtonsContainer
     * @memberof MapeaSidepanel
     */
    togglePlugin(event) {
        let newActivePlugin = event.target;
        // Si hay un grupo abierto
        if (this.activePLuginGroup) {
            // Si el plugin no pertenece al grupo abierto se cierra
            if (this.activePLuginGroup.id != event.target.dataset.pluginGroup) {
                // Se cierra el grupo
                this.closeGroup(this.activePLuginGroup);
            } else {
                // Sino, se actualiza el plugin activo
                this.activePLuginGroup.activePlugin = event.target;
            }
        }
        // Si ya habia un plugin activo
        if (this.activePlugin) {
            if ((this.activePlugin.dataset.pluginIndex !== newActivePlugin.dataset.pluginIndex)) {
                // Colapsamos la herramienta que ya no está activa
                this.getPluginPanel(this.plugins[this.activePlugin.dataset.pluginIndex]).collapse();
                //Eliminar el estilo de boton activo
                this.activePlugin.classList.remove(this.ACTIVE_BUTTON_CLASS);
            } else {
                // Si es el mismo boton significa que se habra cerrado con el click, por lo que lo volvemos a abrir
                this.getPluginPanel(this.plugins[this.activePlugin.dataset.pluginIndex]).open();
            }

        }
        this.activePlugin = newActivePlugin;
        // se reestablece el estilo incial del botón
        this.activePlugin.className = this.activePlugin.dataset.pluginClass;
        // se añade la clase de boton activo
        this.activePlugin.classList.add(this.ACTIVE_BUTTON_CLASS);

        if (this.isCollapsed())
            this.open();
    }


    getPluginPanel(plugin) {
        let pluginPanel;
        // Obtención del panel del  plugin desde el mapa si no tiene nombre el plugin obtenemos
        // el panel del control como workarround
        try {
            if (plugin.controls_) pluginPanel = plugin.controls_[0].getPanel();
            else pluginPanel = plugin.control_.getPanel();
        } catch (e) {
            console.log(e);
        }
        return pluginPanel;
    }

    initializeHtmlPanel() {
        this.sidepanelContainer = this.getControls()[0].getElement();
        this.htmlButtonsContainer = this.getControls()[0].getElement().querySelector('.sidepanel>.buttons-container');
        this.htmlPanelsContainer = this.getControls()[0].getElement().querySelector('.sidepanel>.panel-container');
        const sidePanelButton = this.getTemplatePanel().querySelector("button.m-panel-btn");
        this.htmlButtonsContainer.appendChild(sidePanelButton);
        this.initialized = true;
    }

}
