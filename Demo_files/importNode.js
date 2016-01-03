function importNode(node, allChildren, doc) {
    var a, i, il;
    doc = doc || document;
    try {
        return doc.importNode(node, allChildren);
    } catch (e) {
        switch (node.nodeType) {
            case document.ELEMENT_NODE:
                var newNode = doc.createElementNS(node.namespaceURI, node.nodeName);
                if (node.attributes && node.attributes.length > 0) {
                    for (i = 0, il = node.attributes.length; i < il; i++) {
                        a = node.attributes[i];
                        try {
                            newNode.setAttributeNS(a.namespaceURI, a.nodeName, node.getAttribute(a.nodeName));
                        } catch (err) {
                            // ignore this error... doesn't seem to make a difference
                        }
                    }
                }
                if (allChildren && node.childNodes && node.childNodes.length > 0) {
                    for (i = 0, il = node.childNodes.length; i < il; i++) {
                        newNode.appendChild(importNode(node.childNodes[i], allChildren));
                    }
                }
                return newNode;
            case document.TEXT_NODE:
            case document.CDATA_SECTION_NODE:
            case document.COMMENT_NODE:
                return doc.createTextNode(node.nodeValue);
        }
    }
}