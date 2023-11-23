import { fromJSONSafeText, toJSONSafeText } from "./util/json-text-converter";
import { Card } from "./card";
import { copyToClipboard } from "./util/clipboard";
import { addItemToStack, removeItemFromStack } from "./features/search-stack";
import { addItemToDesktop, refCombinedItems, removeItemFromDesktop } from "./features/desktop";
import { whichLeftPaneActive, LeftPaneType, switchToDesktop } from "./features/pane-management";

export interface CardGroupJSON {
    name: string;
    description: string;

    childrenIDs: string[];
}

export class CardGroup {
    name: string;
    uniqueID: string;
    description: string;

    childrenIDs: string[];
    children: (CardGroup | Card)[]

    node: HTMLDivElement;
    nodeDesktopCopy: HTMLDivElement;
    nodeID: string;
    activeName: boolean;
    copyToDesktopButton: HTMLElement;

    constructor(name: string, description: string, id: string = ''){
        this.name = name;
        this.uniqueID = '[G]' + name.replace(/ /g, '-').toLocaleLowerCase();
        this.description = fromJSONSafeText(description);

        this.childrenIDs = [];
        this.children = [];

        this.activeName = true;
        this.copyToDesktopButton = document.createElement('div');
        this.nodeDesktopCopy = this.constructNodeInternal(id, true);
        this.node = this.constructNodeInternal(id);
        this.nodeID = id.length > 0 ? id : this.uniqueID;
    }

    // similar to card.ts' constructNode
    constructNode(id: string){
        this.nodeDesktopCopy = this.constructNodeInternal(id, true);
        this.node = this.constructNodeInternal(id);
    }

    constructNodeInternal(id: string, isDesktop = false){
        // create base node
        const node = document.createElement('div');
        const nameNode = document.createElement('h2');
        const descriptionNode = document.createElement('p');
        nameNode.innerText = `[G] ${this.name}`;
        descriptionNode.innerHTML = this.description;
        node.appendChild(nameNode);
        node.appendChild(descriptionNode);

        nameNode.className = 'card-group-name';
        nameNode.addEventListener('contextmenu', (event) => {
            if(!this.activeName) return;
            event.preventDefault();
            if(whichLeftPaneActive() === LeftPaneType.Desktop){
                removeItemFromDesktop(this);
            } else {
                removeItemFromStack(this);
            }
            return false;
        });
        nameNode.addEventListener('click', (event) => {
            if(!this.activeName) return;
            if(whichLeftPaneActive() === LeftPaneType.Desktop){
                addItemToDesktop(this);
            } else {
                addItemToStack(this);
            }
            event.stopPropagation();
        });

        // create children list
        const subcardNode = document.createElement('div');
        const subcardHeader = document.createElement('h4');
        const subcardContainer = document.createElement('div');
        subcardContainer.className = 'card-group-subcard-container';
        subcardHeader.innerHTML = 'Children:'
        subcardHeader.className = 'card-group-subcard-header';
        subcardNode.appendChild(subcardHeader);
        subcardNode.appendChild(subcardContainer);
        node.appendChild(subcardNode);

        const createSubcardItem = (i: number) => {
            const subcardItem = document.createElement('div');
            subcardItem.innerHTML = `- ${this.childrenIDs[i]}`;
            subcardItem.className = 'card-group-subcard-item';
            subcardItem.style.cursor = 'pointer';
            subcardItem.addEventListener('click', (event) => {
                const item = refCombinedItems.find(item => item.uniqueID === this.childrenIDs[i]);
                if(item === undefined) return;
                else if(!this.activeName) return;
                
                if(whichLeftPaneActive() === LeftPaneType.Desktop) addItemToDesktop(item);
                else addItemToStack(item);
            });
            return subcardItem;
        }
        
        for(let i = 0; i < this.childrenIDs.length; i++){
            subcardContainer.appendChild(createSubcardItem(i))
        }

        // add buttons
        const buttonRow = document.createElement('div');
        const copyJSONButton = document.createElement('button');
        copyJSONButton.innerText = 'Copy JSON';
        copyJSONButton.addEventListener('click', () => copyToClipboard(this.toJSON()));
        buttonRow.appendChild(copyJSONButton);
        const copyUniqueIDButton = document.createElement('button');
        copyUniqueIDButton.innerHTML = 'Copy ID';
        copyUniqueIDButton.addEventListener('click', () => copyToClipboard(this.uniqueID));
        buttonRow.appendChild(copyUniqueIDButton);
        const copyToDesktopButton = document.createElement('button');
        copyToDesktopButton.innerHTML = 'Copy to Desktop';
        copyToDesktopButton.addEventListener('click', () => {
            addItemToDesktop(this);
            switchToDesktop();
        });
        copyToDesktopButton.style.display = 'none';
        if(!isDesktop) this.copyToDesktopButton = copyToDesktopButton;
        buttonRow.appendChild(copyToDesktopButton)
        buttonRow.className = 'card-button-row';
        node.appendChild(buttonRow);

        // finalize node construction
        node.className = 'card-group';
        if(id.length > 0) node.id = id;
        return node;
    }

    disableNameAdding(){
        this.activeName = false;
    }

    enableCopyToDesktop(){
        this.copyToDesktopButton.style.display = 'inline';
    }

    disableCopyToDesktop(){
        this.copyToDesktopButton.style.display = 'none';
    }

    setChildrenIDs(childrenIDs: string[]){
        this.childrenIDs = childrenIDs.sort();
        this.constructNode(this.nodeID);
    }

    toJSON(){
        return `{
    "name": "${this.name}",
    "uniqueID": "${this.uniqueID}",
    "description": "${toJSONSafeText(this.description)}",
    "childrenIDs": ${JSON.stringify(this.childrenIDs)}
}`;
    }

    getNode(){
        return this.node;
    }

    getDesktopNode(){
        return this.nodeDesktopCopy;
    }
}