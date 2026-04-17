import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { MockupsService } from './mockups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMockupRenderDto } from './dto/create-mockup-render.dto';

@Controller('mockups')
export class MockupsController {
  constructor(private mockupsService: MockupsService) {}

  /**
   * Get all available mockup templates
   * GET /mockups/templates?active=true&variant_id=1
   */
  @Get('templates')
  async getTemplates(
    @Query('active') active: string = 'true',
    @Query('variant_id') variant_id: string,
  ) {
    const isActive = active === 'true';
    const variantId = variant_id ? parseInt(variant_id, 10) : null;
    return this.mockupsService.getTemplates(isActive, variantId);
  }

  /**
   * Get mockup template by ID
   * GET /mockups/templates/:id
   */
  @Get('templates/:id')
  async getTemplate(@Param('id') id: string) {
    const templateId = parseInt(id, 10);
    if (isNaN(templateId)) {
      throw new BadRequestException('Invalid template ID');
    }
    return this.mockupsService.getTemplate(templateId);
  }

  /**
   * Render mockup with design image
   * POST /mockups/render
   * Requires authentication
   */
  @Post('render')
  async renderMockup(
    @Request() req,
    @Body() createMockupDto: CreateMockupRenderDto,
  ) {
    const userId = 1;
    return this.mockupsService.renderMockup(userId, createMockupDto);
  }

  /**
   * Get render history for authenticated customer
   * GET /mockups/renders
   * Requires authentication
   */
  @Get('renders')
  @UseGuards(JwtAuthGuard)
  async getRenderHistory(
    @Request() req,
    @Query('limit') limit: string = '20',
  ) {
    const userId = req.user.user_id;
    const limitNum = parseInt(limit, 10) || 20;
    return this.mockupsService.getRenderHistory(userId, limitNum);
  }

  /**
   * Get single render by ID
   * GET /mockups/renders/:id
   * Requires authentication
   */
  @Get('renders/:id')
  @UseGuards(JwtAuthGuard)
  async getRender(@Request() req, @Param('id') id: string) {
    const userId = req.user.user_id;
    const renderId = parseInt(id, 10);
    if (isNaN(renderId)) {
      throw new BadRequestException('Invalid render ID');
    }
    return this.mockupsService.getRender(renderId, userId);
  }

  /**
   * Delete render
   * DELETE /mockups/renders/:id
   * Requires authentication
   */
  @Delete('renders/:id')
  @UseGuards(JwtAuthGuard)
  async deleteRender(@Request() req, @Param('id') id: string) {
    const userId = req.user.user_id;
    const renderId = parseInt(id, 10);
    if (isNaN(renderId)) {
      throw new BadRequestException('Invalid render ID');
    }
    await this.mockupsService.deleteRender(renderId, userId);
    return { message: 'Render deleted successfully' };
  }

  /**
   * Sync mockup templates (admin only, optionally)
   * POST /mockups/sync-templates
   */
  @Post('sync-templates')
  async syncTemplates(
    @Body() templates: Array<{
      name: string;
      mockup_uuid: string;
      category?: string;
      description?: string;
    }>,
  ) {
    if (!Array.isArray(templates) || templates.length === 0) {
      throw new BadRequestException('Templates array is required');
    }
    return this.mockupsService.syncTemplates(templates);
  }
}
