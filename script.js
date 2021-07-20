function search(e) {
	if(event.key === 'Enter') {
		loader = document.getElementById("ldr");
		loader.style.display = "";
		inp = document.getElementById("searchInput").value;
		setTimeout(() => populateTable(inp), 50);
	}
}