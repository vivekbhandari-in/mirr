import { redirect } from "next/navigation";

export default function ReflectionsPage() {
  redirect("/dashboard?tab=reflect");
}
