# Functioneel ontwerp — Sproutly

**Versie:** 1.0  
**Status:** Concept  
**Taal:** Nederlands  
**Product:** Sproutly — planten verzorgen wordt makkelijk

## 1. Inleiding

Sproutly is een webapplicatie voor mensen die hun planten beter willen leren kennen en verzorgen. Een gebruiker kan planten opzoeken, verzorgingsinformatie lezen, planten bewaren in een persoonlijke collectie en herinneringen bijhouden.

De website moet deskundig aanvoelen zonder ingewikkeld te worden. De toon is vriendelijk, rustig en motiverend. De interface gebruikt natuurtinten, echte plantenfoto’s en korte uitleg.

## 2. Doel van het product

Sproutly helpt gebruikers om:

- snel betrouwbare basisinformatie over een plant te vinden;
- te begrijpen wanneer en hoe een plant water, licht, voeding of een nieuwe pot nodig heeft;
- hun eigen planten overzichtelijk te bewaren;
- verzorgingstaken niet te vergeten;
- meer vertrouwen te krijgen in het verzorgen van planten.

## 3. Doelgroep

### Primaire doelgroep

Beginnende plantenliefhebbers die meerdere planten hebben, maar niet altijd weten wat iedere plant nodig heeft. De interface houdt ook rekening met oudere en minder digitaal vaardige gebruikers.

### Belangrijkste gebruikssituatie

De belangrijkste gebruikssituatie is: een beginnende plantenliefhebber zoekt een onbekende plant op en wil binnen enkele seconden begrijpen wat de belangrijkste verzorgingsactie is.

De gebruiker zoekt bijvoorbeeld op “Monstera”, opent de plantpagina en krijgt informatie over licht, water en het controleren van de aarde. Deze gebruikssituatie bepaalt de prioriteit van de homepage, zoekfunctie en plantdetails.

### Secundaire doelgroep

Ervaren thuiskwekers die een eenvoudig overzicht willen van hun planten en verzorgingsmomenten.

### Gebruikerskenmerken

- Gebruikt de website vooral op mobiel.
- Zoekt meestal op de Nederlandse naam van een plant.
- Wil snel antwoord in plaats van lange artikelen.
- Heeft behoefte aan concrete acties.
- Kan verschillende niveaus van tuinierervaring hebben.

### Productkeuzes voor versie 1

- Sproutly ondersteunt zowel kamerplanten als tuinplanten.
- De eerste adviezen zijn gericht op gebruikers in Nederland en België met een gematigd zeeklimaat.
- De productnaam is Sproutly.
- De bestaande rustige, speelse natuurstijl met groene, crème- en perziktinten blijft de visuele basis.
- Locatiegebaseerde seizoensadviezen zijn toegevoegd via de browserlocatie; coördinaten worden niet opgeslagen.
- De lokale Sproutly-dataset blijft de bron voor Nederlandse verzorgingsadviezen.
- GBIF wordt als gratis read-only bron gebruikt voor taxonomische naamcontrole en aanvullende plantmatches; GBIF vervangt de lokale verzorgingsinformatie niet.
- Een ingelogde gebruiker bewaart collectie- en verzorgingsdata server-side; lokale opslag blijft beschikbaar als anonieme prototypefallback.

## 4. Scope

### Binnen de scope van versie 1

- Planten zoeken.
- Planten filteren.
- Plantinformatie bekijken.
- Planten opslaan in Mijn planten.
- Planten uit Mijn planten verwijderen.
- Basisverzorgingstaken bekijken en afvinken.
- Eenvoudige lokale opslag in de browser.
- Een account aanmaken en op meerdere apparaten dezelfde collectie synchroniseren.
- Accountgegevens en Sproutly-status exporteren of verwijderen.
- Responsive weergave op mobiel, tablet en desktop.

### Buiten de scope van versie 1

- Automatische plantdiagnose met fotoherkenning.
- Een uitgebreide community.
- Een webshop.
- Live chat met experts.
- Volledige weersvoorspellingen.
- Meerdere gebruikers op één account.
- Volledig gepersonaliseerde adviezen op basis van sensordata.

## 5. Navigatiestructuur

De website bestaat uit de volgende hoofdonderdelen:

1. **Ontdek**
   - Introductie en zoekbalk.
   - Seizoensadviezen.
   - Populaire planten.
