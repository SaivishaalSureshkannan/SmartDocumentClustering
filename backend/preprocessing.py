from typing import List
import nltk
from nltk.tokenize import RegexpTokenizer
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import string
from nltk_setup import ensure_nltk_resources

# Ensure NLTK resources are available
ensure_nltk_resources()

# Initialize tokenizer and other NLTK tools
tokenizer = RegexpTokenizer(r'\w+')  # This will split on non-word characters
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def preprocess_text(text: str) -> List[str]:
    """
    Preprocess text by:
    1. Converting to lowercase
    2. Removing punctuation
    3. Tokenizing
    4. Removing stopwords
    5. Lemmatizing
    """
    try:
        # Convert to lowercase and handle None/empty strings
        if not text:
            return []
        text = str(text).lower()
        
        # Tokenize (this will automatically handle punctuation)
        tokens = tokenizer.tokenize(text)
        
        # Remove stopwords, empty strings, and lemmatize
        tokens = [
            lemmatizer.lemmatize(token)
            for token in tokens
            if token and token not in stop_words and token.strip()
        ]
        
        return tokens
        
    except Exception as e:
        print(f"Error in preprocessing: {str(e)}")
        return []

def tokens_to_string(tokens: List[str]) -> str:
    """Convert tokens back to string for vectorization"""
    return ' '.join(tokens)
