from typing import Union, List
import os
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import aiofiles
from pdfminer.high_level import extract_text as extract_pdf_text
from docx import Document
import shutil

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite's default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_uploaded_file(upload_file: UploadFile) -> str:
    """Save an uploaded file to the uploads directory"""
    file_path = os.path.join(UPLOAD_DIR, upload_file.filename)
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await upload_file.read()
        await out_file.write(content)
    return file_path

def extract_text(file_path: str) -> str:
    """Extract text from different file types"""
    _, ext = os.path.splitext(file_path.lower())
    
    try:
        if ext == '.pdf':
            # Extract text with better formatting
            text = extract_pdf_text(file_path)
            # Clean up the text
            lines = text.split('\n')
            # Remove empty lines and excessive whitespace
            lines = [line.strip() for line in lines if line.strip()]
            # Join with single newlines
            cleaned_text = '\n'.join(lines)
            # Replace form feed with page break marker
            cleaned_text = cleaned_text.replace('\f', '\n\n[PAGE BREAK]\n\n')
            return cleaned_text
            
        elif ext == '.docx':
            doc = Document(file_path)
            full_text = []
            
            for paragraph in doc.paragraphs:
                # Handle different heading levels
                if paragraph.style.name.startswith('Heading'):
                    full_text.append(f"\n## {paragraph.text} ##\n")
                # Handle normal paragraphs
                else:
                    if paragraph.text.strip():  # Skip empty paragraphs
                        text = paragraph.text
                        # Add formatting indicators
                        if any(run.bold for run in paragraph.runs):
                            text = f"**{text}**"
                        if any(run.italic for run in paragraph.runs):
                            text = f"_{text}_"
                        full_text.append(text)
            
            # Handle tables if present
            for table in doc.tables:
                full_text.append("\nTable Contents:")
                for row in table.rows:
                    row_text = ' | '.join(cell.text for cell in row.cells)
                    full_text.append(row_text)
            
            return '\n'.join(full_text)
        elif ext == '.txt':
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        else:
            return f"Unsupported file type: {ext}"
    except Exception as e:
        return f"Error extracting text: {str(e)}"

@app.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """Handle multiple file uploads and extract text"""
    results = []
    
    for file in files:
        # Validate file type
        allowed_extensions = {'.pdf', '.docx', '.txt'}
        file_ext = os.path.splitext(file.filename.lower())[1]
        
        if file_ext not in allowed_extensions:
            results.append({
                "filename": file.filename,
                "error": "Unsupported file type"
            })
            continue
            
        try:
            # Save file
            file_path = await save_uploaded_file(file)
            
            # Extract text
            extracted_text = extract_text(file_path)
            
            results.append({
                "filename": file.filename,
                "extracted_text": extracted_text  # Remove the [:500] limit
            })
            
        except Exception as e:
            results.append({
                "filename": file.filename,
                "error": str(e)
            })
    
    return JSONResponse(content={
        "status": "success",
        "files": results
    })

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}