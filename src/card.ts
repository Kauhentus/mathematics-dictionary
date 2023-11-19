import { fromJSONSafeText, toJSONSafeText } from "./util/json-text-converter";
import { copyToClipboard } from "./util/clipboard";

export interface CardJSON {
    name: string;
    description: string;

    categories: string[];
    subcards: string[];
    creationDate: Date;
    editDate: Date;
}

export class Card {
    name: string;
    uniqueID: string;
    description: string;

    categories: string[];
    subCards: string[];
    creationDate: Date;
    editDate: Date;

    node: HTMLDivElement;
    nodeID: string;
    displayMetaData: boolean;

    constructor(name: string, description: string, id: string = ''){
        this.name = name;
        this.uniqueID = name.replace(/ /g, '-').toLocaleLowerCase();
        this.description = fromJSONSafeText(description);

        this.creationDate = new Date();
        this.editDate = new Date();
        this.categories = [];
        this.subCards = [];

        this.displayMetaData = true;
        this.node = document.createElement('div');
        this.nodeID = id.length > 0 ? id : this.uniqueID;
        this.constructNode(id);
    }

    static constructFromOldJSON(object: any){
        
    }

    constructNode(id: string){
        // create base node
        const node = document.createElement('div');
        const nameNode = document.createElement('h2');
        const descriptionNode = document.createElement('p');
        nameNode.innerText = this.name;
        descriptionNode.innerHTML = this.description;
        node.appendChild(nameNode);
        node.appendChild(descriptionNode);

        // create subcards
        if(this.subCards.length > 0){
            const subcardNode = document.createElement('div');
            const subcardHeader = document.createElement('h4');
            const subcardContainer = document.createElement('div');
            const leftSubcardList = document.createElement('div');
            const rightSubcardList = document.createElement('div');
            subcardHeader.innerHTML = 'Subcards:'
            subcardHeader.className = 'card-subcard-header';
            subcardContainer.appendChild(leftSubcardList);
            subcardContainer.appendChild(rightSubcardList);
            subcardContainer.className = 'card-subcard-container';
            leftSubcardList.className = 'card-subcard-leftlist';
            rightSubcardList.className = 'card-subcard-rightlist';

            const createSubcardItem = (i: number) => {
                const subcardItem = document.createElement('div');
                subcardItem.innerHTML = `- ${this.subCards[i]}`;
                subcardItem.className = 'card-subcard-item';
                return subcardItem;
            }
            
            for(let i = 0; i < this.subCards.length; i++){
                leftSubcardList.appendChild(createSubcardItem(i))
            }
            // for(let i = 0; i < Math.floor(this.subCards.length / 2); i++){
            //     leftSubcardList.appendChild(createSubcardItem(i))
            // }
            // for(let i = Math.floor(this.subCards.length / 2); i < this.subCards.length; i++){
            //     rightSubcardList.appendChild(createSubcardItem(i))
            // }

            subcardNode.appendChild(subcardHeader);
            subcardNode.appendChild(subcardContainer);
            node.appendChild(subcardNode);
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
        buttonRow.appendChild(copyUniqueIDButton)
        buttonRow.className = 'card-button-row';
        node.appendChild(buttonRow);

        // create category + metadata rendering
        const metaDisplay = document.createElement('div');
        metaDisplay.className = 'card-meta-row';
        if(this.displayMetaData && this.categories.length > 0){
            metaDisplay.innerHTML = this.categories.map(cat => `#${cat.replace(/ /g, '-')}`).join(' ');
            node.appendChild(metaDisplay);
        }

        node.className = 'card';
        if(id.length > 0) node.id = id;
        this.node = node;
    }

    setDates(creationDate: Date, editDate: Date){
        this.creationDate = creationDate;
        this.editDate = editDate;
    }

    setCategories(categories: string[]){
        this.categories = categories;
        this.constructNode(this.nodeID);
    }

    setSubcards(subcards: string[]){
        this.subCards = subcards.sort();
        this.constructNode(this.nodeID);
    }

    toJSON(){
        return `{
    "name": "${this.name}",
    "uniqueID": "${this.uniqueID}",
    "description": "${toJSONSafeText(this.description)}",

    "creationDate": ${JSON.stringify(this.creationDate)},
    "editDate": ${JSON.stringify(this.editDate)},

    "categories": ${JSON.stringify(this.categories)},
    "subcards": ${JSON.stringify(this.subCards)}
}`;
    }
    
    getNode(){
        return this.node;
    }
}