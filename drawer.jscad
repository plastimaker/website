// title      : PlastiMaker Customizable Mini Drawers
// author     : PlastiMaker
// license    : MIT License
// revision   : A1
// file       : drawer.jscad

var g_prm_drawer_width = 70;
var g_prm_drawer_depth = 120;
var g_prm_drawer_height = 24;
var g_prm_drawer_thickness = 0.8;
var g_prm_drawer_numOfSections = 6;//>=1

function main () {
    var _holderDepth = 1.4;
    var _windowElevation = g_prm_drawer_thickness+4.2;

    var body = cube({
        size: [g_prm_drawer_width,g_prm_drawer_depth,g_prm_drawer_height], 
        center: true
    });

    body = createSections(body);
    body = addLabelHolder(body);
    body = addHandle(body);

    return [body.translate([0,0,g_prm_drawer_height/2])];

    function addHandle(body) {
        var size = 8;
        var height = _windowElevation;
        var handle = roundRect(size,size,height,[0.01,0.01,1,1]);
        var offset = size - (size*0.18);
        var cut1 = cylinder({r: size/2, h: height, center:true}).translate([offset,0,0]);
        var cut2 = cut1.translate([-offset*2,0,0]);
        handle = difference(handle, cut1, cut2).translate([
            0,
            -g_prm_drawer_depth/2 - size/2 - _holderDepth,
            -g_prm_drawer_height/2 + height/2]);

        return union(body,handle);
    }

    function addLabelHolder(body){
        var holderWidth = g_prm_drawer_width - 8;
        var holderDepth = _holderDepth;
        var paperWidth = holderWidth - 3;
        var papaerDepth = 0.6;
        var papaerElevation = g_prm_drawer_thickness+1.2;
        var windowWidth = holderWidth - 8;
        var windowElevation = _windowElevation;

        var holder = cube({
            size: [holderWidth,holderDepth,g_prm_drawer_height], 
            center: true
        });

        var paper = cube({
            size: [paperWidth,papaerDepth,g_prm_drawer_height], 
            center: true
        }).translate([0,holderDepth/2-papaerDepth/2,papaerElevation]);

        var window = cube({
            size: [windowWidth,holderDepth,g_prm_drawer_height], 
            center: true
        }).translate([0,0,windowElevation]);

        holder = difference(holder, window);
        holder = difference(holder,paper).translate([0,-g_prm_drawer_depth/2-(holderDepth/2),0]);
        body = union(holder, body);
        return body;
    }

    function createSections(body){
        var depth = ((g_prm_drawer_depth-g_prm_drawer_thickness)/g_prm_drawer_numOfSections)
        -g_prm_drawer_thickness;
        
        var box = cube({size:[
            g_prm_drawer_width - g_prm_drawer_thickness*2,
            depth, 
            g_prm_drawer_height - g_prm_drawer_thickness],center:true})
            .translate([0,
                g_prm_drawer_depth/2 - depth/2 - g_prm_drawer_thickness,
                g_prm_drawer_thickness]);

        for(var i=0; i<g_prm_drawer_numOfSections; i++){
            body = difference(body, box);
            box = box.translate([0,-depth - g_prm_drawer_thickness,0]);
        }
        return body;
    }

    function roundRect(width, depth, height, radius){
        return linear_extrude({height: height},hull(
            circle({r: radius[0], center: true}).translate([-width/2+radius[0], depth/2-radius[0]]),
            circle({r: radius[1], center: true}).translate([width/2-radius[1], depth/2-radius[1]]),
            circle({r: radius[2], center: true}).translate([width/2-radius[2], -depth/2+radius[2]]),
            circle({r: radius[3], center: true}).translate([-width/2+radius[3], -depth/2+radius[3]])
          )).translate([0,0,-height/2]);
    }
}
