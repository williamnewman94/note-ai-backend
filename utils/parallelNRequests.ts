export default async function parallelNRequests(request: () => Promise<string | null>, n: number) {
    const requests = Array(n).fill(() => request());
    const responses = await Promise.all(requests.map(request => request()));
    return responses.filter(response => response !== null);
}