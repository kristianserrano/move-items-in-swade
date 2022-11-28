# Move Items in SWADE

**A Foundry VTT module for Savage Worlds Adventure Edition that allows moving Items between Actors instead of just copying them.**

This module allows for moving Items between SWADE Actors by dragging and dropping. To avoid cloning items, simply hold down the Alt/Option key before dragging an item.

If an Item with a quantity greater than 1 is dragged to another Actor's Sheet while holding Alt/Option, the quantity of the original Item is reduced by 1. If the target Actor has a matching Item, it increases the quantity by 1, otherwise it creates a new item with a quantity of 1. If the original Item only had a quantity of 1, it is deleted from the source Actor.
