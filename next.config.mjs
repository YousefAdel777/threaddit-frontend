/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/media/**', 
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "u/**",
            },
            {
                protocol: "https",
                hostname: "www.gravatar.com",
                port: "",
                pathname: "avatar/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                port: "",
                pathname: "u/**",
            }
        ]
    }
};

export default nextConfig;