2. **Alle planten**
   - Volledige catalogus van de lokale Sproutly-dataset.
   - Zoeken op naam, alias, wetenschappelijke naam, categorie, type en lichtbehoefte.
   - Filteren op binnen/buiten, licht en moeilijkheid.
   - Sorteren op relevantie, naam en moeilijkheid.
   - Planten direct toevoegen aan Mijn planten.
3. **Mijn planten**
   - Persoonlijke plantenlijst.
   - Eigen naam, locatie en toegang tot de plantpagina.
4. **Verzorgingskalender**
   - Het eerstvolgende verzorgingsmoment per plant en handeling.
   - Registreren van uitgevoerde handelingen.
5. **Plantdetails**
   - Verzorgingsinformatie voor één plant.
   - Plant opslaan in de collectie.

## 6. Functionele eisen

### 6.1 Zoeken

**Doel:** de gebruiker vindt een plant op basis van een zoekterm.

**Proces:**

1. De gebruiker opent de homepage.
2. De gebruiker vult een plantnaam in.
3. De gebruiker klikt op **Zoeken** of drukt op Enter.
4. Sproutly zoekt in de beschikbare plantdata.
5. De resultaten verschijnen onder Populaire planten.

**Zoekvelden:**

- Nederlandse naam.
- Wetenschappelijke naam.
- Categorie.
- Planttype.
- Lichtbehoefte.
- Moeilijkheidsgraad.

**Regels:**

- Hoofdletters mogen geen verschil maken.
- Gedeeltelijke zoektermen moeten resultaten kunnen geven.
- Bij nul resultaten verschijnt een duidelijke melding.
- De zoekopdracht blijft zichtbaar in het zoekveld.

Na een zoekopdracht controleert Sproutly de zoekterm via de openbare GBIF Species API. Tijdens deze controle toont de zoekbalk een laadstatus. Bij een succesvolle controle toont de website hoeveel taxonomische matches GBIF heeft gevonden. De lokale zoekresultaten blijven leidend voor plantkaarten en verzorgingsdetails.

Wanneer GBIF niet bereikbaar is of een fout teruggeeft:

- blijft de lokale zoekfunctie werken;
- blijft de lokale plantinformatie beschikbaar;
- verschijnt een duidelijke foutmelding naast de zoekbalk.

De gebruikte read-only route is `https://api.gbif.org/v1/species/search` met `highertaxon_key=6` voor Plantae en een limiet van vijf matches.

### 6.2 Filteren

De gebruiker kan resultaten filteren op:

- Alle planten.
- Binnenplanten.
- Buitenplanten.

Een filter kan gecombineerd worden met een zoekopdracht. Het actieve filter is visueel herkenbaar.

Resultaten kunnen worden gesorteerd op relevantie, naam of moeilijkheidsgraad. Nederlandse alternatieve namen en veelgebruikte Engelse namen worden meegenomen in de zoekopdracht.

### 6.3 Plantkaart

Elke plantkaart bevat:

- Een echte plantenfoto.
- Plantnaam.
- Wetenschappelijke naam.
- Categorie.
- Knop om de plant op te slaan.
- Een duidelijke fallback wanneer de foto niet beschikbaar is.

Klikken op de foto of kaart opent de plantdetails.

### 6.4 Plantdetails

De aparte plantpagina toont een foto met bronlink, categorie, Nederlandse en wetenschappelijke naam, beschrijving, lichtbehoefte, interval voor aardcontrole, moeilijkheid en wateradvies. De gebruiker kan een exemplaar toevoegen en bij meerdere exemplaren via een keuzelijst de gewenste plant openen.

Voor een opgeslagen exemplaar bevat de pagina een persoonlijk profiel en verzorgingslogboek. Na opslaan verschijnt een overzicht; via **Plantgegevens bewerken** kan de gebruiker de opgeslagen gegevens opnieuw aanpassen.

Uitgebreide verzorgingsinformatie en controleerbare bronnen met verificatiedatum voor alle plantpagina's blijven openstaande werkzaamheden.

### 6.5 Mijn planten

Mijn planten toont alle planten die de gebruiker heeft opgeslagen.

Per opgeslagen plant wordt getoond:

- Foto.
- Naam.
- Wetenschappelijke naam.
- Eigen naam en locatie, indien ingevuld.

Via de plantdetails kan de gebruiker de opgeslagen plant personaliseren met:

