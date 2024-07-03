"use client";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import Head from "next/head";

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

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="h-screen w-screen">
        <h1 className="font-lato text-black-87 text-24px font-bold-550 text-left mt-10 ml-4">
          PDF to Form
        </h1>
        <hr />
        <br />
        <p className="font-lato font-bold text-left mt-10 ml-4 text-center text-red-dark">
          {fileUploadStatus}
        </p>
        <div className="flex flex-col justify-center">
          <div className="flex justify-center">
            <input
              type="file"
              accept=".pdf"
              className="font-lato bg-green-light border-4 border-black-60 text-20px rounded-md p-1 hover:bg-gray-dark hover:border-gray-dark mr-2"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="font-lato bg-green-light border-4 border-black-60 text-20px rounded-md p-2 hover:bg-gray-dark hover:border-gray-dark"
              onClick={handleFileUpload}
            >
              PDF hochladen
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {fieldData.map((field, index) => (
              <div key={index}>
                <label>{field.name}</label>
                {field.type === "textfield" ? (
                  <input
                    type="text"
                    name={field.name}
                    value={formValues[field.name] || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type="checkbox"
                    name={field.name}
                    checked={!!formValues[field.name]}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
            <br />
            <div className="flex justify-center">
              <button
                type="submit"
                className="font-lato bg-green-light border-4 border-black-60 text-20px rounded-md p-2 hover:bg-gray-dark hover:border-gray-dark mr-2"
              >
                Änderungen absenden
              </button>
              <button
                type="button"
                className="font-lato bg-green-light border-4 border-black-60 text-20px rounded-md p-2 hover:bg-gray-dark hover:border-gray-dark"
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
