import { axiosConfigSetting } from "@/lib/api";

axiosConfigSetting();

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default AuthLayout;