- Een eigen naam.
- Een eigen foto.
- Plant- of aankoopdatum.
- Locatie.
- Persoonlijke notities.
- Favorietstatus.

Zonder account worden deze gegevens in de browser opgeslagen. Na inloggen worden ze server-side opgeslagen en bij een nieuw bezoek opnieuw geladen.

De gebruiker kan meerdere exemplaren van dezelfde soort toevoegen. Via **Verwijderen** in Mijn planten wordt na bevestiging één exemplaar met profiel en logboek verwijderd. Het aantal planten wordt automatisch bijgewerkt.

Zonder account gebruikt de website `localStorage`. Een ingelogde gebruiker gebruikt Supabase als bron van waarheid; de lokale browsergegevens blijven daarvan gescheiden.

Wanneer de collectie leeg is, toont Sproutly een korte uitleg en een knop om planten te bekijken.

Met **Alleen mijn favorieten tonen** kan de gebruiker de collectie filteren op exemplaren die in hun profiel als favoriet zijn gemarkeerd. Als er geen favorieten zijn, verschijnt uitleg en een knop om alle planten weer te tonen.

### 6.6 Verzorgingstaken

De homepage toont seizoensgebonden taken, bijvoorbeeld:

- Zoek meer licht.
- Begin met zaaien.
- Ververs de aarde.

Een gebruiker kan een seizoenssuggestie afvinken en opnieuw openen. Verzorgingsmomenten voor individuele planten worden afzonderlijk in het logboek geregistreerd.

De status van taken blijft zonder account bewaard in `localStorage`. Voor ingelogde gebruikers wordt de status server-side opgeslagen.

### 6.7 Herinnering

De homepage kan via de browser Notification API toestemming vragen en direct een testmelding tonen. De kalenderpagina controleert de toestemming. Bij weigering of een niet-ondersteunde browser volgt een tekstuele melding. Er worden geen automatische achtergrondmeldingen voor toekomstige datums gepland.

### 6.8 Verzorgingsoverzicht

Onder de collectie staat een compact overzicht met:

- De huidige datum.
- Openstaande verzorgingstaken voor vandaag.
- Een weekweergave met de dagen van maandag tot en met zondag.
- Een rustige status wanneer er vandaag geen dringende taak is.

De taken volgen het logboek en de opgeslagen exemplaren. Na bevestiging registreert afvinken de bijbehorende handeling op vandaag; de volgende datum wordt opnieuw berekend. Dit wordt lokaal of bij het account bewaard.

### 6.9 Seizoensbepaling

Sproutly bepaalt het actuele meteorologische seizoen automatisch met de datum van de computer van de gebruiker. Voor het eerste doelgebied, Nederland en België, gelden de volgende indelingen:

- Winter: december, januari en februari.
- Lente: maart, april en mei.
- Zomer: juni, juli en augustus.
- Herfst: september, oktober en november.

De seizoensnaam en de drie aanbevolen taken op de homepage worden aangepast aan het gevonden seizoen. De gebruiker hoeft geen seizoen handmatig in te stellen.

### 6.10 Locatie en klimaat

De gebruiker kan via **Gebruik mijn locatie** toestemming geven voor de browser Geolocation API. Sproutly gebruikt de latitude alleen om het halfrond te bepalen:

- Noordelijk halfrond: de standaard seizoensindeling voor Nederland en België.
- Zuidelijk halfrond: de seizoensadviezen worden omgedraaid.

De locatie wordt niet opgeslagen in `localStorage` en wordt alleen tijdens het huidige bezoek gebruikt. Wanneer de gebruiker geen toestemming geeft, de browserlocatie niet ondersteunt of de aanvraag mislukt, blijft de standaardindeling voor het noordelijk halfrond actief en krijgt de gebruiker een duidelijke statusmelding.

### 6.11 Maandkalender

De verzorgingskalender bevat naast het weekoverzicht een maandweergave met:

- Maandag tot en met zondag als kolommen.
- Navigatie naar de vorige en volgende maand.
- Een visuele markering voor vandaag.
- Een markering op dagen met verzorgingsmomenten.
- Een detailpaneel voor de geselecteerde dag.
- Een knop om een handeling na bevestiging op vandaag in het logboek vast te leggen.

