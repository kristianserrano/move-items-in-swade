
async function mvi_adjustQuantities(dragTarget, sheet, dragSource) {
	const item = await fromUuid(dragSource.uuid);
	const isQualifiedItem = hasProperty(item, 'system.quantity') && item.documentName === 'Item'
	const originalItem = await fromUuid(dragSource.uuid);
	//await item.setFlag('move-items-in-swade', 'sourceUuid', dragSource.uuid);
	const target = await fromUuid(dragTarget.uuid);
	const targetIsNotSelf = originalItem.actor !== target;
	if (isQualifiedItem && targetIsNotSelf) {
		if (target && target.isOwner) {
			let quantity = 1;
			await Dialog.wait({
				title: game.i18n.format("MOVE_ITEMS.QuantityDialogTitle", { name: item.name }),
				content: `
					<label for="quantity">${game.i18n.format("MOVE_ITEMS.HowManyItems")}</label>
					<input type="number" id="quantity" value="1" autofocus>
				`,
				buttons: {
					moveX: {
						label: game.i18n.format("MOVE_ITEMS.MoveX"),
						callback: async (html) => {
							quantity = parseInt(html.find("#quantity")[0].value);
							if (item.system.quantity - quantity === 0) {
								await item.delete();
							} else if (item.system.quantity - quantity > 0) {
								await item.update({ 'system.quantity': item.system.quantity - quantity });
							} else if (item.system.quantity - quantity < 0) {
								ui.notifications.warn(game.i18n.format("MOVE_ITEMS.QuantityNotAvailable"));
								return;
							}
							const existingItem = target.items.find((i) => i.name === item.name);
							if (existingItem) {
								await existingItem.update({ 'system.quantity': existingItem.system.quantity + quantity });
							} else {
								const newItem = await item.clone();
								await newItem.updateSource({ 'system.quantity': quantity });
								await Item.create(newItem, {
									parent: target
								});
							}
						}
					},
					moveAll: {
						label: game.i18n.format("MOVE_ITEMS.MoveAll"),
						callback: async () => {
							quantity = item.system.quantity;
							const existingItem = target.items.find((i) => i.name === item.name);
							if (existingItem) {
								await existingItem.update({ 'system.quantity': existingItem.system.quantity + quantity });
							} else {
								const newItem = await item.clone();
								await newItem.updateSource({ 'system.quantity': quantity });
								await Item.create(newItem, {
									parent: target
								});
							}
							await item.delete();
						}
					},
					cancel: {
						label: game.i18n.format("MOVE_ITEMS.Cancel")
					}
				},
				default: "moveAll"
			}, { classes: ["swade-app"] });
		} else {
			ui.notifications.warn(game.i18n.format("MOVE_ITEMS.NoOwnership"));
		}
	}
};

Hooks.on('preCreateItem', (document, data, user) => {
	const altPressed = KeyboardManager.getKeyboardEventContext(event).isAlt;
	if (altPressed) {
		return false;
	}
});

Hooks.on('dropActorSheetData', (dragTarget, sheet, dragSource) => {
	const altPressed = KeyboardManager.getKeyboardEventContext(event).isAlt;
	if (altPressed) {
		mvi_adjustQuantities(dragTarget, sheet, dragSource);
	}
});
