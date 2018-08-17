import angular from 'angular';

class Node {
    constructor() {
        this.template = require('./node.html');
        this.restrict = 'AE';
        this.replace = 'true';
    }

    link(scope, element, attrs) {

    }
}

export default angular.module('directives.treenode', [])
    .directive('treeNode', () => new Node())
    .name;
