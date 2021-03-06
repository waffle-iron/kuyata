import angular from 'angular';
import uiRouter from 'angular-ui-router';
import angularSpinner from 'angular-spinner';

import items from './items/items';
import SourceManager from './../../components/source/source-manager/source-manager';
import CategoryManager from './../../components/category/category-manager/category-manager';
import ItemManager from './../../components/item/item-manager/item-manager';

import language from './../language/language';
import importer from './../importer/importer';
import exporter from './../exporter/exporter';

import SourcesDirective from './sources-directive';
import CategoriesDirective from './categories-directive';

export default angular.module('app.sources', [
	uiRouter,

	items.name,
	SourceManager.name,
	CategoryManager.name,
	ItemManager.name,

	language.name,
	importer.name,
	exporter.name
])

.config(($stateProvider, $urlRouterProvider) => {

	$stateProvider

		.state("app.sources", {
			url: "/",
			views: {
				'sources@': {
					template: '<sources></sources>'
				}
			}
		})
})

.directive('sources', SourcesDirective)
.directive('categories', CategoriesDirective);
