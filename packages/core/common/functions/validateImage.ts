import { TFunction } from "i18next";

export function validateImage(
  t: TFunction<"translation", undefined>,
  imageBase64: string
): void {
  const regex = /^data:image\/([a-zA-Z]+);base64,(.+)$/;
  const match = regex.exec(imageBase64);

  if (!match) {
    throw new Error(t("invalid_image_format"));
  }

  const [, extension, base64Data] = match;

  if (!["png", "jpeg", "jpg"].includes(extension)) {
    throw new Error(t("format_not_supported_allowed_formats_png_jpeg_jpg"));
  }

  if (base64Data.length > 1024 * 1024 * 5) {
    throw new Error(t("image_size_exceeded_5mb"));
  }
}