De maandkalender toont het eerstvolgende moment per plant en handeling, geen volledige reeks vooruit. Een foutieve registratie kan via het logboek worden bewerkt of verwijderd; de planning wordt daarna opnieuw berekend.

### 6.12 Automatische verzorgingsplanning

De website berekent het eerstvolgende verzorgingsmoment per exemplaar vanaf de laatste toepasselijke logboekdatum. Aarde controleren en water geven plannen de volgende aardcontrole. De eerste standaardintervallen voor voorbeelden zijn:

| Planttype/voorbeeld | Aardcontrole | Voeding | Verpotten |
|---|---:|---:|---:|
| Monstera | 7 dagen | 28 dagen | 365 dagen |
| Basilicum | 3 dagen | 14 dagen | 180 dagen |
| Lavendel | 10 dagen | 90 dagen | 365 dagen |
| Sansevieria en Aloë vera | 21 dagen | 60 dagen | 730 dagen |
| Tomaat | 3 dagen | 7 dagen | 180 dagen |
| Rozemarijn | 10 dagen | 90 dagen | 365 dagen |
| Pannenkoekenplant | 7 dagen | 28 dagen | 365 dagen |

De laatst geregistreerde watergift of aardcontrole bepaalt de volgende aardcontrole. Zonder eerdere registratie verschijnt een eerste controle vandaag. Voeding en verpotten worden alleen gepland voor soorten met een bekend interval en na een eerdere registratie van die handeling. Snoeien wordt niet automatisch gepland. Achterstallige momenten verschijnen vandaag met de oorspronkelijk geplande datum. Het verwijderen van een logboekregel herberekent de planning. Intervallen zijn richtlijnen: controleer altijd eerst de plant en de aarde.

### 6.13 Taken uitstellen

Bij een gepland kalenderitem op de homepage kan de gebruiker kiezen voor **+1 dag** of **+1 week**. De wijziging wordt bij de browsergegevens of het account opgeslagen. De oorspronkelijke standaardinterval blijft ongewijzigd.

### 6.14 Accounts en synchronisatie

De gebruiker kan een account maken met een schermnaam, e-mailadres en wachtwoord. Na registratie of login:

- wordt de Supabase Auth-sessie gebruikt;
- wordt de collectie geladen uit Supabase;
- worden wijzigingen aan planten, profielen, taken en uitstelmomenten naar Supabase gesynchroniseerd;
- kan de gebruiker uitloggen zonder dat de vorige accountdata in de nieuwe sessie zichtbaar blijft.

Gebruikersgegevens staan als JSONB in een Supabase-tabel met Row Level Security. Opslaan vergelijkt de huidige serverstatus met de eerder geladen versie en meldt conflicten in plaats van andere wijzigingen stilzwijgend te overschrijven. Bij een nieuw account worden lokale browsergegevens gekopieerd. De oudere Node-backend en zijn lokale JSON-bestand staan los van de huidige accountfunctie; oude Node-accounts worden niet automatisch overgezet. Productieback-ups en herstel moeten nog worden ingericht en getest. De huidige configuratie vereist geen e-mailbevestiging, zodat eigenaarschap van het e-mailadres niet wordt gecontroleerd.

## 7. Gegevensmodel

### 7.1 Plant

De lokale catalogus bevat onder meer `name`, `scientific`, `aliases`, `category`, `type`, `light`, `difficulty`, `image`, `imageSource` en `soilCheckDays`. Beschrijvingen en wateradvies worden op de plantpagina aangevuld. De foto is lokaal gebundeld en `imageSource` verwijst naar de bronpagina. Een volledig gecontroleerde verzorgingsbron en verificatiedatum voor elke soort zijn nog niet beschikbaar.

### 7.2 Opgeslagen plant

`savedPlants` is een lijst van exemplaar-ID's. Oudere opgeslagen planten kunnen de soortnaam als ID gebruiken. `plantProfiles` bevat per ID het profiel met onder meer `species`, `customName`, `location`, `date`, `notes`, `favorite`, `photo` en `careLog`. Een eigen foto wordt als data-URL in het profiel opgeslagen; het gekozen bestand mag maximaal 500 KB zijn.

### 7.3 Verzorgingstaak

Een logboekregel bevat een ID, datum, handeling en notitie. Verzorgingsmomenten worden daaruit berekend en niet als vaste volgende datums in het profiel bewaard. `completedTasks` bevat afgeronde taken en `careOverrides` bevat uitstelmomenten.

