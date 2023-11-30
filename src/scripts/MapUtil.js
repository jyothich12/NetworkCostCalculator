

function drawShape(map, points, shape) {

    cleanTheMap(map);

    var distance = 0;

    if (shape === 'loop') {
        distance = drawLoop(map, points);
    } else if (shape === 'star') {
        distance = drawStar(map, points);
    } else if (shape === 'wheel') {
        distance = drawLoop(map, points) + drawStar(map, points);
    }

    return metersToMiles(distance);
        
}


function drawLoop(map, points){

    // Initialize a linestring and add all the points to it:
    var linestring = new H.geo.LineString();
    [...points, points[0]].forEach(function(point) {
      linestring.pushPoint(point);
    });

    // Initialize a polyline with the linestring:
    var polyline = new H.map.Polyline(linestring, { style: { lineWidth: 2, strokeColor: 'blue' }});
    polyline.id = "loop";

    // Add the polyline to the map:
    map.addObject(polyline);

    return getPolylineLength(polyline);

}

function drawStar(map, points){

    var center = findTheCenter(points);

    var group = new H.map.Group();

    var distance = 0;


    points.forEach(function(point) {
        var linestring = new H.geo.LineString();
        linestring.pushPoint(point);
        linestring.pushPoint(center);

        var polyline = new H.map.Polyline(
            linestring, { style: {  lineWidth: 2, strokeColor: 'red'  }}
        );

        distance += getPolylineLength(polyline);

        group.addObject(polyline);
    });

    group.id = "star";
    map.addObject(group);

    return distance;

}

function cleanTheMap(map){
   for (object of map.getObjects()){
    if (object.id==="loop" || object.id==="star"){
        map.removeObject(object);
        }
    }
}

function getPolylineLength(polyline) {
  const geometry = polyline.getGeometry();
  let distance = 0;
  let last = geometry.extractPoint(0);
  for (let i=1; i < geometry.getPointCount(); i++) {
    const point = geometry.extractPoint(i);
    distance += last.distance(point);
    last = point;
  }
  if (polyline.isClosed()) {
    distance += last.distance(geometry.extractPoint(0));
  }
  
  // distance in meters
  return distance;
}

function metersToMiles(meters) {
    const metersInOneMile = 1609.34; // 1 mile is approximately 1609.34 meters
    return meters / metersInOneMile;
}

window.drawShape = drawShape
