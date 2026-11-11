# Wijzigingen

## 11 november 2026

- Automatische browsermeldingen voor verzorgingsmomenten toegevoegd op de geplande dag.
- De homepage, Mijn planten en de kalender controleren de planning zolang de pagina open is; toestemming van de gebruiker is vereist.
- Dubbele meldingen voor dezelfde taak op dezelfde datum worden per browser voorkomen.
- De knoppen en uitleg verduidelijken dat meldingen niet aankomen nadat Growify of de browser is gesloten.
- Tests toegevoegd voor meldingen van vandaag, dubbele meldingen, ontbrekende toestemming en uitgestelde taken.
- Een plant na verwijderen binnen 10 seconden met profiel, foto, logboek en planning kunnen herstellen.
- Growify-accountback-ups valideren en na een preview samenvoegen; bestaande profielgegevens blijven leidend.
- Per plant-exemplaar aangepaste intervallen voor aardecontrole, voeding en verpotten instellen.
- Aanvullende verzorgingsinformatie en bron/controledatum zichtbaar maken op plantpagina's waar die gegevens al beschikbaar zijn; ontbrekende bronnen worden expliciet gemeld.
- Tests toegevoegd voor importvalidatie, samenvoegen, custom intervallen, catalogusbronnen en de pagina-integratie.

### Grenzen

Dit is een gratis browseroplossing zonder pushserver. De browser en een Growify-pagina moeten open blijven. Betrouwbare pushmeldingen wanneer de website gesloten is, vragen een aparte service worker en push/backend-configuratie.
