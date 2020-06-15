// title      : PlastiMaker Customizable Mini Drawers
// author     : PlastiMaker
// license    : MIT License
// revision   : 0.001
// file       : drawer.jscad

var g_prm_drawer_width = 70;
var g_prm_drawer_depth = 120;
var g_prm_drawer_height = 24;
//var g_

function main () {
    return union(
        cube({
            size: [g_prm_drawer_width,g_prm_drawer_depth,g_prm_drawer_height], 
            center: [g_prm_drawer_width/2,g_prm_drawer_depth/2,0]
        })
    );
}
