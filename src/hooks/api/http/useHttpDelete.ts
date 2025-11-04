import {useMemo} from "react";
import useSWRMutation from "swr/mutation";
import {callHttp, EMPTY_REQUEST, Payload, REQUEST_STATE, RequestState, WrappedLemmyHttp,} from "@/services/HttpService";
import {useGlobalError} from "@/contexts/GlobalErrorContext";
import {useGlobalLoader} from "@/hooks/ui/GlobalLoaderContext";

export const useHttpDelete = <K extends keyof WrappedLemmyHttp>(method: K) => {
  const { setLoading } = useGlobalLoader();
  const { setError } = useGlobalError();

  const {
    trigger,
    data: state = EMPTY_REQUEST,
    isMutating,
  } = useSWRMutation<
    RequestState<Payload<K>>,
    Error,
    string,
    Parameters<WrappedLemmyHttp[K]>
  >(
    `${String(method)}-http-delete`,
    async (_key, { arg }) => {
      setLoading(true);
      setError(null);
      try {
        return await callHttp(method, ...arg) as RequestState<Payload<K>>;
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "Unknown error";
        setError(errorMessage);
        return {
          state: REQUEST_STATE.FAILED,
          err: e instanceof Error ? e : new Error("Unknown error"),
        };
      } finally {
        setLoading(false);
      }
    },
    { revalidate: false }
  );

  const data = useMemo(
    () => (state.state === REQUEST_STATE.SUCCESS ? state.data as Payload<K> : null),
    [state]
  );

  const execute = (...args: Parameters<WrappedLemmyHttp[K]>) => {
    if (args.length === 0) {
        return (trigger as () => Promise<RequestState<Payload<K>>>)();
    }
    return (trigger as (arg: Parameters<WrappedLemmyHttp[K]>) => Promise<RequestState<Payload<K>>>)(args);
  };

  return { state, data, execute, isMutating };
};
