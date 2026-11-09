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
- [x] Een aparte plantpagina met informatie, verzorging en persoonlijke gegevens.
- [x] Meldingen voor acties via toastberichten.
- [ ] Leesbaarheid en begrijpelijkheid testen met echte gebruikers, waaronder oudere en minder digitaal vaardige gebruikers. Een zelftest in de browser is uitgevoerd.
- [ ] Een korte rondleiding voor nieuwe gebruikers toevoegen: plant zoeken, toevoegen en verzorging bijhouden; overslaan en later opnieuw openen mogelijk maken.
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
- [x] Een grotere dataset toevoegen. De lokale catalogus bevat 32 planten, verdeeld over binnenplanten, buitenplanten, kruiden en groenten.
- [x] Synoniemen en alternatieve plantnamen ondersteunen.
- [x] Laadstatus tonen wanneer plantdata uit een API wordt opgehaald. De zoekbalk toont een laadstatus tijdens de GBIF-controle.

## 4. Plantinformatie

- [x] Nederlandse plantnaam tonen.
- [x] Wetenschappelijke naam tonen.
- [x] Korte beschrijving tonen.
- [x] Afbeelding tonen.
- [x] Lichtinformatie tonen.
- [x] Waterinformatie tonen.
- [ ] Uitgebreide verzorgingsinformatie, waaronder verpotten, grondsoort, luchtvochtigheid, temperatuur, groeihoogte, huisdieren, zaaien, snoeien, bemesten en bloei/oogst, waar relevant en betrouwbaar beschikbaar maken op alle plantpagina's.
- [ ] Een controleerbare bron en verificatiedatum voor verzorgingsinformatie per plant zichtbaar maken en inhoudelijk controleren. Fotobronnen staan al bij de afbeeldingen.
- [x] Seizoensadvies aan het halfrond aanpassen via optionele browserlocatie. Coördinaten worden niet opgeslagen; individuele plantadviezen zijn niet op lokaal klimaat afgestemd.

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
- [x] Meerdere exemplaren van dezelfde soort met eigen profiel en logboek ondersteunen.
- [x] Een lege collectie met duidelijke call-to-action tonen.
- [x] Een account toevoegen wanneer gegevens op meerdere apparaten beschikbaar moeten zijn. Supabase bewaart accountgegevens en plantstatus; lokale opslag blijft beschikbaar zonder account.
- [x] Favorieten kunnen filteren in Mijn planten en het filter eenvoudig uitschakelen.
- [ ] Een verwijderde plant met profiel, foto, logboek en bijbehorende verzorgingsgegevens kunnen herstellen via ongedaan maken of een tijdelijke prullenbak; communiceer het herstelvenster als er een tijdslimiet geldt.
- [ ] Een bestaande verzorgingslogboekregel kunnen wijzigen, inclusief datum, handeling en notitie; de planning opnieuw berekenen na opslaan.

## 6. Verzorgingskalender en herinneringen

- [x] Seizoensgebonden tips tonen.
- [x] Het actuele seizoen automatisch bepalen op basis van de datum van de computer van de gebruiker.
- [x] Verzorgingstaken kunnen afvinken.
- [x] Afgeronde taken bewaren in de browser.
- [x] Browsertoestemming voor meldingen kunnen controleren. De homepage kan direct een testmelding tonen; dit plant geen toekomstige meldingen.
- [x] Een echte kalenderweergave bouwen. De maandweergave ondersteunt vorige/volgende maand, geselecteerde dagen en verzorgingsmomenten.
- [x] De volgende aardcontrole per plant berekenen op basis van de laatste watergift of aardcontrole; zonder registratie verschijnt een eerste controle vandaag.
- [x] Het volgende voedings- en verpotmoment berekenen wanneer een interval bekend is en de handeling eerder is geregistreerd.
- [ ] Een betrouwbare planning voor snoeien en ontbrekende voedings- en verpotintervallen onderzoeken.
- [x] De volgende taak opnieuw berekenen na een registratie of verwijdering in het logboek; de kalender toont het eerstvolgende moment per handeling.
- [x] Kalenderitems op de hoofdpagina één dag of één week kunnen uitstellen.
- [ ] Echte automatische herinneringen voor toekomstige verzorgingsmomenten toevoegen; de huidige browsertoestemming plant geen meldingen.
- [ ] Onderzoeken hoe herinneringen aan locatie, seizoen en weer kunnen worden aangepast. Het huidige seizoensadvies wisselt alleen op basis van het halfrond.
- [x] Een overzicht tonen van taken voor vandaag en deze week.

## 7. Data en techniek

