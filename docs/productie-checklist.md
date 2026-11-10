# Growify productiechecklist

Deze checklist beschrijft de stappen die buiten de lokale prototypeomgeving nodig zijn.

## Infrastructuur

- Kies een hostingplatform voor de Node-server.
- Gebruik een echte database in plaats van `data/sproutly.json`.
- Stel een productievariabele voor de poort en omgeving in.
- Zet HTTPS aan en controleer de `Secure`-cookie.
- Stel een eigen domein in en voeg DNS-records toe.
- Configureer externe back-ups en test herstel minstens eenmaal.
- Stel monitoring in voor HTTP-fouten, servercrashes en databasefouten.

## Privacy en data

- Laat de privacytekst juridisch controleren.
- Leg bewaartermijnen vast voor accounts en sessies.
- Controleer de verwijder- en exportprocedure op productiegegevens.
- Controleer GBIF-datasetlicenties en attributie per gebruikte match.
- Controleer de licentie en bronvermelding van iedere plantfoto.

## Testen voor release

- Test in Chrome, Edge, Firefox en Safari.
- Test met toetsenbord en minimaal één schermlezer.
- Test schermbreedtes van 320, 390, 768 en 1440 pixels.
- Controleer zoeken, filters, modal, account, export en verwijderen.
- Test een mislukte afbeeldingsaanvraag en een onbereikbare GBIF-aanvraag.
- Meet Largest Contentful Paint, Cumulative Layout Shift en totale paginagrootte.
- Voer een kleine gebruikerstest uit met beginnende plantenliefhebbers.

## Release

- Voeg een definitieve social-share afbeelding toe.
- Controleer de definitieve productnaam, domeinnaam en favicon.
- Maak een rollbackplan voor code en database.
- Maak een gebruikerssupport- of contactkanaal bekend.
