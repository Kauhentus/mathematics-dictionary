/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/card.ts":
/*!*********************!*\
  !*** ./src/card.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Card": () => (/* binding */ Card)
/* harmony export */ });
/* harmony import */ var _util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/json-text-converter */ "./src/util/json-text-converter.ts");
/* harmony import */ var _util_clipboard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/clipboard */ "./src/util/clipboard.ts");


class Card {
    constructor(name, description, id = '') {
        this.name = name;
        this.uniqueID = name.replace(/ /g, '-').toLocaleLowerCase();
        this.description = (0,_util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__.fromJSONSafeText)(description);
        this.creationDate = new Date();
        this.editDate = new Date();
        this.categories = [];
        this.subCards = [];
        this.displayMetaData = true;
        this.node = document.createElement('div');
        this.nodeID = id.length > 0 ? id : this.uniqueID;
        this.constructNode(id);
    }
    static constructFromOldJSON(object) {
    }
    constructNode(id) {
        // create base node
        const node = document.createElement('div');
        const nameNode = document.createElement('h2');
        const descriptionNode = document.createElement('p');
        nameNode.innerText = this.name;
        descriptionNode.innerHTML = this.description;
        node.appendChild(nameNode);
        node.appendChild(descriptionNode);
        // create subcards
        if (this.subCards.length > 0) {
            const subcardNode = document.createElement('div');
            const subcardHeader = document.createElement('h4');
            const subcardContainer = document.createElement('div');
            const leftSubcardList = document.createElement('div');
            const rightSubcardList = document.createElement('div');
            subcardHeader.innerHTML = 'Subcards:';
            subcardHeader.className = 'card-subcard-header';
            subcardContainer.appendChild(leftSubcardList);
            subcardContainer.appendChild(rightSubcardList);
            subcardContainer.className = 'card-subcard-container';
            leftSubcardList.className = 'card-subcard-leftlist';
            rightSubcardList.className = 'card-subcard-rightlist';
            const createSubcardItem = (i) => {
                const subcardItem = document.createElement('div');
                subcardItem.innerHTML = `- ${this.subCards[i]}`;
                subcardItem.className = 'card-subcard-item';
                return subcardItem;
            };
            for (let i = 0; i < this.subCards.length; i++) {
                leftSubcardList.appendChild(createSubcardItem(i));
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
        copyJSONButton.addEventListener('click', () => (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_1__.copyToClipboard)(this.toJSON()));
        buttonRow.appendChild(copyJSONButton);
        const copyUniqueIDButton = document.createElement('button');
        copyUniqueIDButton.innerHTML = 'Copy ID';
        copyUniqueIDButton.addEventListener('click', () => (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_1__.copyToClipboard)(this.uniqueID));
        buttonRow.appendChild(copyUniqueIDButton);
        buttonRow.className = 'card-button-row';
        node.appendChild(buttonRow);
        // create category + metadata rendering
        const metaDisplay = document.createElement('div');
        metaDisplay.className = 'card-meta-row';
        if (this.displayMetaData && this.categories.length > 0) {
            metaDisplay.innerHTML = this.categories.map(cat => `#${cat.replace(/ /g, '-')}`).join(' ');
            node.appendChild(metaDisplay);
        }
        node.className = 'card';
        if (id.length > 0)
            node.id = id;
        this.node = node;
    }
    setDates(creationDate, editDate) {
        this.creationDate = creationDate;
        this.editDate = editDate;
    }
    setCategories(categories) {
        this.categories = categories;
        this.constructNode(this.nodeID);
    }
    setSubcards(subcards) {
        this.subCards = subcards.sort();
        this.constructNode(this.nodeID);
    }
    toJSON() {
        return `{
    "name": "${this.name}",
    "uniqueID": "${this.uniqueID}",
    "description": "${(0,_util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__.toJSONSafeText)(this.description)}",

    "creationDate": ${JSON.stringify(this.creationDate)},
    "editDate": ${JSON.stringify(this.editDate)},

    "categories": ${JSON.stringify(this.categories)},
    "subcards": ${JSON.stringify(this.subCards)}
}`;
    }
    getNode() {
        return this.node;
    }
}


/***/ }),

/***/ "./src/features/card-authoring.ts":
/*!****************************************!*\
  !*** ./src/features/card-authoring.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initCardAuthoring": () => (/* binding */ initCardAuthoring)
/* harmony export */ });
/* harmony import */ var _util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/json-text-converter */ "./src/util/json-text-converter.ts");
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../card */ "./src/card.ts");
/* harmony import */ var _util_clipboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/clipboard */ "./src/util/clipboard.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



const initCardAuthoring = () => __awaiter(void 0, void 0, void 0, function* () {
    const cardNameInput = document.getElementById('card-name-input');
    const cardDescriptionInput = document.getElementById('card-description-input');
    const cardDescriptionOutput = document.getElementById('card-description-output');
    const previewCardContainer = document.getElementById('card-preview-container');
    const cardCategoryInput = document.getElementById('card-category-input');
    const cardSubcardInput = document.getElementById('card-subcard-input');
    // meta variables whose state is not carried in innerHTML
    let creationDate = new Date();
    const descriptionInputUpdate = () => {
        const name = cardNameInput.value;
        const description = cardDescriptionInput.value;
        const previewCard = new _card__WEBPACK_IMPORTED_MODULE_1__.Card(name, description, 'preview-card');
        previewCard.setDates(creationDate, new Date());
        previewCard.setCategories(cardCategoryInput.value.split(',').map(name => name.trim()).filter(name => name.length > 0));
        previewCard.setSubcards(cardSubcardInput.value.split('\n').map(name => name.trim()).filter(name => name.length > 0));
        cardDescriptionOutput.value = previewCard.toJSON();
        const previewCardNode = previewCard.getNode();
        previewCardContainer.childNodes.forEach(node => node.remove());
        previewCardContainer.appendChild(previewCardNode);
        // @ts-ignore
        if (window.MathJax)
            MathJax.typeset([previewCardNode]);
    };
    const descriptionOutputUpdate = () => {
        try {
            const object = JSON.parse(cardDescriptionOutput.value);
            const hasName = object.name !== undefined && typeof object.name == 'string';
            const hasDescription = object.description !== undefined && typeof object.description == 'string';
            const hasCreationDate = object.creationDate !== undefined && typeof object.creationDate == 'string';
            const hasCategories = object.categories !== undefined && typeof object.categories == 'object';
            const hasSubcards = object.subcards !== undefined && typeof object.subcards == 'object';
            if (hasName && hasDescription && hasCreationDate &&
                hasCategories && hasSubcards) {
                cardNameInput.value = object.name;
                cardDescriptionInput.value = (0,_util_json_text_converter__WEBPACK_IMPORTED_MODULE_0__.fromJSONSafeText)(object.description);
                creationDate = new Date(object.creationDate);
                cardCategoryInput.value = object.categories.join(', ');
                cardSubcardInput.value = object.subcards.join('\n');
                descriptionInputUpdate();
            }
        }
        catch (e) {
            console.log(e);
            return;
        }
    };
    cardNameInput.addEventListener('input', descriptionInputUpdate);
    cardDescriptionInput.addEventListener('input', descriptionInputUpdate);
    cardDescriptionOutput.addEventListener('input', descriptionOutputUpdate);
    cardCategoryInput.addEventListener('input', descriptionInputUpdate);
    cardSubcardInput.addEventListener('input', descriptionInputUpdate);
    const copyButton = document.getElementById('card-authoring-copy-button');
    const pasteButton = document.getElementById('card-authoring-paste-button');
    const clearButton = document.getElementById('card-authoring-clear-button');
    copyButton.addEventListener('click', () => {
        (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_2__.copyToClipboard)(cardDescriptionOutput.value);
    });
    pasteButton.addEventListener('click', () => {
        (0,_util_clipboard__WEBPACK_IMPORTED_MODULE_2__.copyFromClipboard)().then(text => {
            cardDescriptionOutput.value = text;
            descriptionOutputUpdate();
        });
    });
    clearButton.addEventListener('click', () => {
        cardNameInput.value = '';
        cardDescriptionInput.value = '';
        creationDate = new Date();
        cardCategoryInput.value = '';
        cardSubcardInput.value = '';
        descriptionInputUpdate();
    });
    descriptionInputUpdate();
});


