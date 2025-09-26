export class ConfirmUploadDto {
  key!: string;
  bucket?: string;
  kind!: 'image' | 'video';
  mime!: string;
  size?: number;
  ownerUserId?: string;
}
