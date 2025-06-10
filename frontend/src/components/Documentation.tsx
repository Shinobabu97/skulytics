import React from 'react'

const Documentation = () => {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dokumentation & KI-Einsatz</h1>

        {/* Technischer Lösungsweg */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-8">Kurze Beschreibung deines technischen Lösungswegs</h2>
        <p className="mb-6 text-sm text-gray-700">
          Die Anwendung wurde als moderne Web-App mit React (Frontend) und FastAPI (Backend) entwickelt. Die Datenverarbeitung und -validierung erfolgt mit Pandas und NumPy. Die Benutzeroberfläche ist responsiv und nutzt Tailwind CSS für ein klares, modernes Design. Die Visualisierung der Verkaufsdaten und Prognosen erfolgt mit Recharts. Die Entwicklung erfolgte iterativ mit kontinuierlichem Debugging und visuellen Verbesserungen direkt im Editor.
        </p>

        {/* KI-Methoden und Tools */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-8">Welche KI-Methoden oder Tools hast du verwendet?</h2>
        <p className="mb-6 text-sm text-gray-700">
          Für die initiale Konzeption wurde v0 genutzt, um ein Grunddesign zu entwerfen. Das Product Requirements Document (PRD) wurde mit ChatGPT erstellt und verfeinert. Die eigentliche Entwicklung und das Debugging erfolgten mit Cursor, wodurch die App iterativ verbessert, visuelle Elemente angepasst und die Funktionalität erweitert wurden. Für die Prognose wurde eine einfache Heuristik (+50% Wachstum) implementiert. Versionierung und Zusammenarbeit erfolgten über GitHub, das Deployment auf Vercel.
        </p>

        {/* Stärken und Schwächen */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-8">Was hat gut funktioniert, wo siehst du Schwächen?</h2>
        <ul className="mb-6 text-sm text-gray-700 list-disc list-inside">
          <li><b>Stärken:</b> Schnelle Entwicklung durch KI-gestützte Tools, moderne UI, flexible Filtermöglichkeiten, einfache Prognosefunktion, gute Dokumentation und Versionierung.</li>
          <li><b>Schwächen:</b> Prognose basiert nur auf einer einfachen Heuristik, keine komplexen KI-Modelle, keine Benutzerverwaltung, keine persistente Speicherung der Daten.</li>
        </ul>

        {/* Einzigartige Zusammenfassung */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2 mt-8">Projektzusammenfassung</h2>
        <p className="mb-6 text-sm text-gray-700">
          Dieses Projekt entstand durch die enge Verzahnung von KI-gestützter Planung, iterativer Entwicklung und direktem User-Feedback. Die Anforderungen wurden mit Hilfe von ChatGPT und v0 präzisiert, die technische Umsetzung erfolgte mit Cursor, wodurch ein schneller Wechsel zwischen Code, Debugging und UI-Optimierung möglich war. Die App bietet eine moderne, deutschsprachige Oberfläche, flexible Filter und eine einfache, nachvollziehbare Prognose. Die Nutzung von GitHub und Vercel ermöglichte eine effiziente Versionierung und Bereitstellung. Die größte Stärke des Projekts liegt in der schnellen, zielgerichteten Entwicklung und der engen Integration von KI-Tools in den gesamten Workflow.
        </p>
      </div>
    </div>
  )
}

export default Documentation 
