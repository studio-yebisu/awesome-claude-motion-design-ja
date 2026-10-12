(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  let toastTimer;
  function toast(message) {
    const el = $("#toast"); if (!el) return;
    el.textContent = message; el.classList.add("visible");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("visible"), 2600);
  }
  document.addEventListener("click", async event => {
    const button = event.target.closest("[data-copy-command],[data-copy-target]");
    if (!button) return;
    const code = button.dataset.copyTarget ? document.getElementById(button.dataset.copyTarget) : button.closest(".install").querySelector("code");
    try { await navigator.clipboard.writeText(code.textContent.trim()); toast("コピーしました"); }
    catch { toast("コピーできませんでした。テキストを選択してコピーしてください。"); }
  });
  const form = $("#catalog-filters");
  if (form) {
    const search = $("#catalog-search"), origin = $("#origin-filter"), license = $("#license-filter");
    const chips = $$("[data-category-filter]"), cards = $$("[data-project]");
    const validCategories = new Set(chips.map(el => el.dataset.categoryFilter));
    const categories = Object.fromEntries(chips.map(el => [el.dataset.categoryFilter, el.textContent.replace(/\s+\d+\s*$/, "").trim()]));
    let category = "all";
    const norm = text => text.normalize("NFKC").toLocaleLowerCase("ja");
    function render(save = true) {
      const terms = norm(search.value.trim()).split(/\s+/).filter(Boolean);
      let found = 0;
      cards.forEach(card => {
        const match = (category === "all" || card.dataset.category === category) && (origin.value === "all" || card.dataset.origin === origin.value) && (license.value === "all" || card.dataset.license === license.value) && terms.every(term => norm(card.dataset.search).includes(term));
        card.hidden = !match; if (match) found++;
      });
      chips.forEach(chip => { const active = chip.dataset.categoryFilter === category; chip.classList.toggle("active", active); chip.setAttribute("aria-pressed", String(active)); });
      $("#list-title").textContent = category === "all" ? "スキル・ツール一覧" : categories[category];
      $("#result-count").textContent = `${cards.length}件中 ${found}件を表示`;
      $("#no-results").hidden = found !== 0;
      if (save) {
        const url = new URL(location.href); url.search = "";
        if (category !== "all") url.searchParams.set("category", category);
        if (search.value.trim()) url.searchParams.set("q", search.value.trim());
        if (origin.value !== "all") url.searchParams.set("origin", origin.value);
        if (license.value !== "all") url.searchParams.set("license", license.value);
        history.replaceState(null, "", url);
      }
    }
    function restore() {
      const params = new URLSearchParams(location.search);
      category = validCategories.has(params.get("category")) ? params.get("category") : "all";
      search.value = (params.get("q") || "").slice(0, 250);
      origin.value = ["source_post","additional"].includes(params.get("origin")) ? params.get("origin") : "all";
      license.value = ["oss","source-available","unspecified","reference"].includes(params.get("license")) ? params.get("license") : "all";
      render(false);
    }
    form.addEventListener("submit", e => e.preventDefault());
    search.addEventListener("input", () => render()); origin.addEventListener("change", () => render()); license.addEventListener("change", () => render());
    chips.forEach(chip => chip.addEventListener("click", () => { category = chip.dataset.categoryFilter; render(); }));
    $("#clear-filters").addEventListener("click", () => { category = "all"; search.value = ""; origin.value = "all"; license.value = "all"; render(); });
    window.addEventListener("popstate", restore); restore();
  }
})();
