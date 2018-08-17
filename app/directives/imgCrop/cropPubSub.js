/**
 * @file img-crop directive
 * @author zhangzengwei@baidu.com
 */

export default class CropPubSubFactory {
    constructor() {
        let events = {};
        // Subscribe
        this.on = function(names, handler) {
            names.split(' ').forEach(function(name) {
                if (!events[name]) {
                    events[name] = [];
                }
                events[name].push(handler);
            });
            return this;
        };
        // Publish
        this.trigger = function(name, args) {
            angular.forEach(events[name], function(handler) {
                handler.call(null, args);
            });
            return this;
        };
    }

    // static getInstance() {
    //     CropHostFactory.instance = new CropHostFactory();
    //     return CropHostFactory.instance;
    // }
}

// CropHostFactory.getInstance.$inject = [];

// module.exports = CropHostFactory;



