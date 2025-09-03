/**
 * @typedef {object} ImageTag
 * @property {string} id - The unique identifier for the image tag.
 * @property {string} label - The human-readable label for the image tag.
 */

/**
 * An array of required image tags for a standard customer installation.
 * @type {ImageTag[]}
 */
export const requiredCCImages = [
    {id: "router_signal", label: "Router Signal"},
    {id: "router_back", label: "Router Back"},
    {id: "router", label: "Image Router"},
    {id: "atb", label: "ATB"}, 
    {id: "lovage_atb", label: "Lovage ATB"}, 
    {id: "power_reading", label: "Power Reading"}, 
    {id: "path_cable", label: "Path Cable"},
    {id: "labelling", label: "Customer Labelling"},
    {id: "signal_origin", label: "Debut Signal(MDU/JB)"}
  ]
  
  /**
 * An array of required image tags for a Multi-Dwelling Unit (MDU) installation.
 * @type {ImageTag[]}
 */
  export const requiredCCMDUImages = [
    {id: "lovage_mdu", label: "Lovage MDU"},
    {id: "origin_mdu", label: "Poteau(MDU)"},
    {id: "MDU", label: "Image MDU"},
    {id: "lovage_jb", label: "Lovage Join Box"},
    {id: "path_cable_mdu", label: "Path Cable"},
    {id: "labelling_mdu", label: "Labelling MDU"}
  ]