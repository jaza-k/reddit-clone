import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
    if (!options.email.includes('@')) {
        return [
            {
                field: "Email",
                message: "Invalid email address"
            }
        ];
    }

    if (options.username.includes('@')) {
        return [
            {
                field: "Username",
                message: "Username cannot include @"
            }
        ];
    }

    if (options.username.length < 2) {
        return [
            {
                field: "Username",
                message: "Length must be greater than 2"
            }
        ];
    }

    if (options.password.length < 3) {
        return [
            {
                field: "Password",
                message: "Length must be greater than 3"
            }
        ];
    }

    return null;
};