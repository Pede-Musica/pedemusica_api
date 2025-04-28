import { Body, Controller, Get, HttpCode, Param, Post, Query, UnauthorizedException } from '@nestjs/common';
import { Public } from 'src/decorators/auth-guard.decorator';
import { UserCreateDTO } from './dto/user-create.dto';
import { AuthDTO } from './dto/auth.dto';
import { UserService } from './user.service';
import { UserSetPasswordDTO } from './dto/user-set-password';
import { ValidateToken } from './dto/validate-token.dto';
import { UserPaginateDTO } from './dto/user-paginate.dto';
import { FindUserByIdDTO } from './dto/find-user-by-id.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Public()
    @Post('/auth')
    async auth(@Body() data: AuthDTO) {
        if (!(await this.userService.exists(data.email))) {
            throw new UnauthorizedException('Usuário não encontrado')
        }

        return await this.userService.authenticate(data);
    }

    @Public()
    @Post('/set-password')
    async setPassword(@Body() data: UserSetPasswordDTO) {
        return await this.userService.setPassword(data)
    }

    @Public()
    @Get('/validate-password/:token')
    async validatePassword(@Param() data: ValidateToken) {
        return await this.userService.validateToken(data)
    }

    @Public()
    @Get('/test')
    async testAPI() {
        return 'API is working'
    }

    @Get('/paginate')
    async paginate(@Query() params: UserPaginateDTO) {
        return await this.userService.paginate(params)
    }

    @Get('/detail/:id')
    async detail(@Param() data: FindUserByIdDTO) {
        return await this.userService.detail(data)
    }

    @Post('/create')
    async create(@Body() data: UserCreateDTO, @User() user_id: string) {
        return await this.userService.create(data, user_id)
    }

    @Public()
    @Post('/forgot-password')
    async forgotPassword(@Body() data: { email: string }) {
        return await this.userService.forgotPassword(data)
    }

}
