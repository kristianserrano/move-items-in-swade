
async function mvi_decreaseSourceQuantity(dragSource) {
	const item = await fromUuid(dragSource.uuid);
	if (!!item.parent) {
		if (item.system.quantity - 1 === 0) {
			await item.delete();
		} else {
			await item.update({ 'system.quantity': item.system.quantity - 1 });
		}
	}
}

async function mvi_adjustTargetQuantity(item, quantity) {
	await item.update({ 'system.quantity': quantity });
}

Hooks.on('dropActorSheetData', (dragTarget, sheet, dragSource) => {
	const keysPressed = game.keyboard.downKeys;
	const altPressed = keysPressed.has('AltLeft') || keysPressed.has('AltRight');
	const isItemType = dragSource.type === "Item";
	const uuidsExist = !!dragSource.uuid && !!dragTarget.uuid;
	const targetIsNotSelf = uuidsExist && !dragSource.uuid.startsWith(dragTarget.uuid) ? true : false;

	if (!altPressed && isItemType && targetIsNotSelf) {
		mvi_decreaseSourceQuantity(dragSource);
	} else if (altPressed) {
		keysPressed.clear();
	}
});
Hooks.on('preCreateItem', (document, data, user) => {
	const existingItem = document.actor.items.find((i) => i.name === data.name && i.id !== document.id);
	if (!!existingItem) {
		existingItem.update({ 'system.quantity': existingItem.system.quantity + 1 });
		return false;
	} else {
		document.updateSource({ 'system.quantity': 1 });
	}
});