### 7.4 Account en serverstatus

Supabase Auth beheert het account en de sessie. De tabel `sproutly_user_data` koppelt een gebruikers-ID aan een JSONB-status met `savedPlants`, `plantProfiles`, `completedTasks` en `careOverrides`. De plantstatus bevat geen wachtwoord.

## 8. Niet-functionele eisen

### Gebruiksvriendelijkheid

- Een gebruiker moet binnen enkele seconden een plant kunnen zoeken.
- De belangrijkste actie per scherm moet duidelijk zichtbaar zijn.
- Teksten moeten kort en begrijpelijk zijn.
- De website moet niet afhankelijk zijn van technische kennis.

### Responsive ontwerp

- De website werkt op schermen vanaf ongeveer 320 pixels breed.
- Kaarten herschikken zich automatisch op kleinere schermen.
- Tekst blijft leesbaar zonder horizontaal scrollen.
- Knoppen zijn groot genoeg voor aanraking op mobiel.

### Toegankelijkheid

- Alle afbeeldingen hebben een zinvolle alternatieve tekst.
- Interactieve onderdelen zijn met het toetsenbord bereikbaar.
- De pagina bevat een skip-link en modals houden de toetsenbordfocus binnen de dialoog.
- Focus is visueel zichtbaar.
- Kleur is niet de enige manier om status aan te geven.
- Tekst en achtergrond hebben voldoende contrast.
- Modals hebben een correcte dialoogrol en sluitmogelijkheid.

### Prestaties

- Kaartafbeeldingen gebruiken lazy loading en asynchrone decoding; de hero-afbeelding krijgt hoge laadprioriteit.
- De eerste pagina moet snel zichtbaar zijn.
- API-aanvragen krijgen een laadstatus.
- Fouten bij externe data worden duidelijk gemeld.

### Privacy en veiligheid

- Alleen noodzakelijke gebruikersdata wordt opgeslagen.
- Gegevens kunnen later worden verwijderd.
- Alleen de publiceerbare Supabase-sleutel mag in de publieke frontend staan; geheime sleutels en de service-role-sleutel niet.
- Gebruikersinvoer wordt gevalideerd en veilig weergegeven.

## 9. Belangrijkste gebruikersscenario’s

### Scenario A — Een plant opzoeken

Jamie wil weten hoe een Monstera verzorgd moet worden.

1. Jamie opent Sproutly.
2. Jamie typt “Monstera” in de zoekbalk.
3. Jamie klikt op de Monstera-kaart.
4. Sproutly toont licht- en waterinformatie.
5. Jamie leest wanneer de aarde opnieuw gecontroleerd kan worden.

### Scenario B — Een plant bewaren

Jamie heeft een Basilicumplant en wil deze onthouden.

1. Jamie zoekt op Basilicum.
2. Jamie voegt een exemplaar toe.
3. Sproutly toont een bevestiging.
4. Basilicum verschijnt in Mijn planten.
5. De keuze blijft staan na het vernieuwen van de pagina.

### Scenario C — Een taak afronden

Jamie wil een verzorgingshandeling vastleggen.

1. Jamie opent de verzorgingskalender.
2. Jamie kiest een gepland verzorgingsmoment en bevestigt dat de handeling vandaag is uitgevoerd.
3. Sproutly registreert de handeling in het logboek.
4. De volgende datum wordt op basis van de registratie berekend.
5. Bij een vergissing kan Jamie de logboekregel verwijderen, waarna de planning opnieuw wordt berekend.

## 10. Acceptatiecriteria

De eerste versie voldoet wanneer:

- de website volledig Nederlandstalig is;
- een gebruiker op naam kan zoeken;
- filters zichtbaar en werkend zijn;
- plantdetails op een afzonderlijke pagina bekeken kunnen worden;
- een plant toegevoegd en verwijderd kan worden;
- opgeslagen planten na een refresh behouden blijven;
- verzorgingshandelingen geregistreerd kunnen worden en een foutieve logboekregel kan worden verwijderd;
- de website bruikbaar is op mobiel en desktop;
- er geen JavaScript-syntaxfouten of kapotte primaire interacties zijn.

## 11. Toekomstige uitbreidingen

De onderstaande voorstellen zijn **nog niet gerealiseerd**:

