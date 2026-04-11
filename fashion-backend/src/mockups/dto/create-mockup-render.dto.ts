import { IsNumber, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateMockupRenderDto {
  @IsNumber()
  template_id: number;

  @IsString()
  design_image_url: string;

  @IsNumber()
  @IsOptional()
  product_id?: number;

  @IsObject()
  @IsOptional()
  render_config?: {
    color?: string;
    smart_object_id?: string;
    [key: string]: any;
  };
}
