export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/** HTTP 상태코드 → 사용자 메시지 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    switch (error.status) {
      case 400:
        return "잘못된 요청입니다.";
      case 401:
        return "로그인이 필요합니다.";
      case 403:
        return "접근 권한이 없습니다.";
      case 404:
        return "요청한 데이터를 찾을 수 없습니다.";
      case 409:
        return "이미 존재하는 데이터입니다.";
      case 500:
        return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      default:
        return error.message || "알 수 없는 오류가 발생했습니다.";
    }
  }
  if (error instanceof Error) return error.message;
  return "알 수 없는 오류가 발생했습니다.";
}
