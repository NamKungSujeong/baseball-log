import { useRouter } from "next/navigation";
import { signupUser } from "../api/useSignupApis";
import { useState } from "react";
import { TeamId } from "@/types/game-log";

interface UseSignupProps {
  submitting: boolean;
  error: string;
  handleSignup: (
    name: string,
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
    name: string,
    email: string,
    password: string,
    selectedTeamId: TeamId | null,
  ) => {
    setSubmitting(true);
    setError("");
    try {
      const response = await signupUser(name, email, password, selectedTeamId);
      if (response.status === 200) {
        // const { id, nickname, supportingTeamId } = response.data;
        // login(id, nickname, supportingTeamId);
        router.replace("/");
        localStorage.setItem("isLoggedIn", "true");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입 실패");
    }
  };

  return {
    submitting,
    error,
    handleSignup,
  };
};

export default useSignup;