/***/ }),

/***/ "./src/features/pane-management.ts":
/*!*****************************************!*\
  !*** ./src/features/pane-management.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LeftPaneType": () => (/* binding */ LeftPaneType),
/* harmony export */   "RightPaneType": () => (/* binding */ RightPaneType),
/* harmony export */   "initPaneManagement": () => (/* binding */ initPaneManagement)
/* harmony export */ });
var LeftPaneType;
(function (LeftPaneType) {
    LeftPaneType[LeftPaneType["Desktop"] = 0] = "Desktop";
    LeftPaneType[LeftPaneType["SearchStack"] = 1] = "SearchStack";
})(LeftPaneType || (LeftPaneType = {}));
var RightPaneType;
(function (RightPaneType) {
    RightPaneType[RightPaneType["CreateCard"] = 0] = "CreateCard";
    RightPaneType[RightPaneType["CreateCardGroup"] = 1] = "CreateCardGroup";
    RightPaneType[RightPaneType["Search"] = 2] = "Search";
    RightPaneType[RightPaneType["Metadata"] = 3] = "Metadata";
    RightPaneType[RightPaneType["Hierarchy"] = 4] = "Hierarchy";
})(RightPaneType || (RightPaneType = {}));
const initPaneManagement = () => {
    const leftPaneDesktop = document.getElementById("left-pane-desktop");
    const leftPaneSearchStack = document.getElementById("left-pane-search-stack");
    const rightPaneCreateCard = document.getElementById("right-pane-create-card");
    const rightPaneCreateCardGroup = document.getElementById("right-pane-create-card-group");
    const rightPaneSearch = document.getElementById("right-pane-search");
    const rightPaneMetadata = document.getElementById("right-pane-metadata");
    const rightPaneHierarchy = document.getElementById("right-pane-hierarchy");
    const leftPaneButtonDesktop = document.getElementById("left-pane-button-desktop");
    const leftPaneButtonSearchStack = document.getElementById("left-pane-button-search-stack");
    const rightPaneButtonCreateCard = document.getElementById("right-pane-button-create-card");
    const rightPaneButtonCreateCardGroup = document.getElementById("right-pane-button-create-card-group");
    const rightPaneButtonSearch = document.getElementById("right-pane-button-search");
    const rightPaneButtonMetadata = document.getElementById("right-pane-button-metadata");
    const rightPaneButtonHierarchy = document.getElementById("right-pane-button-hierarchy");
    const leftPaneNodeEnumPairs = [
        [leftPaneDesktop, LeftPaneType.Desktop],
        [leftPaneSearchStack, LeftPaneType.SearchStack]
    ];
    const leftPaneClicked = (selectedPane) => {
        leftPaneNodeEnumPairs.forEach(pair => {
            if (pair[1] === selectedPane)
                pair[0].style.display = 'flex';
            else
                pair[0].style.display = 'none';
        });
    };
    const rightPaneNodeEnumPairs = [
        [rightPaneCreateCard, RightPaneType.CreateCard],
        [rightPaneCreateCardGroup, RightPaneType.CreateCardGroup],
        [rightPaneSearch, RightPaneType.Search],
        [rightPaneMetadata, RightPaneType.Metadata],
        [rightPaneHierarchy, RightPaneType.Hierarchy],
    ];
    const rightPaneClicked = (selectedPane) => {
        rightPaneNodeEnumPairs.forEach(pair => {
            if (pair[1] === selectedPane)
                pair[0].style.display = 'flex';
            else
                pair[0].style.display = 'none';
        });
    };
    leftPaneButtonDesktop.addEventListener('click', () => leftPaneClicked(LeftPaneType.Desktop));
    leftPaneButtonSearchStack.addEventListener('click', () => leftPaneClicked(LeftPaneType.SearchStack));
    rightPaneButtonCreateCard.addEventListener('click', () => rightPaneClicked(RightPaneType.CreateCard));
    rightPaneButtonCreateCardGroup.addEventListener('click', () => rightPaneClicked(RightPaneType.CreateCardGroup));
    rightPaneButtonSearch.addEventListener('click', () => rightPaneClicked(RightPaneType.Search));
    rightPaneButtonMetadata.addEventListener('click', () => rightPaneClicked(RightPaneType.Metadata));
    rightPaneButtonHierarchy.addEventListener('click', () => rightPaneClicked(RightPaneType.Hierarchy));
    // disable select buttons
    rightPaneButtonMetadata.style.display = 'none';
};


/***/ }),

/***/ "./src/util/clipboard.ts":
/*!*******************************!*\
  !*** ./src/util/clipboard.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "copyFromClipboard": () => (/* binding */ copyFromClipboard),
