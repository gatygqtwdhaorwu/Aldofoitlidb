# aldo footlocker — carrello + Stripe + tracking

## Avvio
1. Installa Node.js 18+ (in Termux: `pkg install nodejs -y`).
2. Nella cartella del progetto esegui:
   `npm install`
3. È già presente un `.env` con la Publishable Key live di Stripe è già configurata. Per i pagamenti live, la Secret Key deve restare privata e va configurata solo nel server/environment.
4. Avvia:
   `npm start`
5. Apri `http://127.0.0.1:3000`.

## Stripe
Il checkout usa Stripe Checkout. La chiave segreta resta SOLO sul server.
Per i pagamenti reali usa le chiavi live di Stripe e configura il webhook `POST /api/webhook` con il signing secret.

**Sicurezza:** la Secret Key live non va mai pubblicata su GitHub, HTML, JavaScript client-side o condivisa. Se una Secret Key è stata condivisa, revocala/ruotala e sostituiscila nel `.env`.

## Tracking
Dopo il pagamento viene creato un ID tipo `ALD-20260905-ABC123`.
Il cliente può inserirlo in `tracking.html`. Gli stati supportati sono:
`pending`, `paid`, `processing`, `shipped`, `delivered`.

L'aggiornamento di `processing/shipped/delivered` va collegato al tuo gestionale/admin quando avrai un backend operativo.

## Nota importante
La chiave publishable live è configurata nel file `.env`. La Secret Key live è usata solo dal server e deve restare privata. Il checkout Stripe di questo progetto usa il server, quindi senza `STRIPE_SECRET_KEY` il pulsante di pagamento mostrerà un errore di configurazione.

Per avvio locale in Termux:
```bash
cd ~/storage/downloads/aldo-footlocker
npm install
npm start
```
Poi apri `http://127.0.0.1:3000`.
