import { type Lens } from '../constants/lens';

export interface LensDetails {
  name: Lens;
  id: string;
  /** The one question this lens answers about a surface. */
  question: string;
  /** Symptoms a client can already see that point to this lens. */
  signals: string[];
  /** What I actually inspect when I apply the lens. */
  checks: string[];
  /** What changes for the business once the issue is fixed. */
  outcome: string;
  /** Optional extra role this lens plays beyond diagnosis. */
  note?: string;
}
