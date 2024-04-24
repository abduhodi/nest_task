import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const [bearer, token] = req?.headers?.authorization?.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid Header');
    }

    let user: any;

    try {
      user = this.jwtService.verify(token);
      console.log(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }

    req.user = user;

    return true;
  }
}