/* harmony export */   "copyToClipboard": () => (/* binding */ copyToClipboard)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const copyToClipboard = (content) => {
    return navigator.clipboard.writeText(content);
};
const copyFromClipboard = () => __awaiter(void 0, void 0, void 0, function* () {
    const text = yield navigator.clipboard.readText();
    return text;
});


/***/ }),

/***/ "./src/util/json-text-converter.ts":
/*!*****************************************!*\
  !*** ./src/util/json-text-converter.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "fromJSONSafeText": () => (/* binding */ fromJSONSafeText),
/* harmony export */   "toJSONSafeText": () => (/* binding */ toJSONSafeText)
/* harmony export */ });
const toJSONSafeText = (text) => {
    return text
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/"/g, "\\\"");
};
const fromJSONSafeText = (text) => {
    return text
        .replace(/\\n/g, "\n")
        .replace(/\\"n/g, "\"");
};


/***/ }),

/***/ "./src/util/loader.ts":
/*!****************************!*\
  !*** ./src/util/loader.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "loadData": () => (/* binding */ loadData)
/* harmony export */ });
const loadData = (path) => {
    return new Promise((resolve) => {
        const client = new XMLHttpRequest();
        client.open('GET', path);
        client.responseType = 'json';
        client.onload = function () {
            const shaderCode = client.response;
            resolve(shaderCode);
        };
        client.send();
    });
};


/***/ }),

/***/ "./src/util/spacers.ts":
/*!*****************************!*\
  !*** ./src/util/spacers.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createVSpacer": () => (/* binding */ createVSpacer)
/* harmony export */ });
const createVSpacer = (px) => {
    const spacer = document.createElement('div');
    spacer.style.height = `${px}px`;
    return spacer;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _card__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./card */ "./src/card.ts");
/* harmony import */ var _util_loader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/loader */ "./src/util/loader.ts");
/* harmony import */ var _features_card_authoring__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./features/card-authoring */ "./src/features/card-authoring.ts");
/* harmony import */ var _util_spacers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/spacers */ "./src/util/spacers.ts");
/* harmony import */ var _features_pane_management__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./features/pane-management */ "./src/features/pane-management.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





