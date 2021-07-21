let rows = shipdata.split("\n");

class Ship {
    constructor(chars, names, namesdisplay) {
        this.chars = chars;
        this.names = names;
        this.namesdisplay = namesdisplay;
        this.ao3tag = '';
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

let lines = ao3data.split('\n')
lines.forEach(element => {
    let sec = element.split(': ');
    let dis = sec[0];
    let tag = sec[1] + '/works';
    shipdatadict[dis].ao3tag = tag;
});
console.log(shipdatadict);

//populateTable("-!-")

function populateTable(search) {
    search = search.toLowerCase();
    let searchTerms = search.split(/[\s/]+/g);

    let newTable = document.createElement('table');
    newTable.id = "shipTable";
    let first_row = newTable.insertRow();
    first_row.className = "header";
    let first_cell = first_row.insertCell();
    first_cell.outerHTML = "<th>Ship</th>";
    first_cell.style = "width:40%;";
    let second_cell = first_row.insertCell();
    second_cell.outerHTML = "<th>Names</th>";
    second_cell.style = "width:58%;";
    let third_cell = first_row.insertCell();
    third_cell.outerHTML = "<th></th>";
    third_cell.style = "width:1%;";
    let fourth_cell = first_row.insertCell();
    fourth_cell.outerHTML = "<th></th>";
    fourth_cell.style = "width:1%;";
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
            
            if (shipdatadict[key].ao3tag.length > 0) {
                let ao3cell = row.insertCell();
                let a3 = document.createElement('a');
                let link3 = document.createTextNode("Ao3");
                a3.appendChild(link3);
                a3.title = key + " Ao3 Relationship Page ";
                a3.href = shipdatadict[key].ao3tag;
                a3.className = "b2";
                a3.setAttribute('target', '_blank');
                a3.setAttribute('rel', 'noopener noreferrer');
                ao3cell.appendChild(a3);
            } else {
                let ao3cell = row.insertCell();
            }
            
            let suggestcell = row.insertCell();
            let a = document.createElement('a');
            let link = document.createTextNode("*");
            a.appendChild(link);
            a.title = "Suggest a name for " + key;
            a.className = "b2";
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
            a.href = "https://docs.google.com/forms/d/e/1FAIpQLScVaXvrx-dHQIigk5CHL94fJSuWRQaYWq4L6m1QxT0ae6Ou4w/viewform?usp=pp_url&entry.1666039153=" + key;
            suggestcell.appendChild(a);
        }
    });

    let oldTable = document.getElementById("shipTable")
    oldTable.parentNode.replaceChild(newTable, oldTable);

    loader = document.getElementById("ldr");
	loader.style.display = "none";
}