import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginAction } from "@/features/auth/actions/authActions";
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
      const result = await loginAction(email, password);
      if ("error" in result) {
        setError(result.error);
      } else {
        useAuthStore.setState({ user: result.user });
        router.replace("/");
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
