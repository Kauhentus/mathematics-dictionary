import { Card, CardJSON } from "./card";
import { loadData } from "./util/loader";
import { initCardAuthoring } from "./features/card-authoring";
import { createVSpacer } from "./util/spacers";
import { initPaneManagement } from "./features/pane-management";

const leftPaneNode = document.getElementById('left-pane-search-stack') as HTMLDivElement;

const loadCards = async () => {
    const cardMap = await loadData('../card-map.json');
    const paths: string[] = cardMap.files;
    const cardsJSON = await Promise.all(paths.map(path => loadData(`../data-cards/${path}.json`)));

    return cardsJSON;
}

const init = async () => {
    let cardsJSON: CardJSON[] = await loadCards();
    let cards = cardsJSON.map(data => {
        const card = new Card(data.name, data.description);

        if(data.creationDate && data.editDate){
            card.setDates(data.creationDate, data.editDate);
        }
        if(data.categories && data.subcards){
            card.setCategories(data.categories);
            card.setSubcards(data.subcards);
        }

        return card;
    });
    cards.forEach(card => {
        const domNode = card.getNode();
        leftPaneNode.append(domNode);
        leftPaneNode.append(createVSpacer(8));
    });

    // @ts-ignore
    if (window.MathJax) MathJax.typeset();
}

init();
initCardAuthoring();
initPaneManagement();