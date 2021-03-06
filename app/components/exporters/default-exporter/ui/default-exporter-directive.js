/**
 * @fileOverview
 *
 * This file contains the DefaultExporter directive and controller
 */


/**
 * Default directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function DefaultExporterDirective(){
	return {
		scope: {
			modali: "@"
		},
		controllerAs: 'vm',
		controller: DefaultExporterController,
		bindToController: true,
		templateUrl: 'scripts/exporters/default-exporter/ui/default-exporter.html'
	};
}

class DefaultExporterController {
	constructor(DefaultExporter, usSpinnerService, $rootScope) {
		this.DefaultExporter = DefaultExporter;
		this.usSpinnerService = usSpinnerService;
		this.state = 1;
		this.msg = "";
		this.sourceList = [];
		this.sourceListConfirmed = [];
		this.file = "";

		this.sourceRefs = {'ids': [], 'guids': []};

		this.DefaultExporter.getSourceList().then(sourceList => {
			this.sourceList = sourceList;
			this.sourceListConfirmed = Array(sourceList.length);
		});

		let chooser = document.querySelector("#fileDialogExport");
		chooser.addEventListener("change", (e) => {
			this.file = "";
			if(e.target.value){
				this.file = this.DefaultExporter.normalizeExtension(e.target.value);
			}
			$rootScope.$digest();
		}, false);
	}

	setSources(confirmed, index) {
		this.sourceListConfirmed[index] = confirmed;
	}

	notConfirmedSources() {
		if(this.sourceListConfirmed.indexOf(true) == -1) {
			return true;
		}
		return false;
	}

	exportDefaults() {
		this.state = 0;
		this.msg = "";
		let sourceRefs = {'ids': [], 'guids': []};
		this.usSpinnerService.spin('spinner-global');

		this.sourceList.forEach((source, i) => {
			if(this.sourceListConfirmed[i]) {
				sourceRefs.ids.push(source.id);
				sourceRefs.guids.push(source.guid);
			}
		});
		this.DefaultExporter.export(this.file, sourceRefs).then((response) => {
			this.usSpinnerService.stop('spinner-global');
			this.msg = "Exported successfully";
			this.state = 1;
		}).catch((err) => {
			this.usSpinnerService.stop('spinner-global');
			this.msg = "Error on export";
			this.state = 2;
		});
	}
}