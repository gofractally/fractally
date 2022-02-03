if (
    !process.env.NEXT_PUBLIC_CORE_API_BASE_URL ||
    !process.env.NEXT_PUBLIC_CORE_SUBSCRIPTIONS_BASE_URL
) {
    throw new Error("Eden WebApp Environment Variables are not set");
}

export const coreApiBaseUrl = process.env.NEXT_PUBLIC_CORE_API_BASE_URL;
export const coreSubscriptionsBaseUrl =
    process.env.NEXT_PUBLIC_CORE_SUBSCRIPTIONS_BASE_URL;

console.info(`>>> Loaded Configs:
CORE_API_BASE_URL="${coreApiBaseUrl}"
CORE_SUBSCRIPTIONS_BASE_URL="${coreSubscriptionsBaseUrl}"
`);
