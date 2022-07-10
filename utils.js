
function centerTextPosition(text) {
    // calculate the center position in X axis of the whole page for text

    var text_length = text.length;
    var x_bias = text_length / 8;
    console.log(x_bias)
    return 5 - x_bias;
};


module.exports = {
    centerTextPosition
}