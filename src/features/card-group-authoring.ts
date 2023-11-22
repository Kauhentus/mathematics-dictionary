import { fromJSONSafeText } from "../util/json-text-converter";
import { Card } from "../card";
import { CardGroup } from "../cardgroup";
import { copyToClipboard, copyFromClipboard } from "../util/clipboard";
import { downloadFile } from "../util/download";

export const initCardGroupAuthoring = async () => {
    const cardGroupNameInput = document.getElementById('card-group-name-input') as HTMLInputElement;
    const cardGroupDescriptionInput = document.getElementById('card-group-description-input') as HTMLTextAreaElement;
    const cardGroupDescriptionOutput = document.getElementById('card-group-description-output') as HTMLTextAreaElement;
    const previewCardGroupContainer = document.getElementById('card-group-preview-container') as HTMLDivElement;
    const cardGroupChildrenInput = document.getElementById('card-group-category-input') as HTMLTextAreaElement;

    // meta variables whose state is not carried in innerHTML
    let creationDate= new Date();

    const descriptionInputUpdate = () => {
        const name = cardGroupNameInput.value;
        const description = cardGroupDescriptionInput.value;
        const previewCardGroup = new CardGroup(name, description, 'preview-card');
        previewCardGroup.setChildrenIDs(cardGroupChildrenInput.value.split('\n').map(name => name.trim()).filter(name => name.length > 0));
        previewCardGroup.disableNameAdding();
        cardGroupDescriptionOutput.value = previewCardGroup.toJSON();

        const previewCardGroupNode = previewCardGroup.getNode();
        previewCardGroupContainer.childNodes.forEach(node => node.remove());
        previewCardGroupContainer.appendChild(previewCardGroupNode);

        // @ts-ignore
        if (window.MathJax) MathJax.typeset([previewCardGroupNode]);
    }

    const descriptionOutputUpdate = () => {
        try {
            const object = JSON.parse(cardGroupDescriptionOutput.value);
            const hasName = object.name !== undefined && typeof object.name == 'string';
            const hasDescription = object.description !== undefined && typeof object.description == 'string';
            const hasChildrenIDs = object.childrenIDs !== undefined && typeof object.childrenIDs == 'object';

            if(
                hasName && hasDescription && hasChildrenIDs
            ){
                cardGroupNameInput.value = object.name;
                cardGroupDescriptionInput.value = fromJSONSafeText(object.description);
                cardGroupChildrenInput.value = object.childrenIDs.join('\n');

                descriptionInputUpdate();
            }
        } catch(e) {
            console.log(e)
            return;
        }        
    };

    cardGroupNameInput.addEventListener('input', descriptionInputUpdate);
    cardGroupDescriptionInput.addEventListener('input', descriptionInputUpdate);
    cardGroupDescriptionOutput.addEventListener('input', descriptionOutputUpdate);
    cardGroupChildrenInput.addEventListener('input', descriptionInputUpdate);

    const downloadButton = document.getElementById('card-group-authoring-download-button') as HTMLButtonElement;
    const copyButton = document.getElementById('card-group-authoring-copy-button') as HTMLButtonElement;
    const pasteButton = document.getElementById('card-group-authoring-paste-button') as HTMLButtonElement;
    const clearButton = document.getElementById('card-group-authoring-clear-button') as HTMLButtonElement;
    
    downloadButton.addEventListener('click', () => {
        downloadFile(`${cardGroupNameInput.value.replace(/ /g, '-').toLocaleLowerCase()}.json`, cardGroupDescriptionOutput.value);
    });
    copyButton.addEventListener('click', () => {
        copyToClipboard(cardGroupDescriptionOutput.value);
    });
    pasteButton.addEventListener('click', () => {
        copyFromClipboard().then(text => {
            cardGroupDescriptionOutput.value = text;
            descriptionOutputUpdate();
        });
    })
    clearButton.addEventListener('click', () => {
        cardGroupNameInput.value = '';
        cardGroupDescriptionInput.value = '';
        cardGroupChildrenInput.value = '';
        descriptionInputUpdate();
    });

    descriptionInputUpdate();
}