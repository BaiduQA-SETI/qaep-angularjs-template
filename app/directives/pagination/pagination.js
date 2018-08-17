/**
 * @file pagination directive
 * @author zhangyou04@baidu.com
 */
import './pagination.less';

export default class PaginationDirective {
    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.scope = {
            pageInfo: '=info',
            onChange: '=',
            forTable: '=for'
        };
        this.template = require('./pagination.html');
    }

    link(scope, element, attrs) {
        let maxPageCount = 10;
        let getPages = function (data) {
            let showPageCount = maxPageCount;
            let currentPage = data.currentPage || 1;
            let pageCount = Math.ceil(data.total / (data.pageSize || 10));
            let prePageCnt = Math.ceil(showPageCount / 2) - showPageCount % 2;
            let delt = pageCount - showPageCount;
            let start = 1;
            let end = pageCount;
            let pages = [];

            data.pageCount = pageCount;

            if (delt > 0) {
                if (currentPage > prePageCnt) {
                    start = currentPage - prePageCnt;
                }
            }

            end = start + showPageCount - 1;

            if (end > pageCount) {
                start -= end - pageCount;
                start = Math.max(1, start);
                end = pageCount;
            }

            while (start <= end) {
                pages.push(start++);
            }

            return pages;
        };
        let getTotalPageCount = function (pageInfo) {
            return Math.ceil(pageInfo.total / (pageInfo.pageSize || 10));
        };
        let getPageList = function (pageInfo) {
            let pageList = [];
            let pageCount = getTotalPageCount(pageInfo);
            while (pageCount--) {
                pageList.unshift(pageCount);
            }
            return pageList;
        };

        maxPageCount = +attrs.maxPageCount || 10;
        let changePage = function (page) {
            scope.pageInfo.currentPage = page;
            scope.pageInfo.pages = getPages(scope.pageInfo);
            scope.pageInfo.pageChange && scope.pageInfo.pageChange(page, scope.forTable);
            scope.onChange && scope.onChange(page, scope.forTable);
        };

        scope.pageInfo = scope.pageInfo || {};
        angular.extend(scope.pageInfo, {
            maxPageCount: maxPageCount,
            prePage: scope.pageInfo.currentPage
        });

        scope.pageInfo.pages = getPages(scope.pageInfo);

        angular.extend(scope, {
            getPages: getPages,
            getPageList: getPageList,
            getTotalPageCount: getTotalPageCount,
            changePage: changePage,
            onSelectPage(page) {
                if (scope.pageInfo.currentPage !== page) {
                    changePage(page);
                }
            },
            onPrePage(page) {
                if (page >= 1) {
                    changePage(page);
                }
            },
            onNextPage(page) {
                if (page <= scope.pageInfo.pageCount) {
                    changePage(page);
                }
            }
        });
    }
}
