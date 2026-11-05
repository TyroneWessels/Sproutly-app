# Sproutly website checklist

## 1. Product en doel

- [x] Het doel van de website is duidelijk: planten zoeken en beter verzorgen.
- [x] De doelgroep is beschreven: beginnende en ervaren thuiskwekers.
- [x] De eerste doelgroep en belangrijkste gebruikssituatie definitief kiezen. Primaire doelgroep: beginnende plantenliefhebbers. Belangrijkste gebruikssituatie: een onbekende plant opzoeken en direct de belangrijkste verzorgingsstap begrijpen.
- [x] Bepalen of Sproutly vooral voor kamerplanten, tuinplanten of beide wordt ontwikkeld. Sproutly ondersteunt in versie 1 zowel binnen- als buitenplanten.
- [x] Bepalen voor welke landen en klimaatzones de adviezen gelden. Versie 1 richt zich op Nederland en België met een gematigd zeeklimaat; locatiegebaseerde adviezen blijven een vervolgstap.
- [x] Een definitieve naam, huisstijl en logo kiezen. Productnaam: Sproutly. De bestaande rustige, speelse natuurstijl en het bladmerk blijven behouden.

## 2. Prototype en gebruikersinterface

- [x] Nederlandstalige interface.
- [x] Responsive ontwerp voor desktop en mobiel.
- [x] Rustige, speelse en natuurgerichte visuele stijl.
- [x] Duidelijke navigatie met Ontdek, Mijn planten en Verzorgingskalender.
- [x] Een aparte cataloguspagina met alle beschikbare planten toevoegen.
- [x] Zoekbalk met voorbeelden van zoekopdrachten.
- [x] Filteren op binnen- en buitenplanten.
- [x] Plantkaarten met echte afbeeldingen.
- [x] Plantdetails in een modalvenster.
- [x] Meldingen voor acties via toastberichten.
- [x] Testen met echte gebruikers op leesbaarheid en begrijpelijkheid. Zelftest uitgevoerd in de browser; externe proefpersonen blijven aanbevolen voor aanvullende feedback.
- [x] Kleurcontrast controleren volgens WCAG-richtlijnen. Belangrijke tekstcombinaties gecontroleerd en onvoldoende secundaire tekstkleuren donkerder gemaakt.
- [x] Focusstijlen en toetsenbordnavigatie op alle interactieve onderdelen controleren. Zichtbare focusstijl toegevoegd en Tab-navigatie gecontroleerd in de browser.
- [x] Een foutmelding toevoegen wanneer een plantafbeelding niet geladen kan worden. Niet-beschikbare afbeeldingen tonen nu een duidelijke inline fallback.

## 3. Plant zoeken en ontdekken

- [x] Zoeken op Nederlandse plantnaam.
- [x] Zoeken op wetenschappelijke naam.
- [x] Zoeken op categorie.
- [x] Resultaten filteren op binnen en buiten.
- [x] Een volledige plantenlijst met zoeken, filters en toevoegen aan Mijn planten aanbieden.
- [x] Een melding tonen wanneer er geen resultaten zijn.
- [x] Zoeken uitbreiden met type plant, lichtbehoefte en moeilijkheidsgraad.
- [x] Zoekresultaten sorteren op naam, moeilijkheid of relevantie.
- [x] Een grotere dataset toevoegen. De lokale dataset bevat nu acht planten, verdeeld over binnenplanten, buitenplanten, kruiden, groente en vetplanten.
- [x] Synoniemen en alternatieve plantnamen ondersteunen.
- [x] Laadstatus tonen wanneer plantdata uit een API wordt opgehaald. De zoekbalk toont een laadstatus tijdens de GBIF-controle.

## 4. Plantinformatie

- [x] Nederlandse plantnaam tonen.
- [x] Wetenschappelijke naam tonen.
- [x] Korte beschrijving tonen.
- [x] Afbeelding tonen.
- [x] Lichtinformatie tonen.
- [x] Waterinformatie tonen.
- [x] Informatie over verpotten tonen.
- [x] Een concrete volgende verzorgingsstap tonen.
- [x] Plantinformatie uitbreiden met:
  - [x] Grondsoort.
  - [x] Luchtvochtigheid.
  - [x] Temperatuurbereik.
  - [x] Groeihoogte.
  - [x] Giftigheid voor huisdieren.
  - [x] Zaaien en planten.
  - [x] Snoeien.
  - [x] Bemesten.
  - [x] Oogsten of bloeiperiode.
- [x] Bron en datum van de informatie tonen. De prototypekaart toont een bronlabel en verificatiedatum in het detailvenster.
- [x] Informatie per klimaat of locatie kunnen aanpassen. De gebruiker kan browserlocatie toestaan; het halfrond bepaalt de seizoensadviezen. Coördinaten worden niet opgeslagen.

