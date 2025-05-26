from pydantic import BaseModel

class TSNEResult(BaseModel):
    x: float
    y: float 
    cluster: int
    id: str  # document filename
