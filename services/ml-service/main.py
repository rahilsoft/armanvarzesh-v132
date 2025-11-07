from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI(title="Arman ML Service")

class WorkoutFeatures(BaseModel):
    age: int
    weight: float
    height: float
    fitness_level: str
    equipment: list[str]

class WorkoutRecommendation(BaseModel):
    exercises: list[str]
    sets: int
    reps: int
    confidence: float

@app.get("/health")
def health():
    return {"ok": True, "service": "ml-service"}

@app.post("/predict/workout")
def predict_workout(features: WorkoutFeatures) -> WorkoutRecommendation:
    # Placeholder ML model - replace with actual trained model
    # For now, simple rule-based recommendation

    if features.fitness_level == "beginner":
        exercises = ["bodyweight-squats", "push-ups", "plank"]
        sets, reps = 3, 10
    else:
        exercises = ["barbell-squats", "bench-press", "deadlift"]
        sets, reps = 4, 8

    return WorkoutRecommendation(
        exercises=exercises,
        sets=sets,
        reps=reps,
        confidence=0.85
    )
