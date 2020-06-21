// title      : PlastiMaker Customizable Mini Drawers
// author     : PlastiMaker
// license    : MIT License
// revision   : A1
// file       : nails.jscad

function main(params) {

    var wedges = createWedges();
    var nuts = createNuts();

    return [wedges, nuts.translate([0,-params.house_lugShortSideLen - 4,0])];

    function createNuts() {
        var w = params.house_lugShortSideLen - 0.2;
        var i = params.house_lugInnerHoleLen;

        var n = cube({size:[w, w, 2]});
        n = difference(n, cube({size:[i, i, 2]}).translate([(w-i)/2,(w-i)/2,0]));

        return union(n, n.translate([w + 4,0,0]), n.translate([(w + 4)*2,0,0]), n.translate([-(w + 4),0,0]));
    }

    function createWedges() {
        var w = params.house_lugShortSideLen - 0.2;
        var l = params.house_lugThickness * 5;
        var i = params.house_lugInnerHoleLen - 0.4;

        var b1 = cube({size:[w, 1.6, w - (w-i)/2]});
        var b2 = cube({size:[i, l, i]}).translate([(w-i)/2,0,0]);

        var b = union(b1,b2);
        return union(b, b.translate([w + 4,0,0]), b.translate([(w + 4)*2,0,0]), b.translate([-(w + 4),0,0]));
    }
       
}

function getParameterDefinitions() {
    return [
      {
        name: 'house_lugShortSideLen',
        type: 'float',
        initial: (window['g_prm_house_lugShortSideLen']!==undefined ? g_prm_house_lugShortSideLen : 6),
        step: 0.1,
        min: 6,
        max: 11,
        caption: 'Lug Short Side Length (in mm) (Advance):'
      },
      {
        name: 'house_lugInnerHoleLen',
        type: 'float',
        initial: (window['g_prm_house_lugInnerHoleLen']!==undefined ? g_prm_house_lugInnerHoleLen : 3),
        step: 0.1,
        min: 3,
        max: 5,
        caption: 'Lug Inner Hole Length (in mm) (Advance):'
      },
      {
        name: 'house_lugThickness',
        type: 'float',
        initial: (window['g_prm_house_lugThickness']!==undefined ? g_prm_house_lugThickness : 2),
        step: 0.1,
        min: 2,
        max: 4,
        caption: 'Lug Thickness (in mm) (Advance):'
      }
  
    ];
  }