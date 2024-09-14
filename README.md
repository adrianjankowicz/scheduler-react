# Scheduler React App

Aplikacja do zarządzania spotkaniami, zbudowana przy użyciu React. Umożliwia użytkownikom dodawanie, edytowanie i usuwanie spotkań. Projekt korzysta z Firebase do autoryzacji oraz Firestore do przechowywania spotkań.

Strona demo aplikacji jest dostępna pod adresem: [https://adrianjankowicz.github.io/scheduler-react/](https://adrianjankowicz.github.io/scheduler-react/)

## Spis treści

- [Funkcjonalności](#funkcjonalności)
- [Instalacja](#instalacja)
- [Uruchamianie projektu](#uruchamianie-projektu)
- [Struktura projektu](#struktura-projektu)
- [Licencja](#licencja)

## Funkcjonalności

- Dodawanie, edytowanie i usuwanie spotkań.
- Widok spotkań w różnych formatach czasowych (dzień, tydzień, miesiąc).
- Integracja z Firebase Authentication.
- Firestore jako baza danych w czasie rzeczywistym.
- Responsywny interfejs dopasowany do różnych urządzeń.

## Instalacja

Przed rozpoczęciem instalacji upewnij się, że masz zainstalowane:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) lub [Yarn](https://yarnpkg.com/)
- Konto Firebase z włączonym Firestore

### Klonowanie repozytorium

```bash
git clone https://github.com/adrianjankowicz/scheduler-react.git
cd scheduler-react
```

### Instalacja zależności
Przy użyciu npm:
```bash
npm install
```

lub przy użyciu Yarn:
```bash
yarn install
```

# Konfiguracja Firebase

1. Przejdź do [Firebase Console](https://console.firebase.google.com/).
2. Utwórz nowy projekt.
3. Włącz Firestore oraz Authentication.
4. Skopiuj dane konfiguracyjne projektu Firebase.
5. Stwórz plik `.env` w katalogu głównym projektu i dodaj następujące zmienne środowiskowe:


```bash
REACT_APP_FIREBASE_API_KEY=twoj-klucz-api
REACT_APP_FIREBASE_AUTH_DOMAIN=twoja-domena-autoryzacji
REACT_APP_FIREBASE_PROJECT_ID=id-twojego-projektu
REACT_APP_FIREBASE_STORAGE_BUCKET=twoj-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=twoj-sender-id
REACT_APP_FIREBASE_APP_ID=id-twojej-aplikacji

```

# Uruchamianie projektu

Aby uruchomić aplikację w trybie deweloperskim, wpisz:
```bash
npm start
```
lub dla Yarn:
```bash
yarn start
```
Aplikacja będzie dostępna pod adresem http://localhost:3000.

# Struktura projektu
```
scheduler-react/
│
├── src/                  # Główny kod źródłowy
│   ├── components/       # Komponenty wielokrotnego użytku (Scheduler, itp.)
│   ├── context/          # Konteksty Reacta (np. dla motywów)
│   ├── firebase/         # Konfiguracja Firebase
│   ├── styles/           # Pliki ze stylami CSS
│   ├── utils/            # Funkcje pomocnicze
│   └── App.js            # Główna część aplikacji React
│
├── public/               # Statyczne zasoby
├── tests/                # Testy jednostkowe i integracyjne
├── .env                  # Zmienne środowiskowe Firebase
├── package.json          # Zależności i skrypty projektu
├── README.md             # Ten plik README
└── .gitignore            # Pliki ignorowane przez Git
```

# Licencja
Projekt jest licencjonowany na zasadach licencji MIT. Więcej informacji znajdziesz w pliku LICENSE.
