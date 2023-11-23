import { Card, CardJSON } from "./card";
import { loadData } from "./util/loader";
import { initCardAuthoring } from "./features/card-authoring";
import { createVSpacer } from "./util/spacers";
import { LeftPaneType, RightPaneType, initPaneManagement } from "./features/pane-management";
import { initCardGroupAuthoring } from "./features/card-group-authoring";
import { CardGroup, CardGroupJSON } from "./cardgroup";
import { initHierarchy } from "./features/hierarchy";
import { initSearch } from "./features/search";
import { initSearchStack } from "./features/search-stack";
import { initDesktop } from "./features/desktop";
import { initPaneResizing } from "./features/pane-resizing";

const loadCards = async () => {
    const cardMap = await loadData('./card-map.json');
    const paths: string[] = cardMap.files;
    const cardsJSON = await Promise.all(paths.map(path => loadData(`../data-cards/${path}.json`)));

    return cardsJSON;
}

const loadCardGroups = async () => {
    const cardMap = await loadData('./card-group-map.json');
    const paths: string[] = cardMap.files;
    const cardsJSON = await Promise.all(paths.map(path => loadData(`../data-card-groups/${path}.json`)));

    return cardsJSON;
}

const init = async () => {
    let cardsJSON: CardJSON[] = await loadCards();
    let cardGroupsJSON: CardGroupJSON[] = await loadCardGroups();
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
    let cardGroups = cardGroupsJSON.map(data => {
        const cardGroup = new CardGroup(data.name, data.description);
        if(data.childrenIDs) cardGroup.setChildrenIDs(data.childrenIDs);
        return cardGroup;
    });

    // cards.forEach(card => {
    //     const domNode = card.getNode();
    //     leftPaneNode.append(domNode);
    //     leftPaneNode.append(createVSpacer(8));
    // });
    // cardGroups.forEach(cardGroup => {
    //     const domNode = cardGroup.getNode();
    //     leftPaneNode.append(domNode);
    //     leftPaneNode.append(createVSpacer(8));
    // });

    const prevSelectedLeftPane = localStorage.getItem('selected-left-pane');
    const prevSelectedRightPane = localStorage.getItem('selected-right-pane');
    if(prevSelectedLeftPane !== null && prevSelectedRightPane !== null){
        const prevLeft = parseInt(prevSelectedLeftPane) as LeftPaneType;
        const prevRight = parseInt(prevSelectedRightPane) as RightPaneType;
        initPaneManagement(prevLeft, prevRight);
    } else {
        initPaneManagement(LeftPaneType.Desktop, RightPaneType.Search);
    }

    initCardAuthoring();
    initCardGroupAuthoring();
    initHierarchy(cards, cardGroups);
    initSearch(cards, cardGroups);

    initSearchStack(cards, cardGroups);
    initDesktop(cards, cardGroups);
    initPaneResizing();
    
    // @ts-ignore
    if (window.MathJax) MathJax.typeset();
}

init();