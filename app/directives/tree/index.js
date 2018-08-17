import TreeViewDirective from './tree';
import TreeNode from './node';

export default angular.module('directives.tree', [TreeNode])
	.directive('treeview', () => new TreeViewDirective())
	.name;