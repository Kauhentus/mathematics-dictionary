export const initPaneResizing = () => {
    const ratioButton11 = document.getElementById('ratio-button-1-1') as HTMLButtonElement;
    const ratioButton21 = document.getElementById('ratio-button-2-1') as HTMLButtonElement;
    const ratioButton31 = document.getElementById('ratio-button-3-1') as HTMLButtonElement;
    const ratioButton41 = document.getElementById('ratio-button-4-1') as HTMLButtonElement;

    const changePaneRatio = (left: number, right: number) => () => {
        const totalWidth = 80;
        const leftWidth = Math.ceil(left / (left + right) * totalWidth);
        const rightWidth = Math.floor(right / (left + right) * totalWidth);
        
        const stylesheet = document.styleSheets[0]; // should be /web/style.css
        for(let rule of stylesheet.cssRules){
            let sr = rule as CSSStyleRule;
            if(sr.selectorText === '.left-pane-width'){
                sr.style.width = `${leftWidth}vw`;
            } else if(sr.selectorText === '.right-pane-width'){
                sr.style.width = `${rightWidth}vw`;
            }
        }

        const paneRatioJSON = {
            left: left,
            right: right
        };
        localStorage.setItem("pane-ratio", JSON.stringify(paneRatioJSON));
    }

    ratioButton11.addEventListener('click', changePaneRatio(1, 1));
    ratioButton21.addEventListener('click', changePaneRatio(2, 1));
    ratioButton31.addEventListener('click', changePaneRatio(4, 1));
    ratioButton41.addEventListener('click', changePaneRatio(6, 1));

    const prevPaneRatioJSON = localStorage.getItem("pane-ratio");
    if(prevPaneRatioJSON !== null){
        try {
            const prevPaneRatio = JSON.parse(prevPaneRatioJSON);
            changePaneRatio(prevPaneRatio.left, prevPaneRatio.right)();
        } catch(e){
            
        }
    }
}