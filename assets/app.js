/* Справочник Gen AI-аналитика — навигация, поиск, темы, термины.
   Без зависимостей. Страницы описываются в SITEMAP,
   переходы по терминам — в TERM_LINKS. */
(function () {
  "use strict";

  var SITEMAP = [
    { href: "index.html", num: "", label: "Обложка" },
    { group: "Технологии" },
    { href: "rag.html", num: "01", label: "RAG" },
    { href: "agents.html", num: "02", label: "Агенты и оркестрация" },
    { href: "prompts.html", num: "03", label: "Промпты и контекст" },
    { group: "Качество и надёжность" },
    { href: "evaluation.html", num: "04", label: "Оценка качества" },
    { href: "guardrails.html", num: "05", label: "Guardrails и безопасность" },
    { href: "observability.html", num: "06", label: "Наблюдаемость" },
    { href: "cost.html", num: "07", label: "Стоимость и латентность" },
    { group: "Практика аналитика" },
    { href: "artifacts.html", num: "08", label: "Артефакты аналитика" },
    { href: "glossary.html", num: "09", label: "Глоссарий" }
  ];

  /* Термин → раздел справочника. Ключ — нижний регистр текста чипа.
     Термины без записи остаются некликабельными. */
  var TERM_LINKS = {
    "retrieval-augmented generation": "rag.html",
    "rag": "rag.html",
    "chunking": "rag.html",
    "embeddings": "rag.html",
    "vector database": "rag.html",
    "semantic search": "rag.html",
    "bm25": "rag.html",
    "hybrid search": "rag.html",
    "reranking": "rag.html",
    "top_k": "rag.html",
    "ai agent": "agents.html",
    "agent loop": "agents.html",
    "tool calling": "agents.html",
    "function calling": "agents.html",
    "mcp": "agents.html",
    "model context protocol": "agents.html",
    "multi-agent system": "agents.html",
    "orchestration": "agents.html",
    "router / routing": "agents.html",
    "routing": "agents.html",
    "agent memory": "agents.html",
    "hitl": "agents.html",
    "human-in-the-loop": "agents.html",
    "escalation": "agents.html",
    "prompt engineering": "prompts.html",
    "system prompt": "prompts.html",
    "context window": "prompts.html",
    "context engineering": "prompts.html",
    "few-shot": "prompts.html",
    "chain-of-thought": "prompts.html",
    "structured outputs": "prompts.html",
    "prompt": "prompts.html",
    "token": "cost.html",
    "evals": "evaluation.html",
    "evaluation": "evaluation.html",
    "golden dataset": "evaluation.html",
    "llm-as-a-judge": "evaluation.html",
    "faithfulness": "evaluation.html",
    "groundedness": "evaluation.html",
    "answer relevancy": "evaluation.html",
    "context precision": "evaluation.html",
    "context recall": "evaluation.html",
    "hit rate@k": "evaluation.html",
    "mrr": "evaluation.html",
    "task success rate": "evaluation.html",
    "a/b testing": "evaluation.html",
    "ragas": "evaluation.html",
    "hallucination": "guardrails.html",
    "guardrails": "guardrails.html",
    "prompt injection": "guardrails.html",
    "grounding": "guardrails.html",
    "owasp llm top 10": "guardrails.html",
    "mlsecops": "guardrails.html",
    "tracing": "observability.html",
    "trace / span": "observability.html",
    "opentelemetry": "observability.html",
    "langsmith / langfuse": "observability.html",
    "drift": "observability.html",
    "csat": "observability.html",
    "ttft": "cost.html",
    "p95": "cost.html",
    "prompt caching": "cost.html",
    "deflection rate": "cost.html",
    "brd": "artifacts.html",
    "hld": "artifacts.html",
    "adr": "artifacts.html",
    "nfr": "artifacts.html",
    "c4 model": "artifacts.html",
    "acceptance criteria": "artifacts.html",
    "degradation plan": "artifacts.html",
    "docs as code": "artifacts.html"
  };

  function pageLabel(href) {
    for (var i = 0; i < SITEMAP.length; i++) {
      if (SITEMAP[i].href === href) return SITEMAP[i].label;
    }
    return "";
  }

  function currentFile() {
    var parts = location.pathname.split("/");
    var last = parts[parts.length - 1];
    return last === "" ? "index.html" : last;
  }

  /* ---- Сайдбар: сборка навигации ---- */

  function buildNav() {
    var nav = document.querySelector(".side-nav");
    if (!nav) return;
    var here = currentFile();
    SITEMAP.forEach(function (item) {
      if (item.group) {
        var g = document.createElement("div");
        g.className = "nav-group";
        g.textContent = item.group;
        nav.appendChild(g);
        return;
      }
      var a = document.createElement("a");
      a.href = item.href;
      a.dataset.label = (item.label + " " + (item.num || "")).toLowerCase();
      if (item.href === here) a.classList.add("active");
      a.appendChild(document.createTextNode(item.label));
      nav.appendChild(a);
    });
  }

  /* ---- Поиск по разделам ---- */

  function initSearch() {
    var input = document.getElementById("side-search-input");
    if (!input) return;
    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      document.querySelectorAll(".side-nav a").forEach(function (a) {
        var hit = !q || (a.dataset.label || "").indexOf(q) !== -1;
        a.style.display = hit ? "" : "none";
      });
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        input.value = "";
        input.dispatchEvent(new Event("input"));
      }
    });
  }

  /* ---- Тема: тёмная (по умолчанию) и светлая, выбор помнится ---- */

  var THEME_KEY = "cheatsheet-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll(".theme-opt").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-set") === theme);
    });
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}

    var nav = document.querySelector(".side-nav");
    if (nav) {
      var ICONS = {
        dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></svg>',
        light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      };
      var sw = document.createElement("div");
      sw.className = "theme-switch";
      sw.setAttribute("role", "group");
      sw.setAttribute("aria-label", "Тема оформления");
      ["dark", "light"].forEach(function (t) {
        var b = document.createElement("button");
        b.className = "theme-opt";
        b.type = "button";
        b.setAttribute("data-set", t);
        b.setAttribute("aria-label", t === "dark" ? "Тёмная тема" : "Светлая тема");
        b.title = t === "dark" ? "Тёмная тема" : "Светлая тема";
        b.innerHTML = ICONS[t];
        b.addEventListener("click", function () {
          applyTheme(t);
          try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
        });
        sw.appendChild(b);
      });
      nav.insertAdjacentElement("afterend", sw);
    }

    applyTheme(saved === "light" ? "light" : "dark");
  }

  /* ---- Термины-чипы → ссылки на разделы ---- */

  function initTerms() {
    document.querySelectorAll(".term").forEach(function (el) {
      var key = (el.textContent || "").trim().toLowerCase();
      var href = TERM_LINKS[key];
      if (!href || el.tagName === "A") return;
      if (href === currentFile()) return; // на своей странице чип остаётся текстом
      var a = document.createElement("a");
      a.className = "term term-link";
      a.href = href;
      a.title = "Перейти в раздел «" + pageLabel(href) + "»";
      while (el.firstChild) a.appendChild(el.firstChild);
      el.parentNode.replaceChild(a, el);
    });
  }

  /* ---- Мини-оглавление страницы и якоря заголовков ---- */

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function initToc() {
    var article = document.querySelector("article");
    var holder = document.querySelector(".toc-box > ul");
    if (!article || !holder) return;
    var headings = article.querySelectorAll("h2");
    headings.forEach(function (h) {
      if (!h.id) h.id = slugify(h.textContent || "");
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      holder.appendChild(li);
    });
    if (!headings.length) {
      var box = document.querySelector(".toc-box");
      if (box) box.style.display = "none";
      return;
    }

    /* На широких экранах оглавление уезжает в правую рельсу,
       на узких возвращается в начало статьи. */
    var tocBox = document.querySelector(".toc-box");
    var page = document.querySelector(".page");
    if (!tocBox || !page) return;
    var anchor = tocBox.nextElementSibling; // куда вернуть в потоке статьи
    var rail = null;
    var mq = window.matchMedia("(min-width: 1360px)");

    function place() {
      if (mq.matches) {
        if (!rail) {
          rail = document.createElement("aside");
          rail.className = "toc-rail";
          rail.appendChild(tocBox);
          page.appendChild(rail);
          page.classList.add("with-rail");
        }
      } else if (rail) {
        page.classList.remove("with-rail");
        page.removeChild(rail);
        article.insertBefore(tocBox, anchor);
        rail = null;
      }
    }

    if (mq.addEventListener) mq.addEventListener("change", place);
    place();
  }

  /* ---- Мобильное меню ---- */

  function initToggle() {
    var btn = document.querySelector(".toc-toggle");
    var side = document.querySelector(".sidebar");
    var overlay = document.querySelector(".side-overlay");
    if (!btn || !side) return;
    function close() {
      side.classList.remove("open");
      document.body.classList.remove("nav-open");
    }
    btn.addEventListener("click", function () {
      side.classList.toggle("open");
      document.body.classList.toggle("nav-open");
    });
    if (overlay) overlay.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    buildNav();
    initSearch();
    initTheme();
    initTerms();
    initToc();
    initToggle();
  });
})();
