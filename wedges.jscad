// title      : PlastiMaker Customizable Mini Drawers
// author     : PlastiMaker
// license    : MIT License
// revision   : A1
// file       : nails.jscad

var g_prm_house_lugShortSideLen = 6;
var g_prm_house_lugInnerHoleLen = 3;
var g_prm_house_lugThickness = 2;

function main() {

    var wedges = createWedges();
    var nuts = createNuts();

    return [wedges, nuts.translate([0,-g_prm_house_lugShortSideLen - 4,0])];

    function createNuts() {
        var w = g_prm_house_lugShortSideLen - 0.2;
        var i = g_prm_house_lugInnerHoleLen;

        var n = cube({size:[w, w, 2]});
        n = difference(n, cube({size:[i, i, 2]}).translate([(w-i)/2,(w-i)/2,0]));

        return union(n, n.translate([w + 4,0,0]), n.translate([(w + 4)*2,0,0]), n.translate([-(w + 4),0,0]));
    }

    function createWedges() {
        var w = g_prm_house_lugShortSideLen - 0.2;
        var l = g_prm_house_lugThickness * 5;
        var i = g_prm_house_lugInnerHoleLen - 0.4;

        var b1 = cube({size:[w, 1.6, w - (w-i)/2]});
        var b2 = cube({size:[i, l, i]}).translate([(w-i)/2,0,0]);

        var b = union(b1,b2);
        return union(b, b.translate([w + 4,0,0]), b.translate([(w + 4)*2,0,0]), b.translate([-(w + 4),0,0]));
    }
       
}