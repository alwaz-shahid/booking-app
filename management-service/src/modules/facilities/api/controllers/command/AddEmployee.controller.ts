import { CommandBus } from '@nestjs/cqrs';
import { Body, Controller, Logger, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { BaseController, ValidationTransformer } from 'shared/core';

import {
  AddEmployeeCommand,
  AddEmployeeDto,
  AddEmployeeErrors,
  AddEmployeeResponse,
} from 'modules/facilities/application/command/addEmployee';

import { addEmployeeSchema } from '../../schemas';

@Controller()
export class AddEmployeeController extends BaseController {
  constructor(private readonly commandBus: CommandBus) {
    super();
  }

  logger = new Logger('AddEmployeeController');

  @Post('facilities/:facilityId/employees')
  @ApiTags('Employees')
  @ApiOkResponse()
  @ApiNotFoundResponse({ description: 'Facility not found' })
  async addEmployee(
    @Param('facilityId') facilityId: string,
    @Body() dto: AddEmployeeDto,
    @Res() res: Response,
  ) {
    try {
      const formErrors = await ValidationTransformer.validateSchema(
        dto,
        addEmployeeSchema,
      );

      if (formErrors.isLeft()) {
        return this.clientError(res, formErrors.value.errorValue());
      }

      const result: AddEmployeeResponse = await this.commandBus.execute(
        new AddEmployeeCommand(dto, facilityId),
      );

      if (result.isLeft()) {
        const error = result.value;
        this.logger.error(error.errorValue());

        switch (error.constructor) {
          case AddEmployeeErrors.FacilityNotFoundError:
            return this.notFound(res, error.errorValue());
          default:
            return this.fail(res, error.errorValue());
        }
      }

      this.logger.verbose('Employee successfully added');
      return this.ok(res, {
        employeeId: result.value.getValue().id.toString(),
      });
    } catch (err) {
      this.logger.error('Unexpected server error', err);
      return this.fail(res, err);
    }
  }
}
