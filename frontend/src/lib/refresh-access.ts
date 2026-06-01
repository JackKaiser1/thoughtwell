import { serverURL } from '@/constants';
import { apiErrorHandler, printError } from '@/lib/errorHandler';
import { type AccessTokenResponse } from "@/types/response"

export async function refreshAccessToken() {
    const url = `${serverURL}/api/refresh`;

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          "Authorization": `Bearer ${sessionStorage.refreshToken}`
        }
      });

      if (!response.ok) {
        apiErrorHandler(response);
        throw new Error;
      }

      const result: AccessTokenResponse = await response.json();

      sessionStorage.setItem("accessToken", result.accessToken);

    } catch (err) {
      printError(err)
    }
}

  