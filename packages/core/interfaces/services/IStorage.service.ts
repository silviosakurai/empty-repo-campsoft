export interface IStorageService {
  uploadImage: (clientId: string, imageBase64: string) => Promise<string | null>;
}