- [x] De prototypeversie werkt zonder framework of installatie.
- [x] De plantdata is centraal opgebouwd in JavaScript.
- [x] Een backend of plantdata-API kiezen. GBIF wordt gebruikt voor gratis taxonomische naamcontrole; lokale Sproutly-data blijft de bron voor verzorgingsadvies.
- [x] Controleren of de API commercieel gebruikt mag worden. GBIF-gebruik is niet automatisch voor alle onderliggende datasets commercieel toegestaan; datasetlicenties en attributie moeten voor productie per match gecontroleerd blijven worden.
- [ ] De bronvermelding en licentie van iedere plantfoto voor productie controleren. De huidige catalogus gebruikt lokale foto's met bronlinks.
- [x] Supabase instellen voor accounts en gebruikersgegevens; plantinformatie blijft onderdeel van de lokale catalogus.
- [x] De catalogus gebruikt vaste velden voor onder meer naam, categorie, licht, moeilijkheid en foto.
- [ ] Bronnen, licenties en verificatiedatums van verzorgingsinformatie voor de hele catalogus vastleggen en controleren.
- [x] API-fouten duidelijk tonen aan de gebruiker. Bij een GBIF-fout blijft de lokale dataset beschikbaar en verschijnt een foutstatus.
- [x] Alleen de publiceerbare Supabase-sleutel in de frontend gebruiken; geheime en service-role-sleutels blijven buiten de website.
- [x] GBIF-resultaten tijdelijk cachen.
- [ ] Productie-instellingen voor authenticatielimieten, monitoring, externe back-ups en getest herstel controleren.

## 8. Privacy en veiligheid

- [x] Bepalen welke persoonsgegevens nodig zijn. Supabase Auth beheert accountgegevens; de persoonlijke plantstatus wordt in Supabase opgeslagen.
- [x] Alleen noodzakelijke gegevens opslaan; de website bewaart geen wachtwoord in de plantstatus.
- [x] Een privacyverklaring schrijven. Een privacy- en cookie-informatiesectie staat op de pagina; juridisch laten controleren blijft aanbevolen.
- [x] Toestemming vragen voor notificaties. De herinneringsknop vraagt expliciete browsertoestemming voordat een melding wordt gemaakt.
- [x] Toestemming vragen voor browserlocatie. Locatie wordt pas na een expliciete klik opgevraagd en alleen in het huidige bezoek gebruikt.
- [x] Gebruikersdata kunnen exporteren.
- [ ] Een exportbestand veilig kunnen importeren, met validatie en een duidelijk overzicht van wat wordt toegevoegd of vervangen vóór bevestiging.
- [x] Gebruikersdata kunnen verwijderen.
- [x] Supabase Auth gebruiken voor inloggen en Row Level Security toepassen op gebruikersgegevens.
- [x] Wachtwoordherstel via e-mail in de website aanbieden.
- [ ] De Supabase-e-mail- en redirectinstellingen voor wachtwoordherstel inrichten en de volledige herstelstroom met een echt account testen.
- [ ] E-mailbevestiging voor accounts afwegen en instellen; momenteel is bevestiging uitgeschakeld en wordt eigenaarschap van het e-mailadres niet gecontroleerd.
- [x] Basisvalidatie voor formulieren toepassen.
- [ ] Server-side validatie en grenzen voor de Supabase-plantstatus controleren.
- [x] Gebruikersinvoer veilig weergeven met tekstverwerking en HTML-escaping waar nodig.
- [ ] Productielogs controleren op onbedoeld opgeslagen gevoelige gegevens.

## 9. Testen

- [x] JavaScript-syntax controleren.
- [x] Zoeken testen met een bestaande plant. Getest met Basilicum.
- [x] Zoeken testen met een onbekende plant. Getest met een niet-bestaande zoekterm.
- [x] Filters testen in combinatie met zoeken. Getest met Sansevieria + weinig licht.
- [x] Een plant toevoegen en verwijderen testen. Getest met Sansevieria.
- [x] Controleren of opgeslagen planten na vernieuwen blijven staan. Getest via browser-refresh.
- [ ] Kalenderregistratie bevestigen, een logboekregel verwijderen en de herberekende planning testen.
- [ ] Plantpagina en profielbewerking, inclusief meerdere exemplaren, op mobiel en desktop testen.
- [x] Account registreren, server-state bewaren, uitloggen en opnieuw inloggen testen.
- [x] Mobiel scherm testen. Een eerdere zoekflow is getest op mobiel formaat; de huidige plantpagina moet opnieuw worden getest.
- [x] Tablet- en desktopformaten testen. Layout en horizontale overflow zijn gecontroleerd.
- [x] Afbeelding-foutafhandeling testen. De fallback toont een duidelijke tekst wanneer een afbeelding faalt.
- [ ] Testen in Chrome, Edge, Firefox en Safari.
- [ ] Toegankelijkheid testen met toetsenbord en schermlezer.
- [x] Kaartafbeeldingen gebruiken lazy loading en asynchrone decoding; de hero-afbeelding krijgt hoge laadprioriteit.

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
