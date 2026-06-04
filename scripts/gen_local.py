#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Programmatic LOCAL page generator for All In Media Factory.
Emits /servicii/{serviciu}/{judet}/{oras}/index.html — unique, anti-thin,
each weaving the locality's REAL economic character so pages are not clones.
Also writes sitemap-local.xml.

Run: python scripts/gen_local.py
"""
import os, hashlib, html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://allinmediafactory.com"
CSS = f"{BASE}/blog/style.css"

# ── LOCALITIES: real economic character per place (anti-thin source) ──
LOCALITIES = {
    # Arges (home turf — priority)
    "pitesti":          dict(nume="Pitești", judet="Argeș", judet_slug="arges", tip="municipiu", context="resedinta judetului Arges, cu o economie puternica pe industrie auto (Dacia), comert, servicii si HoReCa", industrii=["service auto", "comert", "constructii", "HoReCa", "cabinete medicale"], landmark="zona centrala si Calea Bucuresti"),
    "mioveni":          dict(nume="Mioveni", judet="Argeș", judet_slug="arges", tip="oras", context="oras industrial langa Pitesti, dezvoltat in jurul uzinei Automobile Dacia, cu multi furnizori auto si comert in crestere", industrii=["furnizori auto", "comert", "constructii", "HoReCa"], landmark="zona uzinei Dacia"),
    "campulung":        dict(nume="Câmpulung", judet="Argeș", judet_slug="arges", tip="municipiu", context="municipiu cu traditie industriala (ARO) si potential turistic la poalele muntilor, cu pensiuni si mici producatori", industrii=["pensiuni", "productie", "constructii", "turism"], landmark="zona Muscel"),
    "curtea-de-arges":  dict(nume="Curtea de Argeș", judet="Argeș", judet_slug="arges", tip="municipiu", context="municipiu turistic, cunoscut pentru Manastirea Curtea de Arges, cu pensiuni, restaurante si comert orientat spre vizitatori", industrii=["pensiuni", "restaurante", "comert", "turism"], landmark="Manastirea Curtea de Arges"),
    "stefanesti":       dict(nume="Ștefănești", judet="Argeș", judet_slug="arges", tip="oras", context="oras langa Pitesti, in zona viticola, cu ferme, podgorii, comert si afaceri de familie", industrii=["podgorii", "ferme", "comert", "constructii"], landmark="zona viticola Stefanesti"),
    "bascov":           dict(nume="Bascov", judet="Argeș", judet_slug="arges", tip="comuna", context="comuna mare, practic suburbie a Pitestiului, cu zona comerciala dezvoltata, service-uri si firme mici", industrii=["comert", "service auto", "constructii", "HoReCa"], landmark="zona comerciala Bascov"),
    "poiana-lacului":   dict(nume="Poiana Lacului", judet="Argeș", judet_slug="arges", tip="comuna", context="comuna din Arges cu afaceri de productie si mestesuguri — inclusiv confectii metalice — si firme de familie", industrii=["confectii metalice", "agricultura", "constructii"], landmark="zona Poiana Lacului"),
    "topoloveni":       dict(nume="Topoloveni", judet="Argeș", judet_slug="arges", tip="oras", context="oras cu producatori locali renumiti (magiun de Topoloveni), agricultura si mici intreprinderi", industrii=["productie alimentara", "agricultura", "comert"], landmark="zona Topoloveni"),
    # Top cities (Wave 1 light — marketing/seo/filmari)
    "bucuresti":        dict(nume="București", judet="București", judet_slug="bucuresti", tip="municipiu", context="cel mai mare oras al tarii, cu cea mai mare concentrare de firme, dar si cea mai mare concurenta online", industrii=["servicii", "IT", "comert", "HoReCa", "imobiliare"], landmark="zona de business"),
    "cluj-napoca":      dict(nume="Cluj-Napoca", judet="Cluj", judet_slug="cluj", tip="municipiu", context="hub tehnologic si universitar, cu firme IT, startup-uri, HoReCa si comert premium", industrii=["IT", "startup-uri", "HoReCa", "imobiliare"], landmark="zona centrala"),
    "timisoara":        dict(nume="Timișoara", judet="Timiș", judet_slug="timis", tip="municipiu", context="centru economic din vest, cu industrie, IT, comert si o piata in crestere", industrii=["industrie", "IT", "comert", "HoReCa"], landmark="zona centrala"),
    "iasi":             dict(nume="Iași", judet="Iași", judet_slug="iasi", tip="municipiu", context="mare centru universitar din Moldova, cu firme IT, servicii si comert", industrii=["IT", "servicii", "comert", "HoReCa"], landmark="zona centrala"),
    "constanta":        dict(nume="Constanța", judet="Constanța", judet_slug="constanta", tip="municipiu", context="oras-port la Marea Neagra, cu turism, comert, logistica si HoReCa sezonier", industrii=["turism", "HoReCa", "logistica", "comert"], landmark="zona litoral"),
    "brasov":           dict(nume="Brașov", judet="Brașov", judet_slug="brasov", tip="municipiu", context="oras turistic si industrial, cu pensiuni, HoReCa, productie si comert", industrii=["turism", "pensiuni", "productie", "HoReCa"], landmark="zona istorica"),
}

ARGES = [k for k, v in LOCALITIES.items() if v["judet_slug"] == "arges"]
CITIES = [k for k in LOCALITIES if LOCALITIES[k]["judet_slug"] != "arges"]

# ── SERVICES ──
SERVICES = {
    "agentie-marketing": dict(label="Agenție de marketing", h1="Agenție de Marketing", kw="agentie marketing", hub=f"{BASE}/servicii/", svc="Marketing digital",
        desc="marketing digital integrat (site, reclame, SEO, video)", pret="de la 300 €/lună",
        sections=["Ce includem: site, reclame, SEO, social media si video, coordonate de o singura echipa.",
                  "Strategie pe afacerea ta, nu sabloane: pornim de la cum arata clientul tau ideal."]),
    "agentie-seo": dict(label="Agenție SEO", h1="Agenție SEO", kw="agentie seo", hub=f"{BASE}/servicii/seo/", svc="SEO",
        desc="optimizare Google (SEO) ca sa apari in primele pozitii", pret="de la 350 €/lună",
        sections=["Audit tehnic, optimizare on-page, SEO local si continut.",
                  "Rezultate masurabile: avem clienti pe pozitia 1-2 in Arges."]),
    "web-design": dict(label="Web Design & creare site-uri", h1="Web Design & Creare Site-uri", kw="web design", hub=f"{BASE}/servicii/creare-site-uri/", svc="Web design",
        desc="creare site-uri si magazine online premium, optimizate SEO", pret="de la 1.500 €",
        sections=["Site de prezentare, magazin online sau landing page — rapide si mobile-first.",
                  "Optimizate SEO din constructie, ca sa apara pe Google."]),
    "filmari": dict(label="Producție Video & Filmări", h1="Producție Video & Filmări", kw="filmari", hub=f"{BASE}/servicii/productie-video/", svc="Producție video",
        desc="productie video si filmari la locatie pentru firme", pret="la cerere",
        sections=["Ne deplasam la locatia ta: scenariu, filmare, montaj, distributie.",
                  "Continut care devine viral — Molini Pizza a depasit 1,5 milioane de vizualizari."]),
    "social-media": dict(label="Administrare Social Media", h1="Administrare Social Media", kw="social media", hub=f"{BASE}/servicii/social-media-ads/", svc="Social media",
        desc="administrare Facebook, Instagram si TikTok", pret="de la 250 €/lună",
        sections=["Strategie, continut, postare constanta si comunitate.",
                  "Pagini vii care aduc clienti, nu doar like-uri."]),
    "google-ads": dict(label="Google & Facebook Ads", h1="Google & Facebook Ads", kw="google ads", hub=f"{BASE}/servicii/social-media-ads/", svc="Reclame Google & Facebook",
        desc="campanii Google si Facebook Ads cu targetare locala", pret="de la 300 €/lună + buget",
        sections=["Targetare locala precisa, mesaj care vinde, optimizare zilnica.",
                  "Clienti care suna, nu doar afisari."]),
}

# Wave 1 plan: Arges = all 6 services; cities = 3 priority services
CITY_SERVICES = ["agentie-marketing", "agentie-seo", "filmari"]


def esc(s):
    return html.escape(s, quote=True)


def page(serv_slug, loc_slug):
    s = SERVICES[serv_slug]
    L = LOCALITIES[loc_slug]
    nume, judet, judet_slug = L["nume"], L["judet"], L["judet_slug"]
    url = f"{BASE}/servicii/{serv_slug}/{judet_slug}/{loc_slug}/"
    seed = int(hashlib.md5((serv_slug + loc_slug).encode()).hexdigest(), 16)
    ind = L["industrii"]
    ind_str = ", ".join(ind[:-1]) + " si " + ind[-1] if len(ind) > 1 else ind[0]
    title = f"{s['label']} {nume} — {s['svc']} care Aduce Clienți | All In Media"
    desc = f"{s['label']} in {nume} ({judet}): {s['desc']}. Pret {s['pret']}. Rezultate reale pentru firme locale. Cere ofertă."
    # answer block (134-167 words target), weaves local economy
    answer = (
        f"All In Media Factory ofera {s['desc']} in {nume}, {judet}. "
        f"{nume} este {L['context']}, asa ca firmele de aici — {ind_str} — au nevoie de o prezenta online care le aduce clienti, nu doar de un site sau o pagina lasata in paragina. "
        f"Pretul porneste {s['pret']}, iar pentru o localitate ca {nume} avantajul e ca pe online concurenta e inca slaba: cine se misca acum prinde primele pozitii inainte sa se trezeasca ceilalti. "
        f"Lucram cu firme din toata zona {judet} si avem rezultate locale demonstrabile — clienti reali pe pozitia 1-2 in Google in judetul Arges. "
        f"Indiferent ca esti in {L['landmark']} sau in alta parte din {nume}, te ajutam sa fii gasit de clientii care cauta exact ce oferi tu. "
        f"Poti suna direct la All In Media Factory: 0758 80 20 20."
    )
    secs = "".join(f"<li>{esc(x)}</li>" for x in s["sections"])
    # siblings in same county for internal linking
    same = [k for k in LOCALITIES if LOCALITIES[k]["judet_slug"] == judet_slug and k != loc_slug]
    sib = same[seed % len(same)] if same else None
    sib2 = same[(seed // 7) % len(same)] if same else None
    rel_links = []
    if sib:
        rel_links.append(f'<a href="{BASE}/servicii/{serv_slug}/{judet_slug}/{sib}/">{esc(s["label"])} {esc(LOCALITIES[sib]["nume"])}</a>')
    if sib2 and sib2 != sib:
        rel_links.append(f'<a href="{BASE}/servicii/{serv_slug}/{judet_slug}/{sib2}/">{esc(s["label"])} {esc(LOCALITIES[sib2]["nume"])}</a>')
    rel_links.append(f'<a href="{s["hub"]}">{esc(s["svc"])} (serviciu)</a>')
    rel_links.append(f'<a href="{BASE}/recomandari/">Rezultate reale</a>')
    rel = " · ".join(rel_links)

    faq = [
        (f"Cât costă {s['kw']} în {nume}?", f"Serviciul porneste {s['pret']}, in functie de complexitate si de obiectivele tale. Pentru firme din {nume} si zona {judet}, iti facem o oferta clara dupa o discutie scurta, fara surprize. Suna la 0758 80 20 20."),
        (f"Lucrați cu firme mici din {nume}?", f"Da. Lucram cu firme de toate marimile din {nume} si {judet}, inclusiv afaceri de familie si firme mici. Strategia corecta conteaza mai mult decat bugetul — avem clienti mici pe pozitia 1-2 in Google."),
        (f"De ce să aleg o agenție pentru {s['kw']} în {nume}?", f"Pentru ca pe plan local concurenta online e inca slaba in {nume}, iar o agentie care stie ce face te urca rapid. In plus, oferim integrat site, reclame, SEO si video — totul sub un singur acoperis."),
    ]
    faq_html = "".join(
        f'<details{" open" if i==0 else ""}><summary>{esc(q)}</summary><p>{esc(a)}</p></details>'
        for i, (q, a) in enumerate(faq)
    )
    faq_ld = ",".join(
        '{ "@type": "Question", "name": %s, "acceptedAnswer": { "@type": "Answer", "text": %s } }' % (json_str(q), json_str(a))
        for q, a in faq
    )

    ld = '''<script type="application/ld+json">
{ "@context": "https://schema.org", "@graph": [
  { "@type": "Service", "name": %s, "serviceType": %s, "provider": { "@type": "Organization", "name": "All In Media Factory", "url": "%s/", "telephone": "+40758802020" }, "areaServed": { "@type": "City", "name": %s }, "description": %s },
  { "@type": "BreadcrumbList", "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "%s/" },
    { "@type": "ListItem", "position": 2, "name": "Servicii", "item": "%s/servicii/" },
    { "@type": "ListItem", "position": 3, "name": %s, "item": "%s" } ] },
  { "@type": "FAQPage", "mainEntity": [ %s ] }
] }
</script>''' % (
        json_str(f"{s['label']} {nume}"), json_str(s["svc"]), BASE, json_str(nume), json_str(s["desc"]),
        BASE, BASE, json_str(f"{s['label']} {nume}"), url, faq_ld,
    )

    return f'''<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{esc(title)}</title>
  <meta name="description" content="{esc(desc)}" />
  <link rel="canonical" href="{url}" />
  <link rel="alternate" hreflang="ro" href="{url}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="{url}" />
  <meta property="og:title" content="{esc(s['label'])} {esc(nume)} — All In Media" />
  <meta property="og:description" content="{esc(s['desc'])}. {esc(s['pret'])}." />
  <meta property="og:image" content="{BASE}/logo.webp" />
  <meta property="og:locale" content="ro_RO" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{esc(s['label'])} {esc(nume)} — All In Media" />
  <meta name="twitter:image" content="{BASE}/logo.webp" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{CSS}">
  {ld}
</head>
<body>
  <nav class="nav"><div class="nav-in"><a href="{BASE}/ro/"><img src="{BASE}/logo.webp" alt="All In Media"></a><a class="nav-cta" href="{BASE}/ro/#contact">Cere ofertă</a></div></nav>
  <main class="wrap">
    <div class="crumbs"><a href="{BASE}/ro/">Acasă</a> › <a href="{BASE}/servicii/">Servicii</a> › {esc(nume)}</div>
    <h1>{esc(s['h1'])} {esc(nume)}</h1>
    <p class="lead">Cauti {esc(s['kw'])} in {esc(nume)}? Te ajutam sa fii gasit de clientii din {esc(judet)} — si sa-i transformi in telefoane care suna.</p>
    <p class="meta">De <b>All In Media Factory</b> · {esc(nume)}, {esc(judet)} · Actualizat 5 iunie 2026</p>
    <article>
      <h2>Cea mai bună agenție de {esc(s['kw'])} din {esc(nume)}?</h2>
      <p>{esc(answer)}</p>
      <h2>Ce includem</h2>
      <ul>{secs}<li>Rapoarte clare si comunicare directa, fara jargon.</li></ul>
      <h2>De ce {esc(s['kw'])} în {esc(nume)} contează acum</h2>
      <p>In {esc(nume)} ({esc(L['context'])}), tot mai multi clienti cauta pe Google si pe retele inainte sa sune. Daca firma ta nu apare acolo, ajung la concurenta. {esc(s['svc'])} te pune in fata lor exact la momentul potrivit.</p>
      <h2>Întrebări frecvente</h2>
      <div class="faq">{faq_html}</div>
      <div class="cta">
        <h2>Vrei mai mulți clienți în {esc(nume)}?</h2>
        <p>Hai să vorbim 15 minute. Îți spunem exact ce ai de făcut.</p>
        <a class="btn" href="tel:+40758802020">Sună: 0758 80 20 20</a>
        <a class="btn ghost" href="https://wa.me/40743391581">WhatsApp</a>
      </div>
      <div class="related">Vezi și: {rel}</div>
    </article>
  </main>
  <footer>© <span id="y"></span> All In Media Factory · {esc(nume)}, {esc(judet)}, România <script>document.getElementById('y').textContent=new Date().getFullYear()</script></footer>
</body>
</html>
'''


def json_str(s):
    import json
    return json.dumps(s, ensure_ascii=False)


def main():
    written = []
    # Arges: all services
    for loc in ARGES:
        for serv in SERVICES:
            written.append(write_page(serv, loc))
    # Cities: priority services only
    for loc in CITIES:
        for serv in CITY_SERVICES:
            written.append(write_page(serv, loc))
    # sitemap-local.xml
    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in written:
        sm.append(f'  <url><loc>{u}</loc><lastmod>2026-06-05</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>')
    sm.append('</urlset>')
    open(os.path.join(ROOT, "sitemap-local.xml"), "w", encoding="utf-8").write("\n".join(sm) + "\n")
    print(f"Generated {len(written)} local pages + sitemap-local.xml")


def write_page(serv, loc):
    L = LOCALITIES[loc]
    d = os.path.join(ROOT, "servicii", serv, L["judet_slug"], loc)
    os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(page(serv, loc))
    return f"{BASE}/servicii/{serv}/{L['judet_slug']}/{loc}/"


if __name__ == "__main__":
    main()
