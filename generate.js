


function generatePPT(body) {
    console.log(body)
    var template_index = body.template;
    const template = require('./templates/template_' + template_index + '/template')
    template.template(body)
}

module.exports = {
    generatePPT
}

