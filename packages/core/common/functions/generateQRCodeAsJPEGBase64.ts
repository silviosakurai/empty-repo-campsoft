import { toBuffer } from "qrcode";
import sharp from "sharp";

export async function generateQRCodeAsJPEGBase64(
  data: string
): Promise<string | null> {
  try {
    const qrImageBuffer = await toBuffer(data, {
      margin: 4,
      scale: 10,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 500,
    });

    const pngBuffer = await sharp(qrImageBuffer)
      .png({ quality: 100 })
      .toBuffer();

    const pngBase64 = pngBuffer.toString("base64");
    const mimePrefixedBase64 = `data:image/png;base64,${pngBase64}`;

    return mimePrefixedBase64;
  } catch (error) {
    return null;
  }
}
