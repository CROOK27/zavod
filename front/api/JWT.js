export const decodeJWT = (token) => {
  try {
    if (!token) return null;

    // JWT токен состоит из 3 частей: header.payload.signature
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));

    return decodedPayload;
  } catch (error) {
    console.error('Ошибка декодирования JWT:', error);
    return null;
  }
}