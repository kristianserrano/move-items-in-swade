Hooks.on('dropActorSheetData', (dragTarget, sheet, dragSource, user) => {
	const keysPressed = game.keyboard.downKeys;
	const altPressed = keysPressed.has('AltLeft') || keysPressed.has('AltRight');
	const isItemType = dragSource.type === "Item";
	const uuidsExist = !!dragSource.uuid && !!dragTarget.uuid;
	const targetIsNotSelf = uuidsExist && !dragSource.uuid.startsWith(dragTarget.uuid) ? true : false;

	if (!altPressed && isItemType && targetIsNotSelf) {
		const dragSourceItem = fromUuid(dragSource.uuid);
		if (dragSourceItem.parent) {
			const item = fromUuid(dragSource.uuid);
			Item.deleteDocuments([item.id], { parent: dragSourceItem.parent });
		}
	} else if (altPressed) {
		keysPressed.clear();
	}
});