1. **Verwijderde plant herstellen:** bied ongedaan maken of een tijdelijke prullenbak. Herstel het specifieke exemplaar met profiel, foto, logboek en bijbehorende planning; communiceer een eventuele bewaartermijn en vraag waar nodig bevestiging.
2. **JSON-export terugzetten:** valideer het gekozen bestand en toon vooraf welke gegevens worden toegevoegd of vervangen. Vraag expliciete bevestiging en overschrijf geen gegevens stilzwijgend; geef fouten begrijpelijk weer.

De optionele rondleiding start op de homepage en bezoekt de pagina's voor zoeken, een voorbeeldplant, Mijn planten en de verzorgingskalender. De gebruiker opent deze zelf, kan tussen de stappen terug- en vooruitgaan, de rondleiding op elke pagina sluiten en later opnieuw openen. De voorbeeldplant wordt niet automatisch toegevoegd.

**Wachtwoordherstel:** de website biedt een herstelverzoek via e-mail en een formulier voor een nieuw wachtwoord. De toegestane Supabase-redirects en e-mailinstellingen moeten nog worden ingericht en de volledige stroom moet met een echt account worden getest.

Eerder vastgelegde openstaande punten blijven onder meer automatische geplande herinneringen, gebruikerstesten met oudere en minder digitaal vaardige gebruikers, schermlezertesten en geteste productieback-ups. Een browsertestmelding is geen automatische herinnering.

Andere mogelijke uitbreidingen:

- Locatiegebaseerde plantkalender met klimaat- en weersinvloeden.
- Weerswaarschuwingen en vorstmeldingen.
- Plantproblemen herkennen met een foto.
- Groeifoto’s en tijdlijn per plant.
- Community met ervaringen en tips.
- Koppeling met aanvullende plantdata-API’s.
- Agenda-integratie.
- Spraakgestuurd zoeken.
- Meertaligheid naast Nederlands.

## Wijzigingslog

De onderstaande vermeldingen zijn historisch en beschrijven beslissingen en prototypes op dat moment. Voor de huidige werking en openstaande voorstellen gelden de secties hierboven.

### 5 november 2026

- De primaire doelgroep voor versie 1 definitief vastgesteld als beginnende plantenliefhebbers.
- De belangrijkste gebruikssituatie vastgesteld als het opzoeken van een onbekende plant en het direct begrijpen van de eerstvolgende verzorgingsactie.
- Reden: deze keuze sluit aan op de bestaande homepage, zoekflow en het gebruikersscenario “Een plant opzoeken” en geeft richting aan de prioriteit van verdere ontwikkeling.

### 5 november 2026 — vervolg

- Sproutly voor versie 1 vastgesteld als app voor zowel binnen- als buitenplanten.
- Nederland en België met een gematigd zeeklimaat vastgesteld als eerste doelgroepgebied.
- De naam Sproutly en de bestaande huisstijl als definitieve basis vastgelegd.
- De zoekfunctie uitgebreid met planttype, lichtbehoefte en moeilijkheidsgraad als functionele eis.
- Reden: deze keuzes sluiten aan op de huidige dataset en maken de eerste versie concreet zonder locatie- of accountfunctionaliteit af te wachten.

### 5 november 2026 — plantprofiel

- De opgeslagen plant uitgebreid met een persoonlijk profiel voor eigen naam, foto, datum, locatie, notities en favorietstatus.
- Reden: beginnende gebruikers hebben naast algemene plantinformatie ook behoefte aan een eenvoudige plek voor hun eigen context en observaties. De gegevens blijven lokaal, zodat de accountfunctionaliteit buiten versie 1 blijft.

### 5 november 2026 — verzorgingsoverzicht

- Een compact overzicht voor vandaag en deze week toegevoegd aan de functionele eisen.
- Reden: de bestaande seizoenskaarten geven advies, maar gebruikers hebben ook een plek nodig om hun actuele verzorgingsmomenten terug te vinden.

### 5 november 2026 — zoeken

- Sorteren op relevantie, naam en moeilijkheidsgraad en zoeken op alternatieve plantnamen toegevoegd aan de functionele eisen.
- Reden: gebruikers kennen niet altijd de officiële Nederlandse naam en willen resultaten snel kunnen ordenen.

### 5 november 2026 — seizoen

