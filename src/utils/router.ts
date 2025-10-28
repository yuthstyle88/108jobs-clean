// แนะนำให้สร้างแฟ้มนี้เก็บไว้ (เช่น src/types/router.ts)

/**
 * ใช้แทน Match<P> ของ inferno-router
 *
 * P – ชนิดของ params (ค่าที่จับได้จาก dynamic segment ในเส้นทาง)
 */
export interface Match<P extends Record<string, string> = Record<string, string>> {
  /** ค่าพารามิเตอร์ในเส้นทาง เช่น /post/:id => { id: "42" } */
  params: P;
  /** เส้นทางที่ประกาศไว้ใน Router (เช่น "/post/:id") */
  path: string;
  /** เส้นทางจริงที่แมตช์ได้ (เช่น "/post/42") */
  url: string;
  /** ถ้าตรงกับ path แบบเป๊ะ ๆ จะเป็น true */
  isExact: boolean;
}