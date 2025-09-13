import { type CustomError } from '../types/customError';
import { useQuasar } from 'quasar';

export function useCustomError(error: CustomError) {
  const $q = useQuasar();
  const { message, status, code } = error;
  $q.notify({ type: 'negative', message: `${status} - ${code}` });
  throw new Error(`${status} - ${message}`);
}
