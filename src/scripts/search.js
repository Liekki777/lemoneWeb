// src/scripts/search.js
document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.getElementById("search");
  const resultsContainer = document.getElementById("search-results");
  const emptyState = document.getElementById("search-empty");

  if (!searchInput) return;

  try {
    const { search } = await import("/pagefind/pagefind.js");
    
    searchInput.addEventListener("input", async (e) => {
      const query = e.target.value.trim();
      resultsContainer.innerHTML = "";
      emptyState.classList.add("d-none");

      if (query.length < 2) return;

      const searchResults = await search(query);

      if (searchResults.results.length === 0) {
        emptyState.classList.remove("d-none");
        return;
      }

      for (const result of searchResults.results.slice(0, 10)) {
        const data = await result.data();
        const item = document.createElement("a");
        item.href = data.url;
        item.className = "list-group-item list-group-item-action border-0 py-3";
        item.innerHTML = `
          <div class="d-flex w-100 justify-content-between align-items-start">
            <div>
              <h6 class="mb-1 fw-bold">${data.meta.title || "Sin título"}</h6>
              <p class="mb-1 text-muted small">${data.excerpt}</p>
            </div>
            <small class="text-muted ms-3">${new Date(data.meta.date || Date.now()).toLocaleDateString('es-ES')}</small>
          </div>
        `;
        resultsContainer.appendChild(item);
      }
    });
  } catch (error) {
    console.error("Error cargando Pagefind:", error);
  }
});
// Atajo global: Ctrl+K o Cmd+K para abrir el buscador
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    const modal = new bootstrap.Modal(document.getElementById("searchModal"));
    modal.show();
  }
});