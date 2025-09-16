import { useQuasar } from 'quasar';
import { type HttpError } from '../../shared/errors/HttpError';

type CustomError = { status: number; code?: string; message?: string };

export function useErrorNotifier() {
  const $q = useQuasar();

  const notifyHttp = (err: HttpError) => {
    const payload = err.data as Partial<CustomError> | null;
    const status = err.status;
    const code = payload?.code ?? 'HTTP_ERROR';
    const message = payload?.message ?? `Request failed (${status})`;
    $q.notify({ type: 'negative', message: `${status} - ${code}: ${message}` });
  };

  const notifyGeneric = (err?: unknown) => {
    console.error('[Request] generic failure:', err);
    $q.notify({ type: 'negative', message: 'Request failed. Please try again.' });
  };

  return { notifyHttp, notifyGeneric };
}
