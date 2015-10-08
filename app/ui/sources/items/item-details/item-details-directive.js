/**
 * @fileOverview
 *
 * This file contains the item details directive and controller
 */


/**
 * Items directive factory
 *
 * @returns {object} DDO directive definition object
 * @constructor
 */
export default function ItemDetailsDirective(){
	return {
		scope: {
			item: "@"
		},
		controllerAs: 'vm',
		controller: ItemDetailsController,
		bindToController: true,
		templateUrl: 'ui/sources/items/item-details/item-details.html'
	};
}


class ItemDetailsController {
	constructor(ItemManager, $state) {

		this.state = $state;
		this.ItemManager = ItemManager;

		this.ItemManager.Item.find(this.item).then((item) => {
			if(item) {
				this.details = item;
			}
			else {
				this.returnToItemList();
			}
		});
	}

	returnToItemList () {
		this.$state.go("app.sources");
	}
}
