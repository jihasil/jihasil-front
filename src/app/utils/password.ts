import crypto from "crypto";

const keyLen = 32;
const digest: string = "sha256";
const iterations: number = 100000;

export const validatePassword = async (
  plainPassword: string,
  passwordFromDB: string,
): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    try {
      const combinedPassword = passwordFromDB.split("|");
      const salt = combinedPassword[0];
      const hashedPassword = combinedPassword[1];

      crypto.pbkdf2(
        plainPassword,
        salt,
        iterations,
        keyLen,
        digest,
        (err, result) => {
          if (err) reject(err);
          else {
            const hashedKey = result.toString("base64");
            resolve(hashedKey === hashedPassword);
          }
        },
      );
    } catch (error) {
      console.log(error);
      reject(false);
    }
  });
};

export const saltAndHashPassword = async (
  password: string,
): Promise<string> => {
  const getSalt = new Promise<string>((resolve, reject) => {
    crypto.randomBytes(16, async (err, buf) => {
      if (err) return reject(err);
      else resolve(buf.toString("base64"));
    });
  });

  return new Promise<string>((resolve, reject) => {
    getSalt
      .then(async (salt) => {
        crypto.pbkdf2(
          password,
          salt,
          iterations,
          keyLen,
          digest,
          (err, result) => {
            if (err) return reject(err);
            else {
              const hashedKey = result.toString("base64");
              const saltAndKey = `${salt}|${hashedKey}`;
              resolve(saltAndKey);
            }
          },
        );
      })
      .catch((err) => reject(err));
  });
};
