"use client";
import { useState } from "react";

const PdfFields = () => {
  const [fieldData, setFieldData] = useState<{ name: string; type: string }[]>([]);
  const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [fileUploadStatus, setFileUploadStatus] = useState("Bitte fügen Sie eine PDF ein");

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
    setFileUploadStatus(file ? "PDF bereit zum Hochladen" : "Bitte fügen Sie eine PDF ein");
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

  return (
    <div>
      <h1>PDF to Form</h1>
      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button type="button" onClick={handleFileUpload}>PDF hochladen</button>
      <form onSubmit={handleSubmit}>
      <p>{fileUploadStatus}</p>
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
        <button type="submit">Änderungen absenden</button>
      </form>
    </div>
  );
};

export default PdfFields;