const leftPaneNode = document.getElementById('left-pane-search-stack');
const loadCards = () => __awaiter(void 0, void 0, void 0, function* () {
    const cardMap = yield (0,_util_loader__WEBPACK_IMPORTED_MODULE_1__.loadData)('../card-map.json');
    const paths = cardMap.files;
    const cardsJSON = yield Promise.all(paths.map(path => (0,_util_loader__WEBPACK_IMPORTED_MODULE_1__.loadData)(`../data-cards/${path}.json`)));
    return cardsJSON;
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    let cardsJSON = yield loadCards();
    let cards = cardsJSON.map(data => {
        const card = new _card__WEBPACK_IMPORTED_MODULE_0__.Card(data.name, data.description);
        if (data.creationDate && data.editDate) {
            card.setDates(data.creationDate, data.editDate);
        }
        if (data.categories && data.subcards) {
            card.setCategories(data.categories);
            card.setSubcards(data.subcards);
        }
        return card;
    });
    cards.forEach(card => {
        const domNode = card.getNode();
        leftPaneNode.append(domNode);
        leftPaneNode.append((0,_util_spacers__WEBPACK_IMPORTED_MODULE_3__.createVSpacer)(8));
    });
    // @ts-ignore
    if (window.MathJax)
        MathJax.typeset();
});
init();
(0,_features_card_authoring__WEBPACK_IMPORTED_MODULE_2__.initCardAuthoring)();
(0,_features_pane_management__WEBPACK_IMPORTED_MODULE_4__.initPaneManagement)();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxJQUFJLHVDQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbkQsSUFBRyxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUM7WUFDbEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNuRDtRQUNELElBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFDO1lBQ2hDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3BDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ25DO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2pCLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLFlBQVksQ0FBQyxNQUFNLENBQUMsNERBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUgsYUFBYTtJQUNiLElBQUksTUFBTSxDQUFDLE9BQU87UUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDMUMsQ0FBQztBQUVELElBQUksRUFBRSxDQUFDO0FBQ1AsMkVBQWlCLEVBQUUsQ0FBQztBQUNwQiw2RUFBa0IsRUFBRSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGJydC8uL3NyYy9jYXJkLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvZmVhdHVyZXMvY2FyZC1hdXRob3JpbmcudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy9mZWF0dXJlcy9wYW5lLW1hbmFnZW1lbnQudHMiLCJ3ZWJwYWNrOi8vcGJydC8uL3NyYy91dGlsL2NsaXBib2FyZC50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL3V0aWwvanNvbi10ZXh0LWNvbnZlcnRlci50cyIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL3V0aWwvbG9hZGVyLnRzIiwid2VicGFjazovL3BicnQvLi9zcmMvdXRpbC9zcGFjZXJzLnRzIiwid2VicGFjazovL3BicnQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vcGJydC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vcGJydC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3BicnQvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9wYnJ0Ly4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZyb21KU09OU2FmZVRleHQsIHRvSlNPTlNhZmVUZXh0IH0gZnJvbSBcIi4vdXRpbC9qc29uLXRleHQtY29udmVydGVyXCI7XHJcbmltcG9ydCB7IGNvcHlUb0NsaXBib2FyZCB9IGZyb20gXCIuL3V0aWwvY2xpcGJvYXJkXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENhcmRKU09OIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgY2F0ZWdvcmllczogc3RyaW5nW107XHJcbiAgICBzdWJjYXJkczogc3RyaW5nW107XHJcbiAgICBjcmVhdGlvbkRhdGU6IERhdGU7XHJcbiAgICBlZGl0RGF0ZTogRGF0ZTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENhcmQge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgdW5pcXVlSUQ6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcblxyXG4gICAgY2F0ZWdvcmllczogc3RyaW5nW107XHJcbiAgICBzdWJDYXJkczogc3RyaW5nW107XHJcbiAgICBjcmVhdGlvbkRhdGU6IERhdGU7XHJcbiAgICBlZGl0RGF0ZTogRGF0ZTtcclxuXHJcbiAgICBub2RlOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIG5vZGVJRDogc3RyaW5nO1xyXG4gICAgZGlzcGxheU1ldGFEYXRhOiBib29sZWFuO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZywgZGVzY3JpcHRpb246IHN0cmluZywgaWQ6IHN0cmluZyA9ICcnKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMudW5pcXVlSUQgPSBuYW1lLnJlcGxhY2UoLyAvZywgJy0nKS50b0xvY2FsZUxvd2VyQ2FzZSgpO1xyXG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBmcm9tSlNPTlNhZmVUZXh0KGRlc2NyaXB0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcmVhdGlvbkRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuZWRpdERhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuY2F0ZWdvcmllcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3ViQ2FyZHMgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5kaXNwbGF5TWV0YURhdGEgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMubm9kZUlEID0gaWQubGVuZ3RoID4gMCA/IGlkIDogdGhpcy51bmlxdWVJRDtcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdE5vZGUoaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBjb25zdHJ1Y3RGcm9tT2xkSlNPTihvYmplY3Q6IGFueSl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0Tm9kZShpZDogc3RyaW5nKXtcclxuICAgICAgICAvLyBjcmVhdGUgYmFzZSBub2RlXHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnN0IG5hbWVOb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcclxuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbk5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XHJcbiAgICAgICAgbmFtZU5vZGUuaW5uZXJUZXh0ID0gdGhpcy5uYW1lO1xyXG4gICAgICAgIGRlc2NyaXB0aW9uTm9kZS5pbm5lckhUTUwgPSB0aGlzLmRlc2NyaXB0aW9uO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQobmFtZU5vZGUpO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoZGVzY3JpcHRpb25Ob2RlKTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIHN1YmNhcmRzXHJcbiAgICAgICAgaWYodGhpcy5zdWJDYXJkcy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgY29uc3Qgc3ViY2FyZE5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgY29uc3Qgc3ViY2FyZEhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2g0Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1YmNhcmRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgY29uc3QgbGVmdFN1YmNhcmRMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHJpZ2h0U3ViY2FyZExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgc3ViY2FyZEhlYWRlci5pbm5lckhUTUwgPSAnU3ViY2FyZHM6J1xyXG4gICAgICAgICAgICBzdWJjYXJkSGVhZGVyLmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtaGVhZGVyJztcclxuICAgICAgICAgICAgc3ViY2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChsZWZ0U3ViY2FyZExpc3QpO1xyXG4gICAgICAgICAgICBzdWJjYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKHJpZ2h0U3ViY2FyZExpc3QpO1xyXG4gICAgICAgICAgICBzdWJjYXJkQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtY29udGFpbmVyJztcclxuICAgICAgICAgICAgbGVmdFN1YmNhcmRMaXN0LmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtbGVmdGxpc3QnO1xyXG4gICAgICAgICAgICByaWdodFN1YmNhcmRMaXN0LmNsYXNzTmFtZSA9ICdjYXJkLXN1YmNhcmQtcmlnaHRsaXN0JztcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZVN1YmNhcmRJdGVtID0gKGk6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViY2FyZEl0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgIHN1YmNhcmRJdGVtLmlubmVySFRNTCA9IGAtICR7dGhpcy5zdWJDYXJkc1tpXX1gO1xyXG4gICAgICAgICAgICAgICAgc3ViY2FyZEl0ZW0uY2xhc3NOYW1lID0gJ2NhcmQtc3ViY2FyZC1pdGVtJztcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdWJjYXJkSXRlbTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc3ViQ2FyZHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbGVmdFN1YmNhcmRMaXN0LmFwcGVuZENoaWxkKGNyZWF0ZVN1YmNhcmRJdGVtKGkpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGZvcihsZXQgaSA9IDA7IGkgPCBNYXRoLmZsb29yKHRoaXMuc3ViQ2FyZHMubGVuZ3RoIC8gMik7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vICAgICBsZWZ0U3ViY2FyZExpc3QuYXBwZW5kQ2hpbGQoY3JlYXRlU3ViY2FyZEl0ZW0oaSkpXHJcbiAgICAgICAgICAgIC8vIH1cclxuICAgICAgICAgICAgLy8gZm9yKGxldCBpID0gTWF0aC5mbG9vcih0aGlzLnN1YkNhcmRzLmxlbmd0aCAvIDIpOyBpIDwgdGhpcy5zdWJDYXJkcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vICAgICByaWdodFN1YmNhcmRMaXN0LmFwcGVuZENoaWxkKGNyZWF0ZVN1YmNhcmRJdGVtKGkpKVxyXG4gICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICBzdWJjYXJkTm9kZS5hcHBlbmRDaGlsZChzdWJjYXJkSGVhZGVyKTtcclxuICAgICAgICAgICAgc3ViY2FyZE5vZGUuYXBwZW5kQ2hpbGQoc3ViY2FyZENvbnRhaW5lcik7XHJcbiAgICAgICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQoc3ViY2FyZE5vZGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYWRkIGJ1dHRvbnNcclxuICAgICAgICBjb25zdCBidXR0b25Sb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb25zdCBjb3B5SlNPTkJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNvcHlKU09OQnV0dG9uLmlubmVyVGV4dCA9ICdDb3B5IEpTT04nO1xyXG4gICAgICAgIGNvcHlKU09OQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gY29weVRvQ2xpcGJvYXJkKHRoaXMudG9KU09OKCkpKTtcclxuICAgICAgICBidXR0b25Sb3cuYXBwZW5kQ2hpbGQoY29weUpTT05CdXR0b24pO1xyXG4gICAgICAgIGNvbnN0IGNvcHlVbmlxdWVJREJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNvcHlVbmlxdWVJREJ1dHRvbi5pbm5lckhUTUwgPSAnQ29weSBJRCc7XHJcbiAgICAgICAgY29weVVuaXF1ZUlEQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gY29weVRvQ2xpcGJvYXJkKHRoaXMudW5pcXVlSUQpKTtcclxuICAgICAgICBidXR0b25Sb3cuYXBwZW5kQ2hpbGQoY29weVVuaXF1ZUlEQnV0dG9uKVxyXG4gICAgICAgIGJ1dHRvblJvdy5jbGFzc05hbWUgPSAnY2FyZC1idXR0b24tcm93JztcclxuICAgICAgICBub2RlLmFwcGVuZENoaWxkKGJ1dHRvblJvdyk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBjYXRlZ29yeSArIG1ldGFkYXRhIHJlbmRlcmluZ1xyXG4gICAgICAgIGNvbnN0IG1ldGFEaXNwbGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbWV0YURpc3BsYXkuY2xhc3NOYW1lID0gJ2NhcmQtbWV0YS1yb3cnO1xyXG4gICAgICAgIGlmKHRoaXMuZGlzcGxheU1ldGFEYXRhICYmIHRoaXMuY2F0ZWdvcmllcy5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgbWV0YURpc3BsYXkuaW5uZXJIVE1MID0gdGhpcy5jYXRlZ29yaWVzLm1hcChjYXQgPT4gYCMke2NhdC5yZXBsYWNlKC8gL2csICctJyl9YCkuam9pbignICcpO1xyXG4gICAgICAgICAgICBub2RlLmFwcGVuZENoaWxkKG1ldGFEaXNwbGF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5vZGUuY2xhc3NOYW1lID0gJ2NhcmQnO1xyXG4gICAgICAgIGlmKGlkLmxlbmd0aCA+IDApIG5vZGUuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm5vZGUgPSBub2RlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldERhdGVzKGNyZWF0aW9uRGF0ZTogRGF0ZSwgZWRpdERhdGU6IERhdGUpe1xyXG4gICAgICAgIHRoaXMuY3JlYXRpb25EYXRlID0gY3JlYXRpb25EYXRlO1xyXG4gICAgICAgIHRoaXMuZWRpdERhdGUgPSBlZGl0RGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDYXRlZ29yaWVzKGNhdGVnb3JpZXM6IHN0cmluZ1tdKXtcclxuICAgICAgICB0aGlzLmNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzO1xyXG4gICAgICAgIHRoaXMuY29uc3RydWN0Tm9kZSh0aGlzLm5vZGVJRCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0U3ViY2FyZHMoc3ViY2FyZHM6IHN0cmluZ1tdKXtcclxuICAgICAgICB0aGlzLnN1YkNhcmRzID0gc3ViY2FyZHMuc29ydCgpO1xyXG4gICAgICAgIHRoaXMuY29uc3RydWN0Tm9kZSh0aGlzLm5vZGVJRCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9KU09OKCl7XHJcbiAgICAgICAgcmV0dXJuIGB7XHJcbiAgICBcIm5hbWVcIjogXCIke3RoaXMubmFtZX1cIixcclxuICAgIFwidW5pcXVlSURcIjogXCIke3RoaXMudW5pcXVlSUR9XCIsXHJcbiAgICBcImRlc2NyaXB0aW9uXCI6IFwiJHt0b0pTT05TYWZlVGV4dCh0aGlzLmRlc2NyaXB0aW9uKX1cIixcclxuXHJcbiAgICBcImNyZWF0aW9uRGF0ZVwiOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuY3JlYXRpb25EYXRlKX0sXHJcbiAgICBcImVkaXREYXRlXCI6ICR7SlNPTi5zdHJpbmdpZnkodGhpcy5lZGl0RGF0ZSl9LFxyXG5cclxuICAgIFwiY2F0ZWdvcmllc1wiOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuY2F0ZWdvcmllcyl9LFxyXG4gICAgXCJzdWJjYXJkc1wiOiAke0pTT04uc3RyaW5naWZ5KHRoaXMuc3ViQ2FyZHMpfVxyXG59YDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZ2V0Tm9kZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5vZGU7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBmcm9tSlNPTlNhZmVUZXh0IH0gZnJvbSBcIi4uL3V0aWwvanNvbi10ZXh0LWNvbnZlcnRlclwiO1xyXG5pbXBvcnQgeyBDYXJkIH0gZnJvbSBcIi4uL2NhcmRcIjtcclxuaW1wb3J0IHsgY29weVRvQ2xpcGJvYXJkLCBjb3B5RnJvbUNsaXBib2FyZCB9IGZyb20gXCIuLi91dGlsL2NsaXBib2FyZFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGluaXRDYXJkQXV0aG9yaW5nID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgY29uc3QgY2FyZE5hbWVJbnB1dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLW5hbWUtaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZERlc2NyaXB0aW9uSW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1kZXNjcmlwdGlvbi1pbnB1dCcpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbiAgICBjb25zdCBjYXJkRGVzY3JpcHRpb25PdXRwdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1kZXNjcmlwdGlvbi1vdXRwdXQnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgY29uc3QgcHJldmlld0NhcmRDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1wcmV2aWV3LWNvbnRhaW5lcicpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgY2FyZENhdGVnb3J5SW5wdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1jYXRlZ29yeS1pbnB1dCcpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbiAgICBjb25zdCBjYXJkU3ViY2FyZElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtc3ViY2FyZC1pbnB1dCcpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcblxyXG4gICAgLy8gbWV0YSB2YXJpYWJsZXMgd2hvc2Ugc3RhdGUgaXMgbm90IGNhcnJpZWQgaW4gaW5uZXJIVE1MXHJcbiAgICBsZXQgY3JlYXRpb25EYXRlPSBuZXcgRGF0ZSgpO1xyXG5cclxuICAgIGNvbnN0IGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IGNhcmROYW1lSW5wdXQudmFsdWU7XHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRpb24gPSBjYXJkRGVzY3JpcHRpb25JbnB1dC52YWx1ZTtcclxuICAgICAgICBjb25zdCBwcmV2aWV3Q2FyZCA9IG5ldyBDYXJkKG5hbWUsIGRlc2NyaXB0aW9uLCAncHJldmlldy1jYXJkJyk7XHJcbiAgICAgICAgcHJldmlld0NhcmQuc2V0RGF0ZXMoY3JlYXRpb25EYXRlLCBuZXcgRGF0ZSgpKTtcclxuICAgICAgICBwcmV2aWV3Q2FyZC5zZXRDYXRlZ29yaWVzKGNhcmRDYXRlZ29yeUlucHV0LnZhbHVlLnNwbGl0KCcsJykubWFwKG5hbWUgPT4gbmFtZS50cmltKCkpLmZpbHRlcihuYW1lID0+IG5hbWUubGVuZ3RoID4gMCkpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkLnNldFN1YmNhcmRzKGNhcmRTdWJjYXJkSW5wdXQudmFsdWUuc3BsaXQoJ1xcbicpLm1hcChuYW1lID0+IG5hbWUudHJpbSgpKS5maWx0ZXIobmFtZSA9PiBuYW1lLmxlbmd0aCA+IDApKTtcclxuICAgICAgICBjYXJkRGVzY3JpcHRpb25PdXRwdXQudmFsdWUgPSBwcmV2aWV3Q2FyZC50b0pTT04oKTtcclxuXHJcbiAgICAgICAgY29uc3QgcHJldmlld0NhcmROb2RlID0gcHJldmlld0NhcmQuZ2V0Tm9kZSgpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkQ29udGFpbmVyLmNoaWxkTm9kZXMuZm9yRWFjaChub2RlID0+IG5vZGUucmVtb3ZlKCkpO1xyXG4gICAgICAgIHByZXZpZXdDYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKHByZXZpZXdDYXJkTm9kZSk7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBpZiAod2luZG93Lk1hdGhKYXgpIE1hdGhKYXgudHlwZXNldChbcHJldmlld0NhcmROb2RlXSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZGVzY3JpcHRpb25PdXRwdXRVcGRhdGUgPSAoKSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgb2JqZWN0ID0gSlNPTi5wYXJzZShjYXJkRGVzY3JpcHRpb25PdXRwdXQudmFsdWUpO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNOYW1lID0gb2JqZWN0Lm5hbWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2JqZWN0Lm5hbWUgPT0gJ3N0cmluZyc7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc0Rlc2NyaXB0aW9uID0gb2JqZWN0LmRlc2NyaXB0aW9uICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5kZXNjcmlwdGlvbiA9PSAnc3RyaW5nJztcclxuICAgICAgICAgICAgY29uc3QgaGFzQ3JlYXRpb25EYXRlID0gb2JqZWN0LmNyZWF0aW9uRGF0ZSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvYmplY3QuY3JlYXRpb25EYXRlID09ICdzdHJpbmcnO1xyXG4gICAgICAgICAgICBjb25zdCBoYXNDYXRlZ29yaWVzID0gb2JqZWN0LmNhdGVnb3JpZXMgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2JqZWN0LmNhdGVnb3JpZXMgPT0gJ29iamVjdCc7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhc1N1YmNhcmRzID0gb2JqZWN0LnN1YmNhcmRzICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIG9iamVjdC5zdWJjYXJkcyA9PSAnb2JqZWN0JztcclxuXHJcbiAgICAgICAgICAgIGlmKFxyXG4gICAgICAgICAgICAgICAgaGFzTmFtZSAmJiBoYXNEZXNjcmlwdGlvbiAmJiBoYXNDcmVhdGlvbkRhdGUgJiZcclxuICAgICAgICAgICAgICAgIGhhc0NhdGVnb3JpZXMgJiYgaGFzU3ViY2FyZHNcclxuICAgICAgICAgICAgKXtcclxuICAgICAgICAgICAgICAgIGNhcmROYW1lSW5wdXQudmFsdWUgPSBvYmplY3QubmFtZTtcclxuICAgICAgICAgICAgICAgIGNhcmREZXNjcmlwdGlvbklucHV0LnZhbHVlID0gZnJvbUpTT05TYWZlVGV4dChvYmplY3QuZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgY3JlYXRpb25EYXRlID0gbmV3IERhdGUob2JqZWN0LmNyZWF0aW9uRGF0ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FyZENhdGVnb3J5SW5wdXQudmFsdWUgPSBvYmplY3QuY2F0ZWdvcmllcy5qb2luKCcsICcpO1xyXG4gICAgICAgICAgICAgICAgY2FyZFN1YmNhcmRJbnB1dC52YWx1ZSA9IG9iamVjdC5zdWJjYXJkcy5qb2luKCdcXG4nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbklucHV0VXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gICAgICAgIFxyXG4gICAgfTtcclxuXHJcbiAgICBjYXJkTmFtZUlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25JbnB1dFVwZGF0ZSk7XHJcbiAgICBjYXJkRGVzY3JpcHRpb25JbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIGRlc2NyaXB0aW9uSW5wdXRVcGRhdGUpO1xyXG4gICAgY2FyZERlc2NyaXB0aW9uT3V0cHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZGVzY3JpcHRpb25PdXRwdXRVcGRhdGUpO1xyXG4gICAgY2FyZENhdGVnb3J5SW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZXNjcmlwdGlvbklucHV0VXBkYXRlKTtcclxuICAgIGNhcmRTdWJjYXJkSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBkZXNjcmlwdGlvbklucHV0VXBkYXRlKTtcclxuXHJcbiAgICBjb25zdCBjb3B5QnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtYXV0aG9yaW5nLWNvcHktYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBjb25zdCBwYXN0ZUJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYXJkLWF1dGhvcmluZy1wYXN0ZS1idXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IGNsZWFyQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmQtYXV0aG9yaW5nLWNsZWFyLWJ1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgXHJcbiAgICBjb3B5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGNvcHlUb0NsaXBib2FyZChjYXJkRGVzY3JpcHRpb25PdXRwdXQudmFsdWUpO1xyXG4gICAgfSk7XHJcbiAgICBwYXN0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBjb3B5RnJvbUNsaXBib2FyZCgpLnRoZW4odGV4dCA9PiB7XHJcbiAgICAgICAgICAgIGNhcmREZXNjcmlwdGlvbk91dHB1dC52YWx1ZSA9IHRleHQ7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uT3V0cHV0VXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgY2xlYXJCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgY2FyZE5hbWVJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGNhcmREZXNjcmlwdGlvbklucHV0LnZhbHVlID0gJyc7XHJcbiAgICAgICAgY3JlYXRpb25EYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjYXJkQ2F0ZWdvcnlJbnB1dC52YWx1ZSA9ICcnO1xyXG4gICAgICAgIGNhcmRTdWJjYXJkSW5wdXQudmFsdWUgPSAnJztcclxuICAgICAgICBkZXNjcmlwdGlvbklucHV0VXBkYXRlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkZXNjcmlwdGlvbklucHV0VXBkYXRlKCk7XHJcbn1cclxuIiwiZXhwb3J0IGVudW0gTGVmdFBhbmVUeXBlIHtcclxuICAgIERlc2t0b3AsXHJcbiAgICBTZWFyY2hTdGFja1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBSaWdodFBhbmVUeXBlIHtcclxuICAgIENyZWF0ZUNhcmQsXHJcbiAgICBDcmVhdGVDYXJkR3JvdXAsXHJcbiAgICBTZWFyY2gsXHJcbiAgICBNZXRhZGF0YSxcclxuICAgIEhpZXJhcmNoeVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaW5pdFBhbmVNYW5hZ2VtZW50ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgbGVmdFBhbmVEZXNrdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtZGVza3RvcFwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IGxlZnRQYW5lU2VhcmNoU3RhY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlZnQtcGFuZS1zZWFyY2gtc3RhY2tcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCByaWdodFBhbmVDcmVhdGVDYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWNyZWF0ZS1jYXJkXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lQ3JlYXRlQ2FyZEdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWNyZWF0ZS1jYXJkLWdyb3VwXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lU2VhcmNoID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLXNlYXJjaFwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZU1ldGFkYXRhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLW1ldGFkYXRhXCIpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lSGllcmFyY2h5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWhpZXJhcmNoeVwiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIFxyXG4gICAgY29uc3QgbGVmdFBhbmVCdXR0b25EZXNrdG9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtYnV0dG9uLWRlc2t0b3BcIikgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBjb25zdCBsZWZ0UGFuZUJ1dHRvblNlYXJjaFN0YWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWZ0LXBhbmUtYnV0dG9uLXNlYXJjaC1zdGFja1wiKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUJ1dHRvbkNyZWF0ZUNhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0LXBhbmUtYnV0dG9uLWNyZWF0ZS1jYXJkXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lQnV0dG9uQ3JlYXRlQ2FyZEdyb3VwID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWJ1dHRvbi1jcmVhdGUtY2FyZC1ncm91cFwiKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUJ1dHRvblNlYXJjaCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmlnaHQtcGFuZS1idXR0b24tc2VhcmNoXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lQnV0dG9uTWV0YWRhdGEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJpZ2h0LXBhbmUtYnV0dG9uLW1ldGFkYXRhXCIpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgY29uc3QgcmlnaHRQYW5lQnV0dG9uSGllcmFyY2h5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyaWdodC1wYW5lLWJ1dHRvbi1oaWVyYXJjaHlcIikgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICBcclxuICAgIGNvbnN0IGxlZnRQYW5lTm9kZUVudW1QYWlyczogW0hUTUxEaXZFbGVtZW50LCBMZWZ0UGFuZVR5cGVdW10gPSBbXHJcbiAgICAgICAgW2xlZnRQYW5lRGVza3RvcCwgTGVmdFBhbmVUeXBlLkRlc2t0b3BdLFxyXG4gICAgICAgIFtsZWZ0UGFuZVNlYXJjaFN0YWNrLCBMZWZ0UGFuZVR5cGUuU2VhcmNoU3RhY2tdXHJcbiAgICBdO1xyXG4gICAgY29uc3QgbGVmdFBhbmVDbGlja2VkID0gKHNlbGVjdGVkUGFuZTogTGVmdFBhbmVUeXBlKSA9PiB7XHJcbiAgICAgICAgbGVmdFBhbmVOb2RlRW51bVBhaXJzLmZvckVhY2gocGFpciA9PiB7XHJcbiAgICAgICAgICAgIGlmKHBhaXJbMV0gPT09IHNlbGVjdGVkUGFuZSkgcGFpclswXS5zdHlsZS5kaXNwbGF5ID0gJ2ZsZXgnO1xyXG4gICAgICAgICAgICBlbHNlIHBhaXJbMF0uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNvbnN0IHJpZ2h0UGFuZU5vZGVFbnVtUGFpcnM6IFtIVE1MRGl2RWxlbWVudCwgUmlnaHRQYW5lVHlwZV1bXSA9IFtcclxuICAgICAgICBbcmlnaHRQYW5lQ3JlYXRlQ2FyZCwgUmlnaHRQYW5lVHlwZS5DcmVhdGVDYXJkXSxcclxuICAgICAgICBbcmlnaHRQYW5lQ3JlYXRlQ2FyZEdyb3VwLCBSaWdodFBhbmVUeXBlLkNyZWF0ZUNhcmRHcm91cF0sXHJcbiAgICAgICAgW3JpZ2h0UGFuZVNlYXJjaCwgUmlnaHRQYW5lVHlwZS5TZWFyY2hdLFxyXG4gICAgICAgIFtyaWdodFBhbmVNZXRhZGF0YSwgUmlnaHRQYW5lVHlwZS5NZXRhZGF0YV0sXHJcbiAgICAgICAgW3JpZ2h0UGFuZUhpZXJhcmNoeSwgUmlnaHRQYW5lVHlwZS5IaWVyYXJjaHldLFxyXG4gICAgXTtcclxuICAgIGNvbnN0IHJpZ2h0UGFuZUNsaWNrZWQgPSAoc2VsZWN0ZWRQYW5lOiBSaWdodFBhbmVUeXBlKSA9PiB7XHJcbiAgICAgICAgcmlnaHRQYW5lTm9kZUVudW1QYWlycy5mb3JFYWNoKHBhaXIgPT4ge1xyXG4gICAgICAgICAgICBpZihwYWlyWzFdID09PSBzZWxlY3RlZFBhbmUpIHBhaXJbMF0uc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcclxuICAgICAgICAgICAgZWxzZSBwYWlyWzBdLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGxlZnRQYW5lQnV0dG9uRGVza3RvcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGxlZnRQYW5lQ2xpY2tlZChMZWZ0UGFuZVR5cGUuRGVza3RvcCkpO1xyXG4gICAgbGVmdFBhbmVCdXR0b25TZWFyY2hTdGFjay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IGxlZnRQYW5lQ2xpY2tlZChMZWZ0UGFuZVR5cGUuU2VhcmNoU3RhY2spKTtcclxuICAgIHJpZ2h0UGFuZUJ1dHRvbkNyZWF0ZUNhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByaWdodFBhbmVDbGlja2VkKFJpZ2h0UGFuZVR5cGUuQ3JlYXRlQ2FyZCkpO1xyXG4gICAgcmlnaHRQYW5lQnV0dG9uQ3JlYXRlQ2FyZEdyb3VwLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gcmlnaHRQYW5lQ2xpY2tlZChSaWdodFBhbmVUeXBlLkNyZWF0ZUNhcmRHcm91cCkpO1xyXG4gICAgcmlnaHRQYW5lQnV0dG9uU2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gcmlnaHRQYW5lQ2xpY2tlZChSaWdodFBhbmVUeXBlLlNlYXJjaCkpO1xyXG4gICAgcmlnaHRQYW5lQnV0dG9uTWV0YWRhdGEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiByaWdodFBhbmVDbGlja2VkKFJpZ2h0UGFuZVR5cGUuTWV0YWRhdGEpKTtcclxuICAgIHJpZ2h0UGFuZUJ1dHRvbkhpZXJhcmNoeS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHJpZ2h0UGFuZUNsaWNrZWQoUmlnaHRQYW5lVHlwZS5IaWVyYXJjaHkpKTtcclxuXHJcbiAgICAvLyBkaXNhYmxlIHNlbGVjdCBidXR0b25zXHJcbiAgICByaWdodFBhbmVCdXR0b25NZXRhZGF0YS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG59IiwiZXhwb3J0IGNvbnN0IGNvcHlUb0NsaXBib2FyZCA9IChjb250ZW50OiBzdHJpbmcpID0+IHtcclxuICAgIHJldHVybiBuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dChjb250ZW50KTtcclxufSBcclxuXHJcbmV4cG9ydCBjb25zdCBjb3B5RnJvbUNsaXBib2FyZCA9IGFzeW5jICgpID0+IHtcclxuICAgIGNvbnN0IHRleHQgPSBhd2FpdCBuYXZpZ2F0b3IuY2xpcGJvYXJkLnJlYWRUZXh0KCk7XHJcbiAgICByZXR1cm4gdGV4dDtcclxufSIsImV4cG9ydCBjb25zdCB0b0pTT05TYWZlVGV4dCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgIHJldHVybiB0ZXh0XHJcbiAgICAgICAgLnJlcGxhY2UoL1xcXFwvZywgXCJcXFxcXFxcXFwiKVxyXG4gICAgICAgIC5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKVxyXG4gICAgICAgIC5yZXBsYWNlKC9cIi9nLCBcIlxcXFxcXFwiXCIpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZnJvbUpTT05TYWZlVGV4dCA9ICh0ZXh0OiBzdHJpbmcpID0+IHtcclxuICAgIHJldHVybiB0ZXh0XHJcbiAgICAgICAgLnJlcGxhY2UoL1xcXFxuL2csIFwiXFxuXCIpXHJcbiAgICAgICAgLnJlcGxhY2UoL1xcXFxcIm4vZywgXCJcXFwiXCIpO1xyXG59IiwiZXhwb3J0IGNvbnN0IGxvYWREYXRhID0gKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUpID0+IHtcclxuICAgICAgICBjb25zdCBjbGllbnQgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICBjbGllbnQub3BlbignR0VUJywgcGF0aCk7XHJcbiAgICAgICAgY2xpZW50LnJlc3BvbnNlVHlwZSA9ICdqc29uJztcclxuICAgICAgICBjbGllbnQub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoYWRlckNvZGUgPSBjbGllbnQucmVzcG9uc2U7XHJcbiAgICAgICAgICAgIHJlc29sdmUoc2hhZGVyQ29kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsaWVudC5zZW5kKCk7XHJcbiAgICB9KTtcclxufSIsImV4cG9ydCBjb25zdCBjcmVhdGVWU3BhY2VyID0gKHB4OiBudW1iZXIpID0+IHtcclxuICAgIGNvbnN0IHNwYWNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgc3BhY2VyLnN0eWxlLmhlaWdodCA9IGAke3B4fXB4YDtcclxuICAgIHJldHVybiBzcGFjZXI7XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IENhcmQsIENhcmRKU09OIH0gZnJvbSBcIi4vY2FyZFwiO1xyXG5pbXBvcnQgeyBsb2FkRGF0YSB9IGZyb20gXCIuL3V0aWwvbG9hZGVyXCI7XHJcbmltcG9ydCB7IGluaXRDYXJkQXV0aG9yaW5nIH0gZnJvbSBcIi4vZmVhdHVyZXMvY2FyZC1hdXRob3JpbmdcIjtcclxuaW1wb3J0IHsgY3JlYXRlVlNwYWNlciB9IGZyb20gXCIuL3V0aWwvc3BhY2Vyc1wiO1xyXG5pbXBvcnQgeyBpbml0UGFuZU1hbmFnZW1lbnQgfSBmcm9tIFwiLi9mZWF0dXJlcy9wYW5lLW1hbmFnZW1lbnRcIjtcclxuXHJcbmNvbnN0IGxlZnRQYW5lTm9kZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsZWZ0LXBhbmUtc2VhcmNoLXN0YWNrJykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG5jb25zdCBsb2FkQ2FyZHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJkTWFwID0gYXdhaXQgbG9hZERhdGEoJy4uL2NhcmQtbWFwLmpzb24nKTtcclxuICAgIGNvbnN0IHBhdGhzOiBzdHJpbmdbXSA9IGNhcmRNYXAuZmlsZXM7XHJcbiAgICBjb25zdCBjYXJkc0pTT04gPSBhd2FpdCBQcm9taXNlLmFsbChwYXRocy5tYXAocGF0aCA9PiBsb2FkRGF0YShgLi4vZGF0YS1jYXJkcy8ke3BhdGh9Lmpzb25gKSkpO1xyXG5cclxuICAgIHJldHVybiBjYXJkc0pTT047XHJcbn1cclxuXHJcbmNvbnN0IGluaXQgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBsZXQgY2FyZHNKU09OOiBDYXJkSlNPTltdID0gYXdhaXQgbG9hZENhcmRzKCk7XHJcbiAgICBsZXQgY2FyZHMgPSBjYXJkc0pTT04ubWFwKGRhdGEgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNhcmQgPSBuZXcgQ2FyZChkYXRhLm5hbWUsIGRhdGEuZGVzY3JpcHRpb24pO1xyXG5cclxuICAgICAgICBpZihkYXRhLmNyZWF0aW9uRGF0ZSAmJiBkYXRhLmVkaXREYXRlKXtcclxuICAgICAgICAgICAgY2FyZC5zZXREYXRlcyhkYXRhLmNyZWF0aW9uRGF0ZSwgZGF0YS5lZGl0RGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKGRhdGEuY2F0ZWdvcmllcyAmJiBkYXRhLnN1YmNhcmRzKXtcclxuICAgICAgICAgICAgY2FyZC5zZXRDYXRlZ29yaWVzKGRhdGEuY2F0ZWdvcmllcyk7XHJcbiAgICAgICAgICAgIGNhcmQuc2V0U3ViY2FyZHMoZGF0YS5zdWJjYXJkcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY2FyZDtcclxuICAgIH0pO1xyXG4gICAgY2FyZHMuZm9yRWFjaChjYXJkID0+IHtcclxuICAgICAgICBjb25zdCBkb21Ob2RlID0gY2FyZC5nZXROb2RlKCk7XHJcbiAgICAgICAgbGVmdFBhbmVOb2RlLmFwcGVuZChkb21Ob2RlKTtcclxuICAgICAgICBsZWZ0UGFuZU5vZGUuYXBwZW5kKGNyZWF0ZVZTcGFjZXIoOCkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgaWYgKHdpbmRvdy5NYXRoSmF4KSBNYXRoSmF4LnR5cGVzZXQoKTtcclxufVxyXG5cclxuaW5pdCgpO1xyXG5pbml0Q2FyZEF1dGhvcmluZygpO1xyXG5pbml0UGFuZU1hbmFnZW1lbnQoKTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=