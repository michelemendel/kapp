const contentBodyNode = document.querySelector(".info_modal__body");
const mainButton = document.getElementById("info_modal__header__content__nav__main");
const englishButton = document.getElementById("info_modal__header__content__nav__english");
const hebrewButton = document.getElementById("info_modal__header__content__nav__hebrew");
const pesachButton = document.getElementById("info_modal__header__content__nav__pesach");
const aboutButton = document.getElementById("info_modal__header__content__nav__about");

const contentMain = "contentMain";
const contentEnglish = "contentEnglish";
const contentHebrew = "contentHebrew";
const contentPesach = "contentPesach";
const contentAbout = "contentAbout";

const rtl = "rtl";
const ltr = "ltr";

export function init() {
    loadBody(contentMain, contentBodyNode, ltr);

    mainButton.onclick = () => {
        loadBody(contentMain, contentBodyNode, ltr);
    }
    englishButton.onclick = () => {
        loadBody(contentEnglish, contentBodyNode, ltr);
    }
    hebrewButton.onclick = () => {
        loadBody(contentHebrew, contentBodyNode, rtl);
    }
    pesachButton.onclick = () => {
        loadBody(contentPesach, contentBodyNode, ltr);
    }
    aboutButton.onclick = () => {
        loadBody(contentAbout, contentBodyNode, ltr);
    }
}

function loadBody(page, contentBodyNode, direction) {
    getBodyHtml(page)
        .then((bodyHtml) => {
            contentBodyNode.innerHTML = bodyHtml;
            document.getElementById("toppen").scrollIntoView(false);
            contentBodyNode.setAttribute("style", `direction: ${direction}`);
        });
}

/**
 * Using a promise seems to help with the problem of the first page not scrolling,
 * and to make each page scroll to the top when entered.
 */
function getBodyHtml(page) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = (e) => {
            contentBodyNode.innerHTML = "...";
            resolve(e.target.response.body.innerHTML);
        }

        const path = "/info/" + page + ".html";
        xhr.open("GET", path);
        xhr.responseType = "document";
        xhr.send();
    })
};