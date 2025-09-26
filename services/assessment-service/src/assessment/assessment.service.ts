import { Injectable } from '@nestjs/common';

export interface Test {
  id: number;
  name: string;
  description: string;
  unit: string;
  createdBy: number;
  createdAt: Date;
}

export interface TestResult {
  id: number;
  testId: number;
  userId: number;
  score: number;
  recordedAt: Date;
}

/**
 * AssessmentService manages sports tests and user results in memory. It allows
 * creating, updating and deleting tests, recording user results and
 * retrieving results per user.
 */
@Injectable()
export class AssessmentService {
  private tests: Test[] = [];
  private results: TestResult[] = [];
  private testIdCounter = 1;
  private resultIdCounter = 1;

  createTest(name: string, description: string, unit: string, createdBy: number): Test {
    const test: Test = {
      id: this.testIdCounter++,
      name,
      description,
      unit,
      createdBy,
      createdAt: new Date(),
    };
    this.tests.push(test);
    return test;
  }

  updateTest(id: number, name?: string, description?: string, unit?: string): Test {
    const test = this.tests.find(t => t.id === id);
    if (!test) throw new Error('Test not found');
    if (name !== undefined) test.name = name;
    if (description !== undefined) test.description = description;
    if (unit !== undefined) test.unit = unit;
    return test;
  }

  deleteTest(id: number): Test {
    const idx = this.tests.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Test not found');
    const [removed] = this.tests.splice(idx, 1);
    return removed;
  }

  listTests(): Test[] {
    return this.tests;
  }

  recordResult(testId: number, userId: number, score: number): TestResult {
    const test = this.tests.find(t => t.id === testId);
    if (!test) throw new Error('Test not found');
    const result: TestResult = {
      id: this.resultIdCounter++,
      testId,
      userId,
      score,
      recordedAt: new Date(),
    };
    this.results.push(result);
    return result;
  }

  getResultsByUser(userId: number): TestResult[] {
    return this.results.filter(r => r.userId === userId);
  }
}