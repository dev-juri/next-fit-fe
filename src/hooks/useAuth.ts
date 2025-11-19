import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

// --- Types ---
interface AdminLoginDto {
    email: string;
}

interface UserRegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface UserLoginDto {
    email: string;
    password: string;
}

// --- Admin Hooks ---

export const useAdminRequestMagicLink = () => {
    return useMutation({
        mutationFn: async (data: AdminLoginDto) => {
            const response = await api.post("/admin/auth", data);
            return response.data;
        },
    });
};

export const useAdminVerifyMagicLink = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (token: string) => {
            const response = await api.get(`/admin/auth/verify?token=${token}`);
            return response.data;
        },
        onSuccess: (data) => {
            console.log("Verify response:", data);
            // Check for accessToken (camelCase) as per user feedback, and fallbacks
            const token = data.accessToken || data.access_token || data.token || data.data?.accessToken;

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("role", "admin");
                router.push("/admin/dashboard");
            } else {
                console.error("No token found in response", data);
            }
        },
    });
};

// --- User Hooks ---

export const useUserRegister = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (data: UserRegisterDto) => {
            const response = await api.post("/users", data);
            return response.data;
        },
        onSuccess: () => {
            router.push("/login");
        },
    });
};

export const useUserLogin = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: async (data: UserLoginDto) => {
            const response = await api.post("/users/auth", data);
            return response.data;
        },
        onSuccess: (data) => {
            console.log("Login response:", data);
            const token = data.accessToken || data.access_token || data.token || data.data?.accessToken;

            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("role", "user");
                router.push("/dashboard");
            } else {
                console.error("No token found in login response", data);
            }
        },
    });
};
