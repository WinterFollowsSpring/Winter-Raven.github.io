let rows = shipdata.split("\n");

class Ship {
    constructor(chars, names, namesdisplay) {
        this.chars = chars;
        this.names = names;
        this.namesdisplay = namesdisplay;
    }
}

let shipdatadict = {};

rows.forEach(element => {
    let section = element.split(": ");
    let display = section[0];
    let chars = section[0].split("/");
    let names = section[1].split(";");
    let namesdisplay = section[1].replace(/;/g, ', ');
    shipdatadict[display] = new Ship(chars, names, namesdisplay);
});

populateTable("-!-")

function populateTable(search) {
    search = search.toLowerCase();
    let searchTerms = search.split(/[\s/]+/g);
    console.log(searchTerms);

    let newTable = document.createElement('table');
    newTable.id = "shipTable";
    let first_row = newTable.insertRow();
    first_row.className = "header";
    let first_cell = first_row.insertCell();
    first_cell.outerHTML = "<th>Ship</th>";
    first_cell.style = "width:40%;";
    let second_cell = first_row.insertCell();
    second_cell.outerHTML = "<th>Names</th>";
    second_cell.style = "width:59%;";
    let third_cell = first_row.insertCell();
    third_cell.outerHTML = "<th></th>";
    third_cell.style = "width:1%;";
    Object.entries(shipdatadict).forEach(([key, ship]) => {
        let matches = 0;
        matchloop:
        for (let i = 0; i < searchTerms.length; i++) {
            for (let j = 0; j < ship.chars.length; j++) {
                if (ship.chars[j].toLowerCase().includes(searchTerms[i])) {
                    matches += 1;
                    continue matchloop;
                }
            }
            for (let k = 0; k < ship.names.length; k++) {
                if (ship.names[k].toLowerCase().includes(searchTerms[i])) {
                    matches += 1;
                    continue matchloop;
                }
            }
        }

        if (searchTerms.length == matches) {
            let row = newTable.insertRow();
            let displaycell = row.insertCell();
            let text1 = document.createTextNode(key);
            displaycell.appendChild(text1);
            let namescell = row.insertCell();
            let text2 = document.createTextNode(ship.namesdisplay);
            namescell.appendChild(text2);
            let suggestcell = row.insertCell();
            let a = document.createElement('a');
            let link = document.createTextNode("*");
            a.appendChild(link);
            a.title = "Suggest a name for " + key;
            a.href = "https://docs.google.com/forms/d/e/1FAIpQLScVaXvrx-dHQIigk5CHL94fJSuWRQaYWq4L6m1QxT0ae6Ou4w/viewform?usp=pp_url&entry.1666039153=" + key;
            suggestcell.appendChild(a);
        }
    });

    let oldTable = document.getElementById("shipTable")
    oldTable.parentNode.replaceChild(newTable, oldTable);

    loader = document.getElementById("ldr");
	loader.style.display = "none";
}