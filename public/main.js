const statusBox = document.getElementById("status");
const animeList = document.getElementById("animeList");

// Show a small status message
function setStatus(msg) {
  if (statusBox) statusBox.textContent = msg;
}

async function loadAnime() {
  try {
    setStatus("Loading anime from database...");
    const res = await fetch("/api/entries");
    const result = await res.json();

    // Clear old list
    animeList.innerHTML = "";

    if (!result.ok) {
      setStatus("Failed to load anime.");
      return;
    }

    if (result.data.length === 0) {
      setStatus("No anime added yet. Try adding one!");
      return;
    }

    setStatus(`Showing ${result.data.length} anime entries:`);

    result.data.forEach(entry => {
      const card = document.createElement("article");
      card.className = "anime-card";

      // add a card class based on status for colored border
      if (entry.status) {
        card.classList.add(`status-${entry.status}`);
      }

      const title = document.createElement("div");
      title.className = "anime-title";
      title.textContent = entry.title;

      // Meta row: status pill + rating
      const metaRow = document.createElement("div");
      metaRow.className = "anime-meta-row";

      const statusPill = document.createElement("span");
      statusPill.className = "status-pill";

      if (entry.status === "watching") {
        statusPill.classList.add("status-watching-pill");
        statusPill.textContent = "WATCHING";
      } else if (entry.status === "completed") {
        statusPill.classList.add("status-completed-pill");
        statusPill.textContent = "COMPLETED";
      } else {
        statusPill.classList.add("status-plan_to_watch-pill");
        statusPill.textContent = "PLAN TO WATCH";
      }

      const ratingBadge = document.createElement("span");
      ratingBadge.className = "rating-badge";
      ratingBadge.textContent = `★ ${entry.rating ?? 0}/10`;

      metaRow.appendChild(statusPill);
      metaRow.appendChild(ratingBadge);

      const favChar = document.createElement("div");
      favChar.className = "fav-char";
      favChar.textContent = entry.favoriteCharacter
        ? `Favourite character: ${entry.favoriteCharacter}`
        : "Favourite character: (none yet)";

      const notes = document.createElement("div");
      notes.className = "anime-notes";
      notes.textContent = entry.notes || "(No notes yet)";

      // Tags row (if any)
      const tagsRow = document.createElement("div");
      tagsRow.className = "tags-row";

      if (Array.isArray(entry.tags) && entry.tags.length > 0) {
        entry.tags.forEach(tag => {
          const chip = document.createElement("span");
          chip.className = "tag-chip";
          chip.textContent = `#${tag}`;
          tagsRow.appendChild(chip);
        });
      }

      const actions = document.createElement("div");
      actions.className = "card-actions";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => handleDelete(entry._id));

      actions.appendChild(deleteBtn);

      card.appendChild(title);
      card.appendChild(metaRow);
      card.appendChild(favChar);
      card.appendChild(notes);
      if (tagsRow.childElementCount > 0) {
        card.appendChild(tagsRow);
      }
      card.appendChild(actions);

      animeList.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    setStatus("Error loading anime.");
  }
}

// Handle delete action
async function handleDelete(id) {
  const sure = confirm("Are you sure you want to delete this anime?");
  if (!sure) return;

  try {
    const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
    const result = await res.json();
    alert(result.message || result.error);
    loadAnime(); // reload the list
  } catch (err) {
    console.error(err);
    alert("Failed to delete.");
  }
}

// Run when page loads
if (animeList) {
  loadAnime();
}
