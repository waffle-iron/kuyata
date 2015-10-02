/**
 * @fileOverview
 *
 * This file contains the Item manager
 */

import _ from 'lodash';

/**
 * Manage everything about items
 *
 * @class
 */
export default class ItemManager {

    constructor($q, Item){
        this.$q = $q;
        this.Item = Item;

        this.currentPage = 0;
        this.loadedPages = [0];
        this.pageLength = 50;
        this.maxPages = 3;

        this.data = {list:[]};
    }

    /**
     * Getter method to retrieve data from DB or use cached data if it already exists
     * OR if is wanted to force clear and get from database
     *
     * @param params is an Object with any or all these properties: "query, source, category"
     * @returns a promise
     */
    findList(params = {}){
        // if data.list is empty OR if is wanted to force clear and get from database
        this.Item.ejectAll();
        let query = createQuery(params);
        return this.Item.findAll(query);
    }

    /**
     * Retrieve a Item list as a paged segment on cached items or on DB
     * If page param is false, items segment is getted from DB
     * else it try to find Items on cache or use DB and save into cache (with a size limit)
     *
     * @param params Object with any or all these properties: "title, source, category"
     * @param page Int that indicate what items page it required
     * @returns a promise
     */
    findListPage(params = {}, page = false){
        this.currentPage = page;

        // if page is not false, is considered is trying to paginate
        if (this.currentPage) {
            // if page requested is on cache, find and return it
            if(_.include(this.loadedPages, this.currentPage)) {
                let firstItemPage = _.indexOf(this.loadedPages, this.currentPage) * this.pageLength;
                return this.$q.when(this.data.list.slice(firstItemPage, firstItemPage + this.pageLength));
            }

            // if page requested is not on cache
            else {
                // if cache is full, remove last page saved
                if(_.size(this.loadedPages) == this.maxPages) {

                    // if new current page is the highest, remove the left one
                    if(this.currentPage > _.last(this.loadedPages)) {
                        this.data.list.splice(0, this.pageLength);
                        let query = createQuery(params, 0, this.pageLength);
                        this.loadedPages.shift();
                    }

                    // if new current page is the lowest, remove the right one
                    else {
                        this.data.list.splice((this.loadedPages.length - 1) * this.pageLength, this.pageLength);
                        let query = createQuery(params, (this.loadedPages.length - 1) * this.pageLength, this.pageLength);
                        this.loadedPages.pop();
                    }

                    this.Item.ejectAll(params);
                }

                // DB findAll for the requested page, to cache and to return it
                let query = createQuery(params, this.currentPage*this.pageLength, this.pageLength);
                return this.Item.findAll(query).then((items) => {

                    // if new current page is the lowest, locate it on the left
                    if(this.currentPage < _.last(this.loadedPages)){
                        this.loadedPages.unshift(this.currentPage);
                        this.data.list = items.concat(this.data.list);
                        return items;
                    }

                    // if new current page is the highest, locate it on the right
                    this.loadedPages.push(this.currentPage);
                    this.data.list = this.data.list.concat(items);
                    return items;
                });
            }
        }

        // if page is false, reset and find and cache firstpage
        else {
            this.Item.ejectAll();
            this.data.list = [];
            let query = createQuery(params, 0, this.pageLength);

            return this.Item.findAll(query).then((items) => {
                this.currentPage = 0;
                this.loadedPages = [0];
                this.data.list = items;
                return this.data.list;
            });
        }
    }

    /**
     * Get item by id. Find items from cache data
     * The item must be already cached. Single item only is requested through listed and cached items
     *
     * @param itemId on INT format which to find,
     * @returns Item Object
     */
    getItemById (itemId) {
        return _.find(this.data.list, (item) => {
            return item.id === itemId
        })
    };
}

/**
 * Private function to generate JSON of params used on DS finds queries
 *
 * @param params is an Object with any or all these properties: "title, source, category, skip, limit"
 * @returns a DS format params Object
 */
function createQuery(params, skip = false, limit = false) {
    let _params = {sort: [['src_date', 'DESC']]};

    if(skip !== false) {
        _params.skip = skip;
        _params.limit = limit;
    }

    if(!_.isEmpty(params)){
        _params.where = {};
        if(params.title){
            _params.where.title = {'in': params.title};
        }
        if(params.source){
            _params.where.source = {'==': params.source};
        }
        if(params.category){
            _params.where.category = {'==': params.category};
        }
    }

    return _params;
}