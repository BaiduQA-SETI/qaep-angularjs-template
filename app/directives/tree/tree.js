/**
 * @file  Tree view UI Component
 * @author zhangyou04@baidu.com
 */
import angular from 'angular';
import './tree.less';
import TreeNode from './node';

export default class TreeViewDirective {
    constructor() {
        this.template = require('./tree.html');
        this.restrict = 'E';
        this.replace = 'true';
        this.scope = {
            nodes: '=data',
            getIconClass: '=',
            getNodeText: '=',
            onToggleExpand: '&',
            onEdit: '&',
            onDelete: '&',
            onSelect: '&',
            onDragStart: '&',
            onDrop: '&'
        };
    }

    link(scope, element, attrs) {
        // 相关属性参数初始化
        scope.animation = !!attrs.animation;
        scope.multiple = !!attrs.multiple;
        scope.editable = !!attrs.editable;
        scope.id = attrs.key || 'id';
        scope.name = attrs.name || 'name';
        scope.tooltip = attrs.tooltip || attrs.name || 'name';
        scope.children = attrs.children || 'children';
        scope.isPartChecked = function (node) {
            var children = node[scope.children] || [];
            var hasChecked = false;
            var hasNoChecked = false;

            for (var i = 0, len = children.length; i < len; i++) {
                hasNoChecked = hasNoChecked || !children[i].isSelected;
                hasChecked = hasChecked || !!children[i].isSelected;
                if (hasNoChecked && hasChecked) {
                    return true;
                }
            }

            return false;
        };
        scope.makeIconClass = function (node) {
            var iconClass = [];
            if (typeof scope.getIconClass === 'function') {
                iconClass.push(scope.getIconClass(node));
            }
            if (typeof attrs.icon === 'string') {
                iconClass.push(attrs.icon)
            }
            return iconClass.join(' ');
        };

        var id = scope.id;
        var name = scope.name;
        var children = scope.children;
        var findNode = function (node, nodes, callback) {
            var result = null;

            for (var i = 0, len = nodes.length; i < len; i++) {
                if (nodes[i].id + '' === node.id + '') {
                    result = nodes[i];
                    callback && callback(i, nodes, parent);
                } else {
                    result = findNode(node, nodes[i].children || [], callback);
                }

                if (result) {
                    return result;
                }
            }

            return result;
        };
        var goThroughNodes = function (nodes, callback) {
            if (typeof callback !== 'function') {
                return;
            }

            (nodes || []).forEach(function (node, i) {
                if (callback(node)) {
                    return;
                } else {
                    goThroughNodes(node.children, callback);
                }
            });
        };

        // events
        angular.extend(
            scope,
            {
                toggle: function (node, s) {
                    node.isCollapsed = !node.isCollapsed;
                    scope.onToggleExpand && scope.onToggleExpand() && scope.onToggleExpand()(node);
                },
                edit: function (node, nodes, e) {
                    goThroughNodes(nodes, function (node) {
                        node.isEdit = false;
                    });
                    node.isEdit = true;
                    scope.onEdit && scope.onEdit(node);
                },
                del: function (node, nodes) {
                    findNode(node, nodes, function (index, nodes) {
                        nodes.splice(index, 1);
                    });
                    scope.onDelete && scope.onDelete(node);
                },
                select: function (node, nodes, e) {
                    if (scope.multiple) {
                        // 处理子节点
                        goThroughNodes(node[scope.children], function (item) {
                            item.isSelected = !node.isSelected;
                        });
                        var tempNode = {};
                        tempNode[id] = $(e.currentTarget).closest('ul').data('pid');
                        var parentNode = findNode(tempNode, nodes);
                        var hasCheckedItem = false;
                        var hasNotCheckedItem = false;
                        var children = [];

                        node.isSelected = !node.isSelected;
                        if (parentNode) {
                            children = parentNode[scope.children];
                            for (var i = 0; i < children.length; i++) {
                                hasCheckedItem = hasCheckedItem || children[i].isSelected;
                                hasNotCheckedItem = hasNotCheckedItem || !children[i].isSelected;
                            }
                            parentNode.isSelected = hasCheckedItem && !hasNotCheckedItem;
                        }
                    } else {
                        if (!node.isSelected) {
                            goThroughNodes(nodes, function (node) {
                                node.isSelected = false;
                            });
                        }
                        node.isSelected = !node.isSelected;
                    }
                    
                    scope.onSelect && scope.onSelect() && scope.onSelect()(node);
                },
                finishEdit: function (node) {
                    node.isEdit = false;
                },
                inputKeyup: function (node, e) {
                    if (e.keyCode === 13) {
                        this.finishEdit(node, e);
                    }
                },
                dragStart: function (node, nodes, e) {
                    e.originalEvent.dataTransfer.setData('id', node[id]);
                    e.handleObj.data = node;
                    console.log('dragStart...');
                },
                dragOver: function (node, nodes, e) {
                    e.preventDefault();
                },
                drop: function (node, nodes, e) {

                }
            }
        );
            
        var isDraging = false;
        var dragNodeId;
        var INSERT_TYPE = {
            BEFORE: 1, // 前兄弟节点插入
            IN: 2, // 子节点插入
            AFTER: 3 // 后兄弟节点插入
        };
        // 获取插入节点的位置，三种位置: 前兄弟，后兄弟，子节点
        var getInsertType = function (ele, e) {
            var rect = ele.getBoundingClientRect();
            var eventPos = {
                x: e.originalEvent.pageX,
                y: e.originalEvent.pageY - (document.body.scrollTop || document.documentElement.scrollTop)
            };
            var height = rect.height;
            var offsetY = eventPos.y - rect.top;
            var start = height / 4;
            var end = (height / 4) * 3;
            var insertType = INSERT_TYPE.IN;
            console.log(start + '-' + offsetY + '-' + end + ' | ' + eventPos.y + '-' + rect.top);

            // 中间区域 作为孩子节点插入
            if (offsetY >= start && offsetY <= end) {
                insertType = INSERT_TYPE.IN;
            }

            // 中间偏上 作为前兄弟节点插入
            if (offsetY < start) {
                insertType = INSERT_TYPE.BEFORE;
            }

            // 中间偏下 作为后兄弟节点插入
            if (offsetY > end) {
                insertType = INSERT_TYPE.AFTER;
            }

            return insertType;
        };
        var dragHandler = function (e) {
            isDraging = true;
            var target = $(e.currentTarget);
            var nodeId = target.data('id');
            var node = {};
            node[id] = nodeId;
            node = findNode(node, scope.nodes);
            dragNodeId = nodeId;

            e.originalEvent.dataTransfer.effectAllowed = 'move';

            e.originalEvent.dataTransfer.setData('id', nodeId);
            scope.$apply(function () {
                node.isCollapsed = true;
                scope.onDragStart && scope.onDragStart() && scope.onDragStart()();
            });
        };
        var dragoverHandler = function (e) {
            e.preventDefault();
            var target = $(e.currentTarget);
            var nodeId = target.data('id');
            var insertType = getInsertType(target[0], e);

            if (isDraging && dragNodeId === nodeId) {
                return;
            }
            console.log(nodeId + '-' + dragNodeId);

            console.log('dragover:' + insertType);

            switch (insertType) {
                case INSERT_TYPE.BEFORE:
                    target.removeClass('insert-after insert-in').addClass('insert-before'); 
                    break;
                case INSERT_TYPE.IN:
                    target.removeClass('insert-after insert-before').addClass('insert-in');
                    break;
                case INSERT_TYPE.AFTER:
                    target.removeClass('insert-in insert-before').addClass('insert-after');
                    break;
            }
        };
        var dragleaveHandler = function (e) {
            $(e.currentTarget).removeClass('insert-before insert-in insert-after');
        };
        var dragendHandler = function (e) {
            isDraging = false;
        };
        var dropHandler = function (e) {
            var target = $(e.currentTarget);
            var nodeId = target.data('id');
            var parentNodeId = target.closest('ul').data('pid');
            var dragNodeId = e.originalEvent.dataTransfer.getData('id');
            var dragHandler = scope.onDrop && scope.onDrop();
            var moveNode = function (nodeId, parentNodeId, dragNodeId, nodes, insertType) {
                if (isDraging) {
                    var tempNode = {};
                    var node = null;
                    var parentNode = null;
                    var insertIndex = 0;

                    if (parentNodeId) {
                        tempNode[id] = parentNodeId;
                        parentNode = findNode(tempNode, nodes);
                        for (var i = 0, len = parentNode[children].length; i < len; i++) {
                            if (parentNode[children][i].id === nodeId) {
                                node = parentNode[children][i];
                                insertIndex = i;
                                break;
                            }
                        }
                    } else {
                        tempNode[id] = nodeId;
                        node = findNode(tempNode, nodes);
                    }

                    tempNode[id] = dragNodeId;
                    var dragNode = findNode(tempNode, nodes, function (index, children) {
                        children.splice(index, 1);
                    });
                    var insertNodes = [];

                    if (node && dragNode) {
                        switch (insertType) {
                            case INSERT_TYPE.BEFORE:
                                insertNodes = parentNode ? parentNode[scope.children] : scope.nodes;
                                break;
                            case INSERT_TYPE.IN:
                                node[scope.children] = node[scope.children] || [];
                                insertNodes = node[scope.children];
                                insertIndex = nodes.length;
                                break;
                            case INSERT_TYPE.AFTER:
                                insertNodes = parentNode ? parentNode[scope.children] : scope.nodes;
                                insertIndex++;
                                break;
                        }
                        insertNodes.splice(insertIndex, 0, dragNode);
                    }
                }
            };

            // 如果是拖拽的节点，drop到自己则不做任何处理
            // 如果外部传了onDrag回调且返回true,则表明不需要内部的移动节点处理
            if (nodeId == dragNodeId || dragHandler && !dragHandler(findNode({ id: id }))) {
                return;
            }

            // drop位置边界值判断，如果drop在元素竖直方向的中间区域，则将drop节点作为其子节点加入
            // 若在中间偏上的位置则作为前兄弟节点， 若在中间位置偏下则作为后兄弟节点加入
            var insertType = getInsertType(target[0], e);
            console.log(insertType);
            scope.$apply(function () {
                moveNode(nodeId, parentNodeId, dragNodeId, scope.nodes, insertType);
            });
            $(e.currentTarget).removeClass('insert-before insert-in insert-after');
            e.preventDefault();
        };

        if (attrs.draggable) {
            // add drag & drop events
            $(element).on('dragstart', '.node-info', dragHandler);
            $(element).on('dragover', '.node-info', dragoverHandler);
            $(element).on('dragleave', '.node-info', dragleaveHandler);
            $(element).on('dragend', '.node-info', dragendHandler);
            $(element).on('drop', '.node-info', dropHandler);
        }
    }
}