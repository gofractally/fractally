if (!process.env.NEXT_PUBLIC_CORE_API_BASE_URL) {
    throw new Error("Eden WebApp Environment Variables are not set");
}

export const coreApiBaseUrl = process.env.NEXT_PUBLIC_CORE_API_BASE_URL;

console.info(`>>> Loaded Configs:
CORE_API_BASE_URL="${coreApiBaseUrl}"
`);
