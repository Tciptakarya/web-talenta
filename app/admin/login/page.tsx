import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Login Admin — Talenta Cipta Karya" };

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <LoginForm />
    </div>
  );
}
