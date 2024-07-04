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

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="h-screen w-screen">
        <h1 className="font-lato text-black-87 text-24px font-bold text-left mt-10 ml-1">
          PDF to Form
        </h1>
        <hr />
        <br />
        <p className="font-lato font-bold text-left mt-10 ml-4 text-center text-grayish">
          {fileUploadStatus}
        </p>
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
          <form onSubmit={handleSubmit}>
            {fieldData.length > 0 && (
              <div className="flex justify-center bg-very-light-gray p-4 max-w-7xl w-full border-2 border-t-0 rounded mx-auto">
                {Object.keys(categories).map((category) => (
                  <div
                    key={category}
                    className={`p-4 m-2 bg-white rounded shadow ${
                      category === selectedCategory ? "block" : "hidden"
                    }`}
                  >
                    <div className="flex flex-wrap">
                      {categories[category].map((fieldName) => {
                        const field = fieldData.find(
                          (field) => field.name === fieldName
                        );
                        if (field) {
                          return (
                            <div key={fieldName} className="w-1/5 p-2">
                              <label className="mr-2">{field.name}</label>
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
                                  className="h-5 w-5 text-blue-600"
                                />
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
