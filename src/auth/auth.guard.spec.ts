import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import {
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

// Test - canActivate
// ===========================================================================================
describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService();
    authGuard = new AuthGuard(jwtService);
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  it('should throw UnauthorizedException if authorization header is missing', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if authorization header is malformed', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'MalformedToken',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw ForbiddenException if token is invalid', async () => {
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockRejectedValue(new Error('Invalid token'));

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer invalid.token',
          },
        }),
      }),
    } as unknown as ExecutionContext;

    await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should return true if token is valid', async () => {
    const mockAdminId = 1;
    jest
      .spyOn(jwtService, 'verifyAsync')
      .mockResolvedValue({ adminId: mockAdminId });

    // Créer un mock pour `request`
    const mockRequest = {
      headers: {
        authorization: 'Bearer valid.token',
      },
      admin: undefined,
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as unknown as ExecutionContext;

    const result = await authGuard.canActivate(mockContext);

    expect(result).toBe(true);
    expect(mockRequest.admin).toBe(mockAdminId);
  });
});
