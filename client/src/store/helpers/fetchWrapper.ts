const fetchWrapper = async (url: string, method: string, body?: object) => {
  try {
    const response = await fetch(url, {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`${data.message}`);
    }
    return data;
  } catch (error) {
    console.error(error);
    return { error };
  }
};
export default fetchWrapper;
