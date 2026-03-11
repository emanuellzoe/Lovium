import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import ChatUI from "./ChatUI";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ agentId: string }>;
}) {
  const { agentId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: agent }, { data: profile }] = await Promise.all([
    supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .eq("owner_id", user.id)
      .single(),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ]);

  if (!agent) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-dark">
      <AppHeader profile={profile} />
      <ChatUI agent={agent} />
    </div>
  );
}
