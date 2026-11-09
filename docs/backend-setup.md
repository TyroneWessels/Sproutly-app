# Sproutly lokaal starten en accounts instellen

## Accounts op GitHub Pages

De website gebruikt Supabase Auth en de tabel `public.sproutly_user_data` voor accounts en plantgegevens. Voer [setup.sql](../supabase/setup.sql) uit in de SQL Editor van het eigen Supabase-project. De tabel gebruikt Row Level Security en de SQL staat ingelogde gebruikers alleen toe hun eigen gegevens te beheren. De browser gebruikt uitsluitend de publiceerbare sleutel; voeg nooit een geheime sleutel of service-role-sleutel toe aan de website.

Bij het maken van een account worden de planten en verzorgingsgegevens uit de huidige browser naar dat nieuwe account gekopieerd. Bestaande lokale Node-accounts worden niet automatisch overgezet. Supabase moet bij **Authentication → Sign In / Providers → Email** zijn ingesteld op de gewenste e-mailbevestiging. Zonder e-mailbevestiging wordt niet gecontroleerd of de gebruiker het opgegeven adres bezit.

Het Supabase-pakket wordt lokaal gebundeld zodat GitHub Pages geen npm-installatie nodig heeft. Na een wijziging aan de SDK: `npm install` en `npm run build:supabase`. Controleer daarnaast de Supabase-instellingen voor toegestane website-URL's, back-ups en productiegebruik.

## Lokale Node-server

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

De website gebruikt Supabase voor accounts, ook wanneer de bestanden via deze lokale server of GitHub Pages worden geopend. De server hieronder biedt daarnaast de oudere lokale account-API; die accounts staan los van Supabase.

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
- Zonder account bewaart de website planten en verzorgingsgegevens in de browser. Als een bestaande accountsessie niet kan worden gecontroleerd, wordt bewerken geblokkeerd totdat de verbinding is hersteld, om te voorkomen dat accountgegevens worden overschreven.
- De JSON-opslag is geschikt voor lokaal ontwikkelen, niet voor productie.
- Voor iedere schrijfactie wordt de vorige JSON-versie als `data/sproutly.json.bak` bewaard. Herstel kan lokaal door de backup terug te plaatsen terwijl de server gestopt is.
- Voor productie moet de JSON-opslag worden vervangen door een echte database met back-ups, toegangsbeheer, HTTPS, monitoring en een formeel privacybeleid.
- Zie [docs/productie-checklist.md](./productie-checklist.md) voor de resterende infrastructuur-, privacy- en releasecontroles.
