import jwt  from "jsonwebtoken";

const verifyJWT = (token: string, secret: string): Promise<jwt.JwtPayload | string> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded!);
            }
        });
    });
};

export default verifyJWT