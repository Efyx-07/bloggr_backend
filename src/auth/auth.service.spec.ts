import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('generateJWTToken', () => {
    it('should generate a token', async () => {
      const mockToken = 'mockedToken';
      const adminId = 1;
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);
      const result = authService.generateJWTToken(adminId);

      expect(jwtService.sign).toHaveBeenCalledWith({ adminId });
      expect(result).toBe(mockToken);
    });
  });

  describe('verifyJWTToken', () => {
    it('should verify token', async () => {
      const mockPayload = { adminId: 1 };
      const mockToken = 'mockedToken';
      jest.spyOn(jwtService, 'verify').mockReturnValue(mockPayload);
      const result = authService.verifyJWTToken(mockToken);

      expect(jwtService.verify).toHaveBeenCalledWith(mockToken);
      expect(result).toBe(mockPayload);
    });

    it('should throw an error if token is invalid', async () => {
      const mockToken = 'invalidToken';
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() =>
        authService.verifyJWTToken(mockToken).toThrow('Invalid token'),
      );
    });
  });
});
