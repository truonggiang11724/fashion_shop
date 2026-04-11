import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMockupRenderDto } from './dto/create-mockup-render.dto';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MockupsService {
  private readonly DYNAMIC_MOCKUPS_API_URL = process.env.DYNAMIC_MOCKUPS_API_URL || 'https://app.dynamicmockups.com/api/v1/renders';
  private readonly DYNAMIC_MOCKUPS_API_KEY = process.env.DYNAMIC_MOCKUPS_API_KEY;

  constructor(private prisma: PrismaService) {}

  /**
   * Get all available mockup templates
   */
  async getTemplates(isActive: boolean = true) {
    return this.prisma.mockup_templates.findMany({
      where: isActive ? { is_active: true } : {},
      orderBy: { created_at: 'desc' },
    });
  }

  /**
   * Get mockup template by ID
   */
  async getTemplate(templateId: number) {
    const template = await this.prisma.mockup_templates.findUnique({
      where: { template_id: templateId },
    });

    if (!template) {
      throw new BadRequestException('Mockup template not found');
    }

    return template;
  }

  /**
   * Create mockup template (sync from DynamicMockups)
   */
  async createTemplate(data: {
    name: string;
    mockup_uuid: string;
    description?: string;
    thumbnail_url?: string;
    category?: string;
    smart_objects?: any;
  }) {
    // Check if template already exists
    const existing = await this.prisma.mockup_templates.findUnique({
      where: { mockup_uuid: data.mockup_uuid },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.mockup_templates.create({
      data: {
        name: data.name,
        mockup_uuid: data.mockup_uuid,
        description: data.description,
        thumbnail_url: data.thumbnail_url,
        category: data.category,
        smart_objects: data.smart_objects,
        is_active: true,
      },
    });
  }

  /**
   * Render mockup using DynamicMockups API
   */
  async renderMockup(userId: number, createMockupDto: CreateMockupRenderDto) {
    // Validate template exists
    const template = await this.getTemplate(createMockupDto.template_id);

    // Validate design image URL
    if (!createMockupDto.design_image_url) {
      throw new BadRequestException('Design image URL is required');
    }

    // Check if design image is accessible
    try {
      await axios.head(createMockupDto.design_image_url, { timeout: 5000 });
    } catch (error) {
      throw new BadRequestException('Design image URL is not accessible');
    }

    // Create initial render record with pending status
    const renderRecord = await this.prisma.mockup_renders.create({
      data: {
        customer_id: userId,
        product_id: createMockupDto.product_id,
        template_id: createMockupDto.template_id,
        design_image_url: createMockupDto.design_image_url,
        render_config: createMockupDto.render_config || {},
        status: 'processing',
      },
    });

    try {
      // Prepare smart objects for DynamicMockups API
      const smartObjects = this.prepareSmarty_objects(
        template,
        createMockupDto.design_image_url,
        createMockupDto.render_config,
      );      
      
      // Call DynamicMockups API
      const renderResponse = await this.callDynamicMockupsAPI(
        template.mockup_uuid,
        smartObjects,
      );

      

      // Update render record with success
      const updatedRender = await this.prisma.mockup_renders.update({
        where: { render_id: renderRecord.render_id },
        data: {
          rendered_image_url: renderResponse.rendered_image_url,
          status: 'completed',
        },
        include: {
          mockup_templates: true,
        },
      });

      return updatedRender;
    } catch (error) {
      // Update render record with error
      await this.prisma.mockup_renders.update({
        where: { render_id: renderRecord.render_id },
        data: {
          status: 'failed',
          error_message: '',
        },
      });

      throw new InternalServerErrorException(
        `Failed to render mockup: `,
      );
    }
  }

  /**
   * Get render history for customer
   */
  async getRenderHistory(userId: number, limit: number = 20) {
    return this.prisma.mockup_renders.findMany({
      where: { customer_id: userId },
      include: {
        mockup_templates: true,
        products: { select: { product_id: true, product_name: true } },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  /**
   * Get single render by ID
   */
  async getRender(renderId: number, userId: number) {
    const render = await this.prisma.mockup_renders.findUnique({
      where: { render_id: renderId },
      include: {
        mockup_templates: true,
        products: true,
      },
    });

    if (!render) {
      throw new BadRequestException('Render not found');
    }

    if (render.customer_id !== userId) {
      throw new BadRequestException('Unauthorized access to this render');
    }

    return render;
  }

  /**
   * Delete render
   */
  async deleteRender(renderId: number, userId: number) {
    const render = await this.getRender(renderId, userId);

    return this.prisma.mockup_renders.delete({
      where: { render_id: renderId },
    });
  }

  /**
   * Prepare smart objects for DynamicMockups API
   */
  private prepareSmarty_objects(template: any, designUrl: string, config?: any): Array<any> {
    const smartObjects: Array<any> = [];

    // If template has smart_objects defined, use them
    if (template.smart_objects && Array.isArray(template.smart_objects)) {
      const mapped = (template.smart_objects as any[]).map((obj: any) => ({
        uuid: obj.uuid || obj.id,
        asset: { url: designUrl },
        color: config?.color || obj.color || '#ffffff',
      }));
      smartObjects.push(...mapped);
    } else {
      // Use default single smart object
      smartObjects.push({
        uuid: config?.smart_object_id || 'default',
        asset: { url: designUrl },
        color: config?.color || '#ffffff',
      });
    }

    return smartObjects;
  }

  /**
   * Call DynamicMockups API to render mockup
   */
  private async callDynamicMockupsAPI(
    mockupUuid: string,
    smartObjects: any[],
  ) {
    if (!this.DYNAMIC_MOCKUPS_API_KEY) {
      throw new Error(
        'DynamicMockups API key not configured. Set DYNAMIC_MOCKUPS_API_KEY environment variable.',
      );
    }

    try {
      const response = await axios.post(
        this.DYNAMIC_MOCKUPS_API_URL,
        JSON.stringify({
          mockup_uuid: mockupUuid,
          smart_objects: smartObjects,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.DYNAMIC_MOCKUPS_API_KEY,
            'Accept': 'application/json',
          },
          timeout: 30000,
        },
      );

      if (!response.data?.data?.rendered_image_url) {
        throw new Error('No rendered_image_url in response');
      }

      return {
        rendered_image_url: response.data.data.rendered_image_url,
        render_id: response.data.data.render_id,
      };
    } catch (error) {
      throw new Error(
        `DynamicMockups API error: `,
      );
    }
  }

  /**
   * Sync templates from a predefined list
   * This would typically be called periodically or on demand
   */
  async syncTemplates(templates: Array<{
    name: string;
    mockup_uuid: string;
    category?: string;
    description?: string;
  }>) {
    const results: any = [];

    for (const template of templates) {
      const result = await this.createTemplate(template);
      results.push(result);
    }

    return results;
  }
}