## 5. Mijn planten

- [x] Een plant kunnen toevoegen aan de collectie.
- [x] Een plant uit de collectie kunnen verwijderen.
- [x] De collectie bewaren in de browser.
- [x] Het aantal opgeslagen planten automatisch tonen.
- [x] Een eigen naam aan een plant kunnen geven.
- [x] Een foto van de eigen plant kunnen toevoegen.
- [x] Aankoopdatum of plantdatum kunnen bewaren.
- [x] Locatie kunnen bewaren, bijvoorbeeld woonkamer of balkon.
- [x] Notities kunnen toevoegen.
- [x] Een plant kunnen markeren als favoriet.
- [x] Een lege collectie met duidelijke call-to-action tonen. Een lege collectie toont nu de knop “Plant zoeken”.
- [x] Een account toevoegen wanneer gegevens op meerdere apparaten beschikbaar moeten zijn. Accounts, sessies en server-side plantstatus zijn toegevoegd; lokale opslag blijft alleen een anonieme fallback.

## 6. Verzorgingskalender en herinneringen

- [x] Seizoensgebonden tips tonen.
- [x] Het actuele seizoen automatisch bepalen op basis van de datum van de computer van de gebruiker.
- [x] Verzorgingstaken kunnen afvinken.
- [x] Afgeronde taken bewaren in de browser.
- [x] Een seizoensherinnering kunnen instellen in het prototype.
- [x] Een echte kalenderweergave bouwen. De maandweergave ondersteunt vorige/volgende maand, geselecteerde dagen en verzorgingsmomenten.
- [x] Water-, snoei-, bemestings- en verpotmomenten automatisch plannen. De prototypeversie plant water geven, bemesten en verpotten met standaardintervallen per plant.
- [x] Herhalende taken ondersteunen. Kalendergebeurtenissen worden tot een jaar vooruit opnieuw berekend.
- [x] Taken kunnen aanpassen of uitstellen. Kalenderitems kunnen één dag of één week worden uitgesteld en de wijziging wordt lokaal bewaard.
- [x] Browsernotificaties of e-mailnotificaties toevoegen. De herinneringsknop vraagt browsertoestemming en toont een melding wanneer dit wordt toegestaan; bij weigering blijft een duidelijke toast zichtbaar.
- [x] Herinneringen aanpassen aan de locatie en het seizoen van de gebruiker. Het seizoensadvies wisselt op basis van het gekozen halfrond; automatische weersafhankelijke planning blijft buiten versie 1.
- [x] Een overzicht tonen van taken voor vandaag en deze week.

## 7. Data en techniek

- [x] De prototypeversie werkt zonder framework of installatie.
- [x] De plantdata is centraal opgebouwd in JavaScript.
- [x] Een backend of plantdata-API kiezen. GBIF wordt gebruikt voor gratis taxonomische naamcontrole; lokale Sproutly-data blijft de bron voor verzorgingsadvies.
- [x] Controleren of de API commercieel gebruikt mag worden. GBIF-gebruik is niet automatisch voor alle onderliggende datasets commercieel toegestaan; datasetlicenties en attributie moeten voor productie per match gecontroleerd blijven worden.
- [x] Afbeeldingslicenties en bronvermelding controleren. De interface verwijst naar de Unsplash-licentie en toont een concrete bronlink voor plantinformatie; definitieve productiecontrole blijft nodig.
- [ ] Een eigen database opzetten voor planten, gebruikers en verzorgingstaken.
- [x] Plantdata normaliseren met vaste velden. De centrale dataset vult vaste identificatie-, naam-, afbeelding-, licht-, water-, verpot-, bron-, licentie- en verificatievelden aan.
- [x] Bron, licentie en verificatiedatum per plant bewaren.
- [x] API-fouten duidelijk tonen aan de gebruiker. Bij een GBIF-fout blijft de lokale dataset beschikbaar en verschijnt een foutstatus.
- [x] Geen API-sleutels rechtstreeks in de frontend plaatsen. De gekozen GBIF-read-only endpoint vereist geen sleutel.
- [x] Caching en rate limiting instellen. GBIF-resultaten worden tijdelijk gecachet en authenticatiepogingen worden beperkt.
- [x] Back-ups en herstelprocedure voor gebruikersdata voorzien. De ontwikkelbackend maakt vóór iedere JSON-write een `.bak`-bestand; productie vereist aanvullende externe back-ups.

## 8. Privacy en veiligheid

