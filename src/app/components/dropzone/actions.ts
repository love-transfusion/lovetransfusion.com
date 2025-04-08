'use server';
import sharp from 'sharp';

export async function generateBlurDataURL(formData: FormData) {
  const images: { key: string; blurDataURL: string }[] = [];

  for (const [key, value] of formData.entries()) {
    if (!(value instanceof Blob)) continue;

    const arrayBuffer = await value.arrayBuffer();

    const blurredBuffer = await sharp(Buffer.from(arrayBuffer))
      .resize({ width: 20, height: 20 })
      .blur(10)
      .toBuffer();

    const blurDataURL = `data:image/jpeg;base64,${blurredBuffer.toString('base64')}`;

    images.push({ key, blurDataURL });
  }

  return images;
}