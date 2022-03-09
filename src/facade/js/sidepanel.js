/* eslint-disable */

/**
 * @module M/plugin/Sidepanel
 */
import 'assets/css/sidepanel';
import SidepanelControl from './sidepanelcontrol';
import MapeaSidepanel from './mapeasidepanel.js';
import api from '../../api.json';

export default class Sidepanel extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor() {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    let panelOptions_ = {
      collapsedButtonClass: 'g-cartografia-menu',
      position: M.ui.position.TL,
      tooltip: 'Gestor de paneles'
    };
    this.sidePanel = new MapeaSidepanel("Panel Lateral", panelOptions_);
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.controls_.push(new SidepanelControl());
    this.map_ = map;
    this.controls_[0].on(M.evt.ADDED_TO_MAP, () => {
      this.fire(M.evt.ADDED_TO_MAP);
    });
    // Si se abre el panel y no hay ningun plugin seleccionado, se abre el managelayers y si no lo encuentra el primer plugin por defecto
    this.sidePanel.on(M.evt.SHOW, (evt) => {
      if (M.utils.isNullOrEmpty(this.sidePanel.activePluginIndex)) {
        let htmlButtonControl = this.sidePanel.htmlButtonsContainer.querySelector('*[data-plugin="ManageLayers"]');
        if (M.utils.isNullOrEmpty(htmlButtonControl)) {
          htmlButtonControl = this.sidePanel.htmlButtonsContainer.querySelector('*[data-plugin-index="' + 0 + '"]');
        }
        htmlButtonControl.click();
      }
    });
    this.sidePanel.addControls(this.controls_);
    this.map_.addPanels([this.sidePanel]);
  }

  /**
   * Añade el plugin al mapa y lo inserta en el panel en el orden seleccionado
   * @param {plugin} plugin
   */
  addPlugin(plugin, order) {
    let pluginOrder = 0;
    if (!M.utils.isNullOrEmpty(order)) {
      pluginOrder = order;
    }
    plugin.on(M.evt.ADDED_TO_MAP, (plugin) => {
      this.sidePanel.panelizePlugin(plugin, pluginOrder);
    });
    this.map_.addPlugin(plugin);

  }

  addGroup(options) {
    let groupOrder = 0, groupIcon = '', groupTitle = "Agrupación de plugins", plugins = [];
    if (!M.utils.isNullOrEmpty(options.order)) {
      groupOrder = options.order;
    }
    if (!M.utils.isNullOrEmpty(options.icon)) {
      groupIcon = options.icon;
    }
    if (!M.utils.isNullOrEmpty(options.title)) {
      groupTitle = options.title;
    }
    if (!M.utils.isNullOrEmpty(options.plugins)) {
      plugins = options.plugins;
    }
    this.sidePanel.addGroup(groupTitle, groupIcon, groupOrder, plugins);
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata(){
    return this.metadata_;
  }
}
