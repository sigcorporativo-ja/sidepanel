import M$ui$Sidepanel from '/home/fbmanas/Documentos/git-sigc/sidepanel/src/facade/js/mapeasidepanel';
import M$plugin$Sidepanel from '/home/fbmanas/Documentos/git-sigc/sidepanel/src/facade/js/sidepanel';
import M$control$SidepanelControl from '/home/fbmanas/Documentos/git-sigc/sidepanel/src/facade/js/sidepanelcontrol';
import M$impl$control$SidepanelControl from '/home/fbmanas/Documentos/git-sigc/sidepanel/src/impl/ol/js/sidepanelcontrol';

if (!window.M.ui) window.M.ui = {};
if (!window.M.plugin) window.M.plugin = {};
if (!window.M.control) window.M.control = {};
if (!window.M.impl) window.M.impl = {};
if (!window.M.impl.control) window.M.impl.control = {};
window.M.ui.Sidepanel = M$ui$Sidepanel;
window.M.plugin.Sidepanel = M$plugin$Sidepanel;
window.M.control.SidepanelControl = M$control$SidepanelControl;
window.M.impl.control.SidepanelControl = M$impl$control$SidepanelControl;
