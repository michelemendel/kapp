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

export function init() {
    loadBody(contentMain);

    mainButton.onclick = () => {
        loadBody(contentMain);
    }
    englishButton.onclick = () => {
        loadBody(contentEnglish);
    }
    hebrewButton.onclick = () => {
        loadBody(contentHebrew);
        contentBodyNode.setAttribute("style", "direction: rtl");

    }
    pesachButton.onclick = () => {
        loadBody(contentPesach);
    }
    aboutButton.onclick = () => {
        loadBody(contentAbout);
    }
}

function loadBody(page) {
    const xhr = new XMLHttpRequest();

    xhr.onload = (e) => {
        const body = e.target.response.body;
        contentBodyNode.innerHTML = "";
        contentBodyNode.appendChild(body.firstChild);
    }

    const path = "/info/" + page + ".html";
    xhr.open("GET", path);
    xhr.responseType = "document";
    xhr.send();

    contentBodyNode.setAttribute("style", "direction: ltr");
}


function setInfo() {
    contentBodyNode.innerHTML = `
<h2>About</h2>
<p class="info_modal__body__p">
    <a class="link--big" href="https://www.jødedommen.no/wp-content/uploads/2018/11/Kosherlisten-2018.pdf"
        target="_blank">Link to the kosher list PDF file</a>
</p>

<h2>Contact</h2>
<p class="info_modal__body__p">
    For questions or comments, please contact...
</p>

<h2>Tips</h2>
<p class="info_modal__body__p">
    <ul class="info_modal__body__ul">
        <li class="info_modal__body__li">To see all the products id, add ?showids=1 to the
            end
            of
            the URL</li>
        <li class="info_modal__body__li">To see a specific product - that you can share -
            add
            ?id=123,
            where 123 has to change to the id you want to see.</li>
    </ul>
</p>

<h2>Icon</h2>
<p class="info_modal__body__p">
    Icons made by
    <a class="link--small" href="https://www.freepik.com/" title="Freepik">Freepik</a>
    from
    <a class="link--small" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
    is licensed by
    <a class="link--small" href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0"
        target="_blank">CC
        3.0 BY</a>
</p>
`
}