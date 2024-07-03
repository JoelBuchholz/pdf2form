import { writeFile } from 'fs/promises'
import path from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, PDFCheckBox, PDFTextField } from 'pdf-lib';
import fs from 'fs';
export async function POST(request: NextRequest) {
  try {
  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ success: false })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const pdfPath = path.resolve(process.cwd(), 'lib/document.pdf');
  await writeFile(pdfPath, buffer)
  console.log(`open ${path} to see the uploaded file`)

  return NextResponse.json({ success: true })
} catch (error) {
  console.error(`Error retrieving customers: ${error}`);
  return NextResponse.json({ error: "An error occurred" });
}
}

export async function GET(request: NextRequest) {
  try {
  const pdfPath = path.resolve(process.cwd(), 'lib/document.pdf');
  const existingPdfBytes = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  const fields = form.getFields();
  const fieldData = fields.map((field) => {
    let fieldType = 'unknown';
    if (field instanceof PDFCheckBox) {
      fieldType = 'checkbox';
    } else if (field instanceof PDFTextField) {
      fieldType = 'textfield';
    }
    return { name: field.getName(), type: fieldType };
  });

  return NextResponse.json({ fieldData });
} catch (error) {
  console.error(`Error retrieving customers: ${error}`);
  return NextResponse.json({ error: "An error occurred" });
}
}

export async function PUT(request: NextRequest) {
try {
const body = await request.json();
  const pdfPath = path.resolve(process.cwd(), 'lib/document.pdf');
  const existingPdfBytes = fs.readFileSync(pdfPath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  for (const key in body) {
    const field = form.getField(key);
    if (field instanceof PDFTextField) {
      field.setText(body[key].toString());
    } else if (field instanceof PDFCheckBox) {
      if (body[key] === true) {
        field.check();
      } else {
        field.uncheck();
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = path.resolve(process.cwd(), 'lib/updated_document.pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  return NextResponse.json({ message: "PDF updated successfully" });
} catch (error) {
  console.error(`Error updating PDF: ${error}`);
  return NextResponse.json({ error: "An error occurred" });
}
}