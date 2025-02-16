export async function fetchWithToken(url: string, token: string | undefined) {
    const res = await fetch(url, {
        headers: {"Content-Type": "application/json", "Authorization": `${token}`},
    });
    return await res.json();
}