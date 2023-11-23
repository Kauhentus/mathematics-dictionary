import { downloadFile } from "../util/download";
import { Card } from "../card";
import { CardGroup } from "../cardgroup";
import { getHHMM, getMMDDYYYY } from "../util/date";

let selectedSlot: HTMLDivElement | null = null;
let slotNodes : HTMLDivElement[] = [];
let columns = 2;
let slots = 50;

export type DesktopExportJSON = {
    columns: number,
    slots: number,
    data: (string | null)[]
};

export let refCombinedItems: (Card | CardGroup)[];

export const initDesktop = (cards: Card[], cardGroups: CardGroup[]) => {
    const desktopSurface = document.getElementById('desktop-container') as HTMLElement;
    const combinedItems: (Card | CardGroup)[] = [...cards, ...cardGroups];
    refCombinedItems = combinedItems;

    // create interactive surface
    const clickOnSlot = (slot: HTMLDivElement) => {
        // deactivate slot if card/cardgroup is already inside slot
        if(slot.children.length > 0) return;

        // handle border selection visual
        slotNodes.forEach(slot => {
            slot.style.border = '1px lightgray';
            slot.style.borderStyle = 'dashed';
        });

        if(selectedSlot !== slot){
            selectedSlot = slot;
            selectedSlot.style.border = '1px solid black';
            selectedSlot.style.borderStyle = 'solid';
        } else {
            selectedSlot = null;
        }
        toggleCopyToDesktopButtonActive(combinedItems);

        // handle dynamic cursor over
        slotNodes.forEach(slot => {
            if(slot.children.length === 0){
                slot.style.cursor = 'pointer';
            } else {
                slot.style.cursor = 'default';
            }
        });
    }

    const constructSurface = (slotsToLoad?: (string | null)[]) => {
        desktopSurface.innerHTML = '';
        slotNodes = [];
        let counter = 0;
        for(let x = 0; x < slots; x++){
            const row = document.createElement('div');
            row.className = `desktop-row`;

            for(let y = 0; y < columns; y++){
                const slot = document.createElement('div');
                slot.className = `desktop-slot${y !== 0 ? ' desktop-margin-left' : ''}`;

                slot.addEventListener('click', () => {
                    clickOnSlot(slot);
                });

                row.append(slot);
                slotNodes.push(slot);
                counter += 1;
            }

            desktopSurface.append(row);
        }

        // if loading in slots from json import
        if(!slotsToLoad) return;
        counter = 0;
        for(let x = 0; x < slots; x++){
            for(let y = 0; y < columns; y++){
                const loadedID = slotsToLoad[counter];
                const currentSlot = slotNodes[counter];
                if(loadedID !== null){
                    const item = combinedItems.find(item => item.uniqueID === loadedID);
                    if(item !== undefined){
                        selectedSlot = currentSlot;
                        addItemToDesktop(item);
                    }
                }
                counter += 1;
            }
        }
        selectedSlot = null;
        toggleCopyToDesktopButtonActive(combinedItems);
    }
    constructSurface();

    // handle top bar buttons
    const clearButton = document.getElementById('desktop-clear-button') as HTMLButtonElement;
    const importButton = document.getElementById('desktop-import-button') as HTMLButtonElement;
    const importFileInput = document.getElementById('desktop-import-file') as HTMLInputElement;
    const exportButton = document.getElementById('desktop-export-button') as HTMLButtonElement;

    clearButton.addEventListener('click', () => {
        slotNodes.forEach(node => {
            node.innerHTML = '';
            node.style.border = '1px lightgray';
            node.style.borderStyle = 'dashed';
            node.style.cursor = 'pointer';
        });
        selectedSlot = null;
        toggleCopyToDesktopButtonActive(combinedItems);
        saveDesktop();
    });

    importButton.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', async () => {
        const files: FileList | null = importFileInput.files;
        if(!files) return;
        const fileData = await files[0].text();
        const importData : DesktopExportJSON = JSON.parse(fileData);
        columns = importData.columns;
        slots = importData.slots;
        constructSurface(importData.data);
        importFileInput.value = '';
        saveDesktop();
    });
    exportButton.addEventListener('click', () => {
        const exportData : DesktopExportJSON = {
            columns: columns,
            slots: slots,
            data: slotNodes.map(slot => {
                if(slot.children.length === 0){
                    return null;
                } else {
                    return slot.children[0].id;
                }
            })
        };
        downloadFile(`desktop-${getHHMM()}-${getMMDDYYYY()}.json`, JSON.stringify(exportData, null, 4));
    });

    // local storage loading...
    const importDataJSON = localStorage.getItem("desktop-data");
    if(importDataJSON !== null){
        try {
            const importData: DesktopExportJSON = JSON.parse(importDataJSON);
            columns = importData.columns;
            slots = importData.slots;
            constructSurface(importData.data);
        } catch(e){

        }
    }
}

// local storage desktop saving...
export const saveDesktop = () => {
    const data : DesktopExportJSON = {
        columns: columns,
        slots: slots,
        data: slotNodes.map(slot => {
            if(slot.children.length === 0){
                return null;
            } else {
                return slot.children[0].id;
            }
        })
    };
    localStorage.setItem("desktop-data", JSON.stringify(data));
}

export const addItemToDesktop = (item : Card | CardGroup) => {
    const currentNode = item.getDesktopNode();
    // @ts-ignore
    if (window.MathJax) MathJax.typeset([currentNode]);
    if(!selectedSlot) return;
    if(selectedSlot.children.length > 0) return; // don't replace a card that's already in there
    selectedSlot.appendChild(currentNode);

    selectedSlot.style.border = '1px lightgray';
    selectedSlot.style.borderStyle = 'dashed';
    selectedSlot.style.cursor = 'default';
    selectedSlot = null;

    toggleCopyToDesktopButtonActive(refCombinedItems);
    saveDesktop();
}

export const removeItemFromDesktop = (item : Card | CardGroup) => {
    const currentNode = item.getDesktopNode();
    currentNode.remove();
    saveDesktop();
}

export const toggleCopyToDesktopButtonActive = (combinedItems: (Card | CardGroup)[]) => {
    const slotSelected = selectedSlot !== null;
    for(let item of combinedItems){
        const button = item.copyToDesktopButton as HTMLButtonElement;
        if(slotSelected){
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    }
}