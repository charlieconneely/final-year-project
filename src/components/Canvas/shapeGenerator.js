import rough from 'roughjs/bundled/rough.esm'

const generator = rough.generator();

function shapeGenerator(shape, colour, x1, y1, x2, y2, lineWidth) {
    var roughElement;

    if (shape === "Square") {
        roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
            fill:colour,
            fillStyle:'solid',
            strokeWidth: lineWidth
        })
    }
    else if (shape === "Circle") {
        // set centre points to midpoint between original & current mouse location
        var xCentre = x2 - ((x2-x1)/2)
        var yCentre = y2 - ((y2-y1)/2)
        roughElement = generator.circle(xCentre, yCentre, (x2 - x1)*2, {
            fill:colour,
            fillStyle:'solid',
            strokeWidth: lineWidth
        })
    } 
    else {
        roughElement = generator.line(x1, y1, x2, y2, {strokeWidth: lineWidth})
    }
    return {x1, y1, x2, y2, roughElement};
}

export default shapeGenerator   
