// title      : PlastiMaker Customizable Mini Drawers
// author     : PlastiMaker
// license    : MIT License
// revision   : A1
// file       : housing.jscad

function main(params) {
  var _w = params.drawer_width + params.house_tolerance * 2 + params.house_thickness * 2;
  var _d = params.drawer_depth + params.house_tolerance + params.house_thickness;
  var _h = params.drawer_height + params.house_tolerance * 2 + params.house_thickness * 2;

  var _sw = _w * params.house_h_count - ((params.house_h_count - 1) * params.house_thickness);//stack total width
  var _sh = _h * params.house_v_count - ((params.house_v_count - 1) * params.house_thickness);//stack total height

  var body = cube({ size: [_w, _d, _h], center: true });
  body = makeMainCavity(body);
  body = makeSidesWindowCavity(body);
  body = makeBackWindowCavity(body);
  body = createStack(body);
  body = addTopCover(body);
  body = addLugs(body);

  return [body.rotateX(-90).translate([0, 0, _d / 2])];
  //return [body.translate([0,0,0])];
  //return [body.translate([0,0,_sh/2])];

  function addLugs(body) {
    var longSideLen = params.house_lugLongSideLen;
    var shortSideLen = params.house_lugShortSideLen;
    var innerHoleLen = params.house_lugInnerHoleLen;
    var thick = params.house_lugThickness;
    var sidesLugsOffset = 3;
    var gapTolerance = 0.3;
    var lug = difference(
      polygon([
        [-shortSideLen, 0], [0, 0],
        [0, -longSideLen], [-shortSideLen, -shortSideLen]]),
      polygon([
        [0, 0], [innerHoleLen, 0],
        [innerHoleLen, -innerHoleLen], [0, -innerHoleLen]])
        .translate([(-shortSideLen - innerHoleLen) / 2, -(shortSideLen - innerHoleLen) / 2, 0]));

    lug = linear_extrude({ height: thick }, lug);

    if (params.house_top_lug) {
      var topLugs = lug.rotateY(90).rotateZ(180).translate([thick / 2, -longSideLen, 0]);
      var topLugsRight = topLugs.translate([_sw / 2 - thick / 2 - thick - sidesLugsOffset - gapTolerance, _d / 2, _sh / 2]);
      var topLugsLeft = topLugs.translate([-_sw / 2 + thick / 2 + thick + sidesLugsOffset + gapTolerance, _d / 2, _sh / 2]);
      topLugsRight = union(topLugsRight, topLugsRight.translate([0, -_d + longSideLen, 0]));
      topLugsLeft = union(topLugsLeft, topLugsLeft.translate([0, -_d + longSideLen, 0]));
      body = union(body, topLugsRight, topLugsLeft);
    }
    if (params.house_bottom_lug) {
      var bottomLugs = lug.rotateY(-90).rotateZ(180).translate([-thick / 2, -longSideLen, -_sh]);
      var bottomLugsRight = bottomLugs.translate([_sw / 2 - thick / 2 - sidesLugsOffset, _d / 2, _sh / 2]);
      var bottomLugsLeft = bottomLugs.translate([-_sw / 2 + thick / 2 + sidesLugsOffset, _d / 2, _sh / 2]);
      bottomLugsRight = union(bottomLugsRight, bottomLugsRight.translate([0, -_d + longSideLen, 0]));
      bottomLugsLeft = union(bottomLugsLeft, bottomLugsLeft.translate([0, -_d + longSideLen, 0]));
      body = union(body, bottomLugsRight, bottomLugsLeft);
    }
    if (params.house_left_lug) {
      var offset = thick / 2 + thick + sidesLugsOffset + gapTolerance;
      var leftLugs = lug.rotateX(180).translate([0, -longSideLen, thick / 2]);
      var leftLugsTop = leftLugs.translate([-_sw / 2, _d / 2, _sh / 2 - offset]);
      var leftLugsBottom = leftLugs.translate([-_sw / 2, _d / 2, -_sh / 2 + offset]);
      leftLugsTop = union(leftLugsTop, leftLugsTop.translate([0, -_d + longSideLen, 0]));
      leftLugsBottom = union(leftLugsBottom, leftLugsBottom.translate([0, -_d + longSideLen, 0]));
      body = union(body, leftLugsTop, leftLugsBottom);

      var cornerSupport = polygon([[0, 0], [longSideLen + offset + thick / 2, 0], [0, longSideLen + offset + thick / 2]]);
      cornerSupport = linear_extrude({ height: params.house_thickness }, cornerSupport);
      cornerSupport = cornerSupport.rotateY(90).rotateZ(180).translate([-_sw / 2 + params.house_thickness, _d / 2, _sh / 2]);
      cornerSupport = union(cornerSupport, cornerSupport.mirroredY());
      cornerSupport = union(cornerSupport, cornerSupport.mirroredZ());
      body = union(body, cornerSupport);
    }
    if (params.house_right_lug) {
      var offset = thick / 2 + sidesLugsOffset;
      var rightLugs = lug.rotateY(180).rotateX(180).translate([0, -longSideLen, -thick / 2]);
      var rightLugsTop = rightLugs.translate([_sw / 2, _d / 2, _sh / 2 - offset]);
      var rightLugsBottom = rightLugs.translate([_sw / 2, _d / 2, -_sh / 2 + offset]);
      rightLugsTop = union(rightLugsTop, rightLugsTop.translate([0, -_d + longSideLen, 0]));
      rightLugsBottom = union(rightLugsBottom, rightLugsBottom.translate([0, -_d + longSideLen, 0]));
      body = union(body, rightLugsTop, rightLugsBottom);

      var cornerSupport = polygon([[0, 0], [longSideLen + offset + thick / 2, 0], [0, longSideLen + offset + thick / 2]]);
      cornerSupport = linear_extrude({ height: params.house_thickness }, cornerSupport);
      cornerSupport = cornerSupport.rotateY(90).rotateZ(180).translate([_sw / 2, _d / 2, _sh / 2]);
      cornerSupport = union(cornerSupport, cornerSupport.mirroredY());
      cornerSupport = union(cornerSupport, cornerSupport.mirroredZ());
      body = union(body, cornerSupport);
    }

    return body;
  }

  function addTopCover(body) {
    var topCoverThick = 0.8;
    var topCover = cube({ size: [_sw, _d, topCoverThick], center: true });
    return union(body, topCover.translate([0, 0, _sh / 2 - topCoverThick / 2]));
  }

  function createStack(body) {
    var w = _w - params.house_thickness;
    var h = _h - params.house_thickness;
    var stack = difference(cube(), cube());//empty object

    for (var i = 0; i < params.house_v_count; i++) {
      for (var j = 0; j < params.house_h_count; j++) {
        stack = union(stack, body.translate([j * w, 0, i * h]));
      }
    }

    return stack.translate([_w / 2, 0, _h / 2])
      .translate([-_sw / 2, 0, -_sh / 2]);
  }

  function makeBackWindowCavity(body) {
    var w = _w - params.house_thickness * 2;
    var h = _h - params.house_thickness * 2;
    var x = Math.min(Math.min(w, h) / 2, 5);

    var c = polygon([[-w / 2 + x, h / 2], [w / 2 - x, h / 2], [w / 2, h / 2 - x], [w / 2, -h / 2 + x],
    [w / 2 - x, -h / 2], [-w / 2 + x, -h / 2], [-w / 2, -h / 2 + x], [-w / 2, h / 2 - x]]);
    c = linear_extrude({ height: params.house_thickness, center: true }, c)
      .rotateX(90)
      .translate([0, _d / 2 - params.house_thickness / 2, 0]);

    body = difference(body, c);

    return body;
  }

  function makeSidesWindowCavity(body) {
    var cw = (_w - params.house_thickness * 2) * params.house_window_w_prcnt;
    var cd = (_d - params.house_thickness) * params.house_window_d_prcnt;
    var ch = (_h - params.house_thickness * 2) * params.house_window_h_prcnt;

    if (cw > 0 && cd > 0) {
      body = difference(body, cube({ size: [cw, cd, _h], center: true })
        .translate([0, -params.house_thickness / 2, 0]));
    }
    if (ch > 0 && cd > 0) {
      body = difference(body, cube({ size: [_w, cd, ch], center: true })
        .translate([0, -params.house_thickness / 2, 0]));
    }
    return body;
  }

  function makeMainCavity(body) {
    var cw = _w - params.house_thickness * 2;
    var ch = _h - params.house_thickness * 2;

    body = difference(body, cube({ size: [cw, _d, ch], center: true })
      .translate([0, -params.house_thickness, 0]));

    return body;
  }

}

