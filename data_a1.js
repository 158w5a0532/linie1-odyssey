/**
 * STAGE A1 CURRICULUM DATASET
 * Sourced directly from Linie 1 (A1).
 */

window.STAGE_A1_DATA = {
  stage: "A1",
  levels: [
    {
      id: "LVL 1.01",
      chapter: "Linie 1 K1",
      title: "Verben und Personalpronomen",
      ruleSummary: "Singularformen im Präsens: ich -e, du -(s)t, er/sie -t, Sie -en. Unregelmäßig: sein (ich bin, du bist, er ist).",
      example: "ich heiße, du kommst, Sie sind",
      questions: [
        {
          sentence: "Guten Tag, ich _____ Peter Schmidt.",
          correct: "heiße",
          options: ["heiße", "heißt", "heißen", "heiß"],
          rule: "1. Person Singular: ich heiße (-e Endung)",
          tag: "conjugation_ich"
        },
        {
          sentence: "Woher _____ du, Marco?",
          correct: "kommst",
          options: ["kommen", "kommst", "kommt", "komme"],
          rule: "2. Person Singular: du kommst (-st Endung)",
          tag: "conjugation_du"
        },
        {
          sentence: "Frau Müller _____ die neue Architektin.",
          correct: "ist",
          options: ["bin", "bist", "ist", "sind"],
          rule: "3. Person Singular von 'sein': sie ist",
          tag: "irregular_sein"
        },
        {
          sentence: "Wie _____ Sie mit Nachnamen?",
          correct: "heißen",
          options: ["heißt", "heiße", "heißen", "heiß"],
          rule: "Höflichkeitsform: Sie heißen (-en Endung)",
          tag: "conjugation_sie_formal"
        },
        {
          sentence: "Herr Weber _____ heute aus Frankfurt.",
          correct: "kommt",
          options: ["komme", "kommt", "kommst", "kommen"],
          rule: "3. Person Singular: er kommt (-t Endung)",
          tag: "conjugation_er"
        },
        {
          sentence: "Ich _____ im IT-Support bei DXC.",
          correct: "arbeite",
          options: ["arbeitest", "arbeitet", "arbeite", "arbeiten"],
          rule: "1. Person Singular: ich arbeite",
          tag: "conjugation_ich"
        },
        {
          sentence: "Du _____ sehr gutes Deutsch!",
          correct: "sprichst",
          options: ["sprecht", "sprichst", "spreche", "sprechen"],
          rule: "Vokalwechsel bei sprechen: du sprichst (e -> i)",
          tag: "conjugation_du"
        },
        {
          sentence: "Wer _____ das Meeting heute?",
          correct: "leitet",
          options: ["leite", "leiten", "leitest", "leitet"],
          rule: "3. Person Singular: er/sie leitet (-et nach t-Stamm)",
          tag: "conjugation_er"
        }
      ]
    },
    {
      id: "LVL 1.02",
      chapter: "Linie 1 K1",
      title: "W-Fragen und Antworten",
      ruleSummary: "W-Fragen: Fragewort steht auf Position 1, das konjugierte Verb auf Position 2 (Woher kommen Sie? - Ich komme aus...).",
      example: "Wie heißen Sie? Wo wohnen Sie?",
      questions: [
        {
          sentence: "_____ wohnen Sie? - In Darmstadt.",
          correct: "Wo",
          options: ["Wo", "Woher", "Wohin", "Was"],
          rule: "Ort / Position erfordert das Fragewort 'Wo'",
          tag: "w_fragen_ort"
        },
        {
          sentence: "_____ kommen Sie? - Aus Italien.",
          correct: "Woher",
          options: ["Wo", "Woher", "Wie", "Wer"],
          rule: "Herkunft erfordert das Fragewort 'Woher'",
          tag: "w_fragen_herkunft"
        },
        {
          sentence: "_____ ist Ihr Name? - Bhavani Nakka.",
          correct: "Wie",
          options: ["Wie", "Was", "Wer", "Wo"],
          rule: "Frage nach dem Namen: 'Wie ist Ihr Name?'",
          tag: "w_fragen_name"
        },
        {
          sentence: "_____ sprechen Sie? - Englisch und Deutsch.",
          correct: "Was",
          options: ["Was", "Wie", "Wer", "Woher"],
          rule: "Frage nach Gegenstand/Sprachen: 'Was sprechen Sie?'",
          tag: "w_fragen_sache"
        },
        {
          sentence: "_____ ist der zuständige Projektleiter?",
          correct: "Wer",
          options: ["Wer", "Wie", "Wo", "Was"],
          rule: "Frage nach Personen erfordert 'Wer'",
          tag: "w_fragen_person"
        }
      ]
    },
    {
      id: "LVL 1.06",
      chapter: "Linie 1 K3",
      title: "Bestimmter und unbestimmter Artikel (Nominativ)",
      ruleSummary: "Nominativ: der / ein (maskulin), das / ein (neutral), die / eine (feminin), die / - (Plural).",
      example: "der Tisch / ein Tisch; die Lampe / eine Lampe",
      questions: [
        {
          sentence: "Hier steht _____ Schreibtisch (m).",
          correct: "ein",
          options: ["ein", "eine", "einen", "einem"],
          rule: "Nominativ maskulin unbestimmt: ein Schreibtisch",
          tag: "nom_maskulin"
        },
        {
          sentence: "Das ist _____ Kaffeemaschine (f) für das Team.",
          correct: "eine",
          options: ["ein", "eine", "einen", "einer"],
          rule: "Nominativ feminin unbestimmt: eine Kaffeemaschine",
          tag: "nom_feminin"
        },
        {
          sentence: "Dort drüben liegt _____ Notebook (n).",
          correct: "das",
          options: ["der", "die", "das", "den"],
          rule: "Nominativ neutral bestimmt: das Notebook",
          tag: "nom_neutral"
        },
        {
          sentence: "_____ neue Bildschirm (m) funktioniert einwandfrei.",
          correct: "Der",
          options: ["Der", "Den", "Das", "Dem"],
          rule: "Nominativ maskulin bestimmt: der Bildschirm",
          tag: "nom_maskulin"
        },
        {
          sentence: "Hier ist _____ Besprechungsraum (m).",
          correct: "der",
          options: ["der", "den", "dem", "das"],
          rule: "Nominativ maskulin: Subjekt des Satzes ist 'der'",
          tag: "nom_maskulin"
        }
      ]
    },
    {
      id: "LVL 1.22",
      chapter: "Linie 1 K6",
      title: "Akkusativ (den, das, die)",
      ruleSummary: "Nur maskuline Artikel ändern sich im Akkusativ: der -> den, ein -> einen, kein -> keinen. Neutral (das) und feminin (die) bleiben unverändert.",
      example: "Ich suche den Schlüssel. Ich brauche einen Kuli.",
      questions: [
        {
          sentence: "Haben Sie _____ neuen Vertrag (m) unterschrieben?",
          correct: "den",
          options: ["der", "den", "dem", "des"],
          rule: "Akkusativ maskulin bestimmt: der Vertrag -> den Vertrag",
          tag: "akk_maskulin"
        },
        {
          sentence: "Ich brauche _____ schnellen Rechner (m) für die Arbeit.",
          correct: "einen",
          options: ["ein", "einen", "einem", "einer"],
          rule: "Akkusativ maskulin unbestimmt: ein -> einen",
          tag: "akk_maskulin"
        },
        {
          sentence: "Wir buchen heute _____ Ticket (n) für die Bahn.",
          correct: "das",
          options: ["der", "die", "das", "den"],
          rule: "Akkusativ neutral bleibt unverändert: das Ticket",
          tag: "akk_neutral"
        },
        {
          sentence: "Er findet _____ Zugangskarte (f) nicht mehr.",
          correct: "die",
          options: ["der", "die", "den", "das"],
          rule: "Akkusativ feminin bleibt unverändert: die Zugangskarte",
          tag: "akk_feminin"
        },
        {
          sentence: "Ich sehe heute _____ freien Termin (m) im Kalender.",
          correct: "keinen",
          options: ["kein", "keinen", "keinem", "keine"],
          rule: "Akkusativ maskulin verneint: kein -> keinen",
          tag: "akk_maskulin"
        },
        {
          sentence: "Haben Sie _____ Schlüssel (m) dabei?",
          correct: "den",
          options: ["der", "den", "dem", "das"],
          rule: "Akkusativ maskulin: Haben + Akkusativ -> den Schlüssel",
          tag: "akk_maskulin"
        },
        {
          sentence: "Er trinkt morgens _____ Kaffee (m).",
          correct: "einen",
          options: ["ein", "einen", "einem", "eine"],
          rule: "Akkusativ maskulin: trinken + Akkusativ -> einen Kaffee",
          tag: "akk_maskulin"
        }
      ]
    },
    {
      id: "LVL 1.48",
      chapter: "Linie 1 K12",
      title: "Präpositionen mit Dativ (Ort)",
      ruleSummary: "Die Präpositionen 'aus, bei, mit, nach, von, zu' fordern IMMER den Dativ: dem (m/n), der (f), den + -n (Pl).",
      example: "zum Bahnhof (zu dem), mit dem Zug, von der Schule",
      questions: [
        {
          sentence: "Er fährt jeden Morgen mit _____ Zug (m) nach Frankfurt.",
          correct: "dem",
          options: ["den", "dem", "der", "das"],
          rule: "Präposition 'mit' erfordert Dativ maskulin: dem Zug",
          tag: "dativ_mit"
        },
        {
          sentence: "Ich bin heute den ganzen Tag bei _____ Kunden (m).",
          correct: "einem",
          options: ["einen", "einem", "eines", "ein"],
          rule: "Präposition 'bei' erfordert Dativ maskulin: einem Kunden",
          tag: "dativ_bei"
        },
        {
          sentence: "Wir gehen nach _____ Besprechung (f) kurz essen.",
          correct: "der",
          options: ["die", "der", "den", "dem"],
          rule: "Präposition 'nach' erfordert Dativ feminin: der Besprechung",
          tag: "dativ_nach"
        },
        {
          sentence: "Wie komme ich am besten zu _____ Bahnhof (m)?",
          correct: "dem",
          options: ["den", "dem", "der", "das"],
          rule: "Präposition 'zu' erfordert Dativ: zu dem (zum) Bahnhof",
          tag: "dativ_zu"
        },
        {
          sentence: "Sie kommt gerade aus _____ Büro (n).",
          correct: "dem",
          options: ["das", "dem", "den", "des"],
          rule: "Präposition 'aus' erfordert Dativ neutral: dem Büro",
          tag: "dativ_aus"
        }
      ]
    }
  ]
};
