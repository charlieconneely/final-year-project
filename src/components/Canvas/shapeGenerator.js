import rough from 'roughjs/bundled/rough.esm'

const generator = rough.generator();

function shapeGenerator(shape, x1, y1, x2, y2) {
    var roughElement;

    if (shape === "Square") {
        roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1)
    } else {
        roughElement = generator.line(x1, y1, x2, y2)
    }
    return {x1, y1, x2, y2, roughElement};
}

export default shapeGenerator
