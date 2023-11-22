import { Card } from "../card";
import { CardGroup } from "../cardgroup";
import * as elasticlunr from "elasticlunr";
import { addItemToStack } from "./search-stack";
import { addItemToDesktop } from "./desktop";
import { whichLeftPaneActive, LeftPaneType } from "./pane-management";

export type SearchIndex = {
    name: string,
    description: string,
    id: string
}

export const initSearch = (cards: Card[], cardGroups: CardGroup[]) => {
    const combinedItems = [...cards, ...cardGroups];
    const index = elasticlunr<SearchIndex>(function() {
        this.addField('name');
        this.addField('description');
        this.setRef('id');
    });

    const documents: SearchIndex[] = combinedItems.map(item => {
        return {
            name: item.name,
            description: item.description,
            id: item.uniqueID.replace(/-/g, ' ')
        }
    });
    documents.forEach(document => index.addDoc(document));

    const searchBar = document.getElementById('search-query-input') as HTMLInputElement;
    const searchResultsContainer = document.getElementById('search-results-container') as HTMLDivElement;
    const searchFilterCardsOnly = document.getElementById('search-filter-cards-only') as HTMLInputElement;
    const searchFilterCardgroupsOnly = document.getElementById('search-filter-cardgroups-only') as HTMLInputElement;

    const runSearchQuery = () => {
        const query = searchBar.value;
        const results = index.search(query, {
            fields: {
                name: {boost: 2},
                description: {boost: 1},
            }
        });
        localStorage.setItem("search-query", query);

        searchResultsContainer.innerHTML = '';

        results.forEach(result => {
            const isCard = result.ref.slice(0, 3) !== '[G]';
            if(searchFilterCardsOnly.checked && !searchFilterCardgroupsOnly.checked){
                if(!isCard) return;
            } else if(!searchFilterCardsOnly.checked && searchFilterCardgroupsOnly.checked){
                if(isCard) return;
            }

            const searchItem = document.createElement('div');
            searchItem.className = 'search-result-item';
            const searchHeader = document.createElement('h3');
            searchHeader.className = 'search-item-header';
            searchHeader.innerHTML = result.ref; //.replace(/ /g, '-');
            const searchButtonRow = document.createElement('div');
            searchButtonRow.className = 'search-button-row'

            // const addToStackButton = document.createElement('button');
            // addToStackButton.innerHTML = 'Add to Stack';
            // searchButtonRow.append(addToStackButton);
            // const addToDesktopButton = document.createElement('button');
            // addToDesktopButton.innerHTML = 'Add to Desktop';
            // searchButtonRow.append(addToDesktopButton);

            searchItem.append(searchHeader);
            // searchItem.append(searchButtonRow);
            searchResultsContainer.append(searchItem);

            searchItem.addEventListener('click', () => {
                const thisID = result.ref.replace(/ /g, '-');
                const item = combinedItems.find(item => item.uniqueID === thisID);

                if(!item) return;
                if(whichLeftPaneActive() === LeftPaneType.Desktop){
                    addItemToDesktop(item);
                } else {
                    addItemToStack(item);
                }
            });
        });
    };

    searchBar.addEventListener('input', runSearchQuery);
    searchFilterCardsOnly.addEventListener('click', runSearchQuery);
    searchFilterCardgroupsOnly.addEventListener('click', runSearchQuery);

    // finalization\
    const prevQuery = localStorage.getItem("search-query");
    if(prevQuery){
        searchBar.value = prevQuery;
        runSearchQuery();
    }
}