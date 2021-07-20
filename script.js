function search(e) {
	if(event.key === 'Enter') {
		loader = document.getElementById("ldr");
		loader.style.display = "";	
		
		setTimeout(() => searchTable(), 50);
	}
}

function searchTable() {
	// Declare variables
	var inp, inputNamesList, inputName, filter, table, tr, td, namesList, name, i, txtValue, matches;
	inp = document.getElementById("searchInput").value;
	table = document.getElementById("shipTable");
	
	tr = table.getElementsByTagName("tr"); // table row list
    

	if (inp.charAt(inp.length - 1) === "/") {
	inp = inp.substring(0, inp.length - 1);
	}
	inputNamesList = inp.replace(/\s/g, "").split("/");

	// Loop through all table rows, and hide those who don't match the search query
	for (i = 0; i < tr.length; i++) {
		td = tr[i].getElementsByTagName("td")[0]; // table data 0 (name/name/name..)

		if (td) {
			namesList = (td.textContext || td.innerText).split("/");
			tr[i].style.display = "none";
			matches = 0;
			for (j = 0; j < namesList.length; j++) {
				for (k = 0; k < inputNamesList.length; k++) {
					name = namesList[j];
					filter = inputNamesList[k].toUpperCase();
					if (name.toUpperCase().indexOf(filter) > -1) {
						matches = matches + 1;
					}
				}
				if (matches == inputNamesList.length) {
					tr[i].style.display = "";
				}
			}
		}
	}
	
	loader = document.getElementById("ldr");
	loader.style.display = "none";
}