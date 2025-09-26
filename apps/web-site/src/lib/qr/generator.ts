import QRCode from "qrcode";

export const generateQrDataURL = async (text: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(text, { errorCorrectionLevel: 'H' });
  } catch (err) {
    console.error("QR Generate Error:", err);
    return "";
  }
};