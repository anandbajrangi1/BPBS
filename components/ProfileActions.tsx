"use client";
import { useState } from "react";
import { Settings, Edit2 } from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import { useRouter } from "next/navigation";

interface ProfileActionsProps {
    userData: {
        name: string;
        email: string;
        phone: string;
    };
}

export default function ProfileActions({ userData }: ProfileActionsProps) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const router = useRouter();

    const handleUpdate = () => {
        router.refresh();
    };

    return (
        <>
            <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8 }}>
                <button
                    onClick={() => setIsEditOpen(true)}
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        cursor: "pointer"
                    }}
                    title="Edit Profile"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    onClick={() => setIsPasswordOpen(true)}
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.2)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        cursor: "pointer"
                    }}
                    title="Change Password"
                >
                    <Settings size={18} />
                </button>
            </div>

            <EditProfileModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                initialData={userData}
                onUpdate={handleUpdate}
            />

            <ChangePasswordModal
                isOpen={isPasswordOpen}
                onClose={() => setIsPasswordOpen(false)}
            />
        </>
    );
}
