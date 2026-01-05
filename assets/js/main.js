async function loadBooks() {
    const res = await fetch("/books.json");
    const books = await res.json();
    return books;
}

function el(q) {
    return document.querySelector(q);
}

function renderList(books) {
    const container = el("#books");
    container.innerHTML = "";
    if (!books.length) {
        container.innerHTML = "<p>未找到书籍。</p>";
        return;
    }
    books.forEach((b) => {
        const div = document.createElement("article");
        div.className = "card";
        div.innerHTML = `
      <img src="${b.cover}" alt="${b.title}">
      <div class="body">
        <h3>${b.title}</h3>
        <div class="meta">${b.author} · <span class="chip">${b.tags?.[0] || ""}</span></div>
        <p class="desc">${b.desc}</p>
        <div class="actions">
          <a class="btn" href="book.html?id=${b.id}">查看</a>
          <a class="btn" href="${b.link}" target="_blank">下载</a>
        </div>
      </div>`;
        container.appendChild(div);
    });
}

function populateTags(books) {
    const sel = el("#tagFilter");
    const tags = new Set();
    books.forEach((b) => (b.tags || []).forEach((t) => tags.add(t)));
    Array.from(tags)
        .sort()
        .forEach((t) => {
            const o = document.createElement("option");
            o.value = t;
            o.textContent = t;
            sel.appendChild(o);
        });
}

function setup(books) {
    const search = el("#search");
    const tagFilter = el("#tagFilter");

    function apply() {
        const q = search.value.trim().toLowerCase();
        const tag = tagFilter.value;
        const filtered = books.filter((b) => {
            const matchQ =
                !q ||
                b.title.toLowerCase().includes(q) ||
                (b.author || "").toLowerCase().includes(q);
            const matchTag = !tag || (b.tags || []).includes(tag);
            return matchQ && matchTag;
        });
        renderList(filtered);
    }

    search.addEventListener("input", apply);
    tagFilter.addEventListener("change", apply);
    renderList(books);
}

document.addEventListener("DOMContentLoaded", async () => {
    const books = await loadBooks();
    populateTags(books);
    setup(books);
});