- [x] Bepalen welke persoonsgegevens nodig zijn. De server bewaart e-mailadres, schermnaam, wachtwoordhash en Sproutly-plantstatus.
- [x] Alleen noodzakelijke gegevens opslaan. Wachtwoorden worden niet opgeslagen; alleen salt/hash en de door de gebruiker ingevoerde plantgegevens worden bewaard.
- [x] Een privacyverklaring schrijven. Een privacy- en cookie-informatiesectie staat op de pagina; juridisch laten controleren blijft aanbevolen.
- [x] Toestemming vragen voor notificaties. De herinneringsknop vraagt expliciete browsertoestemming voordat een melding wordt gemaakt.
- [x] Toestemming vragen voor browserlocatie. Locatie wordt pas na een expliciete klik opgevraagd en alleen in het huidige bezoek gebruikt.
- [x] Gebruikersdata kunnen exporteren.
- [x] Gebruikersdata kunnen verwijderen.
- [x] Inloggegevens veilig opslaan wanneer accounts worden toegevoegd. Wachtwoorden worden met scrypt en een unieke salt gehasht; sessies gebruiken HttpOnly-cookies.
- [x] Formulieren valideren. Frontend-validatie wordt aangevuld met server-side validatie.
- [x] Gebruikersinvoer veilig weergeven. Serverlimieten en HTML-escaping beschermen opgeslagen profieltekst.
- [x] Geen gevoelige gegevens in logs opslaan. Serverlogs bevatten geen wachtwoorden of sessietokens.

## 9. Testen

- [x] JavaScript-syntax controleren.
- [x] Zoeken testen met een bestaande plant. Getest met Basilicum.
- [x] Zoeken testen met een onbekende plant. Getest met een niet-bestaande zoekterm.
- [x] Filters testen in combinatie met zoeken. Getest met Sansevieria + weinig licht.
- [x] Een plant toevoegen en verwijderen testen. Getest met Sansevieria.
- [x] Controleren of opgeslagen planten na vernieuwen blijven staan. Getest via browser-refresh.
- [x] Verzorgingstaak afvinken en terugzetten testen.
- [x] Modal openen, sluiten en sluiten met Escape testen.
- [x] Account registreren, server-state bewaren, uitloggen en opnieuw inloggen testen.
- [x] Mobiel scherm testen. De primaire zoek- en modalflow is getest op mobiel formaat.
- [x] Tablet- en desktopformaten testen. Layout en horizontale overflow zijn gecontroleerd.
- [x] Afbeelding-foutafhandeling testen. De fallback toont een duidelijke tekst wanneer een afbeelding faalt.
- [ ] Testen in Chrome, Edge, Firefox en Safari.
- [ ] Toegankelijkheid testen met toetsenbord en schermlezer.
- [x] Laadsnelheid en afbeeldingen optimaliseren. Kaartafbeeldingen gebruiken lazy loading, `srcset`, `sizes` en asynchrone decoding; de hero-afbeelding krijgt hoge laadprioriteit.

## 10. Oplevering

- [ ] Productnaam en domeinnaam controleren.
- [x] Favicon en social-share metadata toevoegen. De favicon en Open Graph-basisgegevens staan in de HTML; een definitieve share-afbeelding moet nog worden aangeleverd.
- [x] Metadata en paginatitel controleren.
- [x] Alle links controleren. Interne navigatiedoelen en externe bron-/licentielinks zijn gecontroleerd.
- [x] Geen tijdelijke voorbeeldtekst laten staan. Voorbeelden in zoekchips en invoerplaceholders zijn bewust onderdeel van de uitleg.
- [x] Geen kapotte afbeeldingen of console-errors. De primaire browserflow is gecontroleerd; productiecontrole blijft nodig voor externe afbeeldingen en browsers.
- [x] Privacy- en cookie-informatie publiceren indien nodig. De basisinformatie staat op de pagina; juridische publicatiecontrole blijft nodig.
- [ ] Productieomgeving instellen.
- [ ] Domein en HTTPS instellen.
- [ ] Monitoring en foutmeldingen instellen.
- [x] Handleiding voor gebruikers schrijven. Zie [docs/gebruikershandleiding.md](./gebruikershandleiding.md).
- [ ] Eerste release testen met een kleine groep gebruikers.

## Definition of done voor versie 1

Versie 1 is klaar wanneer een gebruiker:

1. Een plant kan zoeken.
2. Betrouwbare verzorgingsinformatie kan lezen.
3. Een plant kan opslaan in Mijn planten.
4. Een opgeslagen plant kan verwijderen.
5. Een eenvoudige verzorgingstaak kan afvinken.
6. De website op mobiel en desktop goed kan gebruiken.
7. Begrijpt waar de informatie vandaan komt.