- Automatische seizoensbepaling op basis van de lokale computerdatum toegevoegd.
- De homepage toont per seizoen een eigen titel en drie passende verzorgingstaken.
- Reden: seizoensadvies moet zonder extra instellingen aansluiten op het moment waarop de gebruiker de website bezoekt.

### 5 november 2026 — dataset

- De lokale prototype-dataset uitgebreid naar acht planten met binnenplanten, buitenplanten, kruiden, groente en vetplanten.
- Reden: de zoek- en filterfuncties moeten met meerdere planttypes getest en gebruikt kunnen worden voordat een externe API wordt gekozen.

### 5 november 2026 — lege collectie

- De lege collectie verduidelijkt met een vaste call-to-action naar de zoekbalk.
- Reden: een lege toestand moet niet alleen uitleg geven, maar de gebruiker direct naar de volgende logische actie leiden.

### 5 november 2026 — GBIF

- GBIF gekozen als gratis taxonomische bron naast de lokale Sproutly-verzorgingsdata.
- Laad-, succes- en foutstatus toegevoegd aan de zoekflow.
- Reden: OpenFarm bleek niet meer bereikbaar en Perenual heeft voor dit prototype een te beperkte gratis daglimiet. GBIF biedt een gratis read-only endpoint zonder API-sleutel voor naamcontrole, terwijl verzorgingsadviezen onder eigen broncontrole blijven.

### 5 november 2026 — locatie

- Browserlocatie toegevoegd als optionele manier om het halfrond en daarmee het seizoen te bepalen.
- Coördinaten worden niet opgeslagen; weigeren of mislukken valt terug op noordelijk-halfrondadvies.
- Reden: locatiegebaseerde seizoensadviezen zijn nuttig, maar mogen niet ongevraagd of met blijvende opslag worden geactiveerd.

### 5 november 2026 — maandkalender

- Een maandkalender met maandnavigatie, dagselectie en afvinkbare verzorgingsmomenten toegevoegd.
- Reden: het bestaande weekoverzicht gaf nog geen datumgebaseerd overzicht. Automatische taakintervallen zijn bewust niet stilzwijgend ingevuld en blijven als aparte taak open.

### 5 november 2026 — automatische planning

- Standaardintervallen voor water geven, bemesten en verpotten toegevoegd.
- Terugkerende gebeurtenissen worden tot één jaar vooruit in de kalender gezet.
- Reden: de kalender moet niet alleen handmatige taken tonen, maar ook een bruikbaar startplan bieden voor de opgeslagen planten. De gebruiker moet deze standaardwaarden later kunnen aanpassen.

### 5 november 2026 — taken uitstellen

- Uitstelknoppen van één dag en één week toegevoegd aan geplande kalenderitems.
- Reden: gebruikers moeten een herinnering kunnen aanpassen aan hun eigen planning zonder de standaard verzorgingsfrequentie te verliezen.

### 5 november 2026 — browsernotificaties

- De herinneringsknop gekoppeld aan de browser Notification API met toestemming, successtatus en fout-/weigeringsterugval.
- Reden: de bestaande knop gaf alleen lokale feedback; gebruikers moeten expliciet kunnen kiezen of Sproutly browsermeldingen mag tonen.

### 5 november 2026 — serveropslag en accounts

- Een dependency-vrije Node-backend toegevoegd met registratie, login, logout, HttpOnly sessies en server-side opslag van Sproutly-status.
- De frontend synchroniseert ingelogde plantgegevens met de server en gebruikt localStorage alleen zonder account.
- Reden: browseropslag is apparaatgebonden en heeft geen synchronisatie of betrouwbare back-up. De JSON-opslag is een ontwikkelstap; een productie-database en back-upstrategie blijven open.

### 5 november 2026 — privacy en productievoorbereiding

- Privacy-informatie, lokale gegevens wissen, account-export en accountverwijdering toegevoegd.
- Concrete bronlinks en Unsplash-licentie-informatie zichtbaar gemaakt in plantdetails.
- GBIF-resultaten worden tijdelijk gecachet en authenticatiepogingen worden beperkt.
- Favicon, Open Graph-basismetadata, dynamische collectie-aantallen en dynamisch jaartal toegevoegd.
- Reden: de belangrijkste gebruikersrechten en basiscontrole op herhaald API-gebruik moeten zichtbaar en uitvoerbaar zijn voordat de prototypeversie verder wordt getest.
