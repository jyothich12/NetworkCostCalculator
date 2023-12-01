const costOfOfcPerFeet = 1;
const costOfSplice = 200;
const costOfTubing = 0.7;
const costOfVault = 1000;


function constructOFCInterCluster(map, points, shape) {

    cleanTheMap(map);

    const customIcon = new H.map.Icon('../images/ofc_tower.png', { size: { w: 32, h: 32 } });
    points.forEach((cluster) => {
        addMarkerAt(map, cluster.lat, cluster.lng, "cluster", customIcon);
    });

    var distance = 0;
    var noOfClusters = 0;

    if (shape === 'loop') {
        distance = constructOFCLoop(map, points);
        noOfClusters=points.length;
    } else if (shape === 'star') {
        distance = constructOFCStar(map, points);
        noOfClusters=points.length+1;
    } else if (shape === 'wheel') {
        distance = constructOFCLoop(map, points) + constructOFCStar(map, points);
        noOfClusters=points.length+1;
    }

    var totalCostOfOfcPerFeet = (distance * 3.28084 * costOfOfcPerFeet).toFixed(0);
    var totalCostOfSplice = noOfClusters*costOfSplice;
    var totalCostOfTubing = (distance * 3.28084 * costOfTubing).toFixed(0);
    var totalCostOfVault = noOfClusters*costOfVault;
    var total = parseFloat(totalCostOfOfcPerFeet)+parseFloat(totalCostOfSplice)+parseFloat(totalCostOfTubing)+parseFloat(totalCostOfVault);
    

    var html =  `Total distance of cable to cover: <strong> ${metersToMiles(distance).toFixed(2)} miles</strong> <br/> <br/>`;

    html += `Cost of OFC Layout:  <strong>${totalCostOfOfcPerFeet}$ </strong> <br/>`;         //1 meter equals
    html += `Cost of Splice(x${noOfClusters}): <strong>${totalCostOfSplice}$ </strong> <br/>`;
    html += `Cost of Tubing:  <strong>${totalCostOfTubing}$ </strong> <br/>`;         //1 meter equals
    html += `Cost of Vaults(x${noOfClusters}): <strong>${totalCostOfVault}$</strong>  <br/> <br/>`;
    html += `Total Installation Cost: <strong>${total}$</strong>  <br/>`;
    
    document.getElementById('distanceDiv').innerHTML = html;   
        
}


function constructOFCLoop(map, points){

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

function constructOFCStar(map, points){

    var center = findTheCenter(points);

    const customIconCenter = new H.map.Icon('../images/ofc_central.png', { size: { w: 32, h: 32 } });
    addMarkerAt(map, center.lat, center.lng, "center", customIconCenter);

    var group = new H.map.Group();

    var distance = 0;


    points.forEach(function(point) {
        var linestring = new H.geo.LineString();
        linestring.pushPoint(point);
        linestring.pushPoint(center);

        var polyline = new H.map.Polyline(
            linestring, { style: {  lineWidth: 2, strokeColor: 'blue'  }}
        );

        distance += getPolylineLength(polyline);

        group.addObject(polyline);
    });

    group.id = "star";
    map.addObject(group);

    return distance;

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

window.constructOFCInterCluster = constructOFCInterCluster