function getParameterDefinitions() {
  return [
    {
      name: 'drawer_width',
      type: 'float',
      initial: (window['g_prm_drawer_width']!==undefined ? g_prm_drawer_width : 70),
      step: 0.1,
      min: 20,
      caption: 'Drawer width (in mm):'
    },
    {
      name: 'drawer_depth',
      type: 'float',
      initial: (window['g_prm_drawer_depth']!==undefined ? g_prm_drawer_depth : 120),
      step: 0.1,
      min: 40,
      caption: 'Drawer depth (in mm):'
    },
    {
      name: 'drawer_height',
      type: 'float',
      initial: (window['g_prm_drawer_height']!==undefined ? g_prm_drawer_height : 24),
      step: 0.1,
      min: 15,
      caption: 'Drawer height (in mm):'
    },
    {
      name: 'house_h_count',
      type: 'float',
      initial: (window['g_prm_house_h_count']!==undefined ? g_prm_house_h_count : 2),
      step: 1,
      min: 1,
      max: 20,
      caption: 'Number of horizontal drawers:'
    },
    {
      name: 'house_v_count',
      type: 'float',
      initial: (window['g_prm_house_v_count']!==undefined ? g_prm_house_v_count : 5),
      step: 1,
      min: 1,
      max: 20,
      caption: 'Number of vertical drawers:'
    },
    {
      name: 'house_thickness',
      type: 'float',
      initial: (window['g_prm_house_thickness']!==undefined ? g_prm_house_thickness : 1.6),
      step: 0.1,
      min: 0.3,
      max: 4,
      caption: 'Housing wall thickness (in mm):'
    },
    {
      name: 'house_tolerance',
      type: 'float',
      initial: (window['g_prm_house_tolerance']!==undefined ? g_prm_house_tolerance : 0.5),
      step: 0.1,
      min: 0.1,
      max: 1,
      caption: 'Wall to drawer tolerance (in mm):'
    },
    {
      name: 'house_window_w_prcnt',
      type: 'float',
      initial: (window['g_prm_house_window_w_prcnt']!==undefined ? g_prm_house_window_w_prcnt : 0.8),
      step: 0.01,
      min: 0,
      max: 0.85,
      caption: 'Window clearance on X axis (0.0 - 0.85):'
    },
    {
      name: 'house_window_d_prcnt',
      type: 'float',
      initial: (window['g_prm_house_window_d_prcnt']!==undefined ? g_prm_house_window_d_prcnt : 0.85),
      step: 0.01,
      min: 0,
      max: 0.85,
      caption: 'Window clearance on Y axis (0.0 - 0.85):'
    },
    {
      name: 'house_window_h_prcnt',
      type: 'float',
      initial: (window['g_prm_house_window_h_prcnt']!==undefined ? g_prm_house_window_h_prcnt : 0.65),
      step: 0.01,
      min: 0,
      max: 0.85,
      caption: 'Window clearance on Z axis (0.0 - 0.85):'
    },
    {
      name: 'house_top_lug',
      type: 'checkbox',
      initial: (window['g_prm_house_top_lug']!==undefined ? g_prm_house_top_lug : true),
      checked: (window['g_prm_house_top_lug']!==undefined ? g_prm_house_top_lug : true),
      caption: 'Include top lugs for attaching/extending:'
    },
    {
      name: 'house_right_lug',
      type: 'checkbox',
      initial: (window['g_prm_house_right_lug']!==undefined ? g_prm_house_right_lug : true),
      checked: (window['g_prm_house_right_lug']!==undefined ? g_prm_house_right_lug : true),
      caption: 'Include right lugs for extending:'
    },
    {
      name: 'house_left_lug',
      type: 'checkbox',
      initial: (window['g_prm_house_left_lug']!==undefined ? g_prm_house_left_lug : true),
      checked: (window['g_prm_house_left_lug']!==undefined ? g_prm_house_left_lug : true),
      caption: 'Include left lugs for extending:'
    },
    {
      name: 'house_bottom_lug',
      type: 'checkbox',
      initial: (window['g_prm_house_bottom_lug']!==undefined ? g_prm_house_bottom_lug : true),
      checked: (window['g_prm_house_bottom_lug']!==undefined ? g_prm_house_bottom_lug : true),
      caption: 'Include bottom lugs for extending:'
    },
    {
      name: 'house_lugLongSideLen',
      type: 'float',
      initial: (window['g_prm_house_lugLongSideLen']!==undefined ? g_prm_house_lugLongSideLen : 12),
      step: 0.1,
      min: 12,
      max: 20,
      caption: 'Lug Long Side Length (in mm) (Advance):'
    },
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
