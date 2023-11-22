import { Card } from "../card";
import { CardGroup } from "../cardgroup";
import { addItemToDesktop } from "./desktop";
import { whichLeftPaneActive, LeftPaneType } from "./pane-management";
import { addItemToStack } from "./search-stack";

export type HierarchyInternalItem = {
    uniqueID: string,
    depth: number,
    emptyChild: HTMLElement
}

export const initHierarchy = (cards: Card[], cardGroups: CardGroup[]) => {
    const hierarchyRoot = document.getElementById('hierarchy-root') as HTMLDivElement;
    const empty = document.getElementById('hierarchy-empty') as HTMLDivElement;
    const rootGroups = cardGroups.filter(group => cardGroups.every(otherGroup => {
        const thisID = group.uniqueID;
        if(thisID === otherGroup.uniqueID) return true;
        else return otherGroup.childrenIDs.every(childID => childID !== thisID);
    }));
    const rootCards = cards.filter(card => 
        cardGroups.every(group => 
            group.childrenIDs.every(childID => card.uniqueID != childID)));
    const combinedItems: (Card | CardGroup)[] = [...cards, ...cardGroups];
    const hierarchyManager = new Map<string, HierarchyInternalItem>();

    const createHierarchyItem = (id: string, insertAfter: HTMLElement, depth: number) => {
        const correspondingItem = combinedItems.find(item => item.uniqueID === id);
        const isCardGroup = correspondingItem instanceof CardGroup;
        const itemContainer = document.createElement('div');
        const item = document.createElement('div');
        const itemChildrenContainer = document.createElement('div');
        const itemEmptyChild = document.createElement('div');
        itemContainer.className = 'hierarchy-item-container';
        item.className = 'hierarchy-item';
        itemChildrenContainer.className = 'hierarchy-item-child-container';

        const leftPadding = document.createElement('div');
        leftPadding.innerHTML = '&nbsp;'.repeat(depth * 3);
        const label = document.createElement('div');
        label.innerHTML = isCardGroup ? `<b>${id}</b>` : `${id}`;
        label.className = 'hierarchy-label';
        const toggleButton = document.createElement('button');
        toggleButton.className = 'hierarchy-toggle-button';
        toggleButton.innerHTML = '+';
        item.appendChild(leftPadding);

        if(isCardGroup) {
            item.appendChild(toggleButton);
        } else {
            const cardSpacer = document.createElement('div');
            cardSpacer.innerHTML = '-&nbsp;';
            cardSpacer.className = 'hierarchy-non-toggle-spacer'
            item.appendChild(cardSpacer);
        }

        item.appendChild(label);
        itemContainer.appendChild(item);
        itemContainer.appendChild(itemChildrenContainer);
        itemChildrenContainer.appendChild(itemEmptyChild);
        insertAfter.insertAdjacentElement("afterend", itemContainer);

        let addedChildren: HTMLDivElement[] = [];
        toggleButton.addEventListener('click', () => {
            if(toggleButton.innerHTML === "+"){ // expand
                toggleButton.innerHTML = "-";
                const targetGroup = cardGroups.find(group => group.uniqueID === id) as CardGroup;
                const childrenIDs = targetGroup.childrenIDs;

                let prevItem = itemEmptyChild;
                childrenIDs.forEach(id => {
                    const newItem = createHierarchyItem(id, prevItem, depth + 1);
                    addedChildren.push(newItem);
                    prevItem = newItem;
                });
            }

            else { // close
                toggleButton.innerHTML = "+";
                addedChildren.forEach(child => child.remove());
                addedChildren = [];
            }
        })

        const internalItem : HierarchyInternalItem = {
            uniqueID: id,
            depth: depth,
            emptyChild: itemEmptyChild
        };
        hierarchyManager.set(id, internalItem);

        label.addEventListener('click', () => {
            if(!correspondingItem) return;
            if(whichLeftPaneActive() === LeftPaneType.Desktop){
                addItemToDesktop(correspondingItem);
            } else {
                addItemToStack(correspondingItem);
            }
        });

        return itemContainer;
    }

    let prevItem = empty;
    rootGroups.forEach(rootGroup => {
        const newItem = createHierarchyItem(rootGroup.uniqueID, prevItem, 0)
        prevItem = newItem;
    })
}