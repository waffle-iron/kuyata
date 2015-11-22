import angular from 'angular';

import uiBootstrap from 'angular-bootstrap';
import ImporterDirective from './importer-directive';

// ui importer list
//import defaultImporter from './importers/default-importer/default-importer';
//import rssImporter from './importers/rss-importer/rss-importer';
//import packageImporter from './importers/package-importer/package-importer';

export default angular.module('importer', [
	'ui.bootstrap'
	//defaultImporter.name,
	//rssImporter.name,
	//packageImporter.name
])

.directive('importer', ImporterDirective);
