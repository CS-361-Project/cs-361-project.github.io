var shadow = function (element, source) {
    var bounds = element.getBoundingClientRect();
    var rect = new Rectangle(bounds.left, bounds.top, bounds.width, bounds.height);
    var vertices = visibleVertices(rect, source);
    var path = new Path(vertices.concat(source));
    path.closed = true;
    path.fillColor = "black";
    console.log(path);
    return path;
}

var updateShadow = function (element, source, path) {
    var bounds = element.getBoundingClientRect();
    var rect = new Rectangle(bounds.left, bounds.top, bounds.width, bounds.height);
    var vertices = visibleVertices(rect, source);

    path.removeSegments();
    var outerpoints = [];
    for (var i = 0; i < vertices.length; i++) {
        path.add(vertices[i]);
        //        if (i == 0 || i == vertices.length - 1) {
        outerpoints.push((vertices[i] - source).normalize(30) + vertices[i]);
        //        }
    }
    for (var i = outerpoints.length - 1; i >= 0; i--) {
        path.add(outerpoints[i]);
    }
    path.closed = true;
    path.fillColor = new Color(0, 0, 0);
    return path;
}

var getSorted = function (v, a) {
    var all = [];

    for (var i = 0; i < a.length; i++) {
        all.push({
            'v': v[i],
            'a': a[i]
        });
    }

    all.sort(function (a, b) {
        return a.a - b.a;
    });

    var nv = [];
    var na = [];

    for (var i = 0; i < all.length; i++) {
        nv.push(all[i].v);
        na.push(all[i].a);
    }
    return nv;
}

var visibleVertices = function (rect, source) {
    var visible = [];
    var vertices = [];
    var angles = [];

    if (rect.contains(source)) {
        return visible;
    }

    var center = new Point(rect.x + rect.width / 2, rect.y + rect.height / 2);
    vertices.push(new Point(rect.x, rect.y));
    vertices.push(new Point(rect.x, rect.y + rect.height));
    vertices.push(new Point(rect.x + rect.width, rect.y + rect.height));
    vertices.push(new Point(rect.x + rect.width, rect.y));
    for (var i = 0; i < vertices.length; i++) {
        var dir = (source - vertices[i]).normalize(.001);
        var orth = new Point(-dir.y, dir.x);
        var point1 = vertices[i] + dir;
        var point2 = vertices[i] + orth;
        var point3 = vertices[i] - orth;
        if (rect.contains(point1) || rect.contains(point2) || rect.contains(point3)) {
            visible.push(vertices[i]);
            angles.push((center - source).getDirectedAngle(vertices[i] - source))
        }
    }
    return getSorted(visible, angles);
}





var obstacles = document.getElementsByClassName("obstacle");
var center = new Point(view.size.width / 2, view.size.height / 2);
var paths = [];
var circles = [];
for (var i = 0; i < obstacles.length; i++) {
    paths.push(shadow(obstacles[i], center));
}

view.onMouseMove = function (event) {
    for (var i = 0; i < obstacles.length; i++) {
        updateShadow(obstacles[i], event.point, paths[i]);
    }
}