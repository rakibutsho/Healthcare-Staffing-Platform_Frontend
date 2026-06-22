"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { ReactNode } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout, selectCurrentToken } from "@/redux/features/auth/authSlice";
import LoadingPage from "@/components/shared/loading/Loading";

const WithCompanyProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const token = useAppSelector(selectCurrentToken);
  const user = useAppSelector((state) => state.auth.user);



  useEffect(() => {
    if (!token) {
      dispatch(logout());
      router.replace("/auth/login");
    } else if (
      user &&
      user.role !== "PROVIDER"
    ) {
      dispatch(logout());
      router.replace("/auth/login");
    } else {
      setLoading(false);
    }
  }, [router, token, user, dispatch]);

  if (loading) {
    return <LoadingPage />;
  }

  return children;
};

export default WithCompanyProvider;
