import { useRouter } from "next/navigation";
import { loginUser } from "../api/useLoginApis";
import { useState } from "react";
import useAuthStore from "@/store/useAuthStore";

interface UseLoginProps {
  email: string;
  password: string;
  submitting: boolean;
  error: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLogin: () => Promise<void>;
}

const useLogin = (): UseLoginProps => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    setSubmitting(true);
    setError("");
    try {
      const response = await loginUser(email, password);
      if (response.status === 200) {
        // const { id, nickname, supportingTeamId } = response.data;
        // login(id, nickname, supportingTeamId);
        router.replace("/");
        useAuthStore.setState({ user: response.data });
        localStorage.setItem("isLoggedIn", "true");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    email,
    password,
    submitting,
    error,
    setEmail,
    setPassword,
    handleLogin,
  };
};

export default useLogin;
