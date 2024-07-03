import path from 'path'
import fs from 'fs';
export async function GET() {
    const filename = "updated_document.pdf";
    const filePath = path.join(process.cwd(), 'lib', filename);
  
    // Erstellen Sie den ReadStream
    const stream = fs.createReadStream(filePath);
  
    // Wandeln Sie den Stream in einen Buffer um
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);
  
    // Konvertieren Sie den Buffer in einen Uint8Array
    const uint8array = new Uint8Array(buffer);
  
    return new Response(uint8array, {
      headers: {
        "content-disposition": `attachment; filename="${filename}"`,
        "content-type": "application/pdf"
      },
    });
  }
  