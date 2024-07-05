interface CategoriesType {
  [key: string]: string[];
}

const categories: CategoriesType = {
  Personendaten: [
    "Anbieterwechselauftrag von",
    "Alten Vertrag Kuendigen",
    "Kndigen von",
    "Rufnummern Mitnahme",
  ],
  Rufnummern: [
    "Rufnummern Mitnahme alle Nr der Anschluesse portieren",
    "Telekommonikations Anlagen Duchwahl-RN",
    "Ort Datum",
    "Vertragspartner und ggf Firmenstempel",
  ],
  Endkundenvertragspartner: [
    "WBCIGF",
    "Vorab-ID",
    "Änderungs-Storno-ID",
    "PKlauf",
    "Wechseltermin",
    "Neuer Wechseltermin",
    "Portierungsfenster 6 - 8 Uhr",
    "Portierungsfenster 6 - 12 Uhr",
    "Portierungsfenster Wunschuhrzeit",
    "Portierungsfenster Wunschuhrzeit eingeben",
    "Rückinformation an",
    "über FaxEMail",
    "Tel",
    "Ressourcenübernahme ja",
    "Sicherer Hafen",
    "Storno ausgeführt ja",
    "Storno ausgeführt nein",
  ],
};

export { categories };
