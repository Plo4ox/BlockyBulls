import { createThirdwebClient } from "thirdweb";

export const clientId = import.meta.env.VITE_THIRDWEB_CLIENT_ID;

if (!clientId) {
  throw new Error("ThirdWeb Client ID not set");
}

export default createThirdwebClient({ clientId: clientId });
