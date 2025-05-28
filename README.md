# Smart Document Clustering

A full-stack application that leverages machine learning and NLP techniques to automatically organize and search through document collections by clustering similar documents together and providing semantic search capabilities.

## Features

- **Multi-format Document Support**
  - PDF, DOCX, and TXT file processing
  - Maintains document structure and formatting
  - Batch upload capability

- **Intelligent Document Analysis**
  - Automated document clustering using K-means
  - Semantic search powered by BERT embeddings
  - Interactive document visualization using t-SNE
  - TF-IDF based document vectorization

- **Modern Web Interface**
  - Real-time clustering visualization
  - Intuitive document management
  - Interactive search capabilities

## Tech Stack

### Backend
- Python FastAPI
- scikit-learn
- NLTK
- Sentence Transformers (BERT)
- PDFMiner
- python-docx

### Frontend
- React
- TypeScript
- Vite

## Setup and Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/SmartDocumentClustering.git
cd SmartDocumentClustering
```

2. **Set up Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

3. **Set up Frontend**
```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Access the application at `http://localhost:5173`
2. Upload documents using the file upload interface
3. Adjust clustering parameters if needed
4. View document clusters and relationships
5. Use semantic search to find related documents

-