function search(e) {
	loader = document.getElementById("ldr");
	loader.style.display = "";
	inp = document.getElementById("searchInput").value;
	setTimeout(() => populateTable(inp), 50);
}