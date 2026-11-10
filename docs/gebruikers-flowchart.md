# Gebruikersflow van Growify

De hoofdroute is bewust eenvoudig: bezoekers kunnen eerst rustig rondkijken, hoeven geen account te maken en krijgen na belangrijke acties duidelijke bevestiging.

```mermaid
flowchart TD
    A([Start: open Growify]) --> B[Startpagina: Ontdek]
    B --> C{Wat wilt u doen?}

    C -->|Een plant zoeken| D[Open Alle planten]
    D --> E[Zoek op naam of kies een filter]
    E --> F[Bekijk de planten en verzorgingsinformatie]
    F --> FF[Open de plantpagina voor informatie en verzorging]
    FF --> G{Plant bewaren?}
    G -->|Ja| H[Klik op Aan mijn planten]
    H --> I[Growify bevestigt dat de plant is opgeslagen]
    I --> J[Open Mijn planten]
    G -->|Nog niet| E

    C -->|Opgeslagen planten bekijken| J
    J --> K{Staat er al een plant?}
    K -->|Nee| L[Toon rustig: uw lijst is nog leeg]
    L --> D
    K -->|Ja| M[Bekijk uw planten en kies Bekijk in de catalogus]
    M --> FF
    J --> LOG[Open een plant en vul plantgegevens in]
    LOG --> LOG2[Voeg verzorgingsmomenten toe aan het logboek]

    C -->|Verzorging plannen| N[Open Verzorgingskalender]
    N --> O[Bekijk de verzorgingsmomenten]
    O --> P{Andere dag bekijken?}
    P -->|Ja| Q[Kies een dag of een andere maand]
    Q --> O
    P -->|Nee| R([Klaar])
    O --> S{Herinnering gewenst?}
    S -->|Ja| T[Klik op Herinnering instellen]
    T --> U{Klik op Browsermeldingen controleren; ondersteunt de browser dit en geeft de gebruiker toestemming?}
    U -->|Ja| V[Bevestig toestemming; automatische verzorgingsmeldingen zijn nog niet beschikbaar]
    U -->|Nee| W[Leg uit dat meldingen niet zijn ingeschakeld of ondersteund]
    S -->|Nee| R
    V --> R
    W --> R

    B --> X{Wilt u uw gegevens op meerdere apparaten bewaren?}
    X -->|Nee| Y[Gebruik Growify zonder account]
    Y --> Z[Planten blijven op deze browser bewaard]
    X -->|Ja| AA{Is de Growify-server beschikbaar?}
    AA -->|Ja| AB[Maak een account of log in]
    AB --> AC[Bewaar de collectie bij het account]
    AA -->|Nee| AD[Toon duidelijke uitleg en startinstructies]
    AD --> Y
```

## Aandacht voor oudere of minder digitaal vaardige gebruikers

- Gebruik korte, gewone woorden en één duidelijke actie per knop.
- Maak knoppen en klikbare dagen groot genoeg en geef ze voldoende ruimte.
- Toon na opslaan, verwijderen of instellen direct een begrijpelijke bevestiging.
- Maak een account optioneel; laat bezoekers eerst planten ontdekken en bewaren.
- Leg fouten uit in gewone taal en geef meteen de volgende stap.
- Gebruik naast kleur ook tekst, pictogrammen of markeringen om informatie duidelijk te maken.
- Houd de hoofdnavigatie op elke pagina op dezelfde plek en gebruik overal dezelfde paginanamen.
- Browsertoestemming is geen geplande herinnering: automatische verzorgingsmeldingen zijn nog niet beschikbaar.
