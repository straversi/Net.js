var width = $(window).width();
var height = $(window).height();

var diameter = 10;
var nodeCount = 10;
var nodeColor = "black";
var destination = "net";
var sensitivity = 40;

////////////////////////

var radius = diameter / 2;
var s = sensitivity;

function drawNodes(rangeX, rangeY, density, dest) {
    for (var i = 0; i < density; i++) {
        var x = Math.random() * (rangeX - 20) + 10;
        var y = Math.random() * (rangeY - 20) + 10;
        var node = createNode(x, y);
        drawNode(node, dest);
    }
}

function createNode(x, y) {
    var node = "";
    node += "<div class='node' " ;
    node += "data-x='" + x + "' ";
    node += "data-y='" + y + "' ";
    node += "style='height:" + diameter + "px;";
    node += "width:" + diameter + "px;"
    node += "border-radius:" + diameter + "px;";
    node += "left:" + x + "px;";
    node += "top:" + y + "px;";
    node += "background-color:" + nodeColor + ";";
    node += "position:absolute;'>";
    node += "</div>";
    return node;
}

function drawNode(node, dest) {
    var doc = document.getElementById(dest);
    doc.innerHTML += node;
}

drawNode(createNode(0, 0), "net");

$("#" + destination).mousemove(function(event) {
    var parentOffset = $(this).offset();
    var relX = event.pageX - parentOffset.left - radius;
    var relY = event.pageY - parentOffset.top - radius;
    $(".node").each(function() {
        var dist = distance(relX, relY, this.dataset.x, this.dataset.y);
        if (dist < s) {
            var newPoint = oppose(this.dataset.x, this.dataset.y, relX, relY);
            $(this).css({"left": newPoint.left, "top": newPoint.top});
        }
    })
})

function distance(x0, y0, x1, y1) {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}

function force(x0, y0, x1, y1) {
    return 10 / Math.pow(distance(x0, y0, x1, y1), 2);
}

function oppose(refX, refY, mouseX, mouseY) {
    // Return the point opposite (oppX = mouseX, oppY = mouseY).
    // refX = nodeX, refY = nodeY
    var offsetY;
    var offsetX;
    var mXN = parseFloat(refX) - mouseX; // mouseX normalized
    var mYN = parseFloat(refY) - mouseY; // mouseY normalized
    var mXNS = Math.pow(mXN, 2);
    var mYNS = Math.pow(mYN, 2);
    offsetX = -1 * Math.sqrt(-(s*2) * Math.sqrt(mXNS + mYNS) + mXNS + mYNS + Math.pow(s, 2)) / Math.sqrt(mYNS / mXNS + 1);
    offsetY = -1 * mYN * Math.sqrt(-(s*2) * Math.sqrt(mXNS + mYNS) + mXNS + mYNS + Math.pow(s, 2)) / (mXN * Math.sqrt(mYNS / mXNS + 1));
    if (mXN > 0) {
        offsetY = -1 * offsetY;
        offsetX = -1 * offsetX;
    }
    return { left: offsetX + parseFloat(refX), top: offsetY + parseFloat(refY) };
}

drawNodes(width, height, nodeCount, destination);


