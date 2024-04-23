import { generalEnvironment } from "@core/config/environments";
import axios from "axios";

export const paymentApiInstance = axios.create({
  baseURL: `${generalEnvironment.paymentApiBaseUrl}/v1/marketplaces/${generalEnvironment.paymentMarketPlace}`,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(generalEnvironment.paymentApiKey + ":").toString("base64")}`,
  },
});
