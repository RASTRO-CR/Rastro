from pydantic import BaseModel
from typing import Optional, Literal

class AnalisisRequest(BaseModel):
    ciclista_id: str
    tipo_analisis: Optional[Literal["prediccion", "resumen", "riesgo"]] = "prediccion"
    comparar_con: Optional[str] = None  # solo si se quiere comparar entre dos ciclistas
