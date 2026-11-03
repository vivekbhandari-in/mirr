import { Metadata } from "next";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "Your Profile — Mirr",
  description: "Your private identity sanctuary and account settings.",
};

export default function ProfilePage() {
  return <ProfileView />;
}

