// ==UserScript==
// @name        Schm-ifizierung
// @namespace   schm
// @match       *://*/*
// @grant       none
// @version     2.0
// @author      PrimCargo693208
// @description Schmiscord, SchmyouTube & Schmesuaheli
// ==/UserScript==

function textNodesUnder(node){
  let all = [];
  for (node=node.firstChild;node;node=node.nextSibling){
    if (node.nodeType==3) all.push(node);
    else all = all.concat(textNodesUnder(node));
  }
  return all;
}

function lowerFirst(text) {
  let first = text.substring(0,1);
  let rest = text.substring(1);

  return first.toLowerCase() + rest;
}

function mangleTextNode(node) {
  let final = "";
  let words = node.nodeValue.split(" ");


  for (let word of words) {
    // If word is just empty space or too short, ignore
    if (word.trim().length < 2) {
      final += word + " ";
      continue;
    }

    let first = word.substring(0,1);

    // If the first letter is a character
    if (first.toUpperCase() != first.toLowerCase()) {
        // If the first letter is uppercase
        if (first === first.toUpperCase()) {
          // Schm-ify
          final += "Schm" + lowerFirst(word.replace(/^[^aeiouyöüä]+/i, "")) + " ";
        } else {
          // schm-ify
          final += "schm" + lowerFirst(word.replace(/^[^aeiouyöüä]+/i, "")) + " ";
        }
    } else {
      final += word + " ";
    }
  }


  node.nodeValue = final;
}

function replaceUnder(node) {
  let textnodes = textNodesUnder(node);

  for (let node of textnodes) {
    mangleTextNode(node);
  }
}

(() => {
  let origCreateTextNode = document.createTextNode;
  let fakeCreateTextNode = function (a) {
    let result = origCreateTextNode.bind(document)(a);

    mangleTextNode(result);
    return result;
  };

  document.createTextNode = fakeCreateTextNode.bind(document);

  replaceUnder(document.body);
})();


