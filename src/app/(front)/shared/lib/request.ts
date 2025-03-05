export const fetchR = async (
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> => {
  return new Promise<Response>((resolve, reject) => {
    fetch(input, init)
      .then(async (response) => {
        if (response.status === 401) {
          const cookieRotated = await fetch("/api/refresh?noRedirect=true");

          if (cookieRotated.ok) {
            console.log("Token Rotated");

            fetch(input, init)
              .then(async (responseAfterRotation) => {
                resolve(responseAfterRotation);
              })
              .catch((reasonAfterRotation: any) => {
                reject(reasonAfterRotation);
              });
          } else {
            resolve(response);
          }
        } else {
          resolve(response);
        }
      })
      .catch((error: any) => {
        reject(error);
      });
  });
};
