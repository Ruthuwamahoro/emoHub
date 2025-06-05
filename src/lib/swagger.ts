import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: "EmoHub API end points",
      version: '1.0.0',
      description: "API documentations for API endpoints of whole application"
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authorization header using the Bearer scheme'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'next-auth.session-token',
          description: 'NextAuth session cookie authentication'
        },
        secureCookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: '__Secure-next-auth.session-token',
          description: 'NextAuth secure session cookie authentication (HTTPS only)'
        }
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'fullName', 'username'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              minLength: 8,
              description: 'User password (minimum 8 characters)',
              example: 'SecurePassword123!'
            },
            fullName: {
              type: 'string',
              maxLength: 100,
              description: 'User full name',
              example: 'John Doe'
            },
            username: {
              type: 'string',
              description: 'Unique username',
              example: 'johndoe123'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              description: 'User password',
              example: 'SecurePassword123!'
            }
          }
        },
        
        // Authentication Response Schemas
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Authentication success status'
            },
            message: {
              type: 'string',
              description: 'Response message'
            },
            user: {
              $ref: '#/components/schemas/UserProfile'
            },
            token: {
              type: 'string',
              description: 'JWT access token (if using JWT)',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        },
        
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            user: {
              $ref: '#/components/schemas/UserProfile'
            },
            redirectTo: {
              type: 'string',
              description: 'Redirect URL after successful login',
              example: '/dashboard'
            }
          }
        },
        
        RegisterResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'User registered successfully'
            },
            user: {
              $ref: '#/components/schemas/UserProfile'
            },
            requiresVerification: {
              type: 'boolean',
              description: 'Whether email verification is required',
              example: true
            }
          }
        },

        UserProfile: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            fullName: {
              type: 'string',
              description: 'Full Name'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            role: {
              type: 'string',
              format: 'uuid',
              description: 'User role ID'
            },
            profilePicUrl: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'User profile image URL'
            },
            bio: {
              type: 'string',
              nullable: true,
              description: 'User biography'
            },
            expertise: {
              type: 'string',
              nullable: true,
              description: 'User expertise'
            },
            badges: {
              type: 'string',
              nullable: true,
              description: 'User badges'
            },
            location: {
              type: 'string',
              nullable: true,
              description: 'User location'
            },
            isVerified: {
              type: 'boolean',
              description: 'Email verification status'
            },
            onboardingCompleted: {
              type: 'boolean',
              description: 'Onboarding completion status'
            },
            onboardingCompletedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Onboarding completion timestamp'
            },
            isActive: {
              type: 'boolean',
              description: 'Account active status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },

        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID'
            },
            fullName: {
              type: 'string',
              description: 'Full Name'
            },
            username: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address'
            },
            role: {
              type: 'string',
              format: 'uuid',
              description: 'User role ID'
            },
            profilePicUrl: {
              type: 'string',
              format: 'uri',
              nullable: true,
              description: 'User profile image URL'
            },
            bio: {
              type: 'string',
              nullable: true,
              description: 'Biography'
            },
            expertise: {
              type: 'string',
              nullable: true,
              description: 'Expertise area'
            },
            badges: {
              type: 'string',
              nullable: true,
              description: 'User badges'
            },
            isVerified: {
              type: 'boolean',
              description: 'Verification status'
            },
            onboardingCompleted: {
              type: 'boolean',
              description: 'Onboarding status'
            },
            onboardingCompletedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Onboarding completion date'
            },
            isActive: {
              type: 'boolean',
              description: 'Account active status'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        
        Session: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/UserProfile'
            },
            expires: {
              type: 'string',
              format: 'date-time',
              description: 'Session expiration date'
            }
          }
        },
        
        ValidationError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'object',
              description: 'Validation error details',
              additionalProperties: {
                type: 'array',
                items: {
                  type: 'string'
                }
              }
            }
          }
        },
        
        AuthError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Authentication error message'
            },
            code: {
              type: 'string',
              description: 'Error code',
              enum: ['INVALID_CREDENTIALS', 'USER_NOT_FOUND', 'EMAIL_ALREADY_EXISTS', 'WEAK_PASSWORD']
            }
          }
        },
        
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            },
            code: {
              type: 'string',
              description: 'Error code'
            }
          }
        }
      }
    },
    security: [
      {
        cookieAuth: []
      },
      {
        bearerAuth: []
      }
    ],
    paths: {
      '/api/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          description: 'Create a new user account with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterRequest'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/RegisterResponse'
                  }
                }
              }
            },
            '400': {
              description: 'Validation error or bad request',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationError'
                  }
                }
              }
            },
            '409': {
              description: 'User already exists',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthError'
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/auth/signin': {
        post: {
          tags: ['Authentication'],
          summary: 'User login',
          description: 'Authenticate user with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Login successful',
              headers: {
                'Set-Cookie': {
                  description: 'NextAuth session cookie',
                  schema: {
                    type: 'string'
                  }
                }
              },
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LoginResponse'
                  }
                }
              }
            },
            '400': {
              description: 'Invalid request data',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationError'
                  }
                }
              }
            },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuthError'
                  }
                }
              }
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/auth/signout': {
        post: {
          tags: ['Authentication'],
          summary: 'User logout',
          description: 'Sign out the current user and invalidate session',
          security: [
            {
              cookieAuth: []
            }
          ],
          responses: {
            '200': {
              description: 'Logout successful',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true
                      },
                      message: {
                        type: 'string',
                        example: 'Logged out successfully'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/auth/session': {
        get: {
          tags: ['Authentication'],
          summary: 'Get current session',
          description: 'Retrieve current user session information',
          security: [
            {
              cookieAuth: []
            }
          ],
          responses: {
            '200': {
              description: 'Session information',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [
                      {
                        $ref: '#/components/schemas/Session'
                      },
                      {
                        type: 'null',
                        description: 'No active session'
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: [
    './src/app/api/**/*.ts'
  ]
};

export const swaggerSpec = swaggerJSDoc(options);