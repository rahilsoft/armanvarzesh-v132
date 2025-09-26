# AI Service (Suggestions + Readiness + Coach Match)

Implements heuristic-but-explained suggestions, readiness scoring, and coach matching with feature vectors & model snapshots.

## API
- `POST /ai/suggest-next-set` → input: `{ lastSets:[{exerciseId, weight, reps, rpe?}], fatigue?, hr?, seed? }`  
  returns: `{ weight, reps, confidence, why, modelId }`  **(explanation required)**
- `GET  /ai/readiness?hrv=&sleepHours=&load=&soreness=` → `0..100` score + factors
- `POST /ai/coach-match` `{ userFeatures }` → `{ matches:[{coachId,tags,score}] }` (cosine)

## Notes
- NaN/outliers guarded and clamped
- Deterministic output when `seed` provided (LCG)
- Feature vectors stored; model snapshot id persisted with suggestions
