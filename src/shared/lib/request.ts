export const fetchR = async (
  input: string | URL | globalThis.Request,
  init?: RequestInit,
): Promise<Response> => {
  return new Promise<Response>((resolve) => {
    fetch(input, init).then(async (response) => {
      if (response.status === 401) {
        const cookieRotated = await fetch("/api/user/refresh");
        console.log("cookie?");
        console.log(cookieRotated);
        resolve(await fetch(input, init));
      } else {
        resolve(response);
      }
    });
  });
};
