# Sproutly backend lokaal starten

## Vereisten

- Node.js 18 of nieuwer.
- Geen extra npm-packages nodig.

## Starten

Open PowerShell in de projectmap en voer uit:

```powershell
node .\server.js
```

Open de app daarna via de Node-server:

```text
http://localhost:3000
```

Open `index.html` niet rechtstreeks via `file://` en gebruik voor accountfuncties niet een aparte statische previewserver. Aanmelden, inloggen en accountsynchronisatie gebruiken de API van deze Node-server.

De backend maakt bij de eerste start automatisch `data/sproutly.json` aan. Dit bestand bevat accounts, sessies en server-side Sproutly-status.

## API-routes

| Methode | Route | Doel |
|---|---|---|
| `GET` | `/api/health` | Controleert of de backend draait |
| `POST` | `/api/auth/register` | Maakt een account |
| `POST` | `/api/auth/login` | Logt een gebruiker in |
| `POST` | `/api/auth/logout` | Beëindigt de sessie |
| `GET` | `/api/auth/me` | Geeft de huidige gebruiker terug |
| `GET` | `/api/me/state` | Leest de Sproutly-status |
| `PUT` | `/api/me/state` | Slaat de Sproutly-status op |
| `GET` | `/api/me/export` | Exporteert account en Sproutly-status als JSON |
| `DELETE` | `/api/me` | Verwijdert het account, de sessies en de serverstatus |

## Prototype-opmerkingen

- De backend gebruikt bewust alleen ingebouwde Node-modules.
- Wachtwoorden worden met `scrypt` en een unieke salt gehasht.
- Sessies worden via een HttpOnly-cookie beheerd.
- Mislukte authenticatiepogingen worden per clientadres tijdelijk beperkt.
- GBIF-resultaten worden in de browser tijdelijk gecachet om herhaalde aanvragen te beperken.
- Gebruikers kunnen hun servergegevens exporteren en verwijderen vanuit het accountvenster.
- GBIF is niet zonder meer vrij voor elk commercieel gebruik: onderliggende datasetlicenties kunnen CC BY-NC zijn. Voor productie moeten datasetlicenties en verplichte attributie per gebruikte match worden gecontroleerd. Zie [GBIF Terms of Use](https://www.gbif.org/terms) en [Data User Agreement](https://www.gbif.org/terms/data-user).
- Zonder backend of account blijft de frontend werken met lokale browseropslag.
- De JSON-opslag is geschikt voor lokaal ontwikkelen, niet voor productie.
- Voor iedere schrijfactie wordt de vorige JSON-versie als `data/sproutly.json.bak` bewaard. Herstel kan lokaal door de backup terug te plaatsen terwijl de server gestopt is.
- Voor productie moet de JSON-opslag worden vervangen door een echte database met back-ups, toegangsbeheer, HTTPS, monitoring en een formeel privacybeleid.
- Zie [docs/productie-checklist.md](./productie-checklist.md) voor de resterende infrastructuur-, privacy- en releasecontroles.
