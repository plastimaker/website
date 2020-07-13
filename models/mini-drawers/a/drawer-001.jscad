// title      : PlastiMaker Customizable Mini Drawers
// author     : PlastiMaker
// license    : MIT License
// revision   : A1
// file       : drawer.jscad

function main(params) {
  //These vars are linked to totals div (update both when necessary)
  var _handleSize = 8;
  var _holderDepth = 1.4;
  //-----------------------------------------------------------
  var _windowElevation = params.drawer_thickness + 4.2;

  var body = cube({
    size: [params.drawer_width, params.drawer_depth, params.drawer_height],
    center: true
  });

  body = createSections(body);
  body = addLabelHolder(body);
  body = addHandle(body);

  return [body.translate([0, 0, params.drawer_height / 2])];

  function addHandle(body) {
    var size = _handleSize;
    var height = _windowElevation;
    var handle = roundRect(size, size, height, [0.01, 0.01, 1, 1]);
    var offset = size - (size * 0.18);
    var cut1 = cylinder({ r: size / 2, h: height, center: true }).translate([offset, 0, 0]);
    var cut2 = cut1.translate([-offset * 2, 0, 0]);
    handle = difference(handle, cut1, cut2).translate([
      0,
      -params.drawer_depth / 2 - size / 2 - _holderDepth,
      -params.drawer_height / 2 + height / 2]);

    return union(body, handle);
  }

  function addLabelHolder(body) {
    var holderWidth = params.drawer_width - 8;
    var holderDepth = _holderDepth;
    var paperWidth = holderWidth - 3;
    var papaerDepth = 0.6;
    var papaerElevation = params.drawer_thickness + 1.2;
    var windowWidth = holderWidth - 8;
    var windowElevation = _windowElevation;

    var holder = cube({
      size: [holderWidth, holderDepth, params.drawer_height],
      center: true
    });

    var paper = cube({
      size: [paperWidth, papaerDepth, params.drawer_height],
      center: true
    }).translate([0, holderDepth / 2 - papaerDepth / 2, papaerElevation]);

    var window = cube({
      size: [windowWidth, holderDepth, params.drawer_height],
      center: true
    }).translate([0, 0, windowElevation]);

    holder = difference(holder, window);
    holder = difference(holder, paper).translate([0, -params.drawer_depth / 2 - (holderDepth / 2), 0]);
    body = union(holder, body);
    return body;
  }

  function createSections(body) {
    var depth = ((params.drawer_depth - params.drawer_thickness) / params.drawer_numOfSections)
      - params.drawer_thickness;

    var box = cube({
      size: [
        params.drawer_width - params.drawer_thickness * 2,
        depth,
        params.drawer_height], center: true
    })
      .translate([0,
        params.drawer_depth / 2 - depth / 2 - params.drawer_thickness,
        params.drawer_thickness]);

    for (var i = 0; i < params.drawer_numOfSections; i++) {
      body = difference(body, box);
      box = box.translate([0, -depth - params.drawer_thickness, 0]);
    }
    return body;
  }

  function roundRect(width, depth, height, radius) {
    return linear_extrude({ height: height }, hull(
      circle({ r: radius[0], center: true }).translate([-width / 2 + radius[0], depth / 2 - radius[0]]),
      circle({ r: radius[1], center: true }).translate([width / 2 - radius[1], depth / 2 - radius[1]]),
      circle({ r: radius[2], center: true }).translate([width / 2 - radius[2], -depth / 2 + radius[2]]),
      circle({ r: radius[3], center: true }).translate([-width / 2 + radius[3], -depth / 2 + radius[3]])
    )).translate([0, 0, -height / 2]);
  }
}

function getParameterDefinitions() {
  window.g_getTotals = function () {
    return{
      'width':Math.round((g_prm_drawer_width+g_prm_drawer_thickness*2)*10)/10,
      'depth':Math.round((g_prm_drawer_depth + 8 + 1.4)*10)/10
    }
  }
  return [
    {
      name: 'drawer_width',
      type: 'float',
      initial: (window['g_prm_drawer_width'] ? g_prm_drawer_width : 70),
      step: 0.1,
      min: 20,
      caption: 'Drawer width (in mm):'
    },
    {
      name: 'drawer_depth',
      type: 'float',
      initial: (window['g_prm_drawer_depth'] ? g_prm_drawer_depth : 120),
      step: 0.1,
      min: 40,
      caption: 'Drawer depth (in mm):'
    },
    {
      name: 'drawer_height',
      type: 'float',
      initial: (window['g_prm_drawer_height'] ? g_prm_drawer_height : 24),
      step: 0.1,
      min: 15,
      caption: 'Drawer height (in mm):'
    },
    {
      name: 'drawer_thickness',
      type: 'float',
      initial: (window['g_prm_drawer_thickness'] ? g_prm_drawer_thickness : 0.8),
      step: 0.1,
      min: 0.3,
      max: 4,
      caption: 'Drawer thickness (in mm):'
    },
    {
      name: 'drawer_numOfSections',
      type: 'float',
      initial: (window['g_prm_drawer_numOfSections'] ? g_prm_drawer_numOfSections : 6),
      step: 1,
      min: 1,
      max: 20,
      caption: 'Number of divisions:'
    }
  ];
}
