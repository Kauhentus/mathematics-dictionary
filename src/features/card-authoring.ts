import { fromJSONSafeText } from "../util/json-text-converter";
import { Card } from "../card";
import { copyToClipboard, copyFromClipboard } from "../util/clipboard";

export const initCardAuthoring = async () => {
    const cardNameInput = document.getElementById('card-name-input') as HTMLInputElement;
    const cardDescriptionInput = document.getElementById('card-description-input') as HTMLTextAreaElement;
    const cardDescriptionOutput = document.getElementById('card-description-output') as HTMLTextAreaElement;
    const previewCardContainer = document.getElementById('card-preview-container') as HTMLDivElement;
    const cardCategoryInput = document.getElementById('card-category-input') as HTMLTextAreaElement;
    const cardSubcardInput = document.getElementById('card-subcard-input') as HTMLTextAreaElement;

    // meta variables whose state is not carried in innerHTML
    let creationDate= new Date();

    const descriptionInputUpdate = () => {
        const name = cardNameInput.value;
        const description = cardDescriptionInput.value;
        const previewCard = new Card(name, description, 'preview-card');
        previewCard.setDates(creationDate, new Date());
        previewCard.setCategories(cardCategoryInput.value.split(',').map(name => name.trim()).filter(name => name.length > 0));
        previewCard.setSubcards(cardSubcardInput.value.split('\n').map(name => name.trim()).filter(name => name.length > 0));
        cardDescriptionOutput.value = previewCard.toJSON();

        const previewCardNode = previewCard.getNode();
        previewCardContainer.childNodes.forEach(node => node.remove());
        previewCardContainer.appendChild(previewCardNode);

        // @ts-ignore
        if (window.MathJax) MathJax.typeset([previewCardNode]);
    }

    const descriptionOutputUpdate = () => {
        try {
            const object = JSON.parse(cardDescriptionOutput.value);
            const hasName = object.name !== undefined && typeof object.name == 'string';
            const hasDescription = object.description !== undefined && typeof object.description == 'string';
            const hasCreationDate = object.creationDate !== undefined && typeof object.creationDate == 'string';
            const hasCategories = object.categories !== undefined && typeof object.categories == 'object';
            const hasSubcards = object.subcards !== undefined && typeof object.subcards == 'object';

            if(
                hasName && hasDescription && hasCreationDate &&
                hasCategories && hasSubcards
            ){
                cardNameInput.value = object.name;
                cardDescriptionInput.value = fromJSONSafeText(object.description);
                creationDate = new Date(object.creationDate);

                cardCategoryInput.value = object.categories.join(', ');
                cardSubcardInput.value = object.subcards.join('\n');

                descriptionInputUpdate();
            }
        } catch(e) {
            console.log(e)
            return;
        }        
    };

    cardNameInput.addEventListener('input', descriptionInputUpdate);
    cardDescriptionInput.addEventListener('input', descriptionInputUpdate);
    cardDescriptionOutput.addEventListener('input', descriptionOutputUpdate);
    cardCategoryInput.addEventListener('input', descriptionInputUpdate);
    cardSubcardInput.addEventListener('input', descriptionInputUpdate);

    const copyButton = document.getElementById('card-authoring-copy-button') as HTMLButtonElement;
    const pasteButton = document.getElementById('card-authoring-paste-button') as HTMLButtonElement;
    const clearButton = document.getElementById('card-authoring-clear-button') as HTMLButtonElement;
    
    copyButton.addEventListener('click', () => {
        copyToClipboard(cardDescriptionOutput.value);
    });
    pasteButton.addEventListener('click', () => {
        copyFromClipboard().then(text => {
            cardDescriptionOutput.value = text;
            descriptionOutputUpdate();
        });
    })
    clearButton.addEventListener('click', () => {
        cardNameInput.value = '';
        cardDescriptionInput.value = '';
        creationDate = new Date();
        cardCategoryInput.value = '';
        cardSubcardInput.value = '';
        descriptionInputUpdate();
    });

    descriptionInputUpdate();
}
