export const fetchR = async (
  input: string | URL | globalThis.Request,
  init?: RequestInit,
): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    fetch(input, init).then(async (response) => {
      if (response.status === 401) {
        const response = await fetch("/api/user/refresh");
        if (response.ok) {
          resolve(response);
        }
      } else {
        resolve(response);
      }
    });
  });
};
