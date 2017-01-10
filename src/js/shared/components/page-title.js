
let storedTitles = [];

export function PageTitle({title}) {
    storedTitles.push(title);
    return null;
}

export function getLatestTitle() {
    return storedTitles[storedTitles.length - 1];
    storedTitles = [];
}