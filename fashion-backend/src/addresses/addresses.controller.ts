import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@Body() createAddressDto: CreateAddressDto, @Request() req: any) {    
    return this.addressesService.create(createAddressDto, req.user.user_id);
  }

  @Get()
  findAll(@Request() req) {
    return this.addressesService.findAll(req.user.user_id);
  }

  @Get('provinces')
  findProvinces() {
    return this.addressesService.getProvinces();
  }

  @Get('provinces/:id/wards')
  findWards(@Param('id') id: string) {
    return this.addressesService.getWardsByProvince(+id);
  }

  @Get('wards/:id')
  getWardDetail(@Param('id') id: string) {
    return this.addressesService.getWardDetail(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.addressesService.findOne(+id, req.user.user_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto, @Request() req) {
    return this.addressesService.update(+id, updateAddressDto, req.user.user_id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.addressesService.remove(+id, req.user.user_id);
  }

  @Patch(':id/default')
  setDefault(@Param('id') id: string, @Request() req) {
    return this.addressesService.setDefault(+id, req.user.user_id);
  }
}