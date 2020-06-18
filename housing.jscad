// title      : PlastiMaker Customizable Mini Drawers
// author     : PlastiMaker
// license    : MIT License
// revision   : A1
// file       : housing.jscad

var g_prm_drawer_width = 70;
var g_prm_drawer_depth = 120;
var g_prm_drawer_height = 24;
//---------------------------------------------
var g_prm_house_h_count = 2;
var g_prm_house_v_count = 5;
var g_prm_house_thickness = 1.6;
var g_prm_house_tolerance = 0.5;
var g_prm_house_window_w_prcnt = 0.80;//0 to 0.85
var g_prm_house_window_d_prcnt = 0.85;//0 to 0.85
var g_prm_house_window_h_prcnt = 0.65;//0 to 0.85

var g_prm_house_top_lug = true;
var g_prm_house_right_lug = true;
var g_prm_house_left_lug = true;
var g_prm_house_bottom_lug = true;
var g_prm_house_lugLongSideLen = 12;
var g_prm_house_lugShortSideLen = 6;
var g_prm_house_lugInnerHoleLen = 3;

function main () {
    var _w = g_prm_drawer_width + g_prm_house_tolerance*2 + g_prm_house_thickness*2;
    var _d = g_prm_drawer_depth + g_prm_house_tolerance + g_prm_house_thickness;
    var _h = g_prm_drawer_height + g_prm_house_tolerance*2 + g_prm_house_thickness*2;

    var _sw = _w * g_prm_house_h_count - ((g_prm_house_h_count-1)*g_prm_house_thickness);//stack total width
    var _sh = _h * g_prm_house_v_count - ((g_prm_house_v_count-1)*g_prm_house_thickness);//stack total height

    var body = cube({size: [_w,_d,_h], center: true });
    body = makeMainCavity(body);
    body = makeSidesWindowCavity(body);
    body = makeBackWindowCavity(body);
    body = createStack(body);
    body = addTopCover(body);
    body = addLugs(body);

    return [body.translate([0,0,0])];
    //return [body.translate([0,0,_sh/2])];

    function addLugs(body) {
        var longSideLen = g_prm_house_lugLongSideLen;
        var shortSideLen = g_prm_house_lugShortSideLen;
        var innerHoleLen = g_prm_house_lugInnerHoleLen;
        var thick = 2;
        var verticalLugsOffset = 3;
        var gapTolerance = 0.3;
        var lug = difference(
                polygon([
                    [-shortSideLen, 0],[0, 0],
                    [0, -longSideLen],[-shortSideLen, -shortSideLen]]),        
                polygon([
                    [0, 0],[innerHoleLen, 0],
                    [innerHoleLen, -innerHoleLen],[0, -innerHoleLen]])
                    .translate([(-shortSideLen-innerHoleLen)/2,-(shortSideLen-innerHoleLen)/2,0]));

        lug = linear_extrude({height: thick}, lug);

        if(g_prm_house_top_lug) {
            var topLugs = lug.rotateY(90).rotateZ(180).translate([thick/2,-longSideLen,0]);
            var topLugsRight = topLugs.translate([ _sw/2 - thick/2 - thick - verticalLugsOffset - gapTolerance,_d/2,_sh/2]);
            var topLugsLeft = topLugs.translate ([-_sw/2 + thick/2 + thick + verticalLugsOffset + gapTolerance,_d/2,_sh/2]);
            topLugsRight = union(topLugsRight,topLugsRight.translate([0,-_d+longSideLen,0]));
            topLugsLeft = union(topLugsLeft,topLugsLeft.translate([0,-_d+longSideLen,0]));
            body = union(body, topLugsRight, topLugsLeft);
        }
        if(g_prm_house_bottom_lug) {
            var bottomLugs = lug.rotateY(-90).rotateZ(180).translate([-thick/2,-longSideLen,-_sh]);
            var bottomLugsRight = bottomLugs.translate([ _sw/2 - thick/2 - verticalLugsOffset,_d/2,_sh/2]);
            var bottomLugsLeft = bottomLugs.translate ([-_sw/2 + thick/2 + verticalLugsOffset,_d/2,_sh/2]);
            bottomLugsRight = union(bottomLugsRight,bottomLugsRight.translate([0,-_d+longSideLen,0]));
            bottomLugsLeft = union(bottomLugsLeft,bottomLugsLeft.translate([0,-_d+longSideLen,0]));
            body = union(body, bottomLugsRight, bottomLugsLeft);
        }
        if(g_prm_house_left_lug) {
            var offset = thick/2 + thick + verticalLugsOffset + gapTolerance;
            var leftLugs = lug.rotateX(180).translate([0,-longSideLen,thick/2]);
            var leftLugsTop = leftLugs.translate   ([-_sw/2,_d/2, _sh/2 - offset]);
            var leftLugsBottom = leftLugs.translate([-_sw/2,_d/2,-_sh/2 + offset]);
            leftLugsTop = union(leftLugsTop,leftLugsTop.translate([0,-_d+longSideLen,0]));
            leftLugsBottom = union(leftLugsBottom,leftLugsBottom.translate([0,-_d+longSideLen,0]));
            body = union(body, leftLugsTop, leftLugsBottom);

            var cornerSupport = polygon([[0, 0],[longSideLen+offset+thick/2, 0],[0,longSideLen+offset+thick/2]]);
            cornerSupport = linear_extrude({height: g_prm_house_thickness}, cornerSupport);
            cornerSupport = cornerSupport.rotateY(90).rotateZ(180).translate([-_sw/2+g_prm_house_thickness,_d/2,_sh/2]);
            cornerSupport = union(cornerSupport, cornerSupport.mirroredY()); 
            cornerSupport = union(cornerSupport, cornerSupport.mirroredZ()); 
            body = union(body,cornerSupport);
        }
        if(g_prm_house_right_lug) {
            var offset = thick/2 + verticalLugsOffset;
            var rightLugs = lug.rotateY(180).rotateX(180).translate([0,-longSideLen,-thick/2]);
            var rightLugsTop = rightLugs.translate   ([_sw/2,_d/2, _sh/2 - offset]);
            var rightLugsBottom = rightLugs.translate([_sw/2,_d/2,-_sh/2 + offset]);
            rightLugsTop = union(rightLugsTop,rightLugsTop.translate([0,-_d+longSideLen,0]));
            rightLugsBottom = union(rightLugsBottom,rightLugsBottom.translate([0,-_d+longSideLen,0]));
            body = union(body, rightLugsTop, rightLugsBottom);

            var cornerSupport = polygon([[0, 0],[longSideLen+offset+thick/2, 0],[0,longSideLen+offset+thick/2]]);
            cornerSupport = linear_extrude({height: g_prm_house_thickness}, cornerSupport);
            cornerSupport = cornerSupport.rotateY(90).rotateZ(180).translate([_sw/2,_d/2,_sh/2]);
            cornerSupport = union(cornerSupport, cornerSupport.mirroredY()); 
            cornerSupport = union(cornerSupport, cornerSupport.mirroredZ()); 
            body = union(body,cornerSupport);
        }

        return body;
    }

    function addTopCover(body) {
        var topCoverThick = 0.8;
        var topCover = cube({size:[_sw,_d, topCoverThick], center:true});
        return union(body, topCover.translate([0,0,_sh/2 - topCoverThick/2]));
    }

    function createStack(body) {
        var w = _w-g_prm_house_thickness;
        var h = _h-g_prm_house_thickness;
        var stack = difference(cube(),cube());//empty object

        for (var i = 0; i < g_prm_house_v_count; i++) {
            for (var j = 0; j < g_prm_house_h_count; j++) {
                stack = union(stack,body.translate([j*w,0,i*h]));
            }    
        }

        return stack.translate([_w/2,0,_h/2])
                    .translate([-_sw/2,0,-_sh/2]);
    }

    function makeBackWindowCavity(body) {
        var w = _w-g_prm_house_thickness*2;
        var h = _h-g_prm_house_thickness*2;
        var x = Math.min(Math.min(w,h) / 2 , 5);
        
        var c = polygon([[-w/2+x, h/2], [w/2-x, h/2], [w/2, h/2-x], [w/2, -h/2+x], 
            [w/2-x, -h/2], [-w/2+x, -h/2],[-w/2, -h/2+x],[-w/2, h/2 - x]]);
        c = linear_extrude({height: g_prm_house_thickness, center: true}, c)
            .rotateX(90)
            .translate([0,_d/2-g_prm_house_thickness/2,0]);

        body = difference(body, c);

        return body;
    }

    function makeSidesWindowCavity(body) {
        var cw = (_w-g_prm_house_thickness*2) * g_prm_house_window_w_prcnt;
        var cd = (_d-g_prm_house_thickness) * g_prm_house_window_d_prcnt;
        var ch = (_h-g_prm_house_thickness*2) * g_prm_house_window_h_prcnt;

        if(cw > 0 && cd > 0){
            body = difference(body, cube({size: [cw,cd,_h], center:true})
                .translate([0,-g_prm_house_thickness/2,0]));
        }
        if(ch > 0 && cd > 0){
            body = difference(body, cube({size: [_w,cd,ch], center:true})
                .translate([0,-g_prm_house_thickness/2,0]));
        }
        return body;
    }

    function makeMainCavity(body) {
        var cw = _w - g_prm_house_thickness*2;
        var ch = _h - g_prm_house_thickness*2;

        body = difference(body, cube({size: [cw,_d,ch], center:true})
            .translate([0,-g_prm_house_thickness,0]));

        return body;
    }
        
}