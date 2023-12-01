const costOfRelay = 250;
const costOfRouter = 2500;
const costOfTower = 7000;
const rangeOfTowerInMiles = 10;

const customIconWirelessRepeater = new H.map.Icon('../images/wireless_repeater.png', { size: { w: 32, h: 32 } });

function constructWirelessInterCluster(map, points, shape) {

    cleanTheMap(map);

    const customIcon = new H.map.Icon('../images/wireless_tower.png', { size: { w: 48, h: 48 } });
    points.forEach((cluster) => {
        addMarkerAt(map, cluster.lat, cluster.lng, "cluster", customIcon);
    });

    var noOfRelays = 0;
    var noOfClusters = 0;

    if (shape === 'loop') {
        noOfRelays = constructWirelessLoop(map, points);
        noOfClusters=points.length;
    } else if (shape === 'star') {
        noOfRelays = constructWirelessStar(map, points) + 1;  //extra relay for central hub
        noOfClusters=points.length+1;
    } else if (shape === 'wheel') {
        noOfRelays = constructWirelessLoop(map, points) + constructWirelessStar(map, points) + 1;  //extra relay for central hub
        noOfClusters=points.length+1;
    }


    var totalCostOfRelays = noOfRelays * costOfRelay;
    var totalCostOfRouter = noOfClusters * costOfRouter;
    var totalCostOfTower = noOfRelays * costOfTower;

    var total = parseFloat(totalCostOfRelays)+parseFloat(totalCostOfRouter)+parseFloat(totalCostOfTower);

    var html =  `Assuming each tower has a transmitting radius of ${rangeOfTowerInMiles}miles <br/> <br/>`;

    html += `Cost of Microwave Relays(x${noOfRelays}): <strong>${totalCostOfRelays}$ </strong> <br/>`;
    html += `Cost of Site Routers(x${noOfClusters}):  <strong>${totalCostOfRouter}$ </strong> <br/>`;        
    html += `Cost of Tower(x${noOfRelays}): <strong>${totalCostOfTower}$</strong>  <br/> <br/>`;
    html += `Total Installation Cost: <strong>${total}$</strong>  <br/>`;
    
    document.getElementById('distanceDiv').innerHTML = html;   
        
}


function constructWirelessLoop(map, points){

    // Initialize a linestring and add all the points to it:
    var linestring = new H.geo.LineString();
    [...points, points[0]].forEach(function(point) {
      linestring.pushPoint(point);
    });

    // Initialize a polyline with the linestring:
    var polyline = new H.map.Polyline(linestring, { style: { lineWidth: 2, strokeColor: 'rgba(98, 150, 0, 0.7)', lineDash: [2, 2] }});
    polyline.id = "loop";

    // Add the polyline to the map:
    map.addObject(polyline);

    return addMarkersAlongPolygon(map, [...points, points[0]], rangeOfTowerInMiles,  customIconWirelessRepeater);

}

function constructWirelessStar(map, points){

    var center = findTheCenter(points);

    const customIconCenter = new H.map.Icon('../images/wireless_central.png', { size: { w: 48, h: 48 } });
    addMarkerAt(map, center.lat, center.lng, "center", customIconCenter);

    var group = new H.map.Group();

    var noOfRelays = 0;


    points.forEach(function(point) {
        var linestring = new H.geo.LineString();
        linestring.pushPoint(point);
        linestring.pushPoint(center);

        var polyline = new H.map.Polyline(
            linestring, { style: {  lineWidth: 2, strokeColor: 'rgba(98, 150, 0, 0.7)', lineDash: [2, 2]  }}
        );

        noOfRelays += addMarkersAlongPolygon(map, [point, center], rangeOfTowerInMiles, customIconWirelessRepeater);

        group.addObject(polyline);
    });

    group.id = "star";
    map.addObject(group);

    return noOfRelays;

}

window.constructWirelessInterCluster = constructWirelessInterCluster
