"use client";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
    "Telekommonikations Anlagen Ruffnummernblock bis": "bis",
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
    "Ressourcenübernahme nein": "Ressourcenübernahme: nein",
    "Storno ausgeführt ja": "Storno ausgeführt: ja",
    "Storno ausgeführt nein": "Storno ausgeführt: nein",
  };

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
        ></meta>
        <title>PDF2FORM</title>
      </Head>
      <link
        rel="stylesheet"
        type="text/css"
        href="http://ui.sipsale.de/style.css"
      ></link>
      <link
        rel="stylesheet"
        type="text/css"
        href="http://ui.sipsale.de/semantic/dist/semantic.min.css"
      ></link>
      <link
        rel="stylesheet"
        type="text/css"
        href="http://ui.sipsale.de/semantic/dist/calendar.min.css"
      ></link>
      <script
        src="https://code.jquery.com/jquery-3.1.1.min.js"
        integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8="
        crossOrigin="anonymous"
      ></script>
      <script src="http://ui.sipsale.de/semantic/dist/semantic.min.js"></script>
      <script src="http://ui.sipsale.de/semantic/dist/calendar.min.js"></script>
      {/*MAIN DIV*/}
      <br />
      <h2 className="ui dividing header w-full">PDF2FORM</h2>
      <br />
      {/*NAVBAR*/}
      <div className="ui last container">
        <div className="ui three ordered steps">
          {Object.keys(categories).map((category) => (
            <div
              key={category}
              className={`content ${
                category === selectedCategory ? "active step" : "disabled step"
              }`}
            >
              <div className="title">{category}</div>
            </div>
          ))}
        </div>
      </div>
      <br />
      <br />
      {/*START PDF DISPLAY*/}
      <div id="step1" className="ui form last message container">
        <form onSubmit={handleSubmit}>
          {/*MAIN DIV CONTAINER*/}
          {Object.keys(categories).map((category) => (
            // DIV CONTAINER DIV FOR EACH CATEGORY
            <div
              key={category}
              className={` ${
                category === selectedCategory ? "block" : "hidden"
              }`}
            >
              {/*DIV CONTAINER FOR THE FORM FIELDS*/}
              <div className="field">
                {categories[category].map((fieldName) => {
                  const field = fieldData.find(
                    (field) => field.name === fieldName
                  );
                  if (field) {
                    return (
                      // DIV CONTAINER FOR EACH FORM FIELD
                      <div key={fieldName} className="field">
                        {fieldName === "Alten Vertrag Kuendigen" && (
                          // DIV CONTAINER FOR THE "Alten Vertrag Kuendigen" FIELD AND ITS SUBFIELD
                          <div className="flex gap-4">
                            <div>
                              {/* DIV FOR LABELS AND CHECKBOXES*/}
                              <label className="mr-2">
                                {displayNameMapping[field.name] || field.name}
                              </label>
                              <input
                                type="checkbox"
                                name={field.name}
                                checked={!!formValues[field.name]}
                                onChange={handleChange}
                                className="h-5 w-5 text-black-70"
                              />
                            </div>
                            {["Kndigen von"].map((name) => {
                              const innerField = fieldData.find(
                                (field) => field.name === name
                              );
                              if (innerField) {
                                return (
                                  // DIV CONTAINER FOR EACH TEXT FIELD FROM "Alter Vertrag Kuendigen"
                                  <div
                                    key={name}
                                    className="flex items-center gap-5"
                                  >
                                    <label className="mr-2">
                                      {displayNameMapping[innerField.name] ||
                                        innerField.name}
                                    </label>
                                    <input
                                      type="text"
                                      name={innerField.name}
                                      value={formValues[innerField.name] || ""}
                                      onChange={handleChange}
                                      className="border-2 border-gray-300 rounded p-1 w-full mr-1 ml-20"
                                      disabled={!formValues[field.name]}
                                    />
                                  </div>
                                );
                              }
                            })}
                          </div>
                        )}
                        {fieldName === "Rufnummern Mitnahme" && (
                          // DIV CONTAINER FOR THE "RUFNUMMERN MITNAHME" FIELD AND ITS SUBFIELDS
                          <div className="flex gap-4">
                            <div>
                              {/* DIV FOR LABELS AND CHECKBOXES*/}
                              <label className="mr-2">
                                {displayNameMapping[field.name] || field.name}
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
                                      {displayNameMapping[innerField.name] ||
                                        innerField.name}
                                    </label>
                                    <input
                                      type="text"
                                      name={innerField.name}
                                      value={formValues[innerField.name] || ""}
                                      onChange={handleChange}
                                      className="border-2 border-gray-300 rounded p-1 w-full mr-5"
                                      disabled={!formValues[field.name]}
                                    />
                                  </div>
                                );
                              }
                            })}
                          </div>
                        )}

                        {fieldName ===
                          "Rufnummern Mitnahme alle Nr der Anschluesse portieren" && (
                          // DIV CONTAINER FOR THE "RUFNUMMERN" FIELD AND ITS SUBFIELDS
                          <div className="flex flex-row gap-4 mx-auto">
                            <div className="flex flex-col items-left gap-2 w-1/2">
                              <div>
                                {/* DIV FOR LABELS AND CHECKBOXES*/}
                                <label className="mr-2">
                                  {displayNameMapping[field.name] || field.name}
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
                                        {displayNameMapping[innerField.name] ||
                                          innerField.name}
                                      </label>
                                      <input
                                        type="text"
                                        name={innerField.name}
                                        value={
                                          formValues[innerField.name] || ""
                                        }
                                        onChange={handleChange}
                                        className="border-2 border-gray-300 rounded p-1 w-full mr-5"
                                        disabled={!formValues[field.name]}
                                      />
                                    </div>
                                  );
                                }
                              })}
                            </div>
                            <div className="flex flex-col items-left gap-2 w-1/2">
                              {[
                                "Telekommonikations Anlagen Duchwahl-RN",
                                "Telekommonikations Anlagen Abfragestelle",
                              ].map((name) => {
                                const innerField = fieldData.find(
                                  (field) => field.name === name
                                );
                                if (innerField) {
                                  return (
                                    // DIV CONTAINER FOR EACH TEXT FIELD FROM "Telekommunikation"
                                    <div key={name}>
                                      <label className="w-full">
                                        {displayNameMapping[innerField.name] ||
                                          innerField.name}
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
                              <div className="flex items-left gap-2 w-1/2">
                                {[
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
                              <div className="flex flex-col items-left gap-2 w-1/2">
                                {[
                                  "Ort Datum",
                                  "Vertragspartner und ggf Firmenstempel",
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
                            </div>
                          </div>
                        )}

                        {fieldName === "WBCIGF" && (
                          <div className="flex flex-row gap-4 mx-auto">
                            <div className="flex flex-col items-left gap-2 w-1/2">
                              <div>
                                <label className="mr-2">
                                  {displayNameMapping[field.name] || field.name}
                                </label>
                                <input
                                  type="text"
                                  name={field.name}
                                  checked={!!formValues[field.name]}
                                  onChange={handleChange}
                                  className="border-2 border-gray-300 rounded p-1 w-full mr-5"
                                />
                              </div>
                              {[
                                "Vorab-ID",
                                "Änderungs-Storno-ID",
                                "PKlauf",
                                "Wechseltermin",
                              ].map((name) => {
                                const innerField = fieldData.find(
                                  (field) => field.name === name
                                );
                                if (innerField) {
                                  return (
                                    <div key={name}>
                                      <label className="w-full">
                                        {displayNameMapping[innerField.name] ||
                                          innerField.name}
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
                            <div className="flex flex-col items-left gap-2 w-1/2">
                              {[
                                "Neuer Wechseltermin",
                                "Rückinformation an",
                                "über FaxEMail",
                                "Tel",
                              ].map((name) => {
                                const innerField = fieldData.find(
                                  (field) => field.name === name
                                );
                                if (innerField) {
                                  if (name === "Rückinformation an") {
                                    return (
                                      <div key={name}>
                                        <label className="w-full">
                                          {displayNameMapping[
                                            innerField.name
                                          ] || innerField.name}
                                        </label>
                                        <select
                                          name={innerField.name}
                                          value={
                                            formValues[innerField.name] || ""
                                          }
                                          onChange={handleSelectChange}
                                          className="border-2 border-gray-300 rounded p-1 w-full mr-5"
                                        >
                                          <option value="Name1">Norwin Reitzenstein</option>
                                          <option value="Name2">Andreas Hammerschmidt</option>
                                          <option value="Name3">Daniel Witt</option>
                                        </select>
                                      </div>
                                    );
                                  } else if (name === "über FaxEMail") {
                                    return (
                                      <div key={name}>
                                        <label className="w-full">
                                          {displayNameMapping[
                                            innerField.name
                                          ] || innerField.name}
                                        </label>
                                        <input
                                          type="text"
                                          name={innerField.name}
                                          value="technik@terrera.ag"
                                          readOnly
                                          className="border-2 border-gray-300 rounded p-1 w-full mr-5"
                                        />
                                      </div>
                                    );
                                  } else if (name === "Tel") {
                                    return (
                                      <div key={name}>
                                        <label className="w-full">
                                          {displayNameMapping[
                                            innerField.name
                                          ] || innerField.name}
                                        </label>
                                        <input
                                          type="text"
                                          name={innerField.name}
                                          value="0911 5401715"
                                          readOnly
                                          className="border-2 border-gray-300 rounded p-1 w-full mr-5"
                                        />
                                      </div>
                                    );
                                  } else {
                                    return (
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
                                            formValues[innerField.name] || ""
                                          }
                                          onChange={handleChange}
                                          className="border-2 border-gray-300 rounded p-1 w-full mr-5"
                                        />
                                      </div>
                                    );
                                  }
                                }
                              })}
                            </div>
                          </div>
                        )}

                        {field.name !== "Rufnummern Mitnahme" &&
                          field.name !==
                            "Rufnummern Mitnahme alle Nr der Anschluesse portieren" &&
                          field.name !== "WBCIGF" &&
                          field.name !==
                            "Telekommonikations Anlagen Duchwahl-RN" &&
                          field.name !== "Alten Vertrag Kuendigen" &&
                          field.name !== "Ort Datum" && (
                            // DIV CONTAINER FOR THE FORM FIELDS THAT ARE NOT THE ONES WRITTEN
                            <div className="grid grid-rows-auto grid-cols-4 w-full">
                              <label className="mr-2">
                                {displayNameMapping[field.name] || field.name}
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
          {/*ZURÜCK AND WEITER BUTTONS*/}
          <div className="flex justify-end p-4 max-w-xl mx-auto w-full">
            {fieldData.length > 0 &&
              selectedCategory !== Object.keys(categories)[0] && (
                <button
                  className="ui right labeled icon button fluid submit"
                  onClick={handleZuruckClick}
                >
                  Zurück
                </button>
              )}
            {fieldData.length > 0 &&
              selectedCategory !==
                Object.keys(categories)[Object.keys(categories).length - 1] && (
                <button
                  className="ui right labeled icon button fluid submit"
                  onClick={handleWeiterClick}
                >
                  Weiter
                </button>
              )}
          </div>
          {/*BUTTONS SAVE CHANGES AND PDF DOWNLOAD*/}
          <div className="flex justify-end p-4 mx-auto w-full">
            <button
              type="submit"
              className="ui right labeled icon button fluid submit"
            >
              Änderungen absenden
            </button>
            <button
              type="submit"
              className="ui right labeled icon button fluid submit"
              onClick={handleDownload}
            >
              <i className="right arrow icon"></i>
              PDF herunterladen
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PdfFields;
