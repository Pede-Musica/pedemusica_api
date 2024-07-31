import { Injectable } from '@nestjs/common';

@Injectable()
export class BooleanHandlerService {

    async convert(value: string | boolean): Promise<boolean | undefined> {
        if (['true', '1', true, 1].includes(value)) {
            return true;
        }

        if (['false', '0', false, 0].includes(value)) {
            return false;
        }

        return undefined;
    }
}
