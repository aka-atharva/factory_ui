from fastapi import APIRouter, HTTPException
from typing import List

from api.models.factory_models import FactoryMetrics, FactoryStatus
from api.services.data_store import data_store

router = APIRouter()

@router.get("/metrics", response_model=FactoryMetrics)
async def get_factory_metrics():
    metrics = data_store.get_factory_metrics()
    return metrics

@router.get("/status", response_model=List[FactoryStatus])
async def get_factory_status():
    status = data_store.get_factory_status()
    return status

@router.get("/machine-types")
async def get_machine_types():
    machine_types = data_store.get_machine_types()
    return {"machine_types": machine_types}

@router.get("/batch-quality")
async def get_batch_quality():
    batch_quality = data_store.get_batch_quality()
    return batch_quality

@router.get("/energy-metrics")
async def get_energy_metrics():
    energy_metrics = data_store.get_energy_metrics()
    return energy_metrics

