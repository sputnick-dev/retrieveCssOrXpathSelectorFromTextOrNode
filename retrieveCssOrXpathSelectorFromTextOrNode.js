// ==UserScript==
// @name         retrieveCssOrXpathSelectorFromTextOrNode
// @namespace    gilles<dot>quenot<at>sputnick<dot>fr
// @version      0.4
// @description  retrieve CSS or Xpath Selector from text or node for chrome dev tools/Firefox dev tools
// @author       Gilles Quenot
// @include      https://*
// @include      http://*
// @include      file://*
// @exclude      https://mail.google.com/*
// @grant        none
// ==/UserScript==

var xpathNamespaceResolver = {
    svg: 'http://www.w3.org/2000/svg',
    mathml: 'http://www.w3.org/1998/Math/MathML'
};

var getElementByXPath = function getElementByXPath(expression) {
    var a = document.evaluate(expression, document.body, xpathNamespaceResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (a.snapshotLength > 0) {
        return a.snapshotItem(0);
    }
};

window.retrieveCssOrXpathSelectorFromTextOrNode = function(arg, type) {
    var root = [], node;
    var nodeType = type.toLowerCase();
    function retrieveNodeNameAndAttributes(node) {
        var output = '';
        try {
            var nodeName = node.nodeName.toLowerCase();
        } catch(e) {
            console.error('ERROR no matching node');
            return;
        }
        if (node.hasAttributes()) {
            var attrs = node.attributes;
            for (var i = 0; i < attrs.length; i++) {
                if (nodeType === 'xpath') {
                    if (attrs[i].value) {
                        output += '[@' + attrs[i].name + '="' + attrs[i].value + '"]';
                    }
                    else {
                        output += '[@' + attrs[i].name + ']';
                    }
                }
                else if (nodeType === 'css') {
                    if (attrs[i].value) {
                        if (attrs[i].name === 'id') {
                            if (/:/.test(attrs[i].value)) {
                                output += '[id="' + attrs[i].value + '"]'; // new Ex: [id="foo:bar"]
                            }
                            else {
                                output += "#" + attrs[i].value;
                            }
                        } else if (attrs[i].name === 'class') {
                            var classes = attrs[i].value.split(/\s+\b/).join('.');
                            output += '.' + classes;
                        } else {
                            output += "[" + attrs[i].name + '="' + attrs[i].value + '"]';
                        }
                    }
                    else {
                        output += "[" + attrs[i].name + "]";
                    }
                }
            }
        }

        var txt = '';
        if (nodeName === 'a' && nodeType === 'xpath') {
            txt = '[text()="' + node.innerText + '"]';
        }

        root.push({ 'name': nodeName, 'attrs': output, txt });

        if (nodeName === 'body') return;
        else retrieveNodeNameAndAttributes(node.parentNode); // recursive function
    }

    if (typeof arg === 'string') { // text from within the page
        var selector = '//*[text()[contains(.,"' + arg + '")]]';
        node = getElementByXPath(selector);
    } else if (typeof arg === 'object') { // node argument, let's do some 'duck typing'
        if (arg && arg.nodeType) {
            node = arg;
        }
        else {
            console.error("ERROR expected node, get object");
            return;
        }
    } else {
        console.error("ERROR expected node or string argumument");
        return;
    }

    retrieveNodeNameAndAttributes(node);

    var output = '';
    if (nodeType === 'css') {
        output = root.reverse().map(elt => elt.name + elt.attrs ).join(' > ');
    }
    else if (nodeType === 'xpath') {
        output = '//' + root.reverse().map(elt => elt.name + elt.txt + elt.attrs ).join('/');
    }
    else {
        console.error('ERROR unknown type ' + type);
    }

    return output;
    //console.log(output);

};

window.x = function(arg) {
    console.log("CSS\n" + window.retrieveCssOrXpathSelectorFromTextOrNode(arg, 'css'));
    console.log("XPath\n" + window.retrieveCssOrXpathSelectorFromTextOrNode(arg, 'xpath'));
    
};
