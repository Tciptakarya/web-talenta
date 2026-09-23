import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";

export const metadata = { title: "Lupa Password — Talenta Cipta Karya" };

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <ForgotPasswordForm />
    </div>
  );
}
