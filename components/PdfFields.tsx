"use client";
import { useState } from "react";
import Head from "next/head";
import { categories } from "./categories";

const PdfFields = () => {
  const [fieldData, setFieldData] = useState<{ name: string; type: string }[]>(
    []
  );
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [fileUploadStatus, setFileUploadStatus] = useState(
    "Bitte fügen Sie eine PDF ein"
  );

  const fetchData = async () => {
    try {
      const response = await fetch("/api/file");
      const data = await response.json();
      setFieldData(data.fieldData);
    } catch (error) {
      console.error("Error fetching PDF fields:", error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setFormValues({
      ...formValues,
      [event.target.name]: value,
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setPdfFile(file);
    setFileUploadStatus(
      file ? "PDF bereit zum Hochladen" : "Bitte fügen Sie eine PDF ein"
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/file", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      const data = await response.json();
      console.log("Response from backend:", data);
    } catch (error) {
      console.error("Error sending object to backend:", error);
    }
  };

  const handleFileUpload = async () => {
    if (!pdfFile) {
      setFileUploadStatus("Bitte fügen Sie eine PDF ein");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);

    try {
      const response = await fetch("/api/file", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Response from backend:", data);
      setFileUploadStatus("Datei erfolgreich hochgeladen!");

      fetchData();
    } catch (error) {
      console.error("Error uploading file to backend:", error);
      setFileUploadStatus("Fehler beim Hochladen der Datei");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch("/api/download", {
        method: "GET",
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "new_document.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(categories)[0]
  );

  const handleZuruckClick = () => {
    const categoryKeys = Object.keys(categories);
    const currentIndex = categoryKeys.indexOf(selectedCategory);
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setSelectedCategory(categoryKeys[prevIndex]);
    }
  };

  const handleWeiterClick = () => {
    const categoryKeys = Object.keys(categories);
    const currentIndex = categoryKeys.indexOf(selectedCategory);
    if (currentIndex < categoryKeys.length - 1) {
      const nextIndex = currentIndex + 1;
      setSelectedCategory(categoryKeys[nextIndex]);
    }
  };

  interface DisplayNameMapping {
    [key: string]: string;
  }

  const displayNameMapping: DisplayNameMapping = {
    "Alten Vertrag Kuendigen": "Alten Vertrag kündigen",
    "Kndigen von": "Kündigen von",
    "Rufnummern Mitnahme": "Rufnummer/n mitnehmen",
    NameFirma: "Name/Firma",
    Hausnr: "Hausnr.",
    "Rufnummern Mitnahme alle Nr der Anschluesse portieren":
      "Alle Rufnummern der Anschlüsse mitnehmen",
    "Rufnummern Mitnahme Ortskennzahl": "Ortskennzahl/en",
    "Rufnummern Mitnahme Ortskennzahl 2": " ",
    "Rufnummern Mitnahme Rufnummer 1": "Rufnummer/n",
    "Rufnummern Mitnahme Rufnummer 2": " ",
    "Rufnummern Mitnahme Rufnummer 3": " ",
    "Rufnummern Mitnahme Rufnummer 4": " ",
    "Rufnummern Mitnahme Rufnummer 5": " ",
    "Rufnummern Mitnahme Rufnummer 6": " ",
    "Rufnummern Mitnahme Rufnummer 7": " ",
    "Rufnummern Mitnahme Rufnummer 8": " ",
    "Rufnummern Mitnahme Rufnummer 9": " ",
    "Telekommonikations Anlagen Duchwahl-RN":
      "Telekommunikationsanlage: Durchwahl-Rufnummer",
    "Telekommonikations Anlagen Abfragestelle": "Abfragestelle",
    "Telekommonikations Anlagen Ruffnummernblock von": "Rufnummernblock von",
    "Telekommonikations Anlagen Ruffnummernblock bis": "Rufnummernblock bis",
    "Ort Datum": "Ort, Datum",
    "Vertragspartner und ggf Firmenstempel":
      "Unterschrift: (Vertragspartner und ggf. Firmenstempel)",
    WBCIGF: "WBCI-GF",
    "Änderungs-Storno-ID": "Änderungs-/Storno-ID",
    "Portierungsfenster 6 - 8 Uhr": "Portierungsfenster: 6:00 - 8:00 Uhr",
    "Portierungsfenster 6 - 12 Uhr": "Portierungsfenster: 6:00 - 12:00 Uhr",
    "Portierungsfenster Wunschuhrzeit": "Portierungsfenster: Wunschuhrzeit",
    "Portierungsfenster Wunschuhrzeit eingeben": "",
    "über FaxEMail": "Über Fax/E-Mail",
    Tel: "Tel.",
    "Ressourcenübernahme ja": "Ressourcenübernahme: ja",
    "Ressourcenübernahme nein": "nein",
    "Storno ausgeführt ja": "Storno ausgeführt: ja",
    "Storno ausgeführt nein": "nein",
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/*MAIN DIV*/}
      <div className="h-screen w-screen">
        <h1 className="font-lato text-black-87 text-24px font-bold text-left mt-10 ml-1">
          PDF to Form
        </h1>
        <hr />
        <br />
        <p className="font-lato font-bold text-left mt-10 ml-4 text-center text-grayish">
          {fileUploadStatus}
        </p>
        {/*FILE UPLOAD BUTTONS*/}
        <div className="flex flex-col justify-center">
          <div className="flex justify-center bg-very-light-gray p-4 max-w-xl mx-auto w-full border-2 rounded">
            <input
              type="file"
              accept=".pdf"
              className="font-lato bg-gray-light border-3 border-black-60 text-17px rounded-md p-1 hover:bg-gray-dark hover:border-gray-dark mr-2"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="font-lato bg-gray-light border-3 border-black-60 text-17px rounded-md p-2 hover:bg-gray-dark hover:border-gray-dark"
              onClick={handleFileUpload}
            >
              PDF hochladen
            </button>
          </div>
          {/*NAVBAR*/}
          {fieldData.length > 0 && (
            <div className="flex justify-center p-4 max-w-xl mx-auto w-full border-2 border-t-0 rounded">
              <nav className="flex justify-around w-full">
                {Object.keys(categories).map((category) => (
                  <button
                    key={category}
                    className={`p-2 rounded-md border border-transpartent ${
                      category === selectedCategory
                        ? "bg-black-70 text-white"
                        : "bg-transparent text-gray-dark hover:border-gray-dark hover:text-grayish"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </nav>
            </div>
          )}
          <br />
          {/*START PDF DISPLAY*/}
          <form onSubmit={handleSubmit}>
            {/*MAIN DIV CONTAINER*/}
            {fieldData.length > 0 && (
              <div className="flex justify-center bg-very-light-gray p-4 max-w-7xl w-full border-2 border-t-0 rounded mx-auto">
                {Object.keys(categories).map((category) => (
                  // DIV CONTAINER DIV FOR EACH CATEGORY
                  <div
                    key={category}
                    className={`p-4 m-2 bg-white rounded shadow ${
                      category === selectedCategory ? "block" : "hidden"
                    }`}
                  >
                    {/*DIV CONTAINER FOR THE FORM FIELDS*/}
                    <div className="flex flex-col">
                      {categories[category].map((fieldName) => {
                        const field = fieldData.find(
                          (field) => field.name === fieldName
                        );
                        if (field) {
                          return (
                            // DIV CONTAINER FOR EACH FORM FIELD
                            <div
                              key={fieldName}
                              className="flex w-1/5 p-2 w-full"
                            >
                              {fieldName === "Rufnummern Mitnahme" && (
                                // DIV CONTAINER FOR THE "RUFNUMMERN MITNAHME" FIELD AND ITS SUBFIELDS
                                <div className="flex gap-4">
                                  <div>
                                    {/* DIV FOR LABELS AND CHECKBOXES*/}
                                    <label className="mr-2">
                                      {displayNameMapping[field.name] ||
                                        field.name}
                                    </label>
                                    <input
                                      type="checkbox"
                                      name={field.name}
                                      checked={!!formValues[field.name]}
                                      onChange={handleChange}
                                      className="h-5 w-5 text-black-70"
                                    />
                                  </div>
                                  {[
                                    "NameFirma",
                                    "Vorname",
                                    "Straße",
                                    "Hausnr",
                                    "PLZ",
                                    "Ort",
                                  ].map((name) => {
                                    const innerField = fieldData.find(
                                      (field) => field.name === name
                                    );
                                    if (innerField) {
                                      return (
                                        // DIV CONTAINER FOR EACH TEXT FIELD FROM "RUFNUMMERN MITNAHME"
                                        <div key={name}>
                                          <label className="mr-2">
                                            {displayNameMapping[
                                              innerField.name
                                            ] || innerField.name}
                                          </label>
                                          <input
                                            type="text"
                                            name={innerField.name}
                                            value={
                                              formValues[innerField.name] || ""
                                            }
                                            onChange={handleChange}
                                            className="border-2 border-gray-300 rounded p-1 w-full mr-5"
                                          />
                                        </div>
                                      );
                                    }
                                  })}
                                </div>
                              )}
                              {/* DIV CONTAINER FOR THE "RUFNUMMERN" AND "TELEKOMMUNIKATIONSANLAGE" FIELDS AND ITS SUBFIELDS*/}
                              <div className="flex ">
                                {fieldName ===
                                  "Rufnummern Mitnahme alle Nr der Anschluesse portieren" && (
                                  // DIV CONTAINER FOR THE "RUFNUMMERN" FIELD AND ITS SUBFIELDS
                                  <div className="flex flex-col items-left w-full gap-2">
                                    <div>
                                      {/* DIV FOR LABELS AND CHECKBOXES*/}
                                      <label className="mr-2">
                                        {displayNameMapping[field.name] ||
                                          field.name}
                                      </label>
                                      <input
                                        type="checkbox"
                                        name={field.name}
                                        checked={!!formValues[field.name]}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-black-70"
                                      />
                                    </div>
                                    {[
                                      "Rufnummern Mitnahme Ortskennzahl",
                                      "Rufnummern Mitnahme Ortskennzahl 2",
                                      "Rufnummern Mitnahme Rufnummer 1",
                                      "Rufnummern Mitnahme Rufnummer 2",
                                      "Rufnummern Mitnahme Rufnummer 3",
                                      "Rufnummern Mitnahme Rufnummer 4",
                                      "Rufnummern Mitnahme Rufnummer 5",
                                      "Rufnummern Mitnahme Rufnummer 6",
                                      "Rufnummern Mitnahme Rufnummer 7",
                                      "Rufnummern Mitnahme Rufnummer 8",
                                      "Rufnummern Mitnahme Rufnummer 9",
                                    ].map((name) => {
                                      const innerField = fieldData.find(
                                        (field) => field.name === name
                                      );
                                      if (innerField) {
                                        return (
                                          // DIV CONTAINER FOR EACH TEXT FIELD FROM "RUFNUMMERN"
                                          <div key={name}>
                                            <label className="w-full">
                                              {displayNameMapping[
                                                innerField.name
                                              ] || innerField.name}
                                            </label>
                                            <input
                                              type="text"
                                              name={innerField.name}
                                              value={
                                                formValues[innerField.name] ||
                                                ""
                                              }
                                              onChange={handleChange}
                                              className="border-2 border-gray-300 rounded p-1 w-full mr-5"
                                            />
                                          </div>
                                        );
                                      }
                                    })}
                                  </div>
                                )}
                                {fieldName ===
                                  "Telekommonikations Anlagen Duchwahl-RN" && (
                                  // DIV CONTAINER FOR THE "Telekommunikation" FIELD AND ITS SUBFIELDS
                                  <div className="flex flex-col items-left w-full gap-2">
                                    <div>
                                      {/* DIV FOR LABELS AND CHECKBOXES*/}
                                      <label className="mr-2">
                                        {displayNameMapping[field.name] ||
                                          field.name}
                                      </label>
                                      <input
                                        type="checkbox"
                                        name={field.name}
                                        checked={!!formValues[field.name]}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-black-70"
                                      />
                                    </div>
                                    {[
                                      "Telekommonikations Anlagen Abfragestelle",
                                      "Telekommonikations Anlagen Ruffnummernblock von",
                                      "Telekommonikations Anlagen Ruffnummernblock bis",
                                    ].map((name) => {
                                      const innerField = fieldData.find(
                                        (field) => field.name === name
                                      );
                                      if (innerField) {
                                        return (
                                          // DIV CONTAINER FOR EACH TEXT FIELD FROM "Telekommunikation"
                                          <div key={name}>
                                            <label className="w-full">
                                              {displayNameMapping[
                                                innerField.name
                                              ] || innerField.name}
                                            </label>
                                            <input
                                              type="text"
                                              name={innerField.name}
                                              value={
                                                formValues[innerField.name] ||
                                                ""
                                              }
                                              onChange={handleChange}
                                              className="border-2 border-gray-300 rounded p-1 w-full mr-5"
                                            />
                                          </div>
                                        );
                                      }
                                    })}
                                  </div>
                                )}
                              </div>
                              {fieldName === "Ressourcenübernahme ja" && (
                                // DIV CONTAINER FOR THE "Ressourcenübernahme" FIELD AND ITS SUBFIELD
                                <div className="flex">
                                  <div>
                                    <label className="flex">
                                      {displayNameMapping[field.name] ||
                                        field.name}
                                    </label>
                                    <input
                                      type="checkbox"
                                      name={field.name}
                                      checked={!!formValues[field.name]}
                                      onChange={handleChange}
                                      className="h-5 w-5 text-black-70"
                                    />
                                  </div>
                                </div>
                              )}

                              {field.name !== "Rufnummern Mitnahme" &&
                                field.name !==
                                  "Rufnummern Mitnahme alle Nr der Anschluesse portieren" &&
                                field.name !== "Ressourcenübernahme ja" &&
                                field.name !==
                                  "Telekommonikations Anlagen Duchwahl-RN" && (
                                  // DIV CONTAINER FOR THE FORM FIELDS THAT ARE NOT THE ONES WRITTEN
                                  <div className="grid grid-rows-auto grid-cols-4 w-full">
                                    <label className="mr-2">
                                      {displayNameMapping[field.name] ||
                                        field.name}
                                    </label>
                                    {field.type === "textfield" ? (
                                      <input
                                        type="text"
                                        name={field.name}
                                        value={formValues[field.name] || ""}
                                        onChange={handleChange}
                                        className="border-2 border-gray-300 rounded p-1 w-full"
                                      />
                                    ) : (
                                      <input
                                        type="checkbox"
                                        name={field.name}
                                        checked={!!formValues[field.name]}
                                        onChange={handleChange}
                                        className="h-5 w-5 text-black-70"
                                      />
                                    )}
                                  </div>
                                )}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/*ZURÜCK AND WEITER BUTTONS*/}
            {fieldData.length > 0 && (
              <div className="flex justify-end p-4 max-w-xl mx-auto w-full">
                <div className="flex justify-center bg-very-light-gray border-2 rounded p-2 w-60">
                  {fieldData.length > 0 &&
                    selectedCategory !== Object.keys(categories)[0] && (
                      <button
                        className="font-lato bg-gray-light border-3 border-black-60 text-17px rounded-md p-1 hover:bg-gray-dark hover:border-gray-dark mr-2"
                        onClick={handleZuruckClick}
                      >
                        Zurück
                      </button>
                    )}
                  {fieldData.length > 0 &&
                    selectedCategory !==
                      Object.keys(categories)[
                        Object.keys(categories).length - 1
                      ] && (
                      <button
                        className="font-lato bg-gray-light border-3 border-black-60 text-17px rounded-md p-1 hover:bg-gray-dark hover:border-gray-dark mr-2"
                        onClick={handleWeiterClick}
                      >
                        Weiter
                      </button>
                    )}
                </div>
              </div>
            )}
            {/*BUTTONS SAVE CHANGES AND PDF DOWNLOAD*/}
            <div className="flex justify-center bg-very-light-gray p-4 max-w-xl mx-auto w-full border-2 rounded">
              <button
                type="submit"
                className="font-lato bg-gray-light border-3 border-black-60 text-20px rounded-md p-2 hover:bg-gray-dark hover:border-gray-dark mr-2"
              >
                Änderungen absenden
              </button>
              <button
                type="button"
                className="font-lato bg-gray-light border-3 border-black-60 text-20px rounded-md p-2 hover:bg-gray-dark hover:border-gray-dark"
                onClick={handleDownload}
              >
                PDF herunterladen
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PdfFields;
