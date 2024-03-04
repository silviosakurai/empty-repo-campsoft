import { cacheEnvironment } from "../environments";

export function cacheRedisConnection() {
  return {
    host: cacheEnvironment.cacheHost,
    password: cacheEnvironment.cachePassword,
    port: cacheEnvironment.cachePort,
    family: 4, // 4 (IPv4) or 6 (IPv6)
  };
}
