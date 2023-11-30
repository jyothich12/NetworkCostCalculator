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

function nextToTop(stack) {
    const top = stack.pop();
    const nextTop = stack[stack.length - 1];
    stack.push(top);
    return nextTop;
}


window.computeConvexHull = computeConvexHull
window.findTheCenter = findTheCenter




