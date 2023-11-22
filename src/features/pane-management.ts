export enum LeftPaneType {
    Desktop,
    SearchStack
}

export enum RightPaneType {
    CreateCard,
    CreateCardGroup,
    Search,
    Metadata,
    Hierarchy
}

export const initPaneManagement = (defaultLeft: LeftPaneType = LeftPaneType.SearchStack, defaultRight: RightPaneType = RightPaneType.CreateCardGroup) => {
    const leftPaneDesktop = document.getElementById("left-pane-desktop") as HTMLDivElement;
    const leftPaneSearchStack = document.getElementById("left-pane-search-stack") as HTMLDivElement;
    const rightPaneCreateCard = document.getElementById("right-pane-create-card") as HTMLDivElement;
    const rightPaneCreateCardGroup = document.getElementById("right-pane-create-card-group") as HTMLDivElement;
    const rightPaneSearch = document.getElementById("right-pane-search") as HTMLDivElement;
    const rightPaneMetadata = document.getElementById("right-pane-metadata") as HTMLDivElement;
    const rightPaneHierarchy = document.getElementById("right-pane-hierarchy") as HTMLDivElement;
    
    const leftPaneButtonDesktop = document.getElementById("left-pane-button-desktop") as HTMLDivElement;
    const leftPaneButtonSearchStack = document.getElementById("left-pane-button-search-stack") as HTMLDivElement;
    const rightPaneButtonCreateCard = document.getElementById("right-pane-button-create-card") as HTMLButtonElement;
    const rightPaneButtonCreateCardGroup = document.getElementById("right-pane-button-create-card-group") as HTMLButtonElement;
    const rightPaneButtonSearch = document.getElementById("right-pane-button-search") as HTMLButtonElement;
    const rightPaneButtonMetadata = document.getElementById("right-pane-button-metadata") as HTMLButtonElement;
    const rightPaneButtonHierarchy = document.getElementById("right-pane-button-hierarchy") as HTMLButtonElement;
    
    const leftPaneNodeEnumPairs: [HTMLDivElement, LeftPaneType][] = [
        [leftPaneDesktop, LeftPaneType.Desktop],
        [leftPaneSearchStack, LeftPaneType.SearchStack]
    ];
    const leftPaneClicked = (selectedPane: LeftPaneType) => {
        leftPaneNodeEnumPairs.forEach(pair => {
            if(pair[1] === selectedPane) pair[0].style.display = 'flex';
            else pair[0].style.display = 'none';
        });
    }
    const rightPaneNodeEnumPairs: [HTMLDivElement, RightPaneType][] = [
        [rightPaneCreateCard, RightPaneType.CreateCard],
        [rightPaneCreateCardGroup, RightPaneType.CreateCardGroup],
        [rightPaneSearch, RightPaneType.Search],
        [rightPaneMetadata, RightPaneType.Metadata],
        [rightPaneHierarchy, RightPaneType.Hierarchy],
    ];
    const rightPaneClicked = (selectedPane: RightPaneType) => {
        rightPaneNodeEnumPairs.forEach(pair => {
            if(pair[1] === selectedPane) pair[0].style.display = 'flex';
            else pair[0].style.display = 'none';
        });
    }
    
    leftPaneButtonDesktop.addEventListener('click', () => leftPaneClicked(LeftPaneType.Desktop));
    leftPaneButtonSearchStack.addEventListener('click', () => leftPaneClicked(LeftPaneType.SearchStack));
    rightPaneButtonCreateCard.addEventListener('click', () => rightPaneClicked(RightPaneType.CreateCard));
    rightPaneButtonCreateCardGroup.addEventListener('click', () => rightPaneClicked(RightPaneType.CreateCardGroup));
    rightPaneButtonSearch.addEventListener('click', () => rightPaneClicked(RightPaneType.Search));
    rightPaneButtonMetadata.addEventListener('click', () => rightPaneClicked(RightPaneType.Metadata));
    rightPaneButtonHierarchy.addEventListener('click', () => rightPaneClicked(RightPaneType.Hierarchy));

    // finalize pane management and disable select buttons
    leftPaneClicked(defaultLeft);
    rightPaneClicked(defaultRight);
    rightPaneButtonMetadata.style.display = 'none';
}

export const whichLeftPaneActive = () => {
    const leftPaneDesktop = document.getElementById("left-pane-desktop") as HTMLDivElement;
    const leftPaneSearchStack = document.getElementById("left-pane-search-stack") as HTMLDivElement;

    if(leftPaneDesktop.style.display !== 'none'){
        return LeftPaneType.Desktop;
    } else if(leftPaneSearchStack.style.display !== 'none'){
        return LeftPaneType.SearchStack;
    } else {
        return LeftPaneType.SearchStack; // default to the search stack
    }
}