from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# =====================
# Ciclistas
# =====================
class CiclistaBase(BaseModel):
    id: str
    nombre: str
    edad: int
    equipo: str

class CiclistaCreate(CiclistaBase):
    pass

class CiclistaResponse(CiclistaBase):
    pass


# =====================
# Telemetría
# =====================
class TelemetriaBase(BaseModel):
    ciclista_id: str
    lat: float
    lng: float
    spd: float
    accel_x: float
    accel_y: float
    accel_z: float
    gyro_x: float
    gyro_y: float
    gyro_z: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TelemetriaResponse(TelemetriaBase):
    id: str


# =====================
# Competencias
# =====================
class CompetenciaBase(BaseModel):
    id: str
    nombre: str
    fecha: datetime
    lugar: str

class CompetenciaResponse(CompetenciaBase):
    pass


# =====================
# Alertas
# =====================
class AlertaBase(BaseModel):
    ciclista_id: str
    tipo: str
    mensaje: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class AlertaResponse(AlertaBase):
    id: str


# =====================
# Resúmenes
# =====================
class ResumenBase(BaseModel):
    competencia_id: str
    resumen: str
    generado_por: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ResumenResponse(ResumenBase):
    id: str
