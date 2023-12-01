class Point {
    constructor(zipcode, lat, lng) {
        this.zipcode = zipcode;
        this.lat = parseFloat(lat);
        this.lng = parseFloat(lng);
    }
}

function findTheCenter(points) {
     if (points.length === 0) {
        return null; // Return null if no coordinates are provided
    }

    // Calculate average latitude and longitude
    const avgLat = points.reduce((sum, coord) => sum + coord.lat, 0) / points.length;
    const avgLng = points.reduce((sum, coord) => sum + coord.lng, 0) / points.length;

    return { lat: avgLat, lng: avgLng };
}

function orientation(p, q, r) {
    const val = (q.lng - p.lng) * (r.lat - q.lat) - (q.lat - p.lat) * (r.lng - q.lng);
    if (val === 0) return 0; // Collinear
    return (val > 0) ? 1 : 2; // Clockwise or Counterclockwise
}

function computeConvexHull(points) {

    const n = points.length;
    if (n < 3) return points; // Convex hull is not possible with less than 3 points. returning as it is.

    // Find the point with the lowest y-coordinate (and leftmost if tied)
    points.sort((a, b) => {
        if (a.lng !== b.lng) return a.lng - b.lng;
        return a.lat - b.lat;
    });

    const first = points[0];

    // Sort the points based on polar angle with the lowest point
    points.sort((a, b) => {
        const orientationVal = orientation(first, a, b);
        if (orientationVal === 0) {
            return distance(first, a) - distance(first, b);
        }
        return orientationVal;
    });

    // Graham's scan algorithm to compute convex hull
    // const stack = [];
    // stack.push(points[0]);
    // stack.push(points[1]);

    // for (let i = 2; i < n; i++) {
    //     while (stack.length > 1 && orientation(nextToTop(stack), stack[stack.length - 1], points[i]) !== 2) {
    //         stack.pop();
    //     }
    //     stack.push(points[i]);
    // }

    // return stack;
    return points;
}

function distance(p1, p2) {
    return Math.pow((p1.lat - p2.lat), 2) + Math.pow((p1.lng - p2.lng), 2);
}

// Function to calculate the distance between two points in miles
function distance2(point1, point2) {
    const earthRadiusMiles = 3958.8; // Earth's radius in miles
    const lat1 = point1.lat * (Math.PI / 180);
    const lat2 = point2.lat * (Math.PI / 180);
    const lng1 = point1.lng * (Math.PI / 180);
    const lng2 = point2.lng * (Math.PI / 180);

    const dLat = lat2 - lat1;
    const dLng = lng2 - lng1;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusMiles * c;
    return distance;
}

function nextToTop(stack) {
    const top = stack.pop();
    const nextTop = stack[stack.length - 1];
    stack.push(top);
    return nextTop;
}


function cleanTheMap(map){
   for (object of map.getObjects()){
    if (object.id==="loop" || object.id==="star" || object.id==="relay" || object.id==="center" || object.id ==="cluster"){
        map.removeObject(object);
        }
    }
}

function addMarkerAt(map, lat, lng, id, icon){
    var marker = new H.map.Marker({ lat: lat, lng: lng}, { icon: icon });
    marker.id = id;
    map.addObject(marker);
}

function addMarkersAlongPolygon(map, polygonVertices, rangeOfTowerInMiles, icon) {

    var totalrelays = 0;

    for (let i = 0; i < polygonVertices.length - 1; i++) {
        const startPoint = polygonVertices[i];
        const endPoint = polygonVertices[i + 1];
        const totalDistance = distance2(startPoint, endPoint);

        // Place markers at range intervals
        for (let j = rangeOfTowerInMiles; j <= totalDistance-rangeOfTowerInMiles; j += rangeOfTowerInMiles) {
            const fraction = j / totalDistance;
            const interpolatedPoint = {
                lat: startPoint.lat + fraction * (endPoint.lat - startPoint.lat),
                lng: startPoint.lng + fraction * (endPoint.lng - startPoint.lng),
            };

            // Add marker to the map at the interpolated point
            const relayMarker = new H.map.Marker(interpolatedPoint);
            relayMarker.id = "relay";
            addMarkerAt(map, interpolatedPoint.lat, interpolatedPoint.lng, "relay", icon)
            totalrelays += 1;
        }
    }

    return totalrelays;
}


window.computeConvexHull = computeConvexHull
window.findTheCenter = findTheCenter
window.cleanTheMap = cleanTheMap
window.addMarkersAlongPolygon = addMarkersAlongPolygon
window.addMarkerAt = addMarkerAt




