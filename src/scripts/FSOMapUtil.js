const costOfFSORouter = 2500;
const costOfLaserTx = 5000;
const costOfFSOTower = 7500;
const rangeOfFSOTowerInMiles = 10;

const customIconFSORepeater = new H.map.Icon('../images/fso_repeater.png', { size: { w: 32, h: 32 } });

function constructFSOInterCluster(map, points, shape) {

    cleanTheMap(map);


    const customIcon = new H.map.Icon('../images/fso_tower.png', { size: { w: 48, h: 48 } });
    points.forEach((cluster) => {
        addMarkerAt(map, cluster.lat, cluster.lng, "cluster", customIcon);
    });

    var noOfRouters = 0;
    var noOfRelays = 0;

    if (shape === 'loop') {
        noOfRouters = points.length;
        noOfRelays = constructFSOLoop(map, points) + noOfRouters;
    } else if (shape === 'star') {
        noOfRouters=points.length+1;
        noOfRelays = constructFSOStar(map, points) + noOfRouters;
    } else if (shape === 'wheel') {
        noOfRouters=points.length+1;
        noOfRelays = constructFSOLoop(map, points) + constructFSOStar(map, points) + noOfRouters;
    }  

    var totalCostOfRouter = noOfRouters * costOfFSORouter;
    var totalCostOfLaserTx = noOfRelays * costOfLaserTx;
    var totalCostOfTower = noOfRelays * costOfFSOTower;

    var total = parseFloat(totalCostOfRouter)+parseFloat(totalCostOfLaserTx)+parseFloat(totalCostOfTower);

    var html =  `Assuming each tower has a transmitting radius of ${rangeOfFSOTowerInMiles}miles <br/> <br/>`;

    html += `Router(x${noOfRouters}): <strong>${totalCostOfRouter}$ </strong> <br/>`;
    html += `Laser Tx/Rx(x${noOfRelays}):  <strong>${totalCostOfLaserTx}$ </strong> <br/>`;        
    html += `Cost of Tower(x${noOfRelays}): <strong>${totalCostOfTower}$</strong>  <br/> <br/>`;
    html += `Total Installation Cost: <strong>${total}$</strong>  <br/>`;
    
    document.getElementById('distanceDiv').innerHTML = html;  
}


function constructFSOLoop(map, points){

    // Initialize a linestring and add all the points to it:
    var linestring = new H.geo.LineString();
    [...points, points[0]].forEach(function(point) {
      linestring.pushPoint(point);
    });

    // Initialize a polyline with the linestring:
    var polyline = new H.map.Polyline(linestring, { style: { lineWidth: 2, strokeColor: 'rgba(150, 20, 255, 0.7)', lineDash: [5, 2] }});
    polyline.id = "loop";

    // Add the polyline to the map:
    map.addObject(polyline);

    return addMarkersAlongPolygon(map, [...points, points[0]], rangeOfFSOTowerInMiles, customIconFSORepeater);

}

function constructFSOStar(map, points){

    var center = findTheCenter(points);

    const customIconCenter = new H.map.Icon('../images/fso_central.png', { size: { w: 48, h: 48 } });
    addMarkerAt(map, center.lat, center.lng, "center", customIconCenter);

    var group = new H.map.Group();

    var noOfRelays = 0;


    points.forEach(function(point) {
        var linestring = new H.geo.LineString();
        linestring.pushPoint(point);
        linestring.pushPoint(center);

        var polyline = new H.map.Polyline(
            linestring, { style: {  lineWidth: 2, strokeColor: 'rgba(159, 20, 255, 0.7)', lineDash: [5, 2]  }}
        );

        noOfRelays += addMarkersAlongPolygon(map, [point, center], rangeOfFSOTowerInMiles, customIconFSORepeater);

        group.addObject(polyline);
    });

    group.id = "star";
    map.addObject(group);

    return noOfRelays;

}

window.constructFSOInterCluster = constructFSOInterCluster
