import client from "./client";

interface SuccessResponse {
  token: string
  username: string
  expires_in: number
}

type LoginResponse =
  | { success: true; data: SuccessResponse }
  | { success: false; error: string };

interface RegisterSuccess {
  id: number
  username: string
  message: string
}

type RegisterResponse =
  | { success: true; data: RegisterSuccess }
  | { success: false; error: string };


export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    const apiRes = await client.post("/auth/login", { username, password })
    return {
      success: true,
      data: apiRes.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error ?? "Something went wrong",
    }
  }
}

export const register = async (username: string, password: string): Promise<RegisterResponse> => {
  try {
    const apiRes = await client.post("/auth/register", { username, password })
    return {
      success: true,
      data: apiRes.data,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error ?? "Something went wrong",
    }
  }
}

// export const logout = () => {
//   localStorage.removeItem("token")
//   window.location.href = "/login"
// }