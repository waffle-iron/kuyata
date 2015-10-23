/**
 * @fileOverview
 *
 * This file contains the Item model
 */

import _ from 'lodash';
import Source from '../../source/source-model/source-model';
import Category from '../../category/category-model/category-model';

/**
 *
 * @param $q
 * @param DS
 * @param utils
 * @returns {*}
 * @ngInject
 *
 */
export default function factory($q, DS, utils, Source, Category){
    Item.$q = $q;
    Item.utils = utils;
    Item.Source = Source;
    Item.Category = Category;

    return utils.defineAngularDataResource(DS, Item, {
        name: 'item'
    });
}


/**
 * @class
 *
 * Properties: as is all dynamic this is to keep track of what properties we are using within this model
 *
 * {number}     id              id on our local DB
 * {number}     source_id       source id on our DB
 * {number}     category_id     level 1 category id on our DB
 * {number}     subcategory_id  level 2 category id on our DB
 * {string}     title           item title
 * {string}     body            item body
 * {string}     author          item author
 * {string}     guid            item id from the item on feed. For sync reasons
 * {string}     url             item url on source
 * {string}     status          item status
 * {date}       src_date        creation date on source
 * {timedate}   created_at      creation date on our DB
 * {timedate}   updated_at      last modified date on our DB
 *
 */
class Item {

    constructor() {
    }

    /**
     * Get Source Object for the item source
     * @returns {*}
     */
    source() {
        return Item.Source.find(this.source_id);
    }

    /**
     * Get Category Object for the item category
     * @returns {*}
     */
    category() {
        return Item.Category.find(this.category_id);
    }

    /**
     * Get Category Object for the item subcategory
     * @returns {*}
     */
    subcategory() {
        return Item.Category.find(this.subcategory_id);
    }
}