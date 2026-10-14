/* APEX CIPHER shared site enhancements: mega menus, cross-page search, and safe Back control. */
(function () {
  "use strict";
  var pages = [
    ["index.html","Home","Company overview, engineering approach, technology capabilities"],
    ["about.html","About","Team, principles, approach, company values"],
    ["services.html","Services","AI consulting, AI solutions, software development"],
    ["ai-consulting.html","AI Consulting","AI strategy, advisory, implementation"],
    ["ai-solutions.html","AI Solutions","Enterprise AI, retrieval, automation"],
    ["software-development.html","Software Development","Web applications, platforms, engineering"],
    ["industries.html","Industries","Industry solutions and sector experience"],
    ["work.html","Work","Portfolio, projects, case studies"],
    ["case-study-ai-platform.html","AI Platform Case Study","AI platform case study"],
    ["case-study-cloud-modernization.html","Cloud Modernization Case Study","Cloud migration, infrastructure, observability"],
    ["insights.html","Insights","Articles, ideas, technology insights"],
    ["article-enterprise-ai.html","Enterprise AI Article","Enterprise AI knowledge and governance"],
    ["faq.html","FAQ","Frequently asked questions"],
    ["contact.html","Contact","Contact APEX CIPHER, start a project"],
    ["privacy-policy.html","Privacy Policy","Privacy and data handling"],
    ["terms.html","Terms","Website terms"],
    ["404.html","Page Not Found","Return to the homepage"]
  ];
  var menuMap = {
    "index.html": [["Home","index.html","Company overview and introduction"],["About the team","about.html","How we work and what we value"],["Start a project","contact.html","Tell us about your technology challenge"]],
    "about.html": [["Our approach","about.html#approach","How we plan and deliver work"],["Technology capabilities","services.html","Explore engineering capabilities"],["Our work","work.html","Selected projects and case studies"]],
    "services.html": [["All Services","services.html","Explore all APEX CIPHER services"],["AI Consulting","ai-consulting.html","Strategy, architecture and implementation"],["AI Solutions","ai-solutions.html","Applied AI for real workflows"],["Software Development","software-development.html","Reliable custom software and platforms"]],
    "industries.html": [["Industry experience","industries.html","Explore our industry focus"],["Selected work","work.html","See relevant delivery examples"],["Discuss your challenge","contact.html","Start a conversation with our team"]],
    "work.html": [["Portfolio","work.html","Browse selected work"],["AI platform","case-study-ai-platform.html","Explore an AI platform case study"],["Cloud modernization","case-study-cloud-modernization.html","Explore a cloud transformation case study"]],
    "insights.html": [["All insights","insights.html","Articles and technical perspectives"],["Enterprise AI","article-enterprise-ai.html","Read about enterprise AI"],["Frequently asked questions","faq.html","Get answers to common questions"]]
  };
  function el(tag, cls, text) { var node=document.createElement(tag); if(cls) node.className=cls; if(text!==undefined) node.textContent=text; return node; }
  function initMenus() {
    document.querySelectorAll(".site-nav__item").forEach(function (item) {
      var link=item.querySelector(":scope > .site-nav__link"); if(!link) return;
      var href=(link.getAttribute("href")||"").split("#")[0]; var entries=menuMap[href]; if(!entries || item.querySelector(".site-mega-panel")) return;
      var panel=el("div","site-mega-panel");
      panel.id="mega-"+href.replace(/[^a-z0-9]+/gi,"-").replace(/^-|-$/g,"");
      panel.setAttribute("aria-label",(link.textContent||"Navigation").trim()+" menu");
      panel.setAttribute("aria-hidden","true");
      entries.forEach(function(entry){ var a=el("a","",entry[0]); a.href=entry[1]; var span=el("span","",entry[2]); a.appendChild(span); panel.appendChild(a); });
      item.appendChild(panel);
      link.setAttribute("aria-haspopup","true");
      link.setAttribute("aria-controls",panel.id);
      link.setAttribute("aria-expanded","false");
      function setOpen(open){
        item.classList.toggle("is-mega-open",open);
        link.setAttribute("aria-expanded",open?"true":"false");
        panel.setAttribute("aria-hidden",open?"false":"true");
        if(open){document.querySelectorAll(".site-nav__item.is-mega-open").forEach(function(other){if(other!==item){other.classList.remove("is-mega-open");var otherLink=other.querySelector(":scope > .site-nav__link");var otherPanel=other.querySelector(":scope > .site-mega-panel");if(otherLink)otherLink.setAttribute("aria-expanded","false");if(otherPanel)otherPanel.setAttribute("aria-hidden","true");}});}
      }
      link.addEventListener("click",function(e){
        if(window.matchMedia("(max-width: 1024px)").matches){
          if(!item.classList.contains("is-mega-open")){e.preventDefault();setOpen(true);}
          else {setOpen(false);}
        }
      });
      item.addEventListener("pointerenter",function(e){if(e.pointerType!=="touch" && !window.matchMedia("(max-width: 1024px)").matches)setOpen(true);});
      item.addEventListener("pointerleave",function(e){if(e.pointerType!=="touch" && !window.matchMedia("(max-width: 1024px)").matches)setOpen(false);});
      item.addEventListener("focusin",function(){setOpen(true);});
      item.addEventListener("focusout",function(e){if(!item.contains(e.relatedTarget) && !window.matchMedia("(max-width: 1024px)").matches)setOpen(false);});
      item.addEventListener("keydown",function(e){ if(e.key==="Escape"){setOpen(false);link.focus();} });
    });
  }
  function syncCurrentPage() {
    var path = (window.location.pathname || "").replace(/\\/g, "/");
    var current = path.split("/").filter(Boolean).pop() || "index.html";
    if (!/\.html?$/i.test(current)) current = "index.html";
    current = current.toLowerCase();
    var parent = {
      "ai-consulting.html":"services.html",
      "ai-solutions.html":"services.html",
      "software-development.html":"services.html",
      "case-study-ai-platform.html":"work.html",
      "case-study-cloud-modernization.html":"work.html",
      "article-enterprise-ai.html":"insights.html",
      "faq.html":"insights.html"
    };
    var active = parent[current] || current;
    document.querySelectorAll(".site-nav__link[aria-current]").forEach(function(link){ link.removeAttribute("aria-current"); });
    document.querySelectorAll(".site-nav__link").forEach(function(link){
      var href = (link.getAttribute("href") || "").split("#")[0].split("?")[0];
      var target = href.split("/").filter(Boolean).pop() || "index.html";
      if (target === "." || target === "./") target = "index.html";
      target = target.toLowerCase();
      if (target === active) link.setAttribute("aria-current", "page");
    });
  }
  function initSearch() {
    var actions=document.querySelector(".site-header__actions"); if(!actions || actions.querySelector(".site-search-trigger")) return;
    var trigger=el("button","site-search-trigger"); trigger.type="button"; trigger.setAttribute("aria-label","Search the website"); trigger.setAttribute("aria-haspopup","dialog"); trigger.innerHTML='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.6" stroke="currentColor" stroke-width="1.8"></circle><path d="m16 16 4.2 4.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"></path></svg>';
    var cta=actions.querySelector(".site-header__cta"); actions.insertBefore(trigger,cta||actions.firstChild);
    var overlay=el("div","site-search-overlay"); overlay.setAttribute("aria-hidden","true");
    var dialog=el("section","site-search-dialog"); dialog.setAttribute("role","dialog"); dialog.setAttribute("aria-modal","true"); dialog.setAttribute("aria-labelledby","site-search-title");
    var head=el("div","site-search-head"); var title=el("h2","","Search APEX CIPHER"); title.id="site-search-title"; var close=el("button","site-search-close","×"); close.type="button"; close.setAttribute("aria-label","Close search"); head.append(title,close);
    var input=el("input","site-search-field"); input.type="search"; input.placeholder="Search services, projects, articles…"; input.setAttribute("aria-label","Search website content");
    var results=el("div","site-search-results"); results.setAttribute("aria-live","polite"); results.appendChild(el("p","site-search-empty","Start typing to search pages across the website."));
    dialog.append(head,input,results); overlay.appendChild(dialog); document.body.appendChild(overlay);
    var index=pages.map(function(p){return {url:p[0],title:p[1],description:p[2],text:(p[1]+" "+p[2]).toLowerCase()};}); var loaded=false;
    function render(){var q=input.value.trim().toLowerCase(); results.replaceChildren(); if(!q){results.appendChild(el("p","site-search-empty","Start typing to search pages across the website."));return;} var matches=index.map(function(p){var score=(p.title.toLowerCase().includes(q)?5:0)+(p.description.toLowerCase().includes(q)?2:0)+(p.text.includes(q)?1:0);return {p:p,score:score};}).filter(function(x){return x.score>0;}).sort(function(a,b){return b.score-a.score;}).slice(0,10); if(!matches.length){results.appendChild(el("p","site-search-empty","No matching pages found. Try another keyword."));return;} matches.forEach(function(m){var a=el("a","site-search-result");a.href=m.p.url;var strong=el("strong","",m.p.title);var span=el("span","",m.p.description);a.append(strong,span);results.appendChild(a);}); }
    function open(){overlay.classList.add("is-open");overlay.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";window.setTimeout(function(){input.focus();},20);}
    function shut(){overlay.classList.remove("is-open");overlay.setAttribute("aria-hidden","true");document.body.style.overflow="";trigger.focus();}
    trigger.addEventListener("click",open);close.addEventListener("click",shut);overlay.addEventListener("click",function(e){if(e.target===overlay)shut();});input.addEventListener("input",render);document.addEventListener("keydown",function(e){if(e.key==="Escape"&&overlay.classList.contains("is-open"))shut();if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();open();}});
    /* Enhance index with full page text when served over HTTP(S); local-file mode still has useful title/description search. */
    if(location.protocol==="http:"||location.protocol==="https:"){Promise.all(pages.map(function(p){return fetch(p[0]).then(function(r){if(!r.ok)throw new Error("skip");return r.text();}).then(function(html){var doc=new DOMParser().parseFromString(html,"text/html");var record=index.find(function(x){return x.url===p[0];});if(record){record.text=(doc.body?doc.body.textContent:html).replace(/\s+/g," ").toLowerCase();record.description=record.text.slice(0,240);}}).catch(function(){});})).then(function(){loaded=true;});}
  }
  function initBackSafety(){
    var back=document.querySelector(".page-back, .btn-back");var footer=document.querySelector(".site-footer, footer");var hero=document.querySelector(".page-hero");if(!back||(!footer&&!hero)||!("IntersectionObserver" in window))return;
    var footerVisible=false;var heroVisible=false;
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.target===footer)footerVisible=entry.isIntersecting;if(entry.target===hero)heroVisible=entry.isIntersecting;});var hidden=footerVisible||heroVisible;back.style.opacity=hidden?"0":"1";back.style.pointerEvents=hidden?"none":"auto";back.setAttribute("aria-hidden",hidden?"true":"false");},{threshold:0.08});
    if(footer)observer.observe(footer);if(hero)observer.observe(hero);
  }

  function initPageHeroSliders() {
    if (!window.APEX_CONFIG || !window.APEX_CONFIG.pageHeroSlides) return;

    var path = (window.location.pathname || "").replace(/\\/g, "/");
    var pageName = path.split("/").filter(Boolean).pop() || "index.html";
    var pageSlug = pageName.replace(/\.html?$/i, "").toLowerCase();
    if (pageSlug === "404") pageSlug = "not-found";
    if (pageSlug === "index") return;

    var slides = window.APEX_CONFIG.pageHeroSlides[pageSlug];
    var hero = document.querySelector(".page-hero");

    if (!slides || !Array.isArray(slides) || !hero || hero.dataset.pageHeroReady === "true") return;

    var inner = hero.querySelector(".page-hero__inner");
    var media = hero.querySelector(".page-hero__media");
    var mediaFrame = media && media.querySelector(".page-hero__media-frame");
    var image = mediaFrame && mediaFrame.querySelector(".page-hero-image");
    var eyebrow = inner && inner.querySelector(".eyebrow");
    var title = inner && inner.querySelector(".page-hero__title");
    var lead = inner && inner.querySelector(".page-hero__lead");
    var meta = inner && inner.querySelector(".page-hero__meta");

    if (!inner || !media || !mediaFrame || !image || !eyebrow || !title || !lead) return;

    var cta = inner.querySelector(".page-hero__cta") || inner.querySelector(".hero__actions .btn--primary");
    if (!cta) {
      cta = document.createElement("a");
      cta.className = "btn btn--primary page-hero__cta";
      inner.appendChild(cta);
    } else {
      cta.classList.add("page-hero__cta");
    }

    var dots = [];
    var activeIndex = 0;
    var timerId = null;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateDots(nextIndex) {
      dots.forEach(function (dot, index) {
        var isActive = index === nextIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function renderDots() {
      var dotWrap = hero.querySelector(".page-hero__dots");
      if (!dotWrap) {
        dotWrap = document.createElement("div");
        dotWrap.className = "page-hero__dots";
        mediaFrame.parentNode.insertBefore(dotWrap, mediaFrame.nextSibling);
      }

      dotWrap.innerHTML = slides.map(function (slide, index) {
        return '<button type="button" class="page-hero__dot' + (index === 0 ? " is-active" : "") + '" data-page-hero-dot="' + index + '" aria-label="Show slide ' + (index + 1) + '" aria-current="' + (index === 0 ? "true" : "false") + '"></button>';
      }).join("");

      dots = Array.prototype.slice.call(dotWrap.querySelectorAll("[data-page-hero-dot]"));
      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          updatePageHero(index);
          startAutoplay();
        });
      });
    }

    function updatePageHero(index) {
      var nextIndex = (index + slides.length) % slides.length;
      var slide = slides[nextIndex];
      activeIndex = nextIndex;

      if (slide.eyebrow) {
        eyebrow.innerHTML = '<span class="eyebrow__dot" aria-hidden="true"></span>' + slide.eyebrow;
      }

      if (slide.title) {
        title.innerHTML = slide.title;
      }

      if (slide.description) {
        lead.textContent = slide.description;
      }

      if (meta && Array.isArray(slide.meta) && slide.meta.length) {
        meta.innerHTML = slide.meta.map(function (item) { return "<li>" + item + "</li>"; }).join("");
      }

      if (slide.image) {
        image.src = slide.image;
      }

      if (slide.alt) {
        image.alt = slide.alt;
      }

      if (slide.srcset) {
        image.setAttribute("srcset", slide.srcset);
      } else {
        image.removeAttribute("srcset");
      }

      if (slide.ctaHref) {
        cta.setAttribute("href", slide.ctaHref);
      }

      if (slide.ctaLabel) {
        cta.textContent = slide.ctaLabel;
      }

      updateDots(activeIndex);
    }

    function stopAutoplay() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    function startAutoplay() {
      if (reducedMotion.matches || slides.length < 2) {
        return;
      }

      stopAutoplay();
      timerId = window.setInterval(function () {
        updatePageHero(activeIndex + 1);
      }, 5000);
    }

    function handleMotionChange() {
      if (reducedMotion.matches) {
        stopAutoplay();
        return;
      }
      startAutoplay();
    }

    hero.dataset.pageHeroReady = "true";
    renderDots();
    updatePageHero(0);

    hero.addEventListener("mouseenter", stopAutoplay);
    hero.addEventListener("mouseleave", startAutoplay);
    hero.addEventListener("focusin", stopAutoplay);
    hero.addEventListener("focusout", function (event) {
      if (!hero.contains(event.relatedTarget)) {
        startAutoplay();
      }
    });

    if (typeof reducedMotion.addEventListener === "function") {
      reducedMotion.addEventListener("change", handleMotionChange);
    } else if (typeof reducedMotion.addListener === "function") {
      reducedMotion.addListener(handleMotionChange);
    }

    startAutoplay();
  }

  function initCardCarousels() {
    var selectors = [
      ".work-grid",
      ".grid--industries",
      ".insight-grid",
      ".portfolio-grid",
      ".value-grid"
    ];

    document.querySelectorAll(selectors.join(",")).forEach(function (group) {
      if (!group || group.dataset.carouselReady === "true") return;
      if (!group.children.length) return;

      var items = Array.prototype.slice.call(group.children);
      if (items.length < 2) return;

      var shell = document.createElement("div");
      shell.className = "carousel-shell";

      var nav = document.createElement("div");
      nav.className = "carousel-nav";
      nav.setAttribute("aria-label", "Card carousel controls");

      var prev = document.createElement("button");
      prev.type = "button";
      prev.className = "carousel-arrow carousel-arrow--prev";
      prev.setAttribute("aria-label", "Previous cards");
      prev.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

      var next = document.createElement("button");
      next.type = "button";
      next.className = "carousel-arrow carousel-arrow--next";
      next.setAttribute("aria-label", "Next cards");
      next.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

      nav.appendChild(prev);
      nav.appendChild(next);

      group.parentNode.insertBefore(shell, group);
      shell.appendChild(group);
      shell.appendChild(nav);

      group.classList.add("carousel-track");
      group.dataset.carouselReady = "true";

      function getStep() {
        var firstItem = items[0];
        if (!firstItem) return 260;
        var styles = window.getComputedStyle(group);
        var gap = parseFloat(styles.columnGap || styles.gap || "24");
        return Math.max(firstItem.getBoundingClientRect().width + gap, 260);
      }

      function updateButtons() {
        var maxScroll = Math.max(group.scrollWidth - group.clientWidth, 0);
        prev.disabled = group.scrollLeft <= 4;
        next.disabled = group.scrollLeft >= maxScroll - 4;
        prev.setAttribute("aria-disabled", prev.disabled ? "true" : "false");
        next.setAttribute("aria-disabled", next.disabled ? "true" : "false");
        prev.classList.toggle("is-hidden", prev.disabled);
        next.classList.toggle("is-hidden", next.disabled);
      }

      prev.addEventListener("click", function () {
        group.scrollBy({ left: -getStep(), behavior: "smooth" });
      });

      next.addEventListener("click", function () {
        group.scrollBy({ left: getStep(), behavior: "smooth" });
      });

      group.addEventListener("scroll", updateButtons, { passive: true });
      window.addEventListener("resize", updateButtons);
      updateButtons();

      var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      group.style.scrollBehavior = reducedMotion.matches ? "auto" : "smooth";

      if (reducedMotion.addEventListener) {
        reducedMotion.addEventListener("change", function () {
          group.style.scrollBehavior = reducedMotion.matches ? "auto" : "smooth";
        });
      }
    });
  }

  function init(){initMenus();syncCurrentPage();initSearch();initBackSafety();initPageHeroSliders();initCardCarousels();}
  window.addEventListener("pageshow", syncCurrentPage);
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
