import angular from 'angular';
import angularSpinner from 'angular-spinner';

import DefaultExporter from './../default-exporter';
import DefaultExporterDirective from './default-exporter-directive';


export default angular.module('exporter.default', [
	DefaultExporter.name
])


.directive('defaultexporter', DefaultExporterDirective);