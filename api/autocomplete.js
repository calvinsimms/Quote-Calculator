function setupAutocomplete(inputEl, dropdownEl) {
  const cache = {}; // local cache for autocomplete

  const debouncedFetch = debounce(async (val) => {
    const query = val.trim();
    if (query.length < 3) {
      dropdownEl.style.display = "none";
      return;
    }

    try {
      // Force cache-busting to avoid 304 issues
      const url = `/api/autocomplete?input=${encodeURIComponent(query)}&_=${Date.now()}`;

      let suggestions;
      if (cache[query]) {
        suggestions = cache[query];
      } else {
        const res = await fetch(url);
        const data = await res.json();
        suggestions = data.predictions || [];
        cache[query] = suggestions;
      }

      console.log("Suggestions:", suggestions);

      // Clear previous dropdown items
      dropdownEl.innerHTML = "";

      if (suggestions.length === 0) {
        const emptyDiv = document.createElement("div");
        emptyDiv.textContent = "No results";
        emptyDiv.style.padding = "8px";
        emptyDiv.style.color = "#888";
        dropdownEl.appendChild(emptyDiv);
      } else {
        suggestions.forEach(s => {
          const div = document.createElement("div");
          div.classList.add("dropdown-item");
          div.textContent = s.description;
          div.addEventListener("click", () => {
            inputEl.value = s.description;
            dropdownEl.style.display = "none";
          });
          dropdownEl.appendChild(div);
        });
      }

      // Ensure dropdown is visible
      dropdownEl.style.display = "block";

    } catch (err) {
      console.error("Autocomplete fetch error:", err);
      dropdownEl.style.display = "none";
    }
  }, 300);

  inputEl.addEventListener("input", () => debouncedFetch(inputEl.value));

  // Hide dropdown if clicking outside
  document.addEventListener("click", e => {
    if (!inputEl.contains(e.target) && !dropdownEl.contains(e.target)) {
      dropdownEl.style.display = "none";
    }
  });

  inputEl.addEventListener("focus", () => {
    if (inputEl.value.trim().length >= 3) {
      debouncedFetch(inputEl.value);
    }
  });
}


