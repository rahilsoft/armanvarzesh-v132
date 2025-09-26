import { Injectable } from '@nestjs/common';
import { CorrectiveExercise } from './entities/exercise.entity';

/**
 * Service storing and retrieving corrective exercises.  Exercises are
 * maintained in-memory to keep the implementation straightforward.
 */
@Injectable()
export class CorrectiveService {
  private exercises: CorrectiveExercise[] = [
    { id: 1, title: 'Plank', description: 'افزایش قدرت عضلات شکم و کمر' },
    { id: 2, title: 'کشش همسترینگ', description: 'کاهش سفتی عضلات پشت ران' },
    { id: 3, title: 'حرکت ساق پا', description: 'تقویت عضلات ساق و بهبود تعادل' },
  ];

  findAll(): CorrectiveExercise[] {
    return this.exercises;
  }

  create(input: { title: string; description?: string }): CorrectiveExercise {
    const nextId = this.exercises.length
      ? Math.max(...this.exercises.map((e) => e.id)) + 1
      : 1;
    const exercise: CorrectiveExercise = {
      id: nextId,
      title: input.title,
      description: input.description,
    };
    this.exercises.push(exercise);
    return exercise;
  }
}