import nltk
import os

def ensure_nltk_resources():
    """Ensure all required NLTK resources are downloaded"""
    required_resources = {
        'punkt': 'tokenizers/punkt',
        'stopwords': 'corpora/stopwords',
        'wordnet': 'corpora/wordnet',
        'omw-1.4': 'omw-1.4'
    }
    
    for package, path in required_resources.items():
        try:
            nltk.data.find(path)
            print(f"Resource {package} already downloaded")
        except LookupError:
            print(f"Downloading {package}...")
            nltk.download(package, quiet=True)

# Call this when the module is imported
ensure_nltk_resources()
