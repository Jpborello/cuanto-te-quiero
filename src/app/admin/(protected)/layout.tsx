import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/isAdmin";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export default async function ProtectedAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const allowed = await isAdmin();

    // if (!allowed) redirect("/admin/login");

    return (
        <>

            <AdminLayoutClient>{children}</AdminLayoutClient>
        </>
    );
}
