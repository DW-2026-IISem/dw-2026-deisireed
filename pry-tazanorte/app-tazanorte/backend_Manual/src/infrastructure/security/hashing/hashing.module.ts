import { Module } from '@nestjs/common';
import { BcryptPasswordHasherService } from './bcrypt-password-hasher.service';

@Module({
  providers: [
    {
      provide: 'PASSWORD_HASHER',
      useClass: BcryptPasswordHasherService,
    },
    BcryptPasswordHasherService,
  ],
  exports: ['PASSWORD_HASHER', BcryptPasswordHasherService],
})
export class HashingModule {}
