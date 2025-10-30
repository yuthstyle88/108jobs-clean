import {useGlobalLoader} from "@/contexts/GlobalLoaderContext";
import {useGlobalError} from "@/contexts/GlobalErrorContext"; // Import GlobalError Context
import useSWR, { SWRConfiguration } from "swr";
import {callHttp, EMPTY_REQUEST, Payload, REQUEST_STATE, RequestState, WrappedLemmyHttp,} from "@/services/HttpService";
import {UserService} from "@/services";

export function useHttpGet<K extends keyof WrappedLemmyHttp>(
  // ชื่อ request method
  method: K,
  // พารามิเตอร์ที่อาจเป็น args (อาร์เรย์) หรือตัวเลือกเพิ่มเติม (option object)
  argsOrOptions?:
    | Parameters<WrappedLemmyHttp[K]>
    | (Parameters<WrappedLemmyHttp[K]>[0] & SWRConfiguration<RequestState<Payload<K>>, Error>),
  // SWR options
  maybeOptions?: SWRConfiguration<RequestState<Payload<K>>, Error>,
) {
  const { setLoading } = useGlobalLoader(); // ใช้สำหรับ Global Loader
  const { setError } = useGlobalError(); // ใช้สำหรับ Global Error

  /* ---------- resolve param / options ---------- */
  // เดิม args เป็นอาร์เรย์ แต่ตอนนี้รองรับ Object เพื่อเพิ่มความยืดหยุ่น
  const args = Array.isArray(argsOrOptions)
    ? (argsOrOptions as Parameters<WrappedLemmyHttp[K]>)
    : argsOrOptions && typeof argsOrOptions === "object"
    ? [argsOrOptions] // รวม options ไว้ในอาร์เรย์
    : undefined;

  // กำหนดค่าตัวเลือกสำหรับ SWR
  const options = args && Array.isArray(argsOrOptions)
    ? maybeOptions
    : (argsOrOptions as SWRConfiguration<RequestState<Payload<K>>, Error> | undefined);

  /* ---------- key / fetcher ---------- */
  const key = [method, ...(args ?? [])] as const;

  const fetcher = async () => {
    setLoading(true); // แสดง Loader
    setError(null); // ล้างข้อผิดพลาดเก่าก่อนเริ่มการดึงข้อมูลใหม่
    try {
      const typedArgs = (args ?? []) as Parameters<WrappedLemmyHttp[K]>;
      return (await callHttp(
        method,
        ...typedArgs,
      )) as RequestState<Payload<K>>;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error occurred";
      setError(errorMessage); // ตั้งค่าข้อผิดพลาดใน GlobalError Context
      return {
        state: REQUEST_STATE.FAILED,
        err: err instanceof Error ? err : new Error(errorMessage),
      } as RequestState<Payload<K>>;
    } finally {
      setLoading(false); // ปิด Loader เสมอ
    }
  };

  /* ---------- swr ---------- */
    const swr = useSWR<RequestState<Payload<K>>, Error>(
        UserService.Instance?.authInfo?.auth ? key : null, // Only fetch if token exists
        fetcher,
        {
            keepPreviousData: true,
            revalidateOnFocus: false,
            ...options,
        }
    );

  /* ---------- mapping ---------- */
  const state = swr.data ?? EMPTY_REQUEST;
  const data =
    state.state === REQUEST_STATE.SUCCESS ? (state.data as Payload<K>) : null;
  const pagination =
    data && typeof data === "object" && "pagination" in data
      ? (data.pagination as any)
      : undefined;

  const execute = () => swr.mutate();
  const isMutating = swr.isValidating;

  return { state, data, execute, isMutating, pagination };
}