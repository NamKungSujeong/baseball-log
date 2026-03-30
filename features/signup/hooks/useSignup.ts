import { useRouter } from "next/navigation";
import { useState } from "react";
import { signupAction } from "@/features/auth/actions/authActions";
import useAuthStore from "@/store/useAuthStore";
import type { TeamId } from "@/types/game-log";

interface UseSignupProps {
  submitting: boolean;
  error: string;
  handleSignup: (
    nickname: string,
    email: string,
    password: string,
    selectedTeamId: TeamId | null,
  ) => Promise<void>;
}

const useSignup = (): UseSignupProps => {
  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSignup = async (
    nickname: string,
    email: string,
    password: string,
    selectedTeamId: TeamId | null,
  ) => {
    setSubmitting(true);
    setError("");
    try {
      const result = await signupAction(nickname, email, password, selectedTeamId);
      if ("error" in result) {
        setError(result.error);
      } else {
        useAuthStore.setState({ user: result.user });
        router.replace("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입 실패");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    error,
    handleSignup,
  };
};

export default useSignup;
